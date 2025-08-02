from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAuthenticatedOrReadOnly
from .utils import calculate_category_averages
from .models import Form, CompletedForm, FormResponse
from .serializers import FormSerializer, CompletedFormSerializer, FormResponseSerializer



class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def submit_response(self, request, pk=None):
        form = self.get_object()
        serializer = FormResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(form=form, user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class CompletedFormViewSet(viewsets.ModelViewSet):
    queryset = CompletedForm.objects.all().order_by('-created_at')
    serializer_class = CompletedFormSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Extraer el número de identificación y el tipo de análisis del contenido del formulario enviado
        identification_number = request.data.get('content', {}).get('info', {}).get('identificationNumber', None)
        form_title = request.data.get('form_title', None)
        if identification_number and form_title:
            # Buscar un formulario existente con el mismo número de identificación y tipo de formulario
            existing_form = CompletedForm.objects.filter(
                content__info__identificationNumber=identification_number,
                form_title=form_title
            ).order_by('-created_at').first()

            # Si existe un formulario, eliminarlo
            if existing_form:
                existing_form.delete()

        # Crear el nuevo formulario
        return super().create(request, *args, **kwargs)

class CheckDocumentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, document_number):
        try:
            completed_form = CompletedForm.objects.filter(
                content__info__identificationNumber=document_number
            ).order_by('-created_at').first()

            if completed_form:
                return Response({'exists': True, 'data': completed_form.content, 'id': completed_form.id}, status=status.HTTP_200_OK)
            else:
                return Response({'exists': False}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'exists': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_category_averages(request, document_number):
    completed_form = CompletedForm.objects.filter(
        content__info__identificationNumber=document_number
    ).order_by('-created_at').first()

    if not completed_form:
        return Response({'exists': False}, status=404)

    category_averages = calculate_category_averages(completed_form.content.get('answers', []))
    return Response({'exists': True, 'category_averages': category_averages})

class FormResponseViewSet(viewsets.ModelViewSet):
    queryset = FormResponse.objects.all()
    serializer_class = FormResponseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return FormResponse.objects.filter(user=self.request.user)

class FormBySlug(APIView):
    """
    API endpoint to get a form by its slug
    """
    permission_classes = [AllowAny]

    def get(self, request, form_slug):
        """
        Handle GET requests to fetch a form by slug
        """
        try:
            form = Form.objects.get(slug=form_slug)
            serializer = FormSerializer(form)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Form.DoesNotExist:
            return Response(
                {'error': f'Form with slug "{form_slug}" does not exist.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'An error occurred: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
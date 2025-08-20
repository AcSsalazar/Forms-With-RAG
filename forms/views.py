from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAuthenticatedOrReadOnly
from .utils import calculate_category_averages, send_results_email
from .rag_config import RAG
from .llm_config import LLM
from .models import Form, CompletedForm, FormResponse
from .serializers import FormSerializer, CompletedFormSerializer, FormResponseSerializer
import logging

logger = logging.getLogger(__name__)

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
        try:
            # Extract user info from request
            identification_number = request.data.get('content', {}).get('info', {}).get('identificationNumber', None)
            form_title = request.data.get('form_title', None)
            user_email = request.data.get('content', {}).get('info', {}).get('email', None)
            user_name = request.data.get('content', {}).get('info', {}).get('userName', None)

            # Handle existing form deletion
            if identification_number and form_title:
                existing_form = CompletedForm.objects.filter(
                    content__info__identificationNumber=identification_number,
                    form_title=form_title
                ).order_by('-created_at').first()
                if existing_form:
                    existing_form.delete()

            # Create new form
            response = super().create(request, *args, **kwargs)

            # Send email if we have user's email
            if user_email:
                send_results_email(
                    to_email=user_email,
                    subject="Resultados de tu evaluación",
                    context={
                        'user': user_name or "Usuario",
                        'form_title': form_title or "Evaluación",
                        'email': user_email,
                        'document_number': identification_number
                    }
                )

            return response

        except Exception as e:
            logger.error(f"Error in CompletedFormViewSet.create: {e}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
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
    

#  Vista para filtrar por UserId todos los ultimos fomrs completados:



class CompletedFormsByDocumentView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, document_number):


        try: 
            forms = CompletedForm.objects.filter(
                content__info__identificationNumber=document_number
            ).order_by('-created_at')

            if not forms.exists():
                return Response(

                    {"count": 0,
                     "results": []}, status=status.HTTP_200_OK)
            

            serializer = CompletedFormSerializer(forms, many=True)    
            return Response({
            "count": forms.count(),
            "results": serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            
    
            return Response(
                {'error': f'Error retrieving forms: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                

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

def generate_personalized_response(context, category_averages):
    """
    Generate a personalized response for the user based on their test results.
    """
    user_name = context.get('user', 'Usuario')
    form_title = context.get('form_title', 'Formulario')

    # Initialize RAG and LLM
    rag = RAG()
    retriever = rag.get_retriever()
    llm = LLM()

    # Greeting
    response = f"Hola {user_name},\n\n"
    response += f"Gracias por completar el formulario: {form_title}.\n\n"

    # Feedback for each category
    response += "Aquí tienes tus resultados:\n\n"
    for category_data in category_averages:
        category_name = category_data['category']['name']
        average = category_data['average']
        plan = category_data['plan']

        if average < 2:
            # Fetch relevant documents for weak categories
            docs = retriever.retrieve(f"Recursos para mejorar en {category_name}")
            doc_links = "\n".join([f"- {doc.metadata['title']}: {doc.metadata['url']}" for doc in docs])

            # Generate feedback using LLM
            feedback = llm.complete(
                system_prompt="Eres un asistente útil.",
                user_prompt=f"Proporciona retroalimentación para un usuario con puntaje bajo en {category_name}.",
            )

            response += f"- {category_name}: Tu puntaje es bajo ({average}). {plan}\n"
            response += f"  Recursos recomendados:\n{doc_links}\n"
            response += f"  Retroalimentación: {feedback}\n"
        elif average < 3:
            response += f"- {category_name}: Tu puntaje es medio-bajo ({average}). {plan}\n"
        elif average < 4:
            response += f"- {category_name}: Tu puntaje es medio ({average}). {plan}\n"
        else:
            response += f"- {category_name}: ¡Excelente trabajo! Tu puntaje es alto ({average}). {plan}\n"

    # Study Plan
    response += "\nPlan de estudio sugerido:\n"
    response += "1. Revisa los temas en los que obtuviste puntajes bajos.\n"
    response += "2. Practica ejercicios relacionados con estas áreas.\n"
    response += "3. Consulta los recursos recomendados a continuación.\n\n"

    # Course Recommendations
    response += "Cursos gratuitos recomendados:\n"
    response += "- En español: Curso de Introducción a la Programación (https://example.com/es)\n"
    response += "- En inglés: FreeCodeCamp - Learn to Code (https://example.com/en)\n\n"

    # Closing Message
    response += "¡Sigue aprendiendo y mejorando! Estamos aquí para apoyarte en tu camino.\n"

    return response


@api_view(['GET'])

def get_personalized_response(request, document_number):
    """
    Endpoint to get a personalized response based on the user's test results.
    
    """
    completed_form = CompletedForm.objects.filter(
        content__info__identificationNumber=document_number
    ).order_by('-created_at').first()

    if not completed_form:
        return Response({'exists': False}, status=404)
    
    category_averages = calculate_category_averages(completed_form.content.get('answers', []))

    context = {
        'user': completed_form.content.get('info', {}).get('userName', 'Usuario'),
        'form_title': completed_form.form_title,
        'document_number': document_number,

    }

    get_personalized_response = generate_personalized_response(context, category_averages)

    return Response({
        'exists': True,
        'personalized_response': category_averages,
        'personalized_response': get_personalized_response
    })




def handle_test_completion(request):
    """
    Handle the completion of a test and generate a personalized response.
    """
    # Example context and answers (replace with actual data from request)
    context = {
        'user': 'Juan Pérez',
        'form_title': 'Evaluación de Habilidades',
        'document_number': '12345',
    }
    answers = [
        {'category': {'name': 'Lógica', 'id': 1}, 'value': 3},
        {'category': {'name': 'Matemáticas', 'id': 2}, 'value': 2},
        {'category': {'name': 'Comunicación', 'id': 3}, 'value': 1},
    ]

    # Calculate category averages
    category_averages = calculate_category_averages(answers)

    # Generate personalized response
    personalized_response = generate_personalized_response(context, category_averages)

    # Send email with results
    send_results_email(
        to_email="juan.perez@example.com",
        subject="Resultados de tu evaluación",
        context=context
    )

    return JsonResponse({"message": personalized_response})
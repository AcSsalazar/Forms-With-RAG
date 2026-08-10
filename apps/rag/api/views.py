from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import FormRequest, Document, GeneratedForm, Question, Submission
from .serializers import (
    FormRequestSerializer, DocumentSerializer, GeneratedFormSerializer, QuestionSerializer, SubmissionSerializer
)
from ..services.ingestion_service import IngestionService
from ..services.retrieval_service import RetrievalService
from ..services.generation_service import GenerationService

class FormRequestViewSet(viewsets.ModelViewSet):
    queryset = FormRequest.objects.all()
    serializer_class = FormRequestSerializer

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated:
            return FormRequest.objects.filter(user=user).order_by('-created_at')
        return FormRequest.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_documents(self, request, pk=None):
        form_request = self.get_object()
        files = request.FILES.getlist('documents') or []
        if not files:
            return Response({'detail': 'no files uploaded (use "documents" field)'}, status=status.HTTP_400_BAD_REQUEST)

        ingestion = IngestionService()
        try:
            docs = ingestion.validate_and_store(files, form_request)
        except Exception as exc:
            return Response({'detail': 'error saving files', 'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = DocumentSerializer(docs, many=True)
        return Response({'status': 'ok', 'documents': serializer.data}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def generate_form(self, request, pk=None):
        form_request = self.get_object()
        if not form_request.documents.exists():
            return Response({'detail': 'no documents uploaded for this form request'}, status=status.HTTP_400_BAD_REQUEST)

        retrieval_service = RetrievalService()
        generation_service = GenerationService()

        try:
            context_chunks = retrieval_service.retrieve(form_request, top_k=int(request.data.get('top_k', 10)))
            if not context_chunks:
                form_request.status = 'failed'
                form_request.save(update_fields=['status'])
                return Response({'detail': 'insufficient context for generation'}, status=status.HTTP_400_BAD_REQUEST)

            form_request.status = 'processing'
            form_request.save(update_fields=['status'])

            result = generation_service.generate_questions(
                context_chunks=context_chunks,
                config={
                    'form_request': form_request,
                    'temperature': float(request.data.get('temperature', 0.2)),
                    'top_p': float(request.data.get('top_p', 1.0)),
                    'max_tokens': int(request.data.get('max_tokens', 4000)),
                },
            )

            form_request.status = 'completed'
            form_request.save(update_fields=['status'])

            generated_form = result['generated_form']
            return Response(
                {
                    'status': 'ok',
                    'generated_form': GeneratedFormSerializer(generated_form).data,
                    'questions': QuestionSerializer(result['questions'], many=True).data,
                    'context_chunks': context_chunks,
                },
                status=status.HTTP_201_CREATED,
            )
        except ValueError as exc:
            form_request.status = 'failed'
            form_request.save(update_fields=['status'])
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            form_request.status = 'failed'
            form_request.save(update_fields=['status'])
            return Response({'detail': 'generation failed', 'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        form_request = self.get_object()
        return Response(
            {
                'id': form_request.id,
                'status': form_request.status,
                'difficulty': form_request.difficulty,
                'evaluation_type': form_request.evaluation_type,
                'created_at': form_request.created_at,
            },
            status=status.HTTP_200_OK,
        )

class GeneratedFormViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GeneratedForm.objects.all()
    serializer_class = GeneratedFormSerializer

    def get_queryset(self):
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated:
            return GeneratedForm.objects.filter(form_request__user=user).order_by('-created_at')
        return GeneratedForm.objects.none()

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

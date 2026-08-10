from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Document, FormRequest, GeneratedForm, Question


class RAGPipelineAPITest(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(
            username='rag_user',
            email='rag@example.com',
            password='pass1234',
        )
        self.other_user = self.user_model.objects.create_user(
            username='other_user',
            email='other@example.com',
            password='pass1234',
        )
        self.client.force_authenticate(user=self.user)

    def _create_form_request(self):
        payload = {
            'difficulty': 'medium',
            'evaluation_type': 'multiple_choice',
        }
        resp = self.client.post(reverse('formrequest-list'), payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        return FormRequest.objects.get(id=resp.data['id'])

    def test_create_form_request_binds_authenticated_user(self):
        form_request = self._create_form_request()
        self.assertEqual(form_request.user_id, self.user.id)
        self.assertEqual(form_request.status, 'queued')

    def test_form_request_queryset_is_user_scoped(self):
        other = FormRequest.objects.create(
            user=self.other_user,
            difficulty='easy',
            evaluation_type='multiple_choice',
        )
        own = FormRequest.objects.create(
            user=self.user,
            difficulty='hard',
            evaluation_type='mixed',
        )

        resp = self.client.get(reverse('formrequest-list'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = {item['id'] for item in resp.data['results']}
        self.assertIn(own.id, ids)
        self.assertNotIn(other.id, ids)

    @patch('apps.rag.api.views.IngestionService.validate_and_store')
    def test_upload_documents_action(self, mock_validate_and_store):
        form_request = self._create_form_request()
        mock_doc = Document.objects.create(
            form_request=form_request,
            filename='sample.txt',
            size=10,
            storage_path='/tmp/sample.txt',
            page_count=0,
            checksum='abc123',
        )
        mock_validate_and_store.return_value = [mock_doc]

        upload = SimpleUploadedFile('sample.txt', b'hello world', content_type='text/plain')
        url = reverse('formrequest-upload-documents', kwargs={'pk': form_request.id})
        resp = self.client.post(url, {'documents': [upload]}, format='multipart')

        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'ok')
        self.assertEqual(len(resp.data['documents']), 1)
        mock_validate_and_store.assert_called_once()

    def test_status_endpoint(self):
        form_request = self._create_form_request()
        form_request.status = 'processing'
        form_request.save(update_fields=['status'])

        url = reverse('formrequest-status', kwargs={'pk': form_request.id})
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['id'], form_request.id)
        self.assertEqual(resp.data['status'], 'processing')

    @patch('apps.rag.api.views.RetrievalService.retrieve')
    @patch('apps.rag.api.views.GenerationService.generate_questions')
    def test_generate_form_success(self, mock_generate_questions, mock_retrieve):
        form_request = self._create_form_request()
        Document.objects.create(
            form_request=form_request,
            filename='sample.txt',
            size=10,
            storage_path='/tmp/sample.txt',
            page_count=0,
            checksum='abc123',
        )

        mock_retrieve.return_value = [
            {
                'text': 'Chunk one',
                'source': 'sample.txt',
                'source_ref': 'sample.txt#chunk0',
            }
        ]

        generated_form = GeneratedForm.objects.create(
            form_request=form_request,
            title='Generated quiz',
            prompt_version='v1',
        )
        q1 = Question.objects.create(
            generated_form=generated_form,
            index=1,
            question_text='What is RAG?',
            choices=['A', 'B', 'C', 'D'],
            correct_answer='A',
            explanation='Because context says so',
            source_refs=['sample.txt#chunk0'],
        )
        q2 = Question.objects.create(
            generated_form=generated_form,
            index=2,
            question_text='Second question',
            choices=['A', 'B', 'C', 'D'],
            correct_answer='B',
            explanation='Second explanation',
            source_refs=['sample.txt#chunk0'],
        )
        mock_generate_questions.return_value = {
            'generated_form': generated_form,
            'questions': [q1, q2],
            'payload': {'title': 'Generated quiz', 'questions': []},
        }

        url = reverse('formrequest-generate-form', kwargs={'pk': form_request.id})
        resp = self.client.post(url, {'top_k': 5}, format='json')

        form_request.refresh_from_db()
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'ok')
        self.assertEqual(form_request.status, 'completed')
        self.assertEqual(len(resp.data['questions']), 2)
        mock_retrieve.assert_called_once()
        mock_generate_questions.assert_called_once()

    @patch('apps.rag.api.views.RetrievalService.retrieve', return_value=[])
    def test_generate_form_insufficient_context(self, _mock_retrieve):
        form_request = self._create_form_request()
        Document.objects.create(
            form_request=form_request,
            filename='sample.txt',
            size=10,
            storage_path='/tmp/sample.txt',
            page_count=0,
            checksum='abc123',
        )

        url = reverse('formrequest-generate-form', kwargs={'pk': form_request.id})
        resp = self.client.post(url, {'top_k': 5}, format='json')

        form_request.refresh_from_db()
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(form_request.status, 'failed')
        self.assertIn('insufficient context', resp.data['detail'])

    @patch('apps.rag.api.views.RetrievalService.retrieve', return_value=[{'text': 'chunk'}])
    @patch('apps.rag.api.views.GenerationService.generate_questions', side_effect=ValueError('LLM output must include exactly 20 questions'))
    def test_generate_form_schema_validation_error_sets_failed(self, _mock_generate, _mock_retrieve):
        form_request = self._create_form_request()
        Document.objects.create(
            form_request=form_request,
            filename='sample.txt',
            size=10,
            storage_path='/tmp/sample.txt',
            page_count=0,
            checksum='abc123',
        )

        url = reverse('formrequest-generate-form', kwargs={'pk': form_request.id})
        resp = self.client.post(url, {'top_k': 5}, format='json')

        form_request.refresh_from_db()
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(form_request.status, 'failed')
        self.assertIn('exactly 20 questions', resp.data['detail'])

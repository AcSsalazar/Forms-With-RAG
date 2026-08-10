# Celery task for document ingestion pipeline (embedding step)
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

try:
    from backend.celery import app as celery_app
except Exception:
    celery_app = None


def _embed_form_chunks_impl(self_or_none, form_request_id, collection_name: str = None):
    """Background task: load DocumentChunk rows for a form request and persist embeddings."""
    try:
        from ..models import FormRequest, DocumentChunk
        from ..services.embedding_service import EmbeddingService

        fr = FormRequest.objects.get(id=form_request_id)
        chunks = DocumentChunk.objects.filter(document__form_request=fr).order_by('chunk_index')
        if not chunks.exists():
            logger.info('No chunks found for FormRequest %s', form_request_id)
            return {'status': 'no_chunks'}

        embedder = EmbeddingService()
        coll = collection_name or f'form_{form_request_id}'
        db = embedder.embed_chunks(chunks, collection_name=coll)
        return {'status': 'ok', 'persisted': True}
    except Exception as e:
        logger.exception('embed_form_chunks failed: %s', e)
        return {'status': 'error', 'error': str(e)}


if celery_app:
    @celery_app.task(bind=True, name='rag.embed_form_chunks')
    def embed_form_chunks(self, form_request_id, collection_name: str = None):
        return _embed_form_chunks_impl(self, form_request_id, collection_name)
else:
    def embed_form_chunks(form_request_id, collection_name: str = None):
        # fallback to synchronous call when Celery not available
        return _embed_form_chunks_impl(None, form_request_id, collection_name)


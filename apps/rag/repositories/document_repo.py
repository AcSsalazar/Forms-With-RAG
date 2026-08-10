# Handles DB access for Document and DocumentChunk
from ..models import Document, DocumentChunk


class DocumentRepository:
    def get_documents_for_request(self, form_request):
        return Document.objects.filter(form_request=form_request).order_by('created_at')

    def save_chunk(self, document, chunk_text, chunk_index, metadata):
        return DocumentChunk.objects.create(
            document=document,
            chunk_text=chunk_text,
            chunk_index=chunk_index,
            metadata=metadata or {},
        )

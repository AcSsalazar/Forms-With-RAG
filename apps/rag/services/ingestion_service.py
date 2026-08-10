# Handles file validation, storage, and text extraction
import os
import hashlib
from django.conf import settings

from ..models import Document, DocumentChunk
from .chunking_service import ChunkingService
from .embedding_service import EmbeddingService


class IngestionService:
    def validate_and_store(self, files, form_request):
        """
        Save uploaded files to MEDIA_ROOT/rag_sources/<form_request.id>/
        Create Document records and a first DocumentChunk containing the extracted text.
        Returns list of created Document objects.
        """
        saved = []
        base_dir = os.path.join(settings.MEDIA_ROOT, 'rag_sources', str(form_request.id))
        os.makedirs(base_dir, exist_ok=True)

        for f in files:
            filename = f.name
            dest_path = os.path.join(base_dir, filename)
            # save file
            with open(dest_path, 'wb') as out:
                for chunk in f.chunks():
                    out.write(chunk)

            size = os.path.getsize(dest_path)
            checksum = hashlib.sha256(open(dest_path, 'rb').read()).hexdigest()

            # attempt to get page count for PDFs; ignore failures
            page_count = 0
            try:
                import PyPDF2

                with open(dest_path, 'rb') as pdf_f:
                    reader = PyPDF2.PdfReader(pdf_f)
                    page_count = len(reader.pages)
            except Exception:
                page_count = 0

            doc = Document.objects.create(
                form_request=form_request,
                filename=filename,
                size=size,
                storage_path=dest_path,
                page_count=page_count,
                checksum=checksum,
            )


            # extract text
            try:
                text = self.extract_text(dest_path)
            except Exception:
                text = ""

            # chunk the text and persist chunk records
            if text:
                chunker = ChunkingService()
                chunks = chunker.chunk_text(text)
                created_chunks = []
                for idx, chunk_text in chunks:
                    cc = DocumentChunk.objects.create(
                        document=doc,
                        chunk_text=chunk_text,
                        chunk_index=idx,
                        metadata={"source": filename, "chunk_index": idx, "document_id": doc.id},
                    )
                    created_chunks.append(cc)

                # enqueue embedding to background task (Celery) if available
                try:
                    from ..tasks.ingest_tasks import embed_form_chunks

                    collection = f"form_{form_request.id}"
                    # if Celery is configured, `embed_form_chunks.delay` will be available.
                    if hasattr(embed_form_chunks, 'delay'):
                        embed_form_chunks.delay(form_request.id, collection_name=collection)
                    else:
                        # synchronous fallback
                        embed_form_chunks(form_request.id, collection_name=collection)
                except Exception:
                    # embedding failures should not block ingestion
                    pass

            saved.append(doc)

        return saved

    def extract_text(self, file_path: str) -> str:
        """Basic text extraction: supports .txt and PDFs (PyPDF2 if installed).
        If PDF extraction isn't available, returns an empty string.
        """
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        if ext in ('.txt', '.md'):
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()

        if ext == '.pdf':
            try:
                import PyPDF2

                text_parts = []
                with open(file_path, 'rb') as pdf_f:
                    reader = PyPDF2.PdfReader(pdf_f)
                    for p in reader.pages:
                        try:
                            text_parts.append(p.extract_text() or "")
                        except Exception:
                            continue
                return "\n\n".join(text_parts)
            except Exception:
                # PyPDF2 not available or extraction failed
                return ""

        # unsupported type
        return ""

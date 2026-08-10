# Handles embedding generation and storage
import logging
from django.conf import settings
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceBgeEmbeddings

from ..models import DocumentChunk

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self):
        model_name = getattr(settings, 'EMBED_MODEL', None)
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': True}
        try:
            self.embed_model = HuggingFaceBgeEmbeddings(
                model_name=model_name,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs,
            )
        except Exception as e:
            logger.error('Failed to initialize embedding model: %s', e)
            self.embed_model = None

    def embed_chunks(self, document_chunks, collection_name: str | None = None):
        """
        Persist `document_chunks` (iterable of DocumentChunk instances) into a Chroma vector store.
        Returns the Chroma client instance.
        """
        texts = []
        metadatas = []
        for dc in document_chunks:
            texts.append(dc.chunk_text)
            md = dc.metadata or {}
            # include reference to DB ids to help later linking
            md.update({
                'document_chunk_id': getattr(dc, 'id', None),
                'document_id': getattr(dc, 'document_id', None),
                'chunk_index': getattr(dc, 'chunk_index', md.get('chunk_index')),
            })
            metadatas.append(md)

        persist_dir = getattr(settings, 'VECTOR_STORE', None)
        if persist_dir is None:
            raise RuntimeError('VECTOR_STORE not configured in settings')
        # make path relative to BASE_DIR when the setting starts with '/'
        try:
            from pathlib import Path

            base = getattr(settings, 'BASE_DIR', None)
            if base and str(persist_dir).startswith('/'):
                persist_dir = str(Path(base) / str(persist_dir).lstrip('/'))
        except Exception:
            pass

        collection = collection_name or 'default'

        if not self.embed_model:
            raise RuntimeError('Embedding model not initialized')

        # Create/append to Chroma collection
        db = Chroma.from_texts(
            texts,
            embedding=self.embed_model,
            metadatas=metadatas,
            persist_directory=persist_dir,
            collection_name=collection,
        )
        try:
            db.persist()
        except Exception as e:
            logger.warning('Chroma persist failed: %s', e)

        return db

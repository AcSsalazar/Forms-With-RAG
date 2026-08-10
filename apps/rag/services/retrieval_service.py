# Handles retrieval of relevant chunks from vector DB
import os
from pathlib import Path

from django.conf import settings
from langchain_community.vectorstores import Chroma

from .embedding_service import EmbeddingService


class RetrievalService:
    def _vector_store_path(self):
        persist_dir = getattr(settings, 'VECTOR_STORE', None)
        if not persist_dir:
            raise RuntimeError('VECTOR_STORE not configured in settings')
        if str(persist_dir).startswith('/'):
            return str(Path(settings.BASE_DIR) / str(persist_dir).lstrip('/'))
        return str(persist_dir)

    def _collection_name(self, form_request):
        return f'form_{form_request.id}'

    def _load_store(self, form_request):
        embedder = EmbeddingService()
        return Chroma(
            persist_directory=self._vector_store_path(),
            collection_name=self._collection_name(form_request),
            embedding_function=embedder.embed_model,
        )

    def retrieve(self, form_request, top_k=10, use_mmr=True):
        query = f'{form_request.evaluation_type} {form_request.difficulty} questions from the uploaded documents'
        db = self._load_store(form_request)

        results = []
        if use_mmr:
            try:
                docs = db.max_marginal_relevance_search(query, k=top_k, fetch_k=max(top_k * 2, top_k))
                for doc in docs:
                    metadata = doc.metadata or {}
                    results.append({
                        'text': doc.page_content,
                        'source': metadata.get('source'),
                        'chunk_index': metadata.get('chunk_index'),
                        'document_id': metadata.get('document_id'),
                        'document_chunk_id': metadata.get('document_chunk_id'),
                        'source_ref': self._build_source_ref(metadata),
                    })
                if results:
                    return results
            except Exception:
                pass

        try:
            docs_with_scores = db.similarity_search_with_score(query, k=top_k)
            for doc, score in docs_with_scores:
                metadata = doc.metadata or {}
                results.append({
                    'text': doc.page_content,
                    'source': metadata.get('source'),
                    'chunk_index': metadata.get('chunk_index'),
                    'document_id': metadata.get('document_id'),
                    'document_chunk_id': metadata.get('document_chunk_id'),
                    'score': score,
                    'source_ref': self._build_source_ref(metadata),
                })
        except Exception:
            results = []

        return results

    def _build_source_ref(self, metadata):
        source = metadata.get('source') or 'unknown'
        chunk_index = metadata.get('chunk_index')
        if chunk_index is None:
            return source
        return f'{source}#chunk{chunk_index}'

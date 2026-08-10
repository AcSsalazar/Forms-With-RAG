# Handles chunking of extracted text
class ChunkingService:
    def chunk_text(self, text, chunk_size_chars: int = 2000, overlap: int = 200):
        """
        Simple character-based chunking: split `text` into chunks of approximately
        `chunk_size_chars` with `overlap` characters repeated between consecutive chunks.
        Returns list of (index, chunk_text).
        """
        if not text:
            return []

        chunks = []
        start = 0
        idx = 0
        text_len = len(text)

        while start < text_len:
            end = start + chunk_size_chars
            chunk = text[start:end]
            chunks.append((idx, chunk))
            idx += 1
            start = max(0, end - overlap)

        return chunks

import io
from typing import Tuple, Dict, Any
from pypdf import PdfReader

def extract_text_from_pdf(file_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
    """
    Extracts text content and metadata from a PDF byte stream.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        num_pages = len(reader.pages)
        text_chunks = []
        
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_chunks.append(page_text.strip())
                
        full_text = "\n\n".join(text_chunks)
        metadata = {
            "num_pages": num_pages,
            "title": reader.metadata.title if reader.metadata and reader.metadata.title else "",
            "author": reader.metadata.author if reader.metadata and reader.metadata.author else "",
            "is_encrypted": reader.is_encrypted
        }
        return full_text, metadata
    except Exception as e:
        raise ValueError(f"Failed to parse PDF document: {str(e)}")

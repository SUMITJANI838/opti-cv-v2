from typing import Tuple, Dict, Any

def extract_text_from_raw(file_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
    """
    Extracts text from raw text / markdown / rtf bytes.
    """
    encodings = ["utf-8", "latin-1", "windows-1252", "ascii"]
    text = ""
    for enc in encodings:
        try:
            text = file_bytes.decode(enc)
            break
        except UnicodeDecodeError:
            continue
            
    if not text:
        text = file_bytes.decode("utf-8", errors="ignore")
        
    return text, {"encoding_used": "auto"}

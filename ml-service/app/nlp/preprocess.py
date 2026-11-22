import re

import spacy


nlp = spacy.load("en_core_web_sm")


def preprocess_text(text: str) -> tuple[str, list[str]]:
    normalized = re.sub(r"\s+", " ", text).strip()
    document = nlp(normalized)

    tokens = [
        token.text.lower()
        for token in document
        if not token.is_stop
        and not token.is_punct
        and not token.is_space
    ]
    
    normalized_text = " ".join(tokens)
    return normalized_text, tokens
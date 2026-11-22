from app.nlp.preprocess import preprocess_text


SKILL_ALIASES = {
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "python": "Python",
    "react": "React",
    "react.js": "React",
    "node.js": "Node.js",
    "node": "Node.js",
    "express": "Express",
    "express.js": "Express",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "git": "Git",
    "docker": "Docker",
    "fastapi": "FastAPI",
    "spacy": "spaCy",
    "java": "Java",
    "c++": "C++",
    "rest apis": "REST APIs",
    "html": "HTML",
    "css": "CSS",
    "tailwind css": "Tailwind CSS",
    "machine learning": "Machine Learning",
    "sql": "SQL",
}


def extract_skills(text: str) -> list[str]:
    normalized_text, _ = preprocess_text(text)
    detected = set()
    compact_text = f" {normalized_text.lower()} "

    for alias, canonical_name in SKILL_ALIASES.items():
        phrase = f" {alias.lower().strip()} "
        if phrase in compact_text:
            detected.add(canonical_name)

    return sorted(detected)

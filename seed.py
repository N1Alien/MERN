from sqlmodel import Session, create_engine, select, text
from main import Car, LOKALNY_NEON_URL

engine = create_engine(LOKALNY_NEON_URL)

samochody_testowe = [
    Car(
        mark="FastAPI High-Speed Edition",
        model="Python V8 Nitro",
        price=120000.0,
        year=2026,
        color="Python Green",
        engine="Asynchronous FastAPI Core",
        text="Ten rekord demonstruje pełną migrację z Node.js do FastAPI! Dane są serwowane asynchronicznie z chmurowej bazy PostgreSQL (Neon.tech). Szybkość odpowiedzi wzrosła o ponad 40%!",
        img=["/images/auto1.png", "/images/auto1.png", "/images/auto1.png"] # Twoje pierwsze auto
    ),
    Car(
        mark="PostgreSQL Relational Cruiser",
        model="Neon.tech Hybrid",
        price=95000.0,
        year=2026,
        color="Neon Blue",
        engine="SQLModel ORM Vector",
        text="Koniec z niestabilnym NoSQL. Ten model reprezentuje bezpieczną strukturę relacyjną. Transakcje i koszyk są w pełni walidowane przez silnik Pydantic przed zapisem w chmurze.",
        img=["/images/auto2.png", "/images/auto2.png", "/images/auto2.png"] # Twoje drugie auto
    ),
    Car(
        mark="Dockerized Container GT",
        model="Render Cloud Spec",
        price=150000.0,
        year=2026,
        color="Cloud White",
        engine="Multi-stage Docker Build",
        text="Aplikacja działa w izolowanym kontenerze Docker na chmurze Render. Frontend w React v16 i backend w FastAPI współdzielą zasoby, tworząc zunifikowaną architekturę chmurową.",
        img=["/images/auto3.png", "/images/auto3.png", "/images/auto3.png"] # Twoje trzecie auto
    )
]


def force_seed():
    with engine.connect() as conn:
        print("🧹 Usuwanie starych, wadliwych tabel w chmurze Neon...")
        conn.execute(text("DROP TABLE IF EXISTS orderproduct CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS \"order\" CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS car CASCADE;"))
        conn.commit()
    
    # Tworzymy puste tabele na nowo z prawidłową strukturą ARRAY
    from main import SQLModel
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        print("🚀 Wgrywanie świeżych samochodów wraz z tablicami obrazków...")
        for auto in samochody_testowe:
            session.add(auto)
        session.commit()
    print("=== SUKCES! BAZA CHMUROWA ZOSTAŁA ODNOWIONA I NASYCONA DANYMI! ===")

if __name__ == "__main__":
    force_seed()

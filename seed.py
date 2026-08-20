from sqlmodel import Session, create_engine, select, text
from main import Car, LOKALNY_NEON_URL

engine = create_engine(LOKALNY_NEON_URL)

samochody_testowe = [
    Car(
        mark="Audi",
        model="A4 B9",
        price=85000.0,
        year=2017,
        color="Czarny",
        engine="2.0 TDI",
        text="Zadbany egzemplarz z polskiego salonu. Serwisowany na bieżąco.",
        img=["/images/audi1.jpg", "/images/audi2.jpg", "/images/audi3.jpg"]
    ),
    Car(
        mark="BMW",
        model="Seria 3 G20",
        price=145000.0,
        year=2020,
        color="Niebieski",
        engine="2.0i xDrive",
        text="M-Pakiet wewnętrzny i zewnętrzny. Stan salonowy.",
        img=["/images/bmw1.jpg", "/images/bmw2.jpg", "/images/bmw3.jpg"]
    ),
    Car(
        mark="Toyota",
        model="RAV4",
        price=115000.0,
        year=2019,
        color="Biała Perła",
        engine="2.5 Hybrid",
        text="Niezawodny napęd hybrydowy. Bardzo ekonomiczny SUV.",
        img=["/images/toyota1.jpg", "/images/toyota2.jpg", "/images/toyota3.jpg"]
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

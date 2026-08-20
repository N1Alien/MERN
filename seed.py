from sqlmodel import Session, create_engine, select
# Importujemy strukturę tabeli bezpośrednio z Twojego pliku main.py
from main import Car, DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)

# Przykładowe samochody do Twojego sklepu
samochody_testowe = [
    Car(
        mark="Audi",
        model="A4 B9",
        price=85000.0,
        year=2017,
        color="Czarny",
        engine="2.0 TDI",
        text="Zadbany egzemplarz z polskiego salonu. Serwisowany na bieżąco, bogate wyposażenie."
    ),
    Car(
        mark="BMW",
        model="Seria 3 G20",
        price=145000.0,
        year=2020,
        color="Niebieski",
        engine="2.0i xDrive",
        text="M-Pakiet wewnętrzny i zewnętrzny. Pierwszy właściciel, niski przebieg, stan salonowy."
    ),
    Car(
        mark="Toyota",
        model="RAV4",
        price=115000.0,
        year=2019,
        color="Biała Perła",
        engine="2.5 Hybrid",
        text="Niezawodny napęd hybrydowy. Bardzo ekonomiczny i przestronny SUV idealny dla rodziny."
    ),
    Car(
        mark="Ford",
        model="Mustang GT",
        price=195000.0,
        year=2018,
        color="Czerwony",
        engine="5.0 V8",
        text="Legenda amerykańskiej motoryzacji. Brutalna moc, niesamowite brzmienie, manualna skrzynia."
    )
]

def seed_database():
    with Session(engine) as session:
        # Sprawdzamy, czy w bazie nie ma już przypadkiem jakichś aut
        istniejące_auta = session.exec(select(Car)).first()
        if istniejące_auta:
            print("⚠️ Baza danych zawiera już samochody. Przerywam, aby nie dublować danych.")
            return

        print("🚀 Dodaję samochody testowe do bazy Neon.tech...")
        for auto in samochody_testowe:
            session.add(auto)
        
        session.commit()
        print("✅ Sukces! Samochody zostały poprawnie zapisane w bazie.")

if __name__ == "__main__":
    seed_database()

import re
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, EmailStr, field_validator
from sqlmodel import Field as SQLField, Session, SQLModel, create_engine, select, Relationship

# 1. KONFIGURACJA BAZY DANYCH (Neon.tech)
DATABASE_URL = "postgresql://neondb_owner:npg_lQIxn5cAwp8E@ep-dry-paper-b1z9j468-pooler.c-5.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
engine = create_engine(DATABASE_URL, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatyczne tworzenie tabel w bazie przy starcie aplikacji
    SQLModel.metadata.create_all(engine)
    yield

def get_session():
    with Session(engine) as session:
        yield session

# 2. INICJALIZACJA APLIKACJI
app = FastAPI(title="Odrodzony Projekt Car Shop", lifespan=lifespan)

# CORS Middleware (Odpowiednik cors() w Express)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. MODELE BAZY DANYCH (SQLModel)

from pydantic import computed_field

class Car(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    mark: str
    model: str
    price: float
    year: int
    color: str
    engine: str
    text: str

    # Oszustwo dla starego Reacta: dodajemy wirtualne pole _id, którego szuka frontend
    @computed_field
    @property
    def _id(self) -> str:
        return str(self.id) if self.id is not None else ""


class Order(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    # Dane klienta (odpowiednik podobiektu client ze starego kodu)
    name: str
    email: str
    address: str
    city: str
    zip: str
    
    # Relacja do zamówionych produktów (1 do wielu)
    products: List["OrderProduct"] = Relationship(back_populates="order")

class OrderProduct(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    order_id: int = SQLField(foreign_key="order.id")
    amount: int
    mark: str
    model: str
    price: float
    engine: str
    request: str | None = None

    order: Order = Relationship(back_populates="products")


# 4. WALIDACJA PYDANTIC (Odpowiednik starego inputValidation.js)
# Pydantic robi to automatycznie podczas przyjmowania danych na endpoint!

class ClientSchema(BaseModel):
    name: str = Field(..., min_length=3)
    email: EmailStr  # Automatyczna walidacja formatu e-mail
    address: str
    city: str = Field(..., min_length=3)
    zip: str
    request: str | None = Field(default=None, max_length=30)

    @field_validator("name", "email", "address", "city", "zip", "request")
    @classmethod
    def check_invalid_signs(cls, v: str | None) -> str | None:
        if v is not None and re.search(r"[<>%\$]", v):
            raise ValueError("Wykryto niedozwolone znaki (<, >, %, $)")
        return v

class ProductItemSchema(BaseModel):
    amount: int
    mark: str
    model: str
    price: float
    engine: str

class OrderCreateSchema(BaseModel):
    client: ClientSchema
    products: List[ProductItemSchema]


# =====================================================================
# 5. ENDPOINTY API (Zabezpieczone przed trailing slash)
# =====================================================================

# Pobieranie wszystkich samochodów (obsługuje /api/cars oraz /api/cars/)
@app.get("/api/cars")
@app.get("/api/cars/")
def get_cars(session: Session = Depends(get_session)):
    cars = session.exec(select(Car)).all()
    return cars

# Pobieranie jednego samochodu po ID (obsługuje string ID z Reacta i trailing slash)
@app.get("/api/car/{car_id}")
@app.get("/api/car/{car_id}/")
def get_car(car_id: str, session: Session = Depends(get_session)):
    try:
        numeric_id = int(car_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Nieprawidłowy format ID")

    car = session.get(Car, numeric_id)
    if not car:
        raise HTTPException(status_code=404, detail="Not found")
    return car

# Składanie nowego zamówienia (obsługuje /api/order oraz /api/order/)
@app.post("/api/order")
@app.post("/api/order/")
def create_order(payload: OrderCreateSchema, session: Session = Depends(get_session)):
    try:
        db_order = Order(
            name=payload.client.name,
            email=payload.client.email,
            address=payload.client.address,
            city=payload.client.city,
            zip=payload.client.zip
        )
        session.add(db_order)
        session.commit()
        session.refresh(db_order)

        for prod in payload.products:
            db_order_product = OrderProduct(
                order_id=db_order.id,
                amount=prod.amount,
                mark=prod.mark,
                model=prod.model,
                price=prod.price,
                engine=prod.engine,
                request=prod.request
            )
            session.add(db_order_product)
        
        session.commit()
        return {"success": True, "order_id": db_order.id}
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Obsługa błędów API 404
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
def api_404(path: str):
    raise HTTPException(status_code=404, detail="Not found...")


# 6. SERWOWANIE APLIKACJI REACT (SPA)
# UWAGA: Te linie muszą być na samym dole pliku, by nie nadpisać endpointów API!
try:
    app.mount("/", StaticFiles(directory="../build", html=True), name="static")
    
    @app.exception_handler(404)
    async def fallback_to_index(request, exc):
        # Odpowiednik app.use('*', ...) z Expressu dla React Routera
        return FileResponse("../build/index.html")
except RuntimeError:
    print("Folder '../build' nie istnieje. Serwowane jest tylko API.")
# 6. SERWOWANIE APLIKACJI REACT (Natywne wsparcie SPA dla FastAPI)
# Automatycznie serwuje folder build i przekazuje nieznane ścieżki do index.html
app.frontend("/", directory="./build")

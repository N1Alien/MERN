import os
import re
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, EmailStr, field_validator, computed_field
from sqlmodel import Field as SQLField, Session, SQLModel, create_engine, select, Relationship
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String

# =====================================================================
# 1. KONFIGURACJA BAZY DANYCH (Neon.tech)
# =====================================================================
# Link zawiera doklejony parametr options na końcu, co eliminuje błąd SNI w psycopg2
LOKALNY_NEON_URL = (
    "postgresql://neondb_owner:npg_lQIxn5cAwp8E"
    "@ep-dry-paper-b1z9j468-pooler.c-5.eu-central-1.aws.neon.tech/neondb"
    "?sslmode=require&channel_binding=require&options=endpoint%3Dep-dry-paper-b1z9j468-pooler"
)

DATABASE_URL = os.getenv("DATABASE_URL", LOKALNY_NEON_URL)
engine = create_engine(DATABASE_URL, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tworzy tabele w bazie przy starcie aplikacji
    SQLModel.metadata.create_all(engine)
    yield

def get_session():
    with Session(engine) as session:
        yield session

# =====================================================================
# 2. INICJALIZACJA APLIKACJI & MIDDLEWARE
# =====================================================================
app = FastAPI(title="Odrodzony Projekt Car Shop", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# 3. MODELE BAZY DANYCH (SQLModel z obsługą ARRAY dla obrazków)
# =====================================================================
class Car(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    mark: str
    model: str
    price: float
    year: int
    color: str
    engine: str
    text: str
    
    # Przechowywanie listy ścieżek do zdjęć w PostgreSQL
    img: list[str] = SQLField(sa_column=Column(ARRAY(String)))

    # Generujemy wirtualne pole _id dla zgodności ze starym Reduxem (MongoDB)
    @computed_field
    @property
    def _id(self) -> str:
        return str(self.id) if self.id is not None else ""

class Order(SQLModel, table=True):
    id: int | None = SQLField(default=None, primary_key=True)
    name: str
    email: str
    address: str
    city: str
    zip: str
    
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

# =====================================================================
# 4. SCHEMATY WALIDACJI DANYCH (Zsynchronizowane z Order.js)
# =====================================================================
class ClientSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=12)
    email: EmailStr
    address: str = Field(..., min_length=6, max_length=22)
    city: str = Field(..., min_length=3, max_length=16)
    zip: str

    @field_validator("name", "email", "address", "city", "zip")
    @classmethod
    def check_invalid_signs(cls, v: str) -> str:
        if re.search(r"[<>%\$]", v):
            raise ValueError("Wykryto niedozwolone znaki (<, >, %, $)")
        return v

class ProductItemSchema(BaseModel):
    amount: int
    mark: str
    model: str
    price: float
    engine: str
    request: str | None = Field(default=None)

class OrderCreateSchema(BaseModel):
    client: ClientSchema
    products: List[ProductItemSchema]

# =====================================================================
# 5. ENDPOINTY API (Zabezpieczone przed trailing slash)
# =====================================================================

@app.get("/api/cars")
@app.get("/api/cars/")
def get_cars(session: Session = Depends(get_session)):
    cars = session.exec(select(Car)).all()
    return cars

@app.get("/api/car/{car_id}")
@app.get("/api/car/{car_id}/")
def get_car(car_id: str, session: Session = Depends(get_session)):
    clean_id = car_id.strip("'\" ")
    try:
        numeric_id = int(clean_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Nieprawidłowy format ID")

    car = session.get(Car, numeric_id)
    if not car:
        raise HTTPException(status_code=404, detail="Not found")
    return car

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

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
def api_404(path: str):
    raise HTTPException(status_code=404, detail="Not found...")

# =====================================================================
# 6. SERWOWANIE PRODUKCYJNE FRONTENDU REACT SPA
# =====================================================================
try:
    app.mount("/static", StaticFiles(directory="./build/static"), name="static")
    app.mount("/images", StaticFiles(directory="./build/images"), name="images")
except RuntimeError:
    pass

@app.get("/")
def serve_index():
    return FileResponse("./build/index.html")

@app.get("/{path:path}")
def catch_all(path: str):
    if path.startswith("api"):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse("./build/index.html")

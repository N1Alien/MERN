# Krok 1: Budowanie Frontendu (React)
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Kopiujemy pliki konfiguracyjne i instalujemy zależności
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kopiujemy całe repozytorium i budujemy produkcyjny folder build
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_ENV=production
RUN npm run build

# Krok 2: Środowisko uruchomieniowe (Python + FastAPI)
FROM python:3.11-slim
WORKDIR /app

# Instalujemy zależności Pythona
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy pliki źródłowe backendu
COPY main.py .
COPY seed.py .

# Kopiujemy wygenerowany folder build bezpośrednio do katalogu głównego bazy (/app/build)
COPY --from=frontend-builder /app/build ./build

# Wystawiamy port wymagany przez platformę Render
EXPOSE 10000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]

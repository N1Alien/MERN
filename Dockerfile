# Krok 1: Budowanie Frontendu (React)
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Krok 2: Przygotowanie Środowiska Produkcyjnego (Python + FastAPI)
FROM python:3.11-slim
WORKDIR /app

# Kopiujemy wymagania i instalujemy biblioteki Pythona
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy plik serwera oraz zbudowany przed chwilą frontend
COPY main.py .
COPY --from=frontend-builder /app/build ./build

# Wystawiamy port i uruchamiamy produkcyjnie uvicorn
EXPOSE 10000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]

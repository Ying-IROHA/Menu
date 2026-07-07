# Build from the project ROOT (the "Bar menu" folder that contains both
# backend/ and Menu/), e.g.:
#   docker build -f backend/Dockerfile -t nocturne-bar .
#   docker run -p 8000:8000 -v nocturne-data:/app/backend nocturne-bar
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ backend/
COPY Menu/ Menu/

WORKDIR /app/backend

# bar_menu.db is created here on first run; mount a volume on
# /app/backend so the database survives container rebuilds/restarts.
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

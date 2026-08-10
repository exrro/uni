# ---- Stage 1: build the frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ---- Stage 2: FastAPI backend that also serves the built frontend ----
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Copy the built frontend into the backend image so FastAPI can serve it
# (single origin, single process, single port — Railway-friendly).
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
RUN mkdir -p data
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Clothy Buddy

Clothy Buddy is a full-stack wardrobe management and outfit recommendation project built with React, Vite, FastAPI, SQLite, and SQLAlchemy.

## Project Structure

- `Backend/`
  FastAPI backend, database config, API routes, recommendation logic, and local uploads.
- `Frontend/FashionAppUI/`
  React + Vite frontend for login, wardrobe management, and outfit recommendations.
- `Clothy_Buddy_Final_Report.md`
  Main academic/project report.
- `TABLE_OF_CONTENTS.md`
  Report table of contents.

## Run Locally

### Backend

1. Create or activate a virtual environment inside `Backend/`.
2. Copy `Backend/.env.example` to `Backend/.env` and adjust values if needed.
3. Install dependencies:

```powershell
cd Backend
pip install -r requirements.txt
```

4. Start the API:

```powershell
cd Backend
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend

1. Install dependencies:

```powershell
cd Frontend\FashionAppUI
npm install
```

2. Start the frontend:

```powershell
cd Frontend\FashionAppUI
npm run dev -- --host 127.0.0.1 --port 5173
```

## Default Local URLs

- Frontend: `http://127.0.0.1:5173/`
- Backend: `http://127.0.0.1:8000/`

## Notes Before Publishing

- Do not commit `Backend/.env`.
- Do not commit `Backend/venv`, `node_modules`, local database files, uploads, or build caches.
- Use `Backend/.env.example` as the public configuration template.

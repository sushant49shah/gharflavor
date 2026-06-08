# Ghar Flavor Ecommerce

Full-stack ecommerce application for homemade foods, groceries, snacks, and kitchen essentials. The project uses a Django REST API backend and a React + TypeScript + Vite frontend, with deployment configured for Render.

## Tech Stack

- Backend: Django 6, Django REST Framework, Simple JWT
- Frontend: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS
- Database: SQLite locally, PostgreSQL on Render
- Deployment: Render Blueprint via `render.yaml`

## Project Structure

```text
.
├── backend/        # Django API project
├── frontend/       # React/Vite frontend
├── render.yaml     # Render deployment blueprint
└── README.md
```

## Features

- Product catalog with categories, search, sorting, pagination, and featured products
- Product reviews with authenticated submission
- Cart and checkout flow
- JWT login, registration, profile, and token refresh
- Admin product, customer, order, and review management
- Contact form API
- Localhost and Render-compatible API configuration

## Backend Setup

From the project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Useful backend commands:

```bash
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
```

## Frontend Setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

For local development, the frontend defaults to:

```text
VITE_API_URL=http://127.0.0.1:8000
```

To override it, create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Validation

Backend:

```bash
cd backend
python manage.py check
```

Frontend:

```bash
cd frontend
npm run build
```

`npm run build` runs TypeScript checks first through `tsc -b`, then builds the Vite app.

## API Routes

Main API route groups:

```text
/api/products/
/api/products/categories/
/api/products/?badge=featured
/api/reviews/
/api/reviews/product/<product_id>/
/api/orders/
/api/orders/create/
/api/orders/admin/
/api/users/
/api/users/login/
/api/users/register/
/api/users/profile/
/api/users/profile/update/
/api/token/
/api/token/refresh/
/api/common/contact/
```

## Environment Variables

Backend:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
DATABASE_URL=postgres-url-for-production
```

Frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Render Deployment

The root `render.yaml` defines:

- PostgreSQL database: `gharflavor-db`
- Backend web service: `gharflavor-backend`
- Static frontend service: `gharflavor`

Backend Render settings:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
Start Command: gunicorn config.wsgi:application
```

Frontend Render settings:

```text
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
VITE_API_URL: https://gharflavor-backend.onrender.com
```

The frontend uses the shared Axios instance in `frontend/src/app/axios.ts`, so local and production API URLs work without manual code changes.

## Notes

- Do not commit generated Python cache files or local database changes.
- Add new frontend API calls through the shared Axios instance so they respect `VITE_API_URL`.
- Add backend routes under the `/api/` prefix to match the current deployment pattern.

# AgriStack backend

FastAPI + MongoDB (Beanie ODM) backend for AgriStack.

## Setup

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Make sure your local MongoDB container is running:

```
docker start agristack-mongo
```

Then run the server:

```
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

## Switching to Atlas

Once your Atlas cluster is ready, update `MONGODB_URI` in `.env` to your Atlas connection string. No code changes needed.

## Structure

- `app/auth` — registration, login, JWT
- `app/marketplace` — listings, orders
- `app/assistant` — proxies requests to the voice assistant service (expects it running on `http://localhost:8100`, update `VOICE_SERVICE_URL` in `app/assistant/service.py` once your teammate's service is ready)
- `app/notifications` — stub, to be built out later
- `app/core` — config, security, auth dependency
- `app/db` — Mongo connection and Beanie initialization

## Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /marketplace/listings`
- `GET /marketplace/listings`
- `POST /marketplace/orders`
- `GET /marketplace/orders`
- `POST /assistant/query`
- `GET /notifications/`
- `GET /health`

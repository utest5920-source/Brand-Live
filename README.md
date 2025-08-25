# Brand.live Clone - Full Stack (Node.js + React + Prisma + SQLite)

## Stack
- Backend: Node.js, Express, Prisma ORM, SQLite (dev) / replaceable with Postgres/MySQL in prod
- Frontend: React (Vite), Axios, React Router
- Auth: OTP (6-digit), JWT
- Uploads: Multer to `server/uploads`

## Project Structure
- `server/` Node.js API
- `client/` React UI

## Prerequisites
- Node.js 18+

## Setup
1. Backend
```bash
cd server
cp .env .env.local || true
npm install
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Server runs at `http://localhost:4000`

2. Frontend
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173`

## Environment
- Server `.env`
```
PORT=4000
JWT_SECRET=change_me
DATABASE_URL="file:./dev.db"
UPLOAD_DIR="./uploads"
CORS_ORIGIN="http://localhost:5173"
```
- Client `.env`
```
VITE_API_BASE=http://localhost:4000
```

## API Overview
- Auth: `POST /auth/login` (otp), `POST /auth/verify` (jwt)
- User: `GET /me/profile`, `PUT /me/profile`
- Business: categories (`/business/categories`), frames (`/business/frame`, `/business/frames`), profile (`/business/profile`)
- Political: frames (`/political/frame`, `/political/frames`), profile (`/political/profile`)
- Image categories: `GET/POST/PUT /categories/image`
- Images: `GET/POST /images`
- Ads: `GET/POST/PUT /ads`

## Production Notes
- Replace SQLite with Postgres/MySQL; update `DATABASE_URL` and run migrations.
- Serve `client` build via a reverse proxy and point to server API.
- Store uploads on S3 or similar in production.
- Secure CORS and JWT secret.

## OTP
- 6-digit numeric, generated locally without third-party services.
- For demo, OTP is returned in response; use an SMS provider in production.
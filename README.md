# EventX Studio (scaffold)

This workspace contains a minimal full-stack scaffold for EventX Studio.

Server (Express + MongoDB)

- Location: `server`
- Setup:
  - copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
  - npm install
  - npm run seed
  - npm run dev

Client (React + Vite + Tailwind)

- Location: `client`
- Setup:
  - npm install
  - set `VITE_API_BASE` in `.env` if backend is remote
  - npm run dev

Notes:

- This is a starting scaffold. It implements authentication, event CRUD, booking with QR codes, and a simple analytics endpoint.

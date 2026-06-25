EventX backend

Setup:

- copy .env.example to .env and set MONGO_URI and JWT_SECRET
- npm install
- npm run seed
- npm run dev

APIs:

- POST /api/auth/register
- POST /api/auth/login
- CRUD /api/events
- POST /api/tickets/book/:eventId
- GET /api/tickets/me
- GET /api/analytics (admin)

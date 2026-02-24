# ServPro Frontend (Client)

Customer-facing web app for browsing services, viewing details, and booking providers.

## Tech Stack
- React 19 + Vite
- React Router
- Fetch-based API client

## Requirements
- Node.js 18+
- Backend running on `http://localhost:4000`

## Setup
```bash
npm install
```

Create `.env` (or copy `.env.example`) and set:
```
VITE_API_BASE_URL=http://localhost:4000
```

## Run
```bash
npm run dev
```

Default dev URL: `http://localhost:5173`

## Key Routes
- `/` Home (services + offers)
- `/services` Services list
- `/services/:id` Service details + booking
- `/login` Client login
- `/register` Client registration
- `/my-bookings` Client bookings (protected)

## API Notes
- List endpoints return `{ items: [...] }`.
- Bookings list uses `GET /bookings?clientId=...`.
- Reservation details are created via `POST /reservation-details` before booking.

## Common Issues
- 404 or HTML response: confirm `VITE_API_BASE_URL` is set to the backend port.
- Empty lists: ensure backend returns `{ items: [...] }` and the user is logged in.

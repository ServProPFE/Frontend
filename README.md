# ServPro Frontend (Client)

Customer-facing web app for browsing services, viewing details, and booking providers.

## Tech Stack
- React 19 + Vite
- React Router
- react-i18next (Bilingual AR/EN with RTL support)
- Fetch-based API client

## Features
- 🌍 **Bilingual Support**: Full Arabic & English interface with RTL (Right-to-Left) layout
- 🔍 Service discovery and filtering
- 📅 Online booking system
- 📈 Booking history with status tracking
- ⭐ Customer reviews and ratings
- 👤 User profile management
- 💳 **Transaction history** (new)
- 🌙 Auto language detection with localStorage persistence

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
- `/services` Services list with filtering
- `/services/:id` Service details + booking form
- `/login` Client login
- `/register` Client registration
- `/my-bookings` Client bookings history (protected)
- `/my-transactions` Transaction history (protected) (new)

## Internationalization (i18n)

### Language Switching
- Click language toggle in navbar to switch between English and Arabic
- Preference is saved to localStorage
- RTL layout automatically applied for Arabic

### Translation Files
Located in `src/locales/`:
- `en.json` - English translations
- `ar.json` - Arabic translations (العربية)

### Key Features
- Auto-detection of browser language
- RTL (Right-to-Left) support for Arabic
- Date formatting based on language
- All UI strings translated

## API Notes
- List endpoints return `{ items: [...] }`.
- Bookings list uses `GET /bookings?clientId=...`.
- Transactions list uses `GET /transactions`.
- Reservation details are created via `POST /reservation-details` before booking.
- Transactions created automatically when booking is CONFIRMED.

## Common Issues
- 404 or HTML response: confirm `VITE_API_BASE_URL` is set to the backend port.
- Empty lists: ensure backend returns `{ items: [...] }` and the user is logged in.
- Language not switching: clear browser cache and localStorage
- RTL not working: check if Arabic is selected in language switcher

## Project Structure
```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── context/          # React Context (Auth, etc)
├── services/         # API service layer
├── config/           # Configuration (API endpoints)
├── styles/           # CSS files
├── locales/          # i18n translation files (EN, AR)
│   ├── en.json      # English
│   └── ar.json      # Arabic
└── App.jsx           # Main app component
```

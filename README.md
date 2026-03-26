# AcademicConnect - University Lost & Found Portal

A production-ready MERN stack application for managing lost and found items in a university campus. Features a score-based matching system and a premium "Academic Curator" UI.

## 🚀 Features

- **Authentication**: Roll number based login, mandatory first-time password change.
- **Lost & Found Reporting**: Multi-step forms with image upload support.
- **Matching System**: Automatic potential match detection using fuzzy string similarity, location matching, and date proximity.
- **Claim System**: Integrated workflow for users to claim items and finders to approve/reject.
- **Dashboard**: High-level overview of activity and matches.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: JWT, Bcrypt, Protected Route Middlewares.
- **Matching**: `string-similarity` for fuzzy matching logic.

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or on Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see `.env.example`)
4. Seed sample data: `npm run seed` (Add `"seed": "node seed.js"` to `package.json` scripts)
5. Start server: `npm start`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start dev server: `npm run dev`

## 🔄 Git Workflow
The project follows a clean branching strategy:
- `main`: Stable production code.
- `develop`: Integration branch.
- `feature/*`: Specific feature branches merged into develop.

# 🏆 SavageMood — MLBB Tournament Management Platform

SavageMood is a professional-grade automated system designed for organizing and managing **Mobile Legends: Bang Bang (MLBB)** tournaments. Built with high performance and scalability in mind, it simplifies the complex process of bracket generation and participant management.

---

## 🖥️ User Interface Preview

| ![Admin](frontend/public/demo1.png) | ![Profile](frontend/public/demo2.png) |
|-------------------------------------|---------------------------------------|
| ![Main](frontend/public/demo3.jpg)  | ![TournamentInfo](frontend/public/demo4.jpg) |

---

## ✨ Features

### ✅ Currently Implemented
- **Full Administrative Suite:** A dedicated dashboard for organizers to oversee users, manage teams, and control tournament status.
- **Automated Brackets:** Seamless integration with the **Challonge API** for instant tournament grid generation and real-time updates.
- **User Management:** Secure registration and authentication flow with role-based access control (RBAC).
- **Tournament Lifecycle:** Complete management from initial creation to final result submission.
- **Clean Architecture:** Backend implementation following the Dependency Rule for maximum maintainability.

### 🗺️ Roadmap (Future Enhancements)
- [ ] **Official MLBB API Integration:** Direct stat tracking and match result verification from Moonton servers.
- [ ] **Real-time Notifications:** WebSocket-based alerts for match start times and bracket changes.
- [ ] **Auto Team-Building:** AI-driven matchmaking for solo players to form balanced competitive teams.
- [ ] **Payment Integration:** Secure entry fee processing and automated prize distribution.

---

## 🛠️ Tech Stack

### Backend
- **Go (Golang)** – High-concurrency server core
- **PostgreSQL** – Relational database for persistent storage
- **Redis** – In-memory cache for bracket data
- **JWT** – Secure token-based authentication
- **Challonge API** – External integration for professional bracket logic
- **SMTP Sandbox** – Email verification testing (Mailtrap / Mailhog)

### Frontend
- **Next.js (App Router)** – Modern React framework
- **Tailwind CSS** – Utility-first styling
- **TypeScript** – End-to-end type safety
- **Zustand** – Lightweight global state management
- **Axios** – API communication

### Infrastructure
- **Docker & Docker Compose** – Containerization
- **golang-migrate** – Database schema version control

---

## 📂 Project Structure

```text
.
├── backend/                # Go API Service
│   ├── cmd/api/            # Main entry point
│   ├── internal/           # Domain, Usecases, Repositories (Clean Arch)
│   └── migrations/         # SQL schema migration files
├── frontend/               # Next.js Application
│   ├── src/app/            # App Router pages
│   ├── src/components/     # Reusable UI
│   └── src/lib/            # API clients & utilities
└── docker-compose.yml      # Infrastructure orchestration
```

---

# 🚀 Getting Started

Follow these steps to run the project locally.

---

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/savagemood.git
cd savagemood
```

---

## 2️⃣ Create `.env` file

Create a `.env` file in the root directory:

```env
DB_USER=user
DB_PASSWORD=password
DB_NAME=savagemood_db
DB_HOST=localhost
DB_PORT=5432

DATABASE_URL=postgres://user:password@localhost:5432/savagemood_db?sslmode=disable

PORT=8080
JWT_SECRET=your_jwt_secret

CHALLONGE_API_KEY=
CHALLONGE_USERNAME=

REDIS_URL=redis://localhost:6379

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

FRONTEND_URL=http://localhost:3000
```

---

## 3️⃣ Start PostgreSQL with Docker

```bash
docker compose up -d
```

This will start the PostgreSQL database and Redis containers.

---

## 4️⃣ Run Backend

```bash
cd backend
go mod tidy
go run cmd/api/main.go
```

Backend will start on:

```
http://localhost:8080
```

---

## 5️⃣ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

---

## 🧪 Testing

```bash
cd backend
```

Run all tests:

```bash
go test ./...
```

Run tests with output:

```bash
go test ./... -v
```

Run a specific package:

```bash
go test ./internal/config/...
go test ./internal/middleware/...
go test ./internal/services/...
go test ./internal/handlers/...
```

Run a specific test by name:

```bash
go test ./internal/middleware/... -run TestAuthMiddleware_ExpiredToken -v
```
# Task Manager

A full-stack task management application with a **FastAPI** backend and a **React + TypeScript** frontend. Supports user authentication, CRUD operations for tasks, and a Kanban board view.

---

## Project Structure

```
.
├── backend/                          # FastAPI backend
│   ├── .env                          # Environment variables (local config)
│   ├── .env.example                  # Environment variable template
│   ├── alembic.ini                   # Alembic migration configuration
│   ├── requirements.txt              # Python dependencies
│   ├── alembic/
│   │   ├── env.py                    # Alembic environment setup
│   │   ├── script.py.mako            # Migration template
│   │   └── versions/
│   │       └── 001_initial.py        # Initial database migration
│   └── app/
│       ├── __init__.py
│       ├── main.py                   # FastAPI app entry point
│       ├── config.py                 # Pydantic settings (env-based config)
│       ├── database.py               # SQLAlchemy engine & session setup
│       ├── deps.py                   # Dependency injection (DB session, current user)
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py               # User SQLAlchemy model
│       │   └── task.py               # Task SQLAlchemy model
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── user.py               # Pydantic schemas for auth
│       │   └── task.py               # Pydantic schemas for tasks
│       ├── services/
│       │   ├── __init__.py
│       │   ├── auth.py               # Business logic: registration, login, JWT
│       │   └── tasks.py              # Business logic: CRUD, filtering
│       └── routers/
│           ├── __init__.py
│           ├── auth.py               # Auth API endpoints
│           └── tasks.py              # Tasks API endpoints
│
├── frontend/                         # React + TypeScript frontend
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node.js dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.node.json            # TypeScript config for Vite/Node
│   ├── vite.config.ts                # Vite config with API proxy
│   └── src/
│       ├── main.tsx                  # React entry point
│       ├── App.tsx                   # Router & auth provider setup
│       ├── App.css                   # App-level styles
│       ├── index.css                 # Global styles
│       ├── types/
│       │   └── index.ts              # Shared TypeScript types
│       ├── services/
│       │   └── api.ts                # HTTP client (auth, task API calls)
│       ├── contexts/
│       │   └── AuthContext.tsx        # Auth state management (React context)
│       ├── components/
│       │   ├── Layout.tsx            # App shell with nav bar
│       │   ├── ProtectedRoute.tsx    # Auth guard wrapper
│       │   ├── TaskCard.tsx          # Task card component
│       │   ├── TaskForm.tsx          # Task create/edit form
│       │   └── KanbanColumn.tsx      # Kanban column with drag-and-drop
│       └── pages/
│           ├── LoginPage.tsx         # Login page
│           ├── RegisterPage.tsx      # Registration page
│           ├── DashboardPage.tsx     # Task list / dashboard view
│           └── KanbanPage.tsx        # Kanban board view
│
└── README.md                         # This file
```

---

## Backend (FastAPI)

### Stack

- **FastAPI** — web framework
- **SQLAlchemy** — ORM
- **Alembic** — database migrations
- **PostgreSQL** — database
- **python-jose** — JWT token creation/validation
- **passlib[bcrypt]** — password hashing
- **Pydantic** — data validation / settings management

### Configuration

Copy `.env.example` to `.env` and adjust values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
SECRET_KEY=change-me-to-a-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Setup & Run

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.  
Interactive docs (Swagger UI) at **http://localhost:8000/docs**.

### API Endpoints

| Method | Endpoint               | Auth Required | Description                    |
|--------|------------------------|---------------|--------------------------------|
| POST   | `/api/auth/register`   | No            | Register a new user            |
| POST   | `/api/auth/login`      | No            | Login, receive JWT token       |
| GET    | `/api/auth/me`         | Yes           | Get current user profile       |
| GET    | `/api/tasks/`          | Yes           | List tasks (filterable)        |
| POST   | `/api/tasks/`          | Yes           | Create a task                  |
| GET    | `/api/tasks/{id}`      | Yes           | Get a single task              |
| PUT    | `/api/tasks/{id}`      | Yes           | Update a task                  |
| DELETE | `/api/tasks/{id}`      | Yes           | Delete a task                  |
| PATCH  | `/api/tasks/{id}/status` | Yes         | Update task status only        |
| GET    | `/api/health`          | No            | Health check                   |

- Task list supports `?status=todo&priority=high` query parameters.
- All task endpoints require a `Bearer <token>` authorization header.

---

## Frontend (React + TypeScript)

### Stack

- **React 18** — UI library
- **TypeScript** — type-safe language
- **Vite** — build tool and dev server
- **React Router v6** — client-side routing
- **CSS** — plain CSS (no framework)

### Setup & Run

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server starts at **http://localhost:5173**.

### How It Connects to the Backend

Vite's dev server proxies `/api/*` requests to the backend at `http://localhost:8000` (configured in `vite.config.ts`). This means:

- The frontend runs on `http://localhost:5173`
- API calls like `fetch('/api/auth/login')` are forwarded to `http://localhost:8000/api/auth/login`
- CORS is configured on the backend to accept requests from `http://localhost:5173`

No manual CORS handling is needed during development.

### Pages

| Route       | Page             | Auth Required | Description                          |
|-------------|------------------|---------------|--------------------------------------|
| `/login`    | LoginPage        | No            | Sign in with email + password        |
| `/register` | RegisterPage     | No            | Create a new account                 |
| `/`         | DashboardPage    | Yes           | Task table with filters and search   |
| `/kanban`   | KanbanPage       | Yes           | Kanban board with drag-and-drop      |

### Features

- **Authentication**: Login, register, and JWT-based session persistence.
- **Dashboard**: Sortable/filterable task list with search.
- **Kanban Board**: Three-column layout (To Do / In Progress / Done) with drag-and-drop status updates.
- **Task CRUD**: Create, edit, and delete tasks via modal forms.
- **Protected Routes**: Unauthenticated users are redirected to `/login`.

---

## Running the Full Stack

1. **Start the backend** (terminal 1):
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start the frontend** (terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser.

4. Register a new account, then log in and start managing tasks.

---

## Database Migrations

Migrations are managed with Alembic. To create a new migration after model changes:

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

# Ethara TaskFlow

**Enterprise Team Task Intelligence Platform**

A production-grade full-stack web application built for the Ethara AI hiring assignment. EtharaFlow enables teams to create projects, manage tasks, assign work, and track progress — all with role-based access control and an enterprise-grade UI.

---

## ✨ Features

### Authentication
- JWT-based authentication with bcrypt password hashing
- Persistent sessions via localStorage
- Protected routes and role guards
- Login / Signup with validation

### Role-Based Access Control
| Feature | Admin | Member |
|---|---|---|
| Create / Delete Projects | ✅ | ❌ |
| Create / Delete Tasks | ✅ | ❌ |
| Assign Tasks | ✅ | ❌ |
| Change Any Task Status | ✅ | ❌ |
| Update Own Task Status | ✅ | ✅ |
| View Dashboard Analytics | ✅ | ❌ |
| View Team Members | ✅ | ❌ |
| View Assigned Tasks/Projects | ✅ | ✅ |

### Project Management
- Create, edit, delete projects
- Add/remove members
- Project status, priority, color, deadline
- Real-time progress tracking based on tasks

### Task Management
- Full CRUD with admin-only create/delete
- Priority badges: Low / Medium / High / Critical
- Status flow: Todo → In Progress → Completed → Overdue
- Auto-overdue detection based on deadline
- Search and filter by status/priority
- Inline status updates for members

### Dashboard
- Animated stats cards: Total, Completed, In Progress, Overdue
- Bar chart visualization (Recharts)
- Project progress list with progress bars
- Recent task table

### UX/Design
- Dark luxury design inspired by Ethara AI, Linear, Vercel
- Framer Motion animations throughout
- React Hot Toast notifications
- Skeleton loaders
- Empty states
- Confirm delete modals
- Responsive layout

---

## 🛠 Tech Stack

### Frontend
- React 18 (Vite)
- TailwindCSS v4
- React Router v6
- Axios
- Framer Motion
- React Hook Form
- React Hot Toast
- Recharts
- Lucide React

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs
- Morgan (logging)
- express-validator

---

## 🗂 Project Structure

```
ethara-taskflow/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # authController, projectController, taskController
│   │   ├── middleware/      # auth.js, errorHandler.js
│   │   ├── models/         # User, Project, Task
│   │   ├── routes/         # auth, projects, tasks
│   │   └── server.js       # Express entry point
│   ├── .env.example
│   ├── package.json
│   └── railway.toml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/     # Layout, Sidebar, UI, ProtectedRoute
│   │   ├── contexts/       # AuthContext
│   │   ├── pages/
│   │   │   ├── auth/       # Login, Signup
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Team.jsx
│   │   │   └── Landing.jsx
│   │   ├── services/       # api.js (Axios instance)
│   │   ├── App.jsx
│   │   └── index.css       # Design system
│   ├── .env.example
│   ├── package.json
│   └── railway.toml
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone <repo-url>
cd ethara-taskflow

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ethara-taskflow
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data (Optional)

Create your first admin via POST `/api/auth/signup`:

```json
{
  "name": "Admin User",
  "email": "admin@ethara.ai",
  "password": "admin123",
  "role": "admin"
}
```

> **Note:** The first registered user is automatically set to Admin.

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Current user |
| GET | `/api/auth/users` | Admin | All users |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/projects` | Private | Get all (filtered by role) |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Private | Get project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project + tasks |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Private | Get tasks (role-filtered) |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/analytics` | Admin | Dashboard stats |
| GET | `/api/tasks/:id` | Private | Get task |
| PATCH | `/api/tasks/:id` | Private | Update (member: status only) |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

---

## ☁️ Railway Deployment

### Backend

1. Create new Railway project → Add service → GitHub repo (backend folder)
2. Set **Root Directory**: `backend`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.railway.app`
4. Deploy!

### Frontend

1. Add another service → GitHub repo (frontend folder)
2. Set **Root Directory**: `frontend`
3. Add environment variables:
   - `VITE_API_URL=https://your-backend.railway.app/api`
4. Deploy!

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@ethara.ai | admin123 |
| Member | member@ethara.ai | member123 |

---

## 📝 Design Philosophy

The UI is inspired by **Ethara AI's** official design language:
- Black (#080808) primary background
- Charcoal cards with subtle 1px borders
- Off-white (#f5f5f0) text
- Indigo (#6366f1) accent color
- Inter typography with tight letter-spacing
- Smooth Framer Motion animations
- Minimal, enterprise-grade spacing

---

## 🏗 Architecture Decisions

- **MVC pattern** on backend: models → controllers → routes
- **Centralized error handling** via Express middleware
- **Role middleware** on all protected routes
- **JWT interceptor** on Axios for automatic auth headers
- **Auto-overdue detection** via MongoDB updateMany on task queries
- **Progress calculation** via virtual aggregation of task completion

---

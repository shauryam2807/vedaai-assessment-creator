# VedaAI — AI Assessment Creator

An AI-powered Assessment Creator that allows teachers to create assignments, generate question papers using AI (Google Gemini), and view/download the generated output.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Zustand |
| **Backend** | Express.js, TypeScript, Socket.IO |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Cache/Queue** | Redis, BullMQ |
| **AI** | Google Gemini API |
| **PDF** | html-pdf-node |

## 📸 Features

- **Assignments Dashboard** — View, search, and manage all created assignments
- **Create Assignment Wizard** — Multi-step form with file upload, question type configurator with counter steppers, and auto-calculated totals
- **AI Question Paper Generation** — Powered by Google Gemini with real-time WebSocket progress updates
- **Output Page** — School-style formatted question paper with difficulty tags, answer key, and PDF download
- **Responsive Design** — Desktop sidebar + mobile bottom tab bar

## 🏗 Project Structure

```
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Pages (/, /create, /assessment/[id])
│   │   ├── components/     # UI components
│   │   │   ├── forms/      # AssignmentForm, QuestionTypesManager
│   │   │   ├── layout/     # Sidebar, TopBar, BottomTabBar
│   │   │   ├── output/     # AIBanner, PaperHeader, QuestionItem
│   │   │   ├── shared/     # GeneratingOverlay
│   │   │   └── ui/         # FileUpload, CounterInput, AssignmentCard
│   │   ├── hooks/          # useWebSocket
│   │   ├── lib/            # API client, validators, utils
│   │   ├── store/          # Zustand store
│   │   └── types/          # TypeScript interfaces
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # DB, Redis, env
│   │   ├── controllers/    # Assignment CRUD + generation
│   │   ├── jobs/           # BullMQ queue & worker
│   │   ├── middleware/     # Validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # AI, PDF, parser services
│   │   ├── websocket/      # Socket.IO setup
│   │   └── index.ts        # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Redis instance (Render/Upstash)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/shauryam2807/vedaai-assessment-creator.git
cd vedaai-assessment-creator
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables
Create a `server/.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. Run the application
```bash
# Terminal 1 — Start server
cd server
npm run dev

# Terminal 2 — Start client
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assignments` | List all assignments |
| `POST` | `/api/assignments` | Create new assignment |
| `GET` | `/api/assignments/:id` | Get assignment by ID |
| `DELETE` | `/api/assignments/:id` | Delete assignment |
| `GET` | `/api/assignments/:id/paper` | Get generated paper |
| `POST` | `/api/assignments/:id/regenerate` | Regenerate paper |
| `GET` | `/api/assignments/:id/pdf` | Download PDF |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join assignment room for updates |
| `generation:started` | Server → Client | Generation has started |
| `generation:progress` | Server → Client | Progress update (0-100%) |
| `generation:completed` | Server → Client | Paper ready |
| `generation:failed` | Server → Client | Generation error |

## 📄 License

MIT

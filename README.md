# Challenge 1 - High-performance Users Table (Mono-repo)

This archive contains a runnable implementation for **Challenge 1** (Users / Orders / Products).
Backend: Node.js + Express (in-memory deterministic seed).
Frontend: React + Vite + TypeScript (Users table with server-side pagination, sorting, search, virtualized rows).

## Quick start (dev)

### Backend
```bash
cd backend
npm install
npm run dev
# Start server on http://localhost:3001
# Seed example:
curl -X POST "http://localhost:3001/dev/seed?users=2000&orders=10000&products=200&seed=42"
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 (Vite dev server)
```

## Tests
Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

## How to create a GitHub repo
1. Create a new repo on GitHub.
2. Locally:
```bash
unzip challenge-1.zip
cd challenge-1
git init
git add .
git commit -m "Challenge 1 initial"
git branch -M main
git remote add origin <YOUR_GITHUB_URL>
git push -u origin main
```


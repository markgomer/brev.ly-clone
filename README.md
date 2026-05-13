# Brev.ly

A modern URL shortener service with a full-featured API and a React management dashboard.

## 🚀 Stack

- **Frontend**: React 19, Vite, TailwindCSS 4, Phosphor Icons.
- **Backend**: Fastify, Drizzle ORM, PostgreSQL, Zod, Swagger.
- **Infrastructure**: Bun, Docker, Cloudflare R2 (S3).

## 🛠️ Setup & Execution

### 1. Environment
Create a `.env` file in the root based on `.env.example` and fill in your credentials:
```bash
cp .env.example .env
```

### 2. Backend (Container)
Start the database and server using Docker:
```bash
cd server && docker compose up -d
```

### 3. Frontend (Build & Run)
Build and preview the React application:
```bash
cd web && bun i && bun run build && bun run preview
```

## 🔗 Access
- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **API Docs**: [http://localhost:3333/docs](http://localhost:3333/docs)


# NOVA8 Kanban Board

Single-board kanban app. FastAPI + SQLite backend, React + TypeScript frontend, Docker Compose.

## Run

```bash
docker compose up --build
```

- App: http://localhost:3000
- Interactive API docs: http://localhost:8000/docs

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/{id}` | Update title and/or status |
| `DELETE` | `/tasks/{id}` | Delete a task |

Task fields: `id` (UUID4), `title`, `status` (`todo` / `in-progress` / `done`),
`created_at` (ISO 8601 UTC).

## Run without Docker

```bash
cd backend && uv sync --all-extras && uv run uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

## Test

```bash
cd backend && uv run pytest
```

## Trade-offs

The brief capped effort at 1–2 hours, so choices were made with time in mind:

- **SQLite over Postgres** — spec allows it; Postgres adds infra for no review value here.
- **nginx `/api` proxy over browser CORS** — one origin in the browser, no CORS to maintain.
- **Services layer even for 4 endpoints** — routes stay thin and HTTP-only; business logic is testable without FastAPI.
- **UUIDs over auto-increment ints** — no enumeration leak, trivially swappable.
- **@dnd-kit with optimistic updates** — cards move instantly; React Query rolls back on error and reconciles with the server.
- **Plain CSS with custom-property tokens over Tailwind** — Tailwind's config/PostCSS setup isn't worth it at this scale.
- **No frontend tests** — RTL + mocked fetch would eat most of the budget for coverage the brief doesn't ask for.

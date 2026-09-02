# Shelfwise

**Stop throwing money in the bin.** Shelfwise is a production-ready kitchen operating system for households and small restaurants: pantry inventory, expiry intelligence, shopping lists, and waste analytics.

Stack: **Angular 19** · **NestJS 11** · **Neon Postgres** (Prisma) · **Tailwind CSS** · JWT auth · Docker.

## Why it exists

UNEP estimates roughly **19% of food available to consumers is wasted**. Most of that is predictable: items bought twice, dates ignored, lists written on paper. Shelfwise turns the fridge into a ledger.

## Product surface

- Multi-member **households** with role-aware access
- Inventory with location, quantity, unit cost, and **expiry status**
- Shopping lists that pull from low-stock and expired items
- Dashboard KPIs: items at risk this week, estimated waste cost, category mix
- JWT authentication, rate limiting, class-validator DTOs, CORS

## Monorepo

```
apps/api   NestJS REST API + Prisma + Neon
apps/web   Angular standalone + Tailwind
```

## Quick start

### 1. Neon database

Create a project at [neon.tech](https://neon.tech) and copy the pooled connection string.

```bash
cp .env.example .env
# set DATABASE_URL and JWT_SECRET
```

### 2. API

```bash
cd apps/api
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

API listens on `http://localhost:3000/api`. Health: `GET /api/health`.

### 3. Web

```bash
cd apps/web
npm install
npm start
```

Open `http://localhost:4200`. Demo account after seed:

- email: `chef@shelfwise.app`
- password: `Shelfwise!2026`

## Tests

```bash
cd apps/api && npm test
cd apps/web && npm test -- --watch=false
```

## Production

| Layer | Recommended host |
| --- | --- |
| Postgres | Neon (serverless, pooled) |
| API | Railway / Render / Fly (`apps/api` Dockerfile) |
| Web | Vercel (`apps/web`, output `dist/web/browser`) |

Set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.

## License

MIT

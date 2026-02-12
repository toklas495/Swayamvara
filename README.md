# Kunbi Samaj Vivah - Backend API

Production-grade matrimonial backend for Kunbi community.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL
- **Query Builder:** Knex
- **Validation:** Zod
- **Auth:** OTP + JWT

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Create PostgreSQL database:
```bash
createdb kunbi_samaj_vivah
```

5. Run migrations:
```bash
npm run migrate:latest
```

6. Seed villages data:
```bash
npm run seed:run
```

## Development
```bash
npm run dev
```

## Build
```bash
npm run build
npm start
```

## Database Commands
```bash
# Run migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name

# Run seeds
npm run seed:run

# Create new seed
npm run seed:make seed_name
```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

Health Check: `GET /health`

### Modules
- OTP: `/api/v1/otp`
- Auth: `/api/v1/auth`
- Users: `/api/v1/users`
- Profiles: `/api/v1/profiles`
- Search: `/api/v1/search`
- Interests: `/api/v1/interests`
- Connections: `/api/v1/connections`
- Moderation: `/api/v1/moderation`
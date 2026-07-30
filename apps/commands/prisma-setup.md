# Prisma + PostgreSQL Setup Reference (Step-by-Step)

Use this guide to set up Prisma 7 in `apps/api` with PostgreSQL, create the first `Task` model, run a migration, and verify data persistence.

## 1. Move into the API directory

```bash
cd apps/api
```

## 2. Install Prisma runtime dependencies

```bash
npm install @prisma/client @prisma/adapter-pg pg
```

Why:
- `pg` is the PostgreSQL driver.
- `@prisma/adapter-pg` is used by Prisma Client for PostgreSQL connections.
- `@prisma/client` is the generated ORM client used in application code.

## 3. Install Prisma development dependencies

```bash
npm install --save-dev prisma @types/pg
```

## 4. Initialize Prisma

```bash
npx prisma init \
  --datasource-provider postgresql \
  --output ../src/generated/prisma
```

Expected files:

```text
apps/api/
├── prisma/
│   └── schema.prisma
├── prisma.config.ts
└── .env
```

## 5. Configure environment variables

Update `.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://taskflow:taskflow_dev_password@localhost:5432/taskflow?schema=public"
```

Why `localhost` right now:
- PostgreSQL is running in Docker.
- The API is running directly on your machine.
- Port `5432` is published from Docker to your host.

When API moves into Docker, use `postgres` as the host (the Compose service name).

## 6. Configure Prisma

Update `prisma.config.ts`:

```ts
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

Note: In Prisma 7, connection configuration lives in `prisma.config.ts`, while models and provider live in `schema.prisma`.

## 7. Create the Task model

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

model Task {
  id          String       @id @default(uuid()) @db.Uuid
  title       String       @db.VarChar(120)
  description String?      @db.Text
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@map("tasks")
}
```

Field quick notes:
- `id @default(uuid())`: auto-generates UUID primary key.
- `description String?`: optional field.
- `status @default(TODO)`: default status for new tasks.
- `updatedAt @updatedAt`: auto-updates on record changes.
- `@@index(...)`: improves filter/sort queries.

## 8. Format and validate the schema

```bash
npx prisma format
npx prisma validate
```

Expected validation result:

```text
The schema is valid
```

## 9. Create and apply migration

```bash
npx prisma migrate dev --name create_tasks_table
```

Expected migration structure:

```text
prisma/
├── migrations/
│   └── <timestamp>_create_tasks_table/
│       └── migration.sql
└── schema.prisma
```

Then generate the client explicitly:

```bash
npx prisma generate
```

Important: Commit generated migration SQL to Git so all environments apply the same schema changes.

## 10. Inspect data with Prisma Studio

```bash
npx prisma studio
```

Expected URL: `http://localhost:5555`

You should see `Task` with:
- `id`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `createdAt`
- `updatedAt`

Create one test row:
- `title`: Learn PostgreSQL
- `description`: Connect TaskFlow API to PostgreSQL
- `status`: TODO
- `priority`: HIGH

Verify:
- `id` is auto-generated.
- `createdAt` is auto-generated.
- `updatedAt` is auto-generated.

## 11. Verify persistence across container restart

Stop PostgreSQL:

```bash
docker compose down
```

Start PostgreSQL again:

```bash
docker compose up -d postgres
```

Reopen Studio:

```bash
cd apps/api
npx prisma studio
```

Expected: previously created test row still exists (stored in Docker volume).

## 12. Data safety note

Do not run this unless you intentionally want to wipe local DB data:

```bash
docker compose down -v
```

`-v` removes volumes and all persisted PostgreSQL data.

## Completion checklist

- Dependencies installed
- Prisma initialized
- `.env` configured
- `prisma.config.ts` configured
- `Task` model created
- Schema validated
- Migration created and applied
- Prisma Client generated
- Studio verified
- Persistence verified
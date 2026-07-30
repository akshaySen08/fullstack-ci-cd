# Prisma Quick Start (Commands Only)

Use this when you want the fastest path to set up Prisma with PostgreSQL in `apps/api`.

## 1) Enter API folder

```bash
cd apps/api
```

## 2) Install dependencies

```bash
npm install @prisma/client @prisma/adapter-pg pg
npm install --save-dev prisma @types/pg
```

## 3) Initialize Prisma

```bash
npx prisma init \
  --datasource-provider postgresql \
  --output ../src/generated/prisma
```

## 4) Configure environment

Set in `.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://taskflow:taskflow_dev_password@localhost:5432/taskflow?schema=public"
```

## 5) Configure Prisma

Set in `prisma.config.ts`:

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

## 6) Add schema model

Set in `prisma/schema.prisma`:

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

## 7) Format, validate, migrate, generate

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name create_tasks_table
npx prisma generate
```

## 8) Open Prisma Studio

```bash
npx prisma studio
```

## 9) Persistence check

```bash
docker compose down
docker compose up -d postgres
cd apps/api
npx prisma studio
```

## 10) Safety

Do not run unless you want to wipe local DB data:

```bash
docker compose down -v
```

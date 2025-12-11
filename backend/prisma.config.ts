import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const DB_HOST = process.env.POSTGRES_HOST || 'localhost'
const DB_USER = process.env.POSTGRES_USER || 'postgres'
const DB_PWD = encodeURIComponent(process.env.POSTGRES_PASSWORD || 'default')
const DB_PORT = process.env.POSTGRES_PORT || 5432
const DB_NAME = process.env.POSTGRES_DATABASE || 'postgres'
const DB_SCHEMA = process.env.POSTGRES_SCHEMA || 'users'
const PGBOUNCER_URL = process.env.PGBOUNCER_URL

const dataSourceURL =
  process.env.DATABASE_URL ||
  (PGBOUNCER_URL
    ? `${PGBOUNCER_URL}?schema=${DB_SCHEMA}&pgbouncer=true`
    : `postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=5`)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: dataSourceURL,
  },
})

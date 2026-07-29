-- V1.0.2 supplies btree indexes for deterministic keyset order. This
-- migration adds GIN trigram indexes for the substring search used by the
-- "like" filter operation (`contains` in Prisma, `%value%` in Postgres).
--
-- These commands run outside a transaction via the adjacent Flyway script
-- configuration. CREATE INDEX CONCURRENTLY avoids taking the write-blocking
-- lock that a regular index build would hold on a large users table.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_USERS_NAME_TRGM"
    ON USERS.USERS USING GIN (NAME gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_USERS_EMAIL_TRGM"
    ON USERS.USERS USING GIN (EMAIL gin_trgm_ops);

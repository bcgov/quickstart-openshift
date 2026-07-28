-- Supports GET /users/search keyset ("seek method") pagination.
--
-- Keyset pagination needs an index on every column it sorts/filters by so
-- Postgres can answer `WHERE (col) > (cursor) ORDER BY col LIMIT n` with an
-- index range scan instead of a sequential scan + sort, keeping page cost
-- roughly constant no matter how deep the page or how large the table
-- grows (billions of rows).
--
-- The primary key already indexes ID, so only NAME and EMAIL need new
-- indexes here. `searchUsers()` always appends ID as a tiebreaker after
-- the requested sort field (e.g. `ORDER BY name ASC, id ASC`), so these
-- are composite (NAME, ID) / (EMAIL, ID) indexes rather than single-column
-- ones: a single-column index on NAME alone can answer the WHERE on NAME
-- but still forces a separate sort on ID, whereas the composite index lets
-- the full keyset predicate - `WHERE (name, id) > (?, ?) ORDER BY name, id`
-- - be answered with a single index range scan.
CREATE INDEX IF NOT EXISTS "IDX_USERS_NAME_ID" ON USERS.USERS (NAME, ID);
CREATE INDEX IF NOT EXISTS "IDX_USERS_EMAIL_ID" ON USERS.USERS (EMAIL, ID);

-- Follow-up (manual, not applied automatically here): the "like" filter
-- operation runs a substring `contains` search, which even with the btree
-- indexes above still falls back to a sequential scan for `%foo%` patterns.
-- At very large scale, consider (subject to the target Postgres instance
-- allowing CREATE EXTENSION - this is not guaranteed on every managed/
-- OpenShift Postgres deployment, so it is intentionally not bundled here):
--   CREATE EXTENSION IF NOT EXISTS pg_trgm;
--   CREATE INDEX IF NOT EXISTS "IDX_USERS_NAME_TRGM" ON USERS.USERS USING GIN (NAME gin_trgm_ops);
--   CREATE INDEX IF NOT EXISTS "IDX_USERS_EMAIL_TRGM" ON USERS.USERS USING GIN (EMAIL gin_trgm_ops);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE AuthRole AS ENUM ('USER', 'ADMIN');

CREATE TABLE
  users (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    role AuthRole NOT NULL DEFAULT 'USER',
    PRIMARY KEY (id)
  );

CREATE TABLE
  accounts (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "userId" uuid NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT,
    PRIMARY KEY (id)
  );

CREATE TABLE
  verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
  );


/* RATE LIMITS TODO: USE REDIS ON FUTURE */
CREATE TABLE rate_limit_requests (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE rate_limit_violations (
  ip VARCHAR(45) PRIMARY KEY,
  violations INTEGER NOT NULL
);

CREATE TABLE rate_limit_blocks (
  ip VARCHAR(45) PRIMARY KEY,
  block_until TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_rate_limit_requests_ip_timestamp ON rate_limit_requests (ip, timestamp)


/* GAME STATUS */
CREATE TABLE user_game_status (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    game_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    progress VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_game_status ON user_game_status (user_id, game_id);


/* CLEAN TABLE */
DELETE FROM rate_limit_requests WHERE timestamp < EXTRACT(EPOCH FROM NOW() - INTERVAL '1 hour');
DELETE FROM rate_limit_violations WHERE ip NOT IN (SELECT DISTINCT ip FROM rate_limit_requests WHERE timestamp > EXTRACT(EPOCH FROM NOW() - INTERVAL '24 hours'));
DELETE FROM rate_limit_blocks WHERE block_until < EXTRACT(EPOCH FROM NOW());
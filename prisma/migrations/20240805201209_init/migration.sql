CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "emailVerified" TIMESTAMPTZ,
    "image" TEXT,
    "role" "AuthRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" BIGINT,
    "id_token" TEXT,
    "scope" TEXT,
    "session_state" TEXT,
    "token_type" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "RateLimitRequest" (
    "id" SERIAL NOT NULL,
    "ip" VARCHAR(45) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "RateLimitRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitViolation" (
    "ip" VARCHAR(45) NOT NULL,
    "violations" INTEGER NOT NULL,

    CONSTRAINT "RateLimitViolation_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "RateLimitBlock" (
    "ip" VARCHAR(45) NOT NULL,
    "block_until" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "RateLimitBlock_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "UserGameStatus" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "gameId" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "progress" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGameStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_rate_limit_requests_ip_timestamp" ON "RateLimitRequest"("ip", "timestamp");

-- CreateIndex
CREATE INDEX "idx_user_game_status" ON "UserGameStatus"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameStatus" ADD CONSTRAINT "UserGameStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

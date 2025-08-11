-- CreateTable
CREATE TABLE "ApiToken" (
    "id" SERIAL NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "tokenType" VARCHAR(20),
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "refreshedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_provider_key" ON "ApiToken"("provider");

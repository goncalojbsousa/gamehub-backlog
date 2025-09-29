-- CreateTable
CREATE TABLE "public"."UserLog" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "action" VARCHAR(100) NOT NULL,
    "userId" UUID NOT NULL,
    "userEmail" VARCHAR(255),
    "targetId" UUID,
    "targetType" VARCHAR(50),
    "details" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_log_user_id" ON "public"."UserLog"("userId");

-- CreateIndex
CREATE INDEX "idx_user_log_action" ON "public"."UserLog"("action");

-- CreateIndex
CREATE INDEX "idx_user_log_timestamp" ON "public"."UserLog"("timestamp");

-- CreateIndex
CREATE INDEX "idx_user_log_target_type" ON "public"."UserLog"("targetType");

-- AddForeignKey
ALTER TABLE "public"."UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

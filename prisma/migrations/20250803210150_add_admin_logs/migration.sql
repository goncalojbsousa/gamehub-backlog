-- CreateTable
CREATE TABLE "AdminLog" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "action" VARCHAR(100) NOT NULL,
    "adminId" UUID NOT NULL,
    "adminEmail" VARCHAR(255) NOT NULL,
    "targetId" UUID,
    "targetType" VARCHAR(50),
    "details" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_admin_log_admin_id" ON "AdminLog"("adminId");

-- CreateIndex
CREATE INDEX "idx_admin_log_action" ON "AdminLog"("action");

-- CreateIndex
CREATE INDEX "idx_admin_log_timestamp" ON "AdminLog"("timestamp");

-- CreateIndex
CREATE INDEX "idx_admin_log_target_type" ON "AdminLog"("targetType");

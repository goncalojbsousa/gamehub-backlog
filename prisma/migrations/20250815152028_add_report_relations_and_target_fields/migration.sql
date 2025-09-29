-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reportedUserId" UUID,
ADD COLUMN     "targetContent" TEXT,
ADD COLUMN     "targetUrl" VARCHAR(255);

-- CreateIndex
CREATE INDEX "idx_report_reported_user" ON "Report"("reportedUserId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `UserGameStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserGameStatus_userId_gameId_key" ON "UserGameStatus"("userId", "gameId");

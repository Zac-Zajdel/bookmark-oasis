/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name]` on the table `api_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "api_tokens_user_id_name_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "api_tokens_user_id_name_key" ON "api_tokens"("user_id", "name");

/*
  Warnings:

  - A unique constraint covering the columns `[tokenConfirmacaoEmail]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "tokenConfirmacaoEmail" TEXT,
ADD COLUMN     "tokenConfirmacaoExpira" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_tokenConfirmacaoEmail_key" ON "Usuario"("tokenConfirmacaoEmail");

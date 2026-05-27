/*
  Warnings:

  - A unique constraint covering the columns `[tokenResetSenha]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "tokenResetSenha" TEXT,
ADD COLUMN     "tokenResetSenhaExpira" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_tokenResetSenha_key" ON "Usuario"("tokenResetSenha");

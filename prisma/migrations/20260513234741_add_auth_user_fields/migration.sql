/*
  Warnings:

  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailConfirmado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENTE',
ADD COLUMN     "senha" TEXT NOT NULL,
ALTER COLUMN "telefone" DROP NOT NULL,
ALTER COLUMN "endereco" DROP NOT NULL;

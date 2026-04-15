-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "redator" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "precoCompra" DOUBLE PRECISION NOT NULL,
    "precoAluguel" DOUBLE PRECISION NOT NULL,
    "diasInclusos" INTEGER NOT NULL,
    "precoDiaExtra" DOUBLE PRECISION NOT NULL,
    "estoque" INTEGER NOT NULL,
    "isDoado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "diasAluguel" INTEGER,
    "retiradaLimite" TIMESTAMP(3) NOT NULL,
    "devolucaoPrevista" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

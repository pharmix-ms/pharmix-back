-- AlterTable
ALTER TABLE "Medicamento" ADD COLUMN     "indicacoes" TEXT;

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL,
    "medicamento1Id" TEXT NOT NULL,
    "medicamento2Id" TEXT NOT NULL,
    "mecanismoEfeito" TEXT NOT NULL,
    "recomendacoes" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "codigoExterno" TEXT NOT NULL,
    "dadosOriginais" JSONB NOT NULL,
    "importadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interacao_medicamento1Id_medicamento2Id_idx" ON "Interacao"("medicamento1Id", "medicamento2Id");

-- CreateIndex
CREATE INDEX "Interacao_medicamento2Id_idx" ON "Interacao"("medicamento2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Interacao_fonte_codigoExterno_key" ON "Interacao"("fonte", "codigoExterno");

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_medicamento1Id_fkey" FOREIGN KEY ("medicamento1Id") REFERENCES "Medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_medicamento2Id_fkey" FOREIGN KEY ("medicamento2Id") REFERENCES "Medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

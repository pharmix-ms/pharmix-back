-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "principioAtivo" TEXT,
    "concentracao" TEXT,
    "formaFarmaceutica" TEXT,
    "fabricante" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicamentoFonte" (
    "id" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "codigoExterno" TEXT NOT NULL,
    "dadosOriginais" JSONB,
    "importadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medicamentoId" TEXT NOT NULL,

    CONSTRAINT "MedicamentoFonte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Medicamento_nome_idx" ON "Medicamento"("nome");

-- CreateIndex
CREATE INDEX "Medicamento_principioAtivo_idx" ON "Medicamento"("principioAtivo");

-- CreateIndex
CREATE INDEX "MedicamentoFonte_medicamentoId_idx" ON "MedicamentoFonte"("medicamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicamentoFonte_fonte_codigoExterno_key" ON "MedicamentoFonte"("fonte", "codigoExterno");

-- AddForeignKey
ALTER TABLE "MedicamentoFonte" ADD CONSTRAINT "MedicamentoFonte_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "Medicamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

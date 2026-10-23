# Importação do Detecta Interações

Fonte prioritária: https://imses.crfmg.org.br, API documentada em
https://imses.crfmg.org.br/api/docs/ (GET `/api/medicamentos`).

Autoria informada pelo site: André Oliveira Baldoni, Anderson Fernandes de Oliveira
Filho e Rafael Sachetto Oliveira (UFSJ). O site identifica o conteúdo como
CC BY-NC-SA 4.0: https://creativecommons.org/licenses/by-nc-sa/4.0/.
Preservar atribuição, condições de uso não comercial e compartilhamento pela mesma
licença ao distribuir a base. Os snapshots ficam fora do Git.

Artigo relacionado: https://doi.org/10.30968/rbfhss.2021.122.0568 (2021).
O PDF fornecido pelo usuário é um guia de 2020 cujo texto apresenta a validação
como etapa proposta. Não mesclar seus registros com a API nem apresentar o
snapshot atual como transcrição exata dos 330 registros relatados no artigo.

## Preparação

Use uma versão de Node compatível com o lockfile (Node 22.22.3 ou superior na linha
22, ou 24.15.0 ou superior na linha 24).

1. `npm ci`
2. Configure `DATABASE_URL` e `DETECTA_API_KEY` no `.env` do backend. Obtenha a
   chave com os responsáveis pelo Detecta Interações; nunca versione a chave.
   O adapter existente (`PrismaPg`) exige uma conexão TCP `postgresql://` ou
   `postgres://`, não uma URL `prisma+postgres://`. Se usar `prisma dev`, inicie a
   instância e copie sua URL PostgreSQL TCP para `DATABASE_URL`.
3. `npm run data:fetch`
4. `npm run data:validate`
5. `npm run db:migrate`
6. `npm run data:import`

`data:validate` lê o snapshot sem conectar ao banco. `data:import` gera o client,
compila o backend e grava o snapshot validado em uma transação. A migration apenas
adiciona um campo opcional a Medicamento e cria Interacao; não apaga tabelas.

## Identidade e integridade

- O snapshot `data/detecta/base.json` guarda data de coleta, origem, autoria,
  licença, referência e SHA-256 do JSON serializado com `JSON.stringify`.
- IDs locais continuam textuais. O ID numérico da API é preservado como
  `codigoExterno`, junto à fonte `detecta-interacoes`.
- Medicamentos são identificados por MedicamentoFonte, sem fusão automática de
  nomes, sinônimos ou apresentações. Reimportar atualiza os mesmos registros.
- Interações que aparecem nos dois medicamentos são deduplicadas por ID da fonte.
  Textos divergentes para um mesmo ID ou referências ausentes bloqueiam a carga.
  IDs distintos são preservados, mesmo quando representam o mesmo par.
- Textos clínicos e ações vazias são mantidos exatamente como recebidos. O sistema
  não inventa ação, indicação, gravidade ou validação clínica.
- A captura inicial retornou 115 medicamentos e 340 interações distintas, sem
  referências ausentes ou cópias divergentes. Os IDs 337–340 têm ação vazia.
  Esses números descrevem a captura, não são limites fixos para futuras cargas.
  O ID 100 também tem recomendação vazia, preservada com aviso na validação.
- Cada registro guarda o conteúdo recebido e os metadados de proveniência.
- Uma trava transacional evita concorrência entre execuções deste importador.
  Qualquer falha dentro da transação desfaz a carga inteira.
- A importação não remove registros ausentes de uma coleta futura. Antes de usar
  uma atualização com remoções da fonte, revisar explicitamente as diferenças.
- O resultado cobre apenas a base consultada. Ausência de registro não demonstra
  ausência de interação; os endpoints e o frontend devem refletir essa distinção.

## Verificações

`npm run test:import` testa deduplicação, preservação de texto, ações vazias,
referências inválidas, conflitos e integridade do snapshot.

Para conferir idempotência no banco de desenvolvimento, execute a mesma carga duas
vezes e compare a contagem de MedicamentoFonte e Interacao da fonte.

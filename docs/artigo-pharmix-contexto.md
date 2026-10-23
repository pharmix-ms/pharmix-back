# Base para o novo artigo do Pharmix

## Referência anterior

Documento fornecido pelo usuário: **Pharmix: Automedicação e o Perigo das
Combinações de Medicamentos**, de Mateus Storti Hellmann e colaboradores.
O arquivo original permanece no computador do autor. Este registro reúne o
contexto para orientar o desenvolvimento e uma nova redação, sem substituir o
artigo original nem validar automaticamente suas referências e resultados.

O novo artigo deve descrever a evolução do protótipo para uma aplicação com
backend próprio. Preservar a motivação, o público leigo e o escopo de apoio
informacional, sem diagnóstico, prescrição ou substituição da orientação
profissional. O título definitivo depende do escopo concluído.

## O que o artigo anterior descreve

- Aplicativo React Native com Expo e TypeScript.
- Busca local em uma lista extraída da fonte externa.
- Consulta de interações diretamente à API Detecta Interações.
- Histórico de consultas no dispositivo, por AsyncStorage.
- Categorização visual por palavras-chave dos textos retornados.
- Ensaios de usabilidade relatados com três participantes e testes de requisições
  à API externa. São resultados da versão anterior, não desta implementação.

## Evolução já implementada

- Backend NestJS, com módulos de medicamentos e interações.
- PostgreSQL e Prisma ORM 7, com migrations versionadas.
- Importação da API Detecta Interações, preservando IDs externos, origem,
  textos recebidos e metadados de coleta.
- Snapshot inicial com 115 registros de medicamentos e 340 registros distintos
  de interações. Contagem de registros não demonstra cobertura clínica completa.
- Importador que permite repetir a carga sem duplicar IDs da mesma fonte.
- GET `/medicamentos`, com IDs locais textuais e indicações normalizadas para
  texto vazio quando não disponíveis.
- GET `/interacoes?nomes=AAS,Varfarina`, por nomes exatos, ignorando caixa e
  removendo espaços nas extremidades. Não há resolução automática de sinônimos,
  marcas ou composição de apresentações comerciais.
- HTTP 400 para consulta inválida; HTTP 404 para medicamentos desconhecidos;
  HTTP 200 com lista vazia para consulta válida sem registros.
- Frontend ajustado para não converter HTTP 404 em ausência de interação e para
  não apresentar ausência de registros como confirmação de segurança.
- Documentação Swagger e testes automatizados. A última verificação da rota de
  interações executou 2 testes unitários e 12 testes HTTP com banco simulado,
  além de consultas de leitura no PostgreSQL local. Isso comprova os casos
  técnicos testados, não validade clínica ou desempenho em produção.

O histórico continua no dispositivo. Ter uma cópia local da base não elimina a
dependência da fonte para cobertura e atualização do conteúdo farmacológico.
Ver também `docs/importacao-detecta.md`.

## Integração relatada no emulador

Em 21 de outubro de 2026, o usuário executou o aplicativo em um emulador Android
e relatou funcionamento inicial da consulta. Ao desligar o backend, observou
erro de rede na confirmação da análise; ao religá-lo, relatou recuperação do
funcionamento. Confirmou também o ajuste da mensagem de rede para português.
A busca foi conectada à listagem do backend e a chave externa deixou de ser
exigida no aplicativo.

O protocolo, as evidências disponíveis e os cenários ainda sem confirmação estão
em [Testes de integração no emulador Android](testes-integracao-emulador.md).

## O que ainda precisa ser demonstrado

- Completar o registro da integração no aplicativo: conteúdo dos resultados,
  ausência de registros, persistência e limpeza do histórico. O funcionamento
  inicial e o teste de interrupção/restabelecimento do backend foram relatados
  pelo usuário no emulador, sem capturas ou medições formais.
- Novas medições de desempenho, com ambiente, cenários e método documentados.
- Novos ensaios de usabilidade, se incluídos como resultado da versão atual.
- Publicação no Neon: o banco utilizado nas verificações é PostgreSQL local.
- Cobertura de nomes comerciais, múltiplos componentes, doses ou dados clínicos
  individuais. A existência de campos no schema ou telas não comprova análise.
- IA, reconhecimento de embalagens e personalização: devem permanecer como
  propostas até implementação e avaliação específicas.

## Pontos a corrigir ou conferir na nova redação

1. A tecnologia efetiva do backend é NestJS; o texto anterior previa Next.js.
2. As consultas atuais usam GET, não POST.
3. Distinguir chamadas HTTP, combinações de medicamentos, pares sem registro,
   registros retornados e IDs únicos de interações. O texto anterior apresenta
   6.555 combinações, 6.560 retornos, 340 interações e 336 interações únicas;
   reconstruir essas métricas a partir dos dados e scripts originais antes de
   reutilizá-las. Não chamar pares sem registro de interações seguras.
4. Reconciliar a tabela antiga de ações: suas quantidades somam 334, e o
   denominador dos percentuais precisa ser explicitado e conferido.
5. A captura atual preserva ação vazia nos IDs externos 337–340 e recomendação
   vazia no ID 100. Não preencher lacunas por inferência nem omiti-las da análise.
6. Não apresentar a classificação visual por palavras-chave como uma escala de
   gravidade validada clinicamente. A fonte não fornece esse campo estruturado.
7. O guia de 2020, o artigo de validação de 2021 e a captura atual da API são
   fontes relacionadas, mas não devem ser tratados como versões idênticas.
8. Conferir as referências e afirmações sobre manutenção da API, novidade da
   proposta e benefícios clínicos antes de reaproveitá-las no novo artigo.

## Estrutura proposta para o novo artigo

1. Introdução: problema, contexto do Pharmix e objetivo desta evolução.
2. Fundamentação e trabalhos relacionados: fontes farmacológicas e aplicações
   de apoio informacional, com referências verificadas.
3. Metodologia: desenvolvimento incremental, requisitos, origem dos dados e
   protocolo de avaliação técnica.
4. Arquitetura e implementação: aplicativo, API NestJS, PostgreSQL, modelo de
   dados, importação, contratos e tratamento de erros.
5. Resultados: funcionalidades efetivamente integradas e evidências obtidas.
6. Discussão: cobertura da base, informações ausentes, atualização dos dados,
   limitações da classificação visual e diferenças em relação ao protótipo.
7. Conclusão e trabalhos futuros: contribuições demonstradas e etapas pendentes.

Redigir resumo e abstract após consolidar objetivo, método e resultados. Novos
recursos e novas verificações devem atualizar este registro antes da redação
final, mantendo separados implementação, avaliação técnica e avaliação clínica.

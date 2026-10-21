# Testes de integração no emulador Android

## Identificação

- Data: 21 de outubro de 2026, horário de referência America/Cuiaba.
- Responsável pela execução manual: usuário desenvolvedor do Pharmix.
- Ambiente informado: Windows, Android Studio, emulador Pixel 6a com Android 15
  (API 35), imagem Google APIs x86_64.
- Aplicativo: versão de desenvolvimento instalada com `npx expo run:android`.
- Backend: NestJS executado localmente com `npm run start:dev`.
- Banco: PostgreSQL 18 local, banco `pharmix`, com carga previamente confirmada
  de 115 medicamentos e 340 interações da fonte Detecta Interações.
- Endereço configurado no aplicativo: `http://10.0.2.2:3000`.
- Autenticação da fonte externa: a chave antiga não é enviada pelo aplicativo
  ao backend próprio. A atualização da base externa é uma operação separada.

Este documento registra o relato da sessão de desenvolvimento. Não foram
capturadas telas, logs completos, vídeos ou tempos dos testes manuais abaixo.
Não foi fixado um commit de ambos os repositórios para esta execução. As
confirmações do usuário são distinguidas das verificações automatizadas.

## Cenários manuais e resultados

| ID | Procedimento orientado | Evidência disponível | Resultado registrado |
| --- | --- | --- | --- |
| EMU-01 | Abrir o aplicativo, buscar AAS e Varfarina, adicioná-los e confirmar a análise com o backend ligado. | Após a orientação, o usuário informou: “pronto, acredito que tenha funcionado”. Não detalhou os campos exibidos. | Funcionamento inicial relatado; conteúdo e navegação ainda precisam de registro detalhado. |
| EMU-02 | Parar o backend com Ctrl+C e solicitar nova análise. | O usuário relatou “Network request failed” acima do botão de confirmar a análise. | Falha de conexão exibida no fluxo de confirmação; não houve relato de resultado sem interações nessa tentativa. |
| EMU-03 | Reiniciar o backend e repetir a análise. | O usuário informou: “Quando liguei voltou a funcionar”. | Retomada da consulta relatada após o restabelecimento do serviço. |
| EMU-04 | Substituir a mensagem técnica de falha de rede por uma mensagem em português e conferir a apresentação. | O usuário confirmou “Pronto, ficou certinho”; o tratamento também foi conferido no código. | Ajuste de mensagem confirmado pelo usuário. |

Mensagem atual para `Network request failed`:

> Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.

O teste de indisponibilidade simula o desligamento do backend. Ele não demonstra
o comportamento de todas as causas de falha de rede, de um aparelho sem internet
ou de um ambiente de produção.

## Evidências complementares já obtidas no desenvolvimento

Estas verificações ocorreram anteriormente na sessão, separadas dos ensaios
manuais do emulador:

- GET `/medicamentos`: HTTP 200 com 115 registros, IDs textuais e contrato de
  resposta conferido por consulta ao PostgreSQL local.
- GET `/interacoes`: consulta AAS/Varfarina retornou uma interação; a inversão da
  ordem, espaços e variação de caixa produziram o mesmo resultado.
- Consulta AAS/Varfarina/Cetorolaco retornou duas interações, envolvendo apenas
  medicamentos da seleção.
- Consulta com nome desconhecido retornou HTTP 404 com código
  `MEDICAMENTOS_NAO_ENCONTRADOS`.
- Consulta AAS/Acetaminofeno retornou HTTP 200 com `interacoes: []` no backend.
- Na verificação da rota de interações, passaram 2 testes unitários e 12 testes
  HTTP com banco simulado. Os cenários incluem entrada inválida, nomes ausentes,
  lista vazia e erro de banco, entre outros.
- O cliente HTTP do frontend foi exercitado com respostas simuladas: HTTP 404
  e 500 geraram erro; HTTP 200 vazio foi aceito; resposta sem a lista esperada
  foi rejeitada.
- Após conectar a busca ao backend, a checagem de tipos e o lint dos arquivos
  alterados do frontend passaram. A mensagem de rede foi alterada depois pelo
  usuário; não se atribui a essa alteração uma nova execução desses checks.

As contagens descrevem execuções anteriores, não testes novamente executados
durante a elaboração deste documento.

## Cenários pendentes de confirmação no aplicativo

1. Conferir e registrar o conteúdo exibido para AAS/Varfarina, incluindo nomes,
   mecanismo, recomendações e ação, comparando-o ao registro no backend.
2. Consultar AAS/Acetaminofeno e confirmar a mensagem de ausência de registros,
   sem afirmação de que a combinação é segura. O cenário foi orientado, mas não
   houve confirmação explícita de sua execução no emulador.
3. Confirmar salvamento no histórico, persistência após reabrir o aplicativo e
   limpeza do histórico. Não houve confirmação específica dessas operações.
4. Abrir a busca com o backend desligado e verificar erro e botão de nova
   tentativa. Em seguida, religar o backend e tentar carregar a lista novamente.
5. Conferir um erro HTTP de medicamento não encontrado na interface, sem
   registrá-lo no histórico como ausência de interações. O backend e o cliente
   HTTP foram verificados separadamente; falta registrar o fluxo visual.
6. Repetir os cenários com capturas de tela e identificação dos commits do
   frontend e do backend antes de apresentá-los como resultados reproduzíveis.

## Uso no novo artigo

Texto de trabalho, limitado às evidências disponíveis:

> Em testes manuais de integração realizados em um emulador Android, o
> desenvolvedor relatou funcionamento inicial do aplicativo com o backend e o
> PostgreSQL locais. Ao interromper o serviço, a nova tentativa de análise
> apresentou uma mensagem de falha de rede na tela de confirmação. Após a
> reinicialização do backend, o funcionamento foi restabelecido. A mensagem
> técnica foi posteriormente adaptada para português, com confirmação de sua
> apresentação pelo desenvolvedor. Esses ensaios forneceram evidências iniciais
> de integração e de tratamento da indisponibilidade do serviço no ambiente de
> desenvolvimento.

Não calcular taxa de sucesso, latência média ou ganho de desempenho com esses
relatos. Não apresentá-los como estudo de usabilidade, validação clínica ou
comprovação de redução dos riscos da automedicação. Os ensaios com três
participantes descritos no artigo anterior pertencem à versão anterior.

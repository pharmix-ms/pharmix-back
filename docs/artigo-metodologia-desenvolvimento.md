# 4 Metodologia

## 4.1 Natureza da pesquisa e estratégia de desenvolvimento

O estudo caracteriza-se como pesquisa aplicada, de caráter exploratório e descritivo, orientada ao desenvolvimento de um artefato computacional. O objeto de avaliação é a implementação do Pharmix como plataforma de apoio informacional, composta por aplicativo móvel, serviço próprio de consulta e base persistida de interações. A investigação descreve decisões de modelagem e verifica se os fluxos implementados correspondem aos requisitos definidos. Não constitui estudo de eficácia terapêutica, ensaio clínico ou avaliação diagnóstica.

O desenvolvimento ocorreu de forma incremental a partir do protótipo anterior. Inicialmente, a consulta de interações foi transferida da integração direta com a fonte externa para um backend próprio. Em seguida, foram incorporados itens alimentares e bebidas, regras complementares e um perfil opcional de saúde. A integração dessas partes passou a produzir um resultado composto, no qual os registros entre princípios ativos e os alertas relacionados ao perfil mantêm suas origens e significados distintos. Essa divisão permitiu verificar cada camada antes da avaliação do fluxo completo.

## 4.2 Requisitos e delimitação do objeto

Os requisitos funcionais compreendem buscar princípios ativos; selecionar alimentos e bebidas disponíveis; consultar registros de interação; cadastrar e remover dados do perfil; apresentar referências para as regras complementares; e armazenar, reabrir e limpar consultas no aparelho. Como requisitos de qualidade, estabeleceram-se a preservação dos textos da fonte, a rastreabilidade da importação, a distinção entre falha técnica e ausência de registros e a comunicação dos limites da análise.

A unidade de entrada é uma seleção de itens classificados como princípio ativo, alimento ou bebida. A análise entre princípios ativos considera os registros de pares contidos nessa seleção. As relações com alimentos e bebidas dependem de regras específicas; os alertas do perfil dependem da correspondência entre um princípio ativo selecionado e uma informação salva. Portanto, uma consulta com vários itens reúne resultados de verificações delimitadas, sem estimar o efeito clínico conjunto de todas as substâncias.

Nesta versão, a cobertura complementar inclui espinafre, bebida alcoólica e água. O perfil contempla alergias informadas, asma, doença hepática e gravidez, com regras específicas descritas na seção de desenvolvimento. Não são avaliados doses, horários, duração do tratamento, função renal, trimestre gestacional ou composição de apresentações comerciais. O termo perfil de saúde designa informações autorrelatadas pelo usuário, sem equivaler a prontuário ou cadastro de um profissional médico.

## 4.3 Origem e preparação dos dados

As interações entre princípios ativos foram obtidas da captura da API Detecta Interações de 21 de outubro de 2026. A coleta preservou o conteúdo recebido, o endereço de origem, a data, a atribuição e um resumo criptográfico SHA-256 do JSON serializado. A captura utilizada contém 115 registros de medicamentos e 340 registros de interação com identificadores distintos. Essas quantidades descrevem o material coletado e não medem a cobertura de todos os medicamentos ou riscos existentes (Detecta Interações, 2026).

Antes da importação, verificaram-se a integridade do arquivo, a presença dos campos esperados, a validade das referências aos medicamentos e a consistência das cópias de uma mesma interação. Registros repetidos foram reunidos pelo identificador externo, enquanto divergências de conteúdo para um mesmo identificador bloqueiam a carga. Identificadores diferentes foram preservados mesmo quando associados ao mesmo par. Assim, quantidade de registros, quantidade de pares e número de requisições são unidades distintas de análise.

Os campos vazios da fonte foram mantidos sem inferência: os registros 337 a 340 não possuem ação preenchida, e o registro 100 não possui recomendação. A verificação dessas lacunas permite apresentar mensagens de informação indisponível na interface e evita atribuir ao sistema conteúdo que não foi fornecido. A integridade computacional do arquivo não equivale à atualização ou à validação clínica de cada mensagem.

## 4.4 Seleção das regras complementares

Adotou-se seleção intencional de exemplos documentados para exercitar os fluxos de alimento, bebida alcoólica, administração com água e alertas do perfil. Foram consultados material informativo do MedlinePlus e rotulagens específicas disponíveis no DailyMed. O procedimento corresponde à construção de um conjunto inicial de demonstração, sem pretensão de revisão sistemática ou de cobertura exaustiva das relações farmacológicas.

Cada regra associa condições de acionamento a um identificador, uma categoria de informação, um título, uma mensagem em português e uma referência. A redação preserva condicionantes relevantes da fonte, como o contexto de consumo de álcool e a apresentação farmacêutica da orientação com água. O alerta de alergia, por sua vez, comunica a coincidência com um relato do usuário; não acrescenta uma conclusão diagnóstica. A adequação clínica e a compreensão dessas mensagens exigem avaliações próprias, distintas dos testes de correspondência executados no software.

## 4.5 Tecnologias e ambiente de avaliação

O aplicativo utiliza TypeScript, React Native 0.81, Expo SDK 54, NativeWind e React Navigation. O backend utiliza NestJS, PostgreSQL e Prisma ORM 7. A API tem contratos documentados em OpenAPI e apresentados por uma interface Scalar. O AsyncStorage mantém o perfil e o histórico no dispositivo. Essa distribuição permite armazenar o catálogo farmacológico no servidor e processar localmente o conjunto inicial de regras do perfil.

O ambiente de integração registrado compreende Windows, backend local, PostgreSQL 18 e emulador Pixel 6a com Android 15, API 35. No emulador, o endereço 10.0.2.2 permite acessar o serviço do computador hospedeiro. Os testes automatizados utilizam Vitest no backend e o executor de testes do Node.js para as regras complementares. Compilação, checagem de tipos e análise estática complementam a verificação, sem substituir testes de comportamento.

## 4.6 Procedimentos e critérios de avaliação

A avaliação técnica foi organizada por responsabilidade. Na importação, os critérios são preservar conteúdo, deduplicar apenas os identificadores correspondentes e rejeitar inconsistências. Na API, são verificados a listagem, a seleção de pares e os contratos de resposta para entrada inválida, medicamento desconhecido, consulta válida vazia e falha interna. Os testes HTTP usam uma dependência de banco simulada; consultas ao PostgreSQL real pertencem a uma etapa separada de integração.

Nas regras locais, os cenários positivos combinam os dois itens exigidos ou o princípio ativo com o dado de perfil correspondente. Os cenários negativos retiram uma condição, usam um item sem regra ou alteram sua categoria. Também se verifica a equivalência local entre paracetamol e acetaminofeno e a prevenção de alertas duplicados de alergia. O critério de aprovação é a correspondência entre identificadores e categorias esperados e o resultado retornado, não a previsão de um desfecho clínico.

O roteiro manual verifica seleção, confirmação, leitura dos resultados, abertura de detalhes e persistência do histórico. Para o perfil, compara-se uma nova consulta antes e depois de salvar ou remover uma informação. A indisponibilidade do backend deve resultar em erro quando a consulta depende desse serviço; uma resposta vazia válida deve resultar em mensagem de ausência de registros. Os registros anteriores de integração são mantidos separados da nova execução automatizada, para não atribuir a esta revisão uma repetição de todos os ensaios no Android.

Não foram produzidas novas medições de latência, taxas de sucesso com participantes ou métricas de compreensão para esta versão. Os ensaios descritos no primeiro manuscrito pertencem ao protótipo anterior e não são transferidos como resultados da implementação atual. A repetibilidade dos próximos ensaios requer identificação das versões, dados de entrada, perfil fictício utilizado, resultado esperado, resultado observado e evidências de tela.

# 5 Desenvolvimento

## 5.1 Evolução da arquitetura

No protótipo anterior, o aplicativo consultava diretamente a API externa e utilizava uma lista local para a busca. A versão atual introduz um backend próprio entre a interface e a base farmacológica. O aplicativo solicita o catálogo e as interações ao serviço NestJS, que consulta a cópia persistida no PostgreSQL. A obtenção de novos dados da fonte externa ocorre por scripts separados, fora do fluxo cotidiano de consulta.

Essa mudança permite controlar os contratos de resposta, validar parâmetros e registrar a proveniência dos dados importados. A chave de acesso da fonte externa deixa de ser exigida no aplicativo, enquanto a atualização da cópia permanece uma responsabilidade operacional. O backend próprio reduz o acoplamento da consulta à disponibilidade imediata do serviço externo, mas não elimina a dependência de sua cobertura e atualização farmacológica.

A arquitetura é parcialmente centralizada: interações entre princípios ativos ficam no servidor; regras de alimentos, bebidas e perfil ficam no código do aplicativo. Essa decisão atende ao conjunto inicial de exemplos, porém implica que a alteração dessas regras depende de distribuir uma nova versão do cliente. Não há, nesta etapa, uma rota que receba o perfil e execute toda a análise no backend.

## 5.2 Organização do aplicativo e do serviço

No frontend, as telas representam as etapas de seleção, confirmação, resultados, detalhes, perfil e histórico. Componentes reutilizáveis concentram campos, botões e cartões, enquanto hooks organizam a busca e a persistência. O serviço HTTP concentra os endereços e o tratamento das respostas. Tipos compartilhados no aplicativo distinguem os itens selecionados, os registros da API e as notas complementares, reduzindo a necessidade de tratar um alimento como medicamento.

No backend, os módulos de medicamentos e interações separam as responsabilidades de listagem e consulta. Os controladores expõem as rotas, os serviços implementam a validação e a recuperação de dados e o módulo de banco disponibiliza o cliente Prisma. Essa organização permite testar o comportamento dos serviços com uma dependência de persistência simulada e verificar os contratos HTTP sem depender da disponibilidade do banco em cada execução.

## 5.3 Modelo relacional e rastreabilidade

O modelo utiliza três entidades centrais: Medicamento, MedicamentoFonte e Interacao. Medicamento mantém a identidade local e o nome utilizado na consulta. MedicamentoFonte relaciona essa identidade ao código externo e à origem, preservando os dados recebidos. Interacao referencia dois medicamentos e armazena mecanismo ou efeito, recomendações, ação, identificador externo e metadados de importação.

A combinação entre fonte e código externo é única nas entidades de proveniência e interação. Dessa forma, repetir uma importação pode atualizar os mesmos registros sem criar novas identidades para o mesmo código. Os relacionamentos preservam a integridade dos pares e os índices apoiam sua recuperação. Campos opcionais de concentração, forma farmacêutica e fabricante no modelo não implicam que essas características sejam preenchidas pela captura ou consideradas pelo algoritmo.

Os identificadores externos não são substituídos por comparações aproximadas de nomes. Essa escolha evita fundir registros distintos por semelhança textual, mas mantém a necessidade de tratar sinônimos de maneira explícita. O backend atual utiliza nomes completos e não resolve automaticamente marcas comerciais, abreviações adicionais ou múltiplos componentes de uma apresentação.

## 5.4 Processo de importação

O processo compreende captura, validação e aplicação da carga. A validação pode ser executada isoladamente, sem gravar no banco. Na aplicação, os medicamentos são relacionados às identidades da fonte e as interações são atualizadas ou criadas conforme seus códigos externos. As operações de escrita ocorrem em uma transação, de modo que uma falha antes da confirmação desfaz as alterações daquele processamento.

Uma trava transacional serializa execuções concorrentes do importador da mesma fonte. Ao final, o procedimento consulta as contagens persistidas para apoiar a conferência operacional. Entretanto, a carga não exclui automaticamente registros que desapareçam em capturas futuras. A identificação de remoções e a política de desativação devem ser tratadas explicitamente antes de automatizar a atualização em produção.

Além de preservar o conteúdo, essa separação facilita investigar diferenças entre versões da fonte e reproduzir a validação do arquivo utilizado. O hash detecta alteração do snapshot em relação ao valor registrado; não comprova autoria, correção clínica ou atualidade do conhecimento. A distribuição dos dados também deve preservar a atribuição e as condições de uso registradas para a fonte.

## 5.5 Busca e composição da seleção

A tela de análise carrega os princípios ativos pela rota GET /medicamentos e acrescenta os itens Espinafre, Bebida alcoólica e Água ao catálogo de sugestões. A busca ignora caixa e acentuação na filtragem local, remove itens já selecionados e apresenta até oito sugestões. Essa filtragem ocorre após o carregamento do catálogo; portanto, a experiência atual de busca não equivale à busca totalmente offline do protótipo anterior.

A seleção admite até cinquenta itens e exige pelo menos um princípio ativo para permitir a análise. Um único princípio ativo pode ser suficiente para avaliar o perfil, enquanto a consulta de pares ao backend exige dois ou mais. A interface preserva a categoria de cada item e informa os nomes dos alimentos e bebidas disponíveis, tornando a cobertura inicial mais fácil de localizar sem sugerir um catálogo alimentar completo.

Ao confirmar, o aplicativo lê o perfil salvo e separa os princípios ativos dos demais itens. Se houver pelo menos dois princípios ativos, solicita as interações ao backend; em seguida, avalia as regras locais e reúne os resultados. Uma proteção contra confirmações simultâneas reduz requisições e gravações duplicadas. Se a leitura do perfil falhar, a análise apresenta erro, evitando utilizar silenciosamente um perfil vazio no lugar dos dados indisponíveis.

## 5.6 Contrato da consulta e tratamento de falhas

A rota GET /interacoes recebe nomes separados por vírgula. O serviço remove espaços nas extremidades, elimina repetições desconsiderando caixa e exige de dois a cinquenta nomes distintos. Também limita o tamanho dos nomes e do parâmetro recebido. A recuperação considera os registros cujos dois medicamentos pertencem à seleção, independentemente da ordem em que o usuário adicionou os itens.

Parâmetros inválidos recebem HTTP 400. Quando um nome não existe na base, o serviço retorna HTTP 404 e identifica os medicamentos ausentes. Uma seleção reconhecida sem interação cadastrada recebe HTTP 200 com lista vazia. Essa distinção é mantida no aplicativo: falhas não são convertidas em uma análise sem registros, e respostas vazias não são interpretadas como garantia de compatibilidade.

O endereço do backend é configurado no cliente por variável de ambiente. A camada HTTP traduz falhas de conexão para uma mensagem em português e verifica a estrutura básica das respostas. Na busca, há possibilidade de tentar carregar o catálogo novamente. A implementação ainda pode ser fortalecida com validação completa de cada registro de interação e limite explícito de espera das requisições, aspectos distintos da lógica clínica das regras.

## 5.7 Regras para alimentos e bebidas

As regras complementares possuem condições determinísticas: para produzir uma nota, o princípio ativo e o item não farmacológico devem estar presentes com as categorias esperadas. A seleção de Varfarina e Espinafre aciona uma mensagem sobre mudanças na ingestão de vitamina K e sua relação com o efeito da varfarina. A regra comunica o contexto dietético descrito no material consultado, sem recomendar a exclusão indiscriminada do alimento (MedlinePlus, [s.d.]).

Paracetamol e Bebida alcoólica acionam uma mensagem baseada na advertência da rotulagem para adultos que consomem três ou mais bebidas alcoólicas por dia durante o uso. O aplicativo não mede consumo, dose ou duração; apresenta a condição descrita pela fonte e orienta a discussão com um profissional. A equivalência entre paracetamol e acetaminofeno é aplicada a essa regra e aos alertas locais relacionados, mas não redefine os identificadores da base do backend (DailyMed, [s.d.]a).

Omeprazol e Água produzem uma orientação de administração referente ao comprimido de liberação retardada descrito na fonte. A saída recomenda conferir a bula da apresentação utilizada. Sua categoria é distinta da interação farmacológica, pois o uso de água nesse exemplo não representa um evento adverso entre substâncias. Assim, o conjunto inicial contém duas regras de interação com itens não farmacológicos e uma orientação de administração (DailyMed, [s.d.]c).

## 5.8 Perfil de saúde e alcance da personalização

O perfil é opcional e armazenado no aparelho. A gravidez possui três estados: sim, não e não informada. As condições selecionáveis nesta versão são Asma e Doença hepática. Para alergias, o usuário busca princípios ativos do catálogo, salva os selecionados e pode removê-los posteriormente. O salvamento explícito determina quais informações serão utilizadas nas próximas consultas; alterações ainda não salvas não compõem essa avaliação.

As regras específicas produzem alertas para AAS com asma, paracetamol ou acetaminofeno com doença hepática e varfarina com gravidez informada. As mensagens preservam a necessidade de avaliação profissional e, no caso da varfarina, não decidem sobre as exceções especializadas descritas pela rotulagem. Não se extrapola uma regra de gravidez para todos os medicamentos ou para qualquer etapa gestacional (DailyMed, [s.d.]a, [s.d.]b, [s.d.]d).

A avaliação de alergias compara os nomes informados com os princípios ativos selecionados, incluindo a equivalência local de paracetamol e acetaminofeno. Não há reconhecimento de reatividade cruzada, classes farmacológicas ou excipientes. Uma lista vazia representa ausência de alergias cadastradas; a interface ainda não distingue ausência conhecida de alergia e histórico desconhecido. Essa limitação delimita a implementação em relação às recomendações discutidas no referencial teórico.

Os alertas do perfil são acrescentados ao resultado sem modificar os registros da fonte. Por exemplo, Varfarina e Espinafre com gravidez marcada produzem uma nota alimentar e outra de gravidez. Paracetamol e Bebida alcoólica com doença hepática produzem uma interação e um alerta do perfil. O sistema não calcula uma gravidade combinada nem transforma essa coexistência em uma estimativa individual de risco.

## 5.9 Apresentação dos resultados e histórico

O resultado identifica os itens consultados, apresenta as interações recuperadas e acrescenta as notas complementares com suas categorias. Os detalhes dos registros do backend exibem mecanismo ou efeito, ação e recomendação; quando um desses textos está vazio na origem, a interface informa a indisponibilidade. As regras documentadas apresentam links para suas fontes, permitindo consultar o contexto de cada mensagem.

A apresentação atual não atribui uma escala clínica de gravidade por palavras-chave. Os cartões de registros da API utilizam um tratamento visual comum de atenção. Essa decisão evita apresentar diferenças de cor como classificação validada quando a fonte não fornece um campo estruturado de gravidade. A mensagem de ausência de registros ressalta que a cobertura da base é limitada, inclusive quando nenhum alerta do perfil é encontrado.

O histórico armazena a seleção e o resultado exibido, com data e identificador local. A gravação é serializada e limitada às cem consultas mais recentes. A reabertura apresenta o registro salvo, sem recalcular os alertas com o perfil atual. Se o salvamento falhar, o resultado permanece disponível com aviso específico, distinguindo falha de persistência de falha da análise.

Perfil e histórico têm controles independentes de limpeza. Apagar o perfil não remove alertas já registrados em consultas anteriores, e essa característica precisa ser considerada no uso de dispositivos compartilhados. O AsyncStorage não constitui, por si só, armazenamento clínico seguro ou criptografado. A versão avaliada não implementa conta de usuário, sincronização do perfil ou envio dessas informações ao backend de interações.

# 6 Avaliação técnica e resultados

## 6.1 Integridade dos dados e testes automatizados

Na revisão de 7 de novembro de 2026, a validação do snapshot confirmou 115 medicamentos e 340 registros distintos de interação, preservando os campos vazios descritos na metodologia. Foram aprovados seis testes da importação, dois testes unitários e doze testes HTTP do backend. A compilação do serviço também foi concluída. Esses resultados demonstram os comportamentos exercitados nos testes e a consistência estrutural verificada, sem medir a cobertura clínica da base.

No frontend, quatro testes das regras complementares foram aprovados, abrangendo distinção de categorias, exigência dos componentes do par, equivalência de nomes e alertas condicionados ao perfil. A checagem de tipos e o lint também foram concluídos. Os testes das regras não substituem a avaliação visual das telas nem comprovam, isoladamente, a persistência no dispositivo.

## 6.2 Integração registrada no Android

O registro de integração de 7 de novembro de 2026 documenta consultas de AAS com Varfarina, ausência de registro para AAS com Acetaminofeno, os três exemplos complementares e alertas relacionados ao perfil. Também registra reabertura e limpeza do histórico, persistência após reiniciar o aplicativo e consulta posterior à limpeza do perfil. Esses resultados pertencem à execução descrita naquele registro; a revisão automatizada não representa nova execução integral do roteiro no emulador.

Relatos anteriores documentaram interrupção e restabelecimento do backend durante consultas. Em conjunto, essas evidências apoiam o funcionamento dos fluxos no ambiente local. Não demonstram disponibilidade em produção, funcionamento em todos os dispositivos ou tolerância a todas as causas de falha de rede. A coleta sistemática de capturas e versões deve acompanhar os próximos ensaios.

## 6.3 Desempenho e compreensão dos alertas

Não há novas medições controladas de desempenho ou estudo de usabilidade desta versão. Portanto, não são atribuídos ganhos de latência, aumento de compreensão ou redução de danos ao backend próprio ou à personalização. Uma avaliação posterior deverá separar tempo de carregamento do catálogo, tempo de consulta ao serviço e tempo de apresentação dos resultados, além de examinar a interpretação dos alertas pelo público-alvo.

# 7 Discussão

A contribuição técnica consiste em integrar uma base persistida sob controle do projeto, um fluxo de consulta por princípios ativos e um conjunto inicial de regras relacionadas a alimentos, bebidas e perfil. A distinção entre os tipos de saída torna explícita a diferença entre recuperar uma interação, apresentar uma orientação de administração e sinalizar informação autorrelatada. A personalização demonstrada é restrita a correspondências documentadas e não equivale à avaliação clínica individual.

A cobertura complementar permanece pequena. A presença de água, álcool e um alimento permite verificar categorias de fluxo, mas não sustenta uma alegação de abrangência alimentar. Da mesma forma, campos ou listas de condições existentes em versões antigas da interface não comprovam a existência de regras para essas condições. A ampliação deve ocorrer mediante inclusão de evidências, revisão das mensagens e testes de acionamento e de não acionamento.

A manutenção de regras no aplicativo facilita o protótipo, mas dificulta sua atualização centralizada. O uso de nomes como contrato de consulta também limita a resolução de sinônimos. A ausência de versões explícitas das regras no histórico reduz a rastreabilidade entre uma mensagem salva e a revisão que a produziu, embora o texto exibido seja preservado. Esses aspectos constituem prioridades de evolução da arquitetura.

A integridade do snapshot, o êxito dos testes e a execução em emulador não são medidas de validade clínica. Persistem dependência da fonte farmacológica, lacunas textuais e necessidade de avaliação profissional das regras complementares. O armazenamento local de dados de saúde requer análise específica de proteção, retenção e exclusão antes de um uso ampliado. A implementação não deve ser descrita como prontuário, sistema de prescrição ou solução clinicamente validada.

# 8 Trabalhos futuros

As próximas etapas compreendem ampliar e revisar o conjunto de regras com profissionais de saúde, identificar versões e datas de revisão de cada regra e avaliar sua centralização no backend. Essa evolução deve preservar a atribuição das fontes e permitir definir como alterações de conteúdo afetam consultas futuras e registros históricos. A política de atualização também deve tratar registros removidos pela fonte externa.

No aplicativo, são pertinentes a explicitação do estado das alergias, a distinção entre risco não avaliado e ausência de regra, o fortalecimento da validação dos dados recebidos e a proteção das informações locais. A análise de nomes comerciais, doses, excipientes e condições adicionais exige modelagem e evidências específicas. Estudos de compreensão com usuários e avaliação clínica do conteúdo devem preceder afirmações de benefício à saúde.

# 9 Conclusão

O Pharmix evoluiu de um protótipo com consulta direta a uma fonte externa para uma aplicação com backend próprio, persistência relacional e regras complementares no dispositivo. A implementação permite combinar princípios ativos com itens alimentares e bebidas cadastrados, consultar um perfil opcional e preservar resultados no histórico. Os testes executados e os registros de integração apoiam o funcionamento técnico dos cenários avaliados.

O alcance da solução é delimitado pela cobertura dos dados e pelas regras implementadas. O perfil acrescenta alertas específicos, sem recalcular gravidade ou substituir uma avaliação profissional. A ampliação do conhecimento farmacológico, a rastreabilidade das atualizações, a proteção dos dados e a avaliação da compreensão das mensagens são necessárias para avançar além da demonstração funcional apresentada.

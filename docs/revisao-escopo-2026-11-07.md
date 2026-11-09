# Revisão do Pharmix em 7 de novembro de 2026

O projeto tem backend próprio para catálogo e pares de princípios ativos, perfil de saúde opcional e exemplos locais de alimentos/bebidas. A cobertura complementar é demonstrativa. Perfil médico significa o perfil de saúde do usuário; não existe área de profissional médico.

## Achados

1. O backend não processa alimentos, bebidas ou perfil. Há duas regras de interação complementar, uma orientação com água e três regras específicas de condição/gravidez, além das correspondências de alergia. Centralizar todas as análises exige evolução adicional.
2. O perfil acrescenta alertas independentes, sem modificar gravidade ou mecanismo dos pares. Não há cálculo de risco individual.
3. A lista vazia de alergias não distingue histórico desconhecido de ausência conhecida. Classes e reatividade cruzada não são avaliadas. A redação do artigo foi delimitada para refletir isso.
4. `fetchInteracoes` verifica a lista, mas não todos os campos dos elementos; a leitura do histórico também verifica apenas a lista externa. Dados malformados podem alcançar telas que acessam propriedades internas. Recomenda-se validação completa com testes de payload inválido e histórico legado.
5. As requisições não têm timeout explícito. A busca depende do carregamento inicial do catálogo, inclusive para adicionar os itens locais.
6. O histórico preserva textos, mas não a versão formal das regras. Limpar perfil não remove resultados históricos. AsyncStorage não oferece, por si só, proteção criptográfica.
7. A importação identifica registros por origem e código e é transacional, mas não remove registros ausentes em capturas futuras. A política de atualização precisa tratar isso.

## Alterações

- Metodologia e desenvolvimento ampliados com origem dos dados, critérios de avaliação, arquitetura, importação, contratos, fluxos, regras, perfil e histórico.
- Resultados técnicos separados de validação clínica e de ensaios anteriores.
- Tela antiga recuperada em `pharmix-front/docs/legacy`, com arquivo de leitura e ZIP de `src` e `package.json` históricos.
- Tela de análise informa os três nomes pesquisáveis de alimentos/bebidas.
- Roteiro com todas as regras implementadas em [interações e perfil](roteiro-interacoes-perfil.md).

## Verificação

| Verificação | Resultado |
| --- | --- |
| Backend — testes unitários | 2 aprovados |
| Backend — testes HTTP com banco simulado | 12 aprovados |
| Importação — testes | 6 aprovados |
| Backend — build e lint | Aprovados |
| Snapshot — validação sem escrita | 115 medicamentos e 340 interações; lacunas preservadas |
| Frontend — regras | 4 testes aprovados |
| Frontend — TypeScript e lint | Aprovados |

O Vitest inicialmente foi bloqueado por EPERM no sandbox; a reexecução autorizada fora dele passou. Não houve nova importação ou nova sessão manual completa no emulador. As alterações locais preexistentes foram preservadas. Nenhum commit ou push foi realizado.

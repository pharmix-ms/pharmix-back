# Interações e perfil — roteiro da versão atual

Revisão de 7 de novembro de 2026. Use dados fictícios. Inicie o backend e aguarde o catálogo carregar. Na análise, busque cada nome abaixo separadamente e selecione a sugestão. Para alertas do perfil, toque em **Salvar perfil** antes de iniciar uma nova consulta. Reabrir o histórico mostra o resultado antigo, sem recalculá-lo.

| Seleção | Perfil salvo | Resultado esperado das regras locais |
| --- | --- | --- |
| Varfarina + Espinafre | Sem condições | Interação sobre mudanças no consumo de vitamina K |
| Paracetamol + Bebida alcoólica | Sem condições | Interação com advertência de lesão hepática no contexto descrito na fonte |
| Acetaminofeno + Bebida alcoólica | Sem condições | Mesmo alerta local de paracetamol |
| Omeprazol + Água | Sem condições | Orientação de administração, não interação prejudicial |
| Varfarina | Gravidez = Sim | Alerta do perfil sobre gravidez |
| AAS | Asma | Alerta do perfil sobre asma |
| Paracetamol ou Acetaminofeno | Doença hepática | Alerta do perfil sobre doença hepática |
| AAS | Alergia a AAS | Alerta de correspondência com alergia informada |
| Varfarina + Espinafre | Gravidez = Sim | Dois cartões: interação alimentar e alerta de gravidez |
| Paracetamol + Bebida alcoólica | Doença hepática | Dois cartões: interação e alerta de doença hepática |
| AAS + Espinafre | Perfil vazio | Nenhuma regra local correspondente; ausência de registros não significa segurança |

Para conferir o backend, AAS + Varfarina tem registro na captura; AAS + Acetaminofeno não tem registro nela. A consulta de princípios ativos usa os nomes do catálogo, sem equivalência geral de sinônimos.

## Limites que afetam os testes

- As únicas condições com regras específicas são **Asma** e **Doença hepática**. Gravidez tem regra específica apenas para **Varfarina**. Outras condições presentes no arquivo histórico `healthData.ts` não são cobertas pelo motor atual.
- O perfil acrescenta alertas. Não altera os textos ou a gravidade dos pares retornados pelo backend, nem calcula um risco conjunto.
- Alergias funcionam por correspondência de nome, com equivalência local entre paracetamol e acetaminofeno. Não há avaliação de reatividade cruzada, excipientes ou classes de medicamentos.
- Não há regras implementadas para café, leite, sucos, cerveja como item separado, outros alimentos ou todas as situações de gravidez. O item de álcool chama-se **Bebida alcoólica**.
- Não é preciso selecionar dois princípios ativos para testar o perfil: um basta. A chamada a `/interacoes` só ocorre com pelo menos dois princípios ativos.
- “Não informada” e “Não” são estados distintos de gravidez, mas nenhum aciona o alerta. Lista vazia de alergias significa apenas ausência de alergias cadastradas.
- Limpar o perfil não apaga alertas já salvos no histórico. A limpeza do histórico é separada.

## Fontes das regras

- Varfarina e espinafre: [MedlinePlus — Taking warfarin](https://medlineplus.gov/ency/patientinstructions/000292.htm).
- Paracetamol, álcool e doença hepática: [DailyMed — Acetaminophen](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bd5e6804-4df4-4a65-92e4-faa3a0f7c005). O alerta de álcool cita adultos que consomem três ou mais bebidas alcoólicas por dia durante o uso; o programa não mede consumo nem define uma quantidade segura.
- Omeprazol e água: [DailyMed — comprimido de liberação retardada](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=35a95bec-51b9-465b-aa93-ad26afb87be8).
- AAS e asma: [DailyMed — Aspirin](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cc7013ea-cf30-6f59-e053-2a95a90a1148).
- Varfarina e gravidez: [DailyMed — Warfarin sodium](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=545ec40d-2db1-4581-b3ec-ce195e5f5400). A fonte descreve exceções especializadas; o aplicativo não decide sobre elas.

Para registrar a execução, anote versão/commit, perfil fictício, seleção, texto exibido, resultado esperado, resultado observado e captura de tela. Esta tabela documenta expectativas verificáveis no código; não representa uma nova execução manual no emulador.

**Test Case ID**: TC5.5

**Test Case Description**: Medir o tempo que o sistema leva para gerar um relatório de produtividade de grupos com diferentes combinações de filtros (período de tempo, métricas, grupos). Este teste visa avaliar o desempenho do sistema na geração de relatórios sob diferentes cargas.  

**Related Use Cases**: UC5.2 - Criar um relatório personalizado de produtividade dos grupos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- A página de geração de relatório personalizado deve estar acessível.  
- O sistema deve ter dados de produtividade de grupos suficientes para gerar relatórios significativos.  

**Steps**:  

- Repetir a geração de relatórios várias vezes, variando as opções de filtro a cada vez:  
  - **Gerar um relatório com um período de tempo curto e poucas métricas para poucos grupos**. Medir o tempo de geração.  
  - **Gerar um relatório com um período de tempo longo e muitas métricas para muitos grupos**. Medir o tempo de geração.  
  - **Gerar relatórios com combinações intermediárias de filtros** (ex: período médio, número médio de métricas, número médio de grupos). Medir os tempos de geração.  
- Para cada geração de relatório, medir o tempo decorrido desde o clique no botão "Gerar Relatório" até o relatório ser apresentado (ou o download começar).  

**Expected Result**:  

- Os tempos de geração de relatórios devem estar dentro de limites aceitáveis, dependendo da complexidade do relatório e da quantidade de dados.  
  - Definir limites de tempo aceitáveis para diferentes níveis de complexidade (ex: relatórios simples < 5 segundos, relatórios complexos < 30 segundos - estes limites são apenas exemplos e devem ser definidos com base nos requisitos de desempenho do sistema).  
- Os tempos de geração devem ser consistentes e previsíveis, sem variações extremas para relatórios de complexidade semelhante.  
- Os tempos de geração devem ser registados para análise e comparação.  

**Actual Result**:
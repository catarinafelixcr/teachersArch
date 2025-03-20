**Test Case ID**: TC5.7  

**Test Case Description**: Verificar o comportamento do sistema quando existem grupos definidos, mas ainda não foram calculados ou recolhidos dados de desempenho para esses grupos. O sistema deve indicar claramente a falta de dados de desempenho, em vez de apresentar métricas vazias ou dados incorretos.  

**Related Use Cases**: UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- Devem existir grupos definidos no sistema.  
- Não devem existir dados de desempenho calculados ou recolhidos para esses grupos. Configurar o ambiente de teste para que existam grupos, mas sem dados de desempenho associados - ex: grupos recém-criados, ou dados de desempenho apagados para teste.  

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Ver desempenho de Grupos em trabalhos".  
- Verificar a lista de grupos e as colunas/áreas onde as métricas de desempenho seriam apresentadas.  

**Expected Result**:  

- O sistema deve exibir a página de "Desempenho de Grupos em Trabalhos" com a lista de grupos existentes.  
- Para cada grupo na lista, onde os dados de desempenho estão em falta, o sistema deve indicar claramente a ausência de dados.   
- O sistema não deve apresentar valores de métricas vazios (ex: campos em branco, "0"s que podem ser confundidos com dados reais), dados incorretos ou erros.  

**Actual Result**:
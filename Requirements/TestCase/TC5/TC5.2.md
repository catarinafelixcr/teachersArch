**Test Case ID**: TC5.2

**Test Case Description**: Verificar se o sistema destaca visualmente os grupos que apresentam baixa produtividade.

**Related Use Cases**: UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos, Main Success Scenario, Passo 5.  

**Pre-conditions**:  

- O Test Case 1 (TC5.1) deve ter sido bem-sucedido e a página de desempenho de grupos deve estar acessível com a lista de grupos e métricas.  
- Deve haver pelo menos um grupo no sistema que tenha sido classificado como de baixa produtividade (configurar dados de teste ou usar dados reais onde existam grupos com baixa produtividade).

**Steps**:  

- Aceder à página de "Desempenho de Grupos em Trabalhos" (já aberta do Test Case 1 ou repetir os passos do TC5.1).  
- Verificar visualmente a lista de grupos e as suas métricas de produtividade.  

**Expected Result**:  

- Os grupos que o sistema identificar como tendo baixa produtividade devem ser destacados visualmente na lista.  
- O destaque visual deve ser claro e perceptível, conforme especificado (ex: cor vermelha, ícone, etc.).  
- A identificação dos grupos de baixa produtividade deve ser baseada em critérios definidos no sistema (ex: abaixo de um certo limiar em alguma métrica de produtividade).  

**Actual Result**:  

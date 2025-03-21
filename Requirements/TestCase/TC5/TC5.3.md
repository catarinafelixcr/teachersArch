**Test Case ID**: TC5.3  

**Test Case Description**: Verificar se o professor consegue clicar num grupo da lista e obter acesso a uma página com detalhes sobre a colaboração entre os membros desse grupo.  

**Related Use Cases**: UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos, Main Success Scenario, Passo 6.  

**Pre-conditions**:  

- O Test Case 1 (TC5.1) deve ter sido bem-sucedido e a página de desempenho de grupos deve estar acessível com a lista de grupos.  
- Deve haver grupos clicáveis na lista (ex: links ou botões associados a cada grupo).  

**Steps**:  

- Aceder à página de "Desempenho de Grupos em Trabalhos" (já aberta do Test Case 1 ou repetir os passos do TC5.1).  
- Localizar um grupo na lista e clicar no grupo (ou no link/botão associado a ele).  

**Expected Result**:  

- Ao clicar num grupo, o sistema deve redirecionar o professor para uma nova página ou secção com detalhes sobre a colaboração entre os membros do grupo selecionado.  
- A página de detalhes deve apresentar informações relevantes sobre a colaboração, tais como:  
  - Listagem dos membros do grupo.  
  - Métricas de contribuição individual por membro (ex: commits por membro, tarefas atribuídas/concluídas por membro).  
  - Visualizações gráficas da colaboração (ex: gráfico de contribuições ao longo do tempo, rede de colaboração entre membros).  
  - (Ou outros detalhes de colaboração relevantes implementados no sistema).  

**Actual Result**:
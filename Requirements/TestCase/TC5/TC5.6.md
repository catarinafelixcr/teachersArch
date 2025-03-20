**Test Case ID**: TC5.6  

**Test Case Description**: Verificar o comportamento do sistema quando não existem grupos definidos no sistema. O sistema deve apresentar uma mensagem informativa em vez de uma lista vazia ou erros.  

**Related Use Cases**: UC5.1 - Ver a previsão desempenho de diferentes grupos em trabalhos.  

**Pre-conditions**:  

- O professor deve estar autenticado no sistema.  
- Não deve existir nenhum grupo definido no sistema.   

**Steps**:  

- Aceder à dashboard do professor no sistema.  
- Navegar até à opção "Ver desempenho de Grupos em trabalhos".  

**Expected Result**:  

- O sistema deve exibir a página de "Desempenho de Grupos em Trabalhos".  
- Em vez de apresentar uma lista de grupos vazia ou causar um erro, o sistema deve exibir uma mensagem clara e informativa indicando que não existem grupos definidos no sistema.  
- A mensagem pode ser algo como: "Não existem grupos definidos neste momento.", "Nenhum grupo encontrado.", "Crie grupos para visualizar o desempenho dos trabalhos." (ou similar).  

**Actual Result**:
Testabilidade 

Contexto 
O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. Como se trata de um sistema interativo e baseado em dados, a performance impacta diretamente a experiência do usuário e a eficácia das previsões.  

Estímulo
- O utilizador acede ao site e faz um pedido de previsão de desempenho com base nos dados do GitLab.  
- O sistema precisa de processar os dados e gerar uma resposta sem muito tempo de demora.  

Artefato  
- O site com a interface contendo várias funcionalidades e o modelo de ML.  
  
Ambiente
- Acesso de vários utilizadores em simultâneo, com múltiplos pedidos ao modelo e diversas visualizações de retorno.  

Resposta
- O sistema tem que processar os pedidos de previsão e mostrar os resultados rapidamente.  

Medida da Resposta   

- Cobertura de Testes: Percentual de testes unitários, de integração e de regressão aplicados ao sistema e ao modelo de ML.  
- Ambientes de Teste: Lista das abordagens usadas, incluindo testes manuais e automáticos, testes de carga e desempenho.  
- Latência: Tempo médio de resposta do site ao carregar páginas, processar ações e tempo médio para o modelo de ML fornecer previsões.  
- Capacidade de Processamento: Número de previsões simultâneas que o sistema consegue suportar sem perda significativa de desempenho.  
- Uso de Recursos: Eficiência na utilização de CPU e memória, otimizando o modelo de ML para reduzir o consumo.  
- Tempo de Carregamento da Interface: Tempo necessário para renderizar as visualizações com os resultados das previsões.  

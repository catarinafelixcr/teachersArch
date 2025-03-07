**Contexto** 

- O sistema é um site que inclui várias funcionalidades, incluindo a demonstração de um modelo de ML para prever o desempenho dos alunos ao longo do semestre, com base na atividade GitLab. A testabilidade do sistema é essencial para garantir que todas as funcionalidades, incluindo a interface do utilizador e a precisão do modelo de ML, possam ser verificadas de forma eficiente, garantindo confiabilidade e facilidade na sua manutenção.

**Estímulo**

- O examinador (pessoa/sistema que testa) executa testes no site para validar funcionalidades como o carragemento de páginas, interação do utilizador, correção das previsões do modelo de ML.
- O objetivo é identificar falhas e garantir que as várias partes/componentes do sistema estejam a funcionar como é suposto.  

**Artefato**

- O site e as suas componentes (interface do utlizador, API do modelo de ML, a base de dados e o processamento de dados). 
  
**Ambiente**

- Testes são executados em diferentes condições(vários navegadores, dispositivos móveis, cenários com carga elevada).  

**Resposta**

- O sistema tem que processar os pedidos de previsão e mostrar os resultados rapidamente.  

**Medida da Resposta**   

A testabilidade do sistema avalia-se com:

    - Cobertura de testes: percentagem do códido que é coberto pelos testes (cobertura do código) e testes que validam previsões do modelo de ML (cobertura do modelo - verificar se os gráficos estão consistentes com os dados), validação da UI em diferentes dispositivos e navegadores (cobertura da interface).

    - Ambientes de testes: devem ser realizados testes de carga para verificar como o site/sistema se comporta com vários utilizadores em simultâneo e testes para avaliar a o modelo ML.

    - Diagnósticos: o sistema tem que permitir a recolha de logs detalhados, de modo a analisar as falhas e identificar padrões de erros, pelo que os resultados dos testes devem ser fáceis de aceder e interpretar. 

    - Tempo de execução dos testes: os testes devem ser rapidamente concluídos, e devem existir um limite de tempo para realizar 90% dos testes (4 horas).

Este diretório contém a documentação dos **Quality Attributes** definidos para o sistema.  
Cada atributo descreve uma característica não funcional que o sistema deve satisfazer para garantir um produto de software robusto, escalável e de fácil manutenção.

## Estrutura

- **Performance – Pedido de Previsão de Todos os Alunos.md**: Latência e throughput ao requisitar previsões globais para todos os alunos.
- **Performance – Pedido de Previsão de um Grupo.md**: Métricas de desempenho ao gerar previsões filtradas por grupo específico.
- **Performance – Pedido de Previsão Individual.md**: Tempo de resposta ao solicitar a previsão para um único aluno.
- **Security – Acesso a Dados.md**: Requisitos de autenticação, autorização e encriptação no acesso aos endpoints de dados.
- **Security – Alteração de Dados.md**: Controlo de integridade e rastreabilidade para operações de escrita e atualização.
- **Security – Perda de Dados.md**: Estratégias de backup e recuperação para evitar ou mitigar perdas de informação.
- **Testability – Cobertura de Testes.md**: Percentuais mínimos de cobertura unitária, de integração e end-to-end exigidos.
- **Testability – Diagnósticos e Facilidade de Análise de Erros.md**: Requisitos de logging, mensagens de erro claras e ferramentas de debug.
- **Testability – Tempo de Execução dos Testes.md**: Tempo máximo aceitável para a execução completa da suite de testes.
- **Usability.md**: Critérios de navegação, feedback ao utilizador e padrões de acessibilidade.


## Organização dos Documentos

Cada documento está estruturado da seguinte forma:

- **Contexto**: Explica o papel do atributo de qualidade no sistema.
- **Estímulo**: Define o evento ou condição que ativa o comportamento esperado.
- **Artefato**: Indica o elemento do sistema ao qual o atributo se aplica.
- **Ambiente**: Descreve o contexto em que o comportamento ocorre.
- **Resposta**: Explica como o sistema deve reagir ao estímulo.
- **Medida da Resposta**: Define como a resposta será avaliada ou quantificada.

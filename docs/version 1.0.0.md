# Planejamento do Projeto FARMER
**Data e Hora:** 28 de Março de 2026, 21:15 BRT

## 1. Visão Geral
O projeto FARMER é um jogo web construído nativamente usando Vanilla Javascript, HTML e CSS. A análise revelou a presença de um `index.html` bem estruturado contendo a interface principal do jogador (modais, informações de recursos, HUD), acompanhado por estilos em cascata (`css/`) modulares e scripts segmentados (`js/` - `app.js`, `particles.js`, `snow.js`, `tabs.js`). Também notamos configurações locais do agente Antigravity na pasta `.agent`.

## 2. Padrão de Versionamento (SemVer)
Para evitar o "inferno de dependências" e estabelecer uma comunicação clara do impacto de cada mudança no código, o projeto adotará o Versionamento Semântico (MAJOR.MINOR.PATCH), consolidando sua base atual como a versão **1.0.0**.

- **MAJOR (1.x.x -> 2.0.0):** Mudanças grandes e incompatíveis, como mudança de paradigma (ex: migrar de Vanilla JS para React/Vue) ou alterações fundamentais na mecânica de salvamento (save slots).
- **MINOR (x.1.x -> x.2.0):** Adição de funcionalidades novas, mas compatíveis. Ex: adição de novas construções no modal, novas mecânicas de clima ou novas animações de partículas, sem quebrar o jogo atual.
- **PATCH (x.x.1 -> x.x.2):** Correções de bugs. Ex: problemas de responsividade em botões CSS, bugs de cálculo de dinheiro, ou pequenos ajustes de sintaxe no Javascript.

## 3. Avaliação Arquitetural e Melhorias
1. **Frontend UI (frontend-specialist)**
   - **Ponto Forte:** Design imersivo usando SVGs e manipulação direta de DOM para modais.
   - **Melhoria:** Extrair lógicas complexas para classes ou funções puras, separando dados (estado de dinheiro/níveis) da renderização da visualização.

2. **Gerenciamento do Jogo (game-developer)**
   - **Ponto Forte:** Scripts de partículas e neve indicando atenção à imersão climática.
   - **Melhoria:** Um módulo controlador de estado ("Game Loop" / "Store Builder") seria ótimo para sincronizar o HTML com variáveis da lógica de trás de forma assíncrona.

3. **Garantia de Qualidade (test-engineer)**
   - **Melhoria:** Construção de testes exploratórios usando Playwright (E2E) para garantir o fluxo de compra de construções e passagem do tempo.

## 4. Detalhamento de Tarefas (Próxima Fase da Orquestração)
- **Tarefa 1 [Minor]:** Preparação do repositório `.git` com tag nativa da v1.0.0 `[Agent: devops-engineer]`.
- **Tarefa 2 [Patch/Minor]:** Refinamento do `index.html` e `app.js` visando um padrão mais sustentável de gerenciamento do DOM `[Agent: frontend-specialist]`.
- **Tarefa 3 [Patch]:** Escrita de cenários Base de testes para a interface (HUD e Modal) para prevenir regressão de recursos `[Agent: test-engineer]`.
- **Tarefa 4 [Patch]:** Auditoria perf / UX via scripts Antigravity (`security_scan`, `ux_audit`) `[Agent: performance-optimizer]`.

## 5. Critérios de Validação (Verification Criteria)
- A versão deverá refletir no projeto e nas tags do Github;
- Sem dependência quebrada;
- Todos os testes de Scripts de Verificação passando.

---

### Mensagem Sugerida para o Commit (GitHub)
```text
docs: cria plano de orquestracao e padroniza arquitetura sob SemVer

- Adiciona versao inicial do plano de desenvolvimento (1.0.0) na documentacao.
- Define regras de MAJOR, MINOR e PATCH baseadas no Semantic Versioning para evitar infernos de dependencias.
- Elabora analise do estado atual (Vanilla JS+HTML+CSS) e plano de acao multi-agente focado em manutencao, teste e performance.
```

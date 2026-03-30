# Planejamento do Projeto FARMER
**Data e Hora:** 28 de Março de 2026, 21:26 BRT

## 1. Visão Geral (Migração Arquitetural)
Após aprovação do plano inicial e com base no feedback ('alterar a estrutura para React + Tailwind e iniciar com npx run dev'), houve uma quebra de compatibilidade em relação à base código Vanilla JS. Seguindo a regra do Versionamento Semântico pactuada na `1.0.0`, o projeto entra, portanto, na versão **2.0.0**. 

## 2. Padrão de Versionamento Atualizado (SemVer)
- **MAJOR (2.0.0):** Migração estrutural completa do Frontend de Vanilla JS para **React 18 + Vite** e estilização via **Tailwind CSS v4**.
- **MINOR (2.1.0):** Novas features React portadas.
- **PATCH (2.0.1):** Pequenos ajustes de tradução em componentes.

## 3. Arquitetura React + Tailwind (Orquestração Fase 2)
### 3.1. DevOps & Estrutura Base (`devops-engineer` / `frontend-specialist`)
- Repositório foi limpo, isolando arquivos antigos na pasta `legacy/`.
- `package.json` foi configurado para conter o comando `npx run dev` (ou `npm run dev`) apontando para o servidor de desenvolvimento do Vite.
- Implementação inicial contendo `index.html` na raiz mapeando para `src/main.jsx` e o uso do `@tailwindcss/vite` no `vite.config.js`.

### 3.2. Gerenciamento do Jogo (`game-developer`)
- O desenvolvimento passa a focar agora em **Componentização**.
- O Modals, Lógica do Relógio e das Ociosidades (Idle features) que antes estavam no `app.js` deverão ser transformados em blocos de hooks.
- As bolhas de clima e temporizador (que utilizavam CSS para flutuar) serão mapeadas usando as utililities do Tailwind CSS.

## 4. Detalhamento de Tarefas (Próxima Fase da Orquestração)
- **Fase A (Concluída nesta interação):** Setup de React e Tailwind, movimentação de legados e provisionamento do servidor Vite.
- **Fase B:** Construção de Layout Base e Cabeçalho do Jogo (`frontend-specialist`). Mapar todos os ícones `assets/icons/` no novo Layout.
- **Fase C:** Componentizar a listagem de construções e integrar estado local do dinheiro (state management `game-developer`).

## 5. Critérios de Validação (Verification Criteria)
- `npx vite` / `npm run dev` rodando sem erros.
- A aplicação inicial renderizando "## FARMER ##" ou "Bem Vindo à Fazenda" usando classes do Tailwind.

---
### Mensagem Sugerida para o Commit (GitHub)
```text
feat(arch): refatora frontend para React e Tailwind e migra para v2.0.0

- Move arquivos HTML, JS e CSS estaticos para a pasta legacy.
- Inicializa projeto com Vite, instalando React, react-dom e TailwindCSS.
- Adiciona pipeline build e servidor dev ao package.json.
- Atualiza plano de versionamento refletindo a evolucao para v2.0.0.
```

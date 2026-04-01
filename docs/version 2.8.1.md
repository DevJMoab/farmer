# Plano de Orquestração - Version 2.8.1
**Data e Hora:** 2026-04-01 07:12:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Refinamento visual da ferramenta de demolição.
- **Troca de Ícone:** Substituir o ícone de trator pelo `demolish.svg`.
- **Cursor Customizado:** Alterar o cursor do mouse para o ícone de demolição quando a ferramenta estiver ativa.

## 2. Abordagem de Implementação

### A. Interface (UI)
- No `App.jsx`, localizar o botão de demolição e atualizar o `src` da imagem para `/assets/icons/demolish.svg`.

### B. Experiência do Usuário (UX)
- Aplicar um estilo dinâmico ao container principal do mapa (`<main>`) para que, quando `gameState.isDemolitionMode` for verdadeiro, o cursor mude para:
  `cursor: url('/assets/icons/demolish.svg') 16 16, crosshair;`
  (O 16 16 centraliza o ponto de clique no meio do ícone).

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Atualizará o `App.jsx` com o novo ícone e lógica de cursor.
  - Ajustará o CSS inline ou classes Tailwind para suportar o cursor customizado.

- **[test-engineer]**:
  - Verificará se o cursor é exibido corretamente em diferentes navegadores.
  - Validará se o clique de demolição continua preciso com o novo cursor.

---
## Sugestão de Mensagem de Commit
> `perf: update demolition icon and add custom cursor v2.8.1`

**Aguardando autorização `Y` para a implementação.**

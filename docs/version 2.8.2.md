# Plano de Orquestração - Version 2.8.2
**Data e Hora:** 2026-04-01 07:16:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Aprimoramento da interface e feedback visual da ferramenta de demolição.
- **Aumento de Ícone:** Incrementar o tamanho do ícone no botão de demolição em 150%.
- **Cursor Persistente:** Garantir que o cursor `demolish.svg` não mude para a maozinha (`pointer`) ao pairar sobre alvos.
- **Animação de Hover:** Criar uma animação de "vibração e perigo" (shake + red pulse) nos objetos durante o hover no modo demolição.

## 2. Abordagem de Implementação

### A. CSS (Arquitetura de Animação)
- Adicionar no `index.css` a animação `@keyframes demolish-shake` que alterna rotação leve e brilho vermelho intenso.
- Criar a classe `.hover-demolish` para aplicar a animação e forçar `cursor: inherit`.

### B. JavaScript (React)
- **App.jsx**:
  - Aumentar o `w-8 h-8` do ícone para `w-12 h-12`.
  - Aplicar a classe `hover-demolish` nas construções quando `isDemolitionMode` estiver ativo.
- **WorldDecor.jsx**:
  - Aplicar a classe `hover-demolish` nas árvores nativas.

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Atualizará o `index.css` com as novas regras de animação.
  - Ajustará os componentes `App.jsx` e `WorldDecor.jsx`.

- **[test-engineer]**:
  - Validará se o cursor customizado permanece consistente sobre os objetos.
  - Verificará se a animação não causa lag em áreas densamente povoadas por árvores.

---
## Sugestão de Mensagem de Commit
> `ui: enhance demolition tool with larger icon and hover animations v2.8.2`

**Aguardando autorização `Y` para a implementação.**

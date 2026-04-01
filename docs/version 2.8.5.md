# Plano de Orquestração - Version 2.8.5
**Data e Hora:** 2026-04-01 07:46:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Ajuste fino de consistência visual e escala do sistema de demolição.
- **Harmonização de Botão:** Alterar o arredondamento para `rounded-xl` para combinar com os botões secundários da barra lateral.
- **Escala de Ícone:** Definir o tamanho do ícone para `sm:w-8 sm:h-8` (32px).
- **Calibração de Cursor:** Sincronizar o tamanho do cursor com o ícone do botão e ajustar o hotspot para `16 16`.

## 2. Abordagem de Implementação

### A. App.jsx (Botão Sidebar)
- Mudar classe do botão de `rounded-[20px]` para `rounded-xl`.
- Ajustar classes do ícone `img` para `w-6 h-6 sm:w-8 sm:h-8`.
- Remover sombras e efeitos que fujam do padrão dos outros botões `rounded-xl`.

### B. App.jsx (Cursor)
- Atualizar o estilo inline do container `main`:
  `cursor: url('/assets/icons/demolish.svg') 16 16, crosshair;`

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Corrigirá o border-radius e tamanho no `App.jsx`.
  - Sincronizará o hotspot do cursor.

- **[test-engineer]**:
  - Comparará lado a lado os botões da barra lateral para garantir 100% de paridade visual.
  - Testará a precisão do cursor de 32px.

---
## Sugestão de Mensagem de Commit
> `fix: match demolition button style and cursor scale v2.8.5`

**Aguardando autorização `Y` para a implementação.**

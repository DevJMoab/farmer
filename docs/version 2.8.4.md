# Plano de Orquestração - Version 2.8.4
**Data e Hora:** 2026-04-01 07:27:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Ajuste de escala massiva para a ferramenta de demolição conforme solicitado pelo usuário.
- **Escala w-24:** Aplicar o tamanho `w-24 h-24` (96px) ao ícone de demolição no botão e no cursor do mouse.
- **Correção de Layout:** Garantir que o botão lateral suporte esse tamanho mantendo o alinhamento.

## 2. Abordagem de Implementação

### A. UI no App.jsx
- Atualizar a classe do ícone de demolição para `w-24 h-24 sm:w-24 sm:h-24`.
- Ajustar o botão pai para não restringir o tamanho (removendo `w-16 h-16` se necessário ou permitindo overflow visível).
- Garantir `flex items-center justify-center` no botão.

### B. Cursor Customizado
- Atualizar o estilo inline do cursor:
  `cursor: url('/assets/icons/demolish.svg') 48 48, crosshair;`
  (48 é o centro de 96px).

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Aplicará as classes de tamanho `w-24` no componente de botão.
  - Atualizará a lógica de cursor no container `main`.

- **[test-engineer]**:
  - Verificará se o cursor de 96px é aceito pelo navegador sem redimensionamento indesejado.
  - Verificará se o botão lateral não colide com outros elementos devido ao aumento de tamanho.

---
## Sugestão de Mensagem de Commit
> `ui: upscale demolition icon and cursor to w-24 v2.8.4`

**Aguardando autorização `Y` para a implementação.**

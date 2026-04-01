# Plano de Orquestração - Version 2.8.3
**Data e Hora:** 2026-04-01 07:23:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Correção de escala e centralização do ícone de demolição.
- **Centralização do Botão:** Corrigir classes Tailwind para garantir que o ícone de 24px fique no centro exato do botão.
- **Sincronia de Escala:** Garantir que o ícone do botão e o cursor do mouse tenham uma percepção de tamanho equivalente.

## 2. Abordagem de Implementação

### A. Correção da UI no App.jsx
- Substituir `w-24 h-24` por `w-6 h-6` (equivalente a 24px) no ícone do botão.
- Garantir o uso de `object-contain` para respeitar a proporção vertical do SVG sem distorções.
- Verificar se o botão pai possui `flex items-center justify-center`.

### B. Ajuste do Cursor
- O cursor será mantido em seu tamanho natural. Vou ajustar o hotspot para `12 12` para alinhar com o novo tamanho visual de 24px.
  `cursor: url('/assets/icons/demolish.svg') 12 12, crosshair;`

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Ajustará as classes de dimensionamento no `App.jsx`.
  - Atualizará o hotspot do cursor no estilo inline do `main`.

- **[test-engineer]**:
  - Validará o alinhamento visual no centro do botão em Desktop e Mobile.
  - Verificará se o clique (hotspot) do mouse está disparando exatamente onde o ícone sugere.

---
## Sugestão de Mensagem de Commit
> `fix: correct demolition icon size and centering v2.8.3`

**Aguardando autorização `Y` para a implementação.**

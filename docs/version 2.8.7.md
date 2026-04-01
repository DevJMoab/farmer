# Plano de Orquestração - Version 2.8.7
**Data e Hora:** 2026-04-01 07:54:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Resolução definitiva do tamanho do cursor de demolição.
- **Abandono do cursor nativo:** Devido a limitações do navegador, o `cursor: url()` será substituído por um elemento DOM customizado.
- **Escala 200% (64px):** O novo elemento terá o tamanho de 64px garantido.
- **Animação Fluida:** O cursor terá sua própria animação de vibração e pulso.

## 2. Abordagem de Implementação

### A. App.jsx (Desenvolvimento do Cursor)
- Criar um estado `mousePos` para rastrear as coordenadas X e Y.
- Adicionar um `useEffect` para escutar o evento `mousemove` globalmente.
- Renderizar um elemento `img` (ou `div` com background) com `fixed`, `pointer-events-none` e `z-index` altíssimo.
- Aplicar `cursor-none` ao container `main` quando o modo demolição estiver ativo.

### B. Visual e Performance
- O cursor customizado usará `transform: translate3d` para garantir aceleração por GPU e evitar lag.
- Escala definida em `w-16 h-16` (64px).

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Desenvolverá a lógica de rastreamento de mouse e o componente visual do cursor.
  - Ajustará o CSS para esconder o ponteiro nativo.

- **[test-engineer]**:
  - Verificará se existe algum "atraso" (input lag) entre o movimento do mouse e o cursor customizado.
  - Validará se o cursor desaparece corretamente ao sair da janela do mapa.

---
## Sugestão de Mensagem de Commit
> `feat: implement custom react cursor for demolition mode v2.8.7`

**Aguardando autorização `Y` para a implementação.**

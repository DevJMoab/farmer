# Plano de Orquestração - Version 2.8.6
**Data e Hora:** 2026-04-01 07:49:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: PATCH)
Aumento expressivo do cursor de demolição.
- **Escala de Cursor:** Aumentar o cursor em 200% (alvo: 64px).
- **Calibração de Hotspot:** Ajustar o ponto de clique para `32 32` para manter a precisão centralizada.

## 2. Abordagem de Implementação

### A. App.jsx (Lógica de Cursor)
- Atualizar o estilo inline do container `main` para usar um hotspot de 64px:
  `style={gameState.isDemolitionMode ? { cursor: "url('/assets/icons/demolish.svg') 32 32, crosshair" } : ...}`

### B. Consideração Técnica
- Note que o ícone do botão permanecerá no tamanho atual (32px) para preservar a harmonia da barra lateral, enquanto o cursor ganhará esse "zoom" de 200% solicitado para melhor visibilidade no mapa.

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**: 
  - Atualizará o hotspot do cursor no `App.jsx`.

- **[test-engineer]**:
  - Validará se o aumento de 200% é perceptível e funcional em diferentes navegadores (pode haver limitações de hardware/SO para cursores > 32px ou > 64px).

---
## Sugestão de Mensagem de Commit
> `ui: upscale demolition cursor to 64px (200% increase) v2.8.6`

**Aguardando autorização `Y` para a implementação.**

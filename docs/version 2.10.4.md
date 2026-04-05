Data: 2026-04-02
Prompt Original do Usuário:
"a animação de demolição nao foi restaurada. o botao mover é so pra ter o icone e não mostre o texto. o fantasma da construção nao esta seguindo a cruz do cursor."

---

## Sugestão de Mensagem de Commit
`fix: demolition filter override, ghost mousePos on moving state, move button icon-only (SemVer 2.10.4)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Bug `filter: 'none'`:** O `style` inline definia `filter: 'none'` em todos os prédios não selecionados, sobrescrevendo o `filter` da animação CSS de demolição. Corrigido para `undefined` quando `isDemolitionMode`.
- **Bug `mousePos` congelado:** `handleMouseMove` só atualizava `mousePos` quando `placementMode !== null`. No `editState === 'moving'`, o `mousePos` ficava estático no ponto de clique. Corrigido para incluir `|| editState === 'moving'` na condição.
- **Botão Mover:** Convertido para ícone-only `✥`, tamanho `w-12 h-12`, sem texto.
- **Opacity fantasma:** Prédio original no estado `moving` recebe `opacity: 0.001` (praticamente invisível) em vez de `0.6`.

---

## Diagnóstico Técnico

### Root Cause 1 — Demolição
```
Inline style: filter: 'none'
CSS .hover-demolish-building: filter: drop-shadow(...)
Resultado: o inline style sempre ganha. Fix: filter: undefined
```

### Root Cause 2 — Fantasma congelado
```
handleMouseMove condição original: if (placementMode && !previewPlacement)
editState === 'moving': placementMode === null → setMousePos nunca chamado
Fix: if ((placementMode && !previewPlacement) || editState === 'moving')
```

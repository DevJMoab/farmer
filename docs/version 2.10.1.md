Data: 2026-04-02
Prompt Original do Usuário:
"o modo de edição nao ta muito bom. quando o zoom é dado o tamanho do quadro de edição não quero que aumente. e o z index dele também ta embaixo das arvores nativas. quando entramos no modo de edição a building fica em modo 'fantasma' e o quadro fica invisível quando clica e confirma o local, aparece o quadro de edição, a alteração do espelhamento muda a imagem quando clica no botão ↔️."

---

## Sugestão de Mensagem de Commit
`fix: edit mode ux patch - phantom flow, zoom-invariant tooltips, flip animation, z-index elevation (SemVer 2.10.1)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Estado `editState`:** Adicionado sub-estado `'moving' | 'placed'` ao sistema de edição.
- **Long Press:** Ao ativar, define `editState: 'moving'` imediatamente (prédio vira fantasma).
- **Fluxo Phantom:** Prédio segue o cursor no estado `moving`. Apenas após clicar no mapa, o estado muda para `'placed'` e o menu aparece.
- **Zoom Neutro nos Tooltips:** Ambas as caixas de edição e construção receberam `transform: translateX(-50%) scale(1/zoom)` para neutralizar o zoom do mapa. Os menus têm sempre o mesmo tamanho visual na tela.
- **Z-Index Elevado (`z-[10000]`):** Menu de edição e caixa de construção elevados acima das árvores nativas.

### [src/index.css](file:///c:/DEV/farmer/src/index.css)
- **`edit-pulse` keyframe:** Removida a propriedade `transform: scale(1.02)` que conflitava com o `scaleX(-1)` do botão Flip. Animação agora usa somente `filter`.

---

## Explicação das Alterações
1. **Zoom Invariante:** A escala do mapa não afeta mais o tamanho das ferramentas de edição na tela.
2. **Fluxo Fantasma:** UX mais intuitiva — segurar 2s → prédio flutua no mouse → clicar → pousar → editar.
3. **Flip Funcional:** O espelhamento agora funciona sem piscar ou resetar a posição visual.

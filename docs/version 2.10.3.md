Data: 2026-04-02
Prompt Original do Usuário:
"o icone de mover seja igual ao da caixa de construção de reposicionar. a caixa de construção também ta com o zindex abaixo das arvores nativas. quero que coloque uma linha tracejada nos limites do terreno. o comportamento de demolição foi alterado, antes ficava uma luz vermelha. o comportamento de quando clicar em mover quero que seja como no modo de construção o cursor fica com uma cruz e o fantasma da peça anda junto com o cursor."

---

## Sugestão de Mensagem de Commit
`feat: terrain boundaries, ghost move mode, demolition animation fix, crosshair cursor (SemVer 2.10.3)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Z-Index Caixa de Construção:** Container `z-[10000]` para sobrepor árvores nativas.
- **Limites de Terreno:** Divs absolutas com classes `terrain-owned` e `terrain-unowned` delimitando setores do mapa.
- **Cursor Crosshair:** Quando `placementMode` ou `editState === 'moving'`, o cursor muda para `crosshair`.
- **Fantasma do Modo Mover:** Imagem semi-transparente azul segue o mouse durante `editState === 'moving'`.
- **Demolição (buildings):** Classe CSS trocada para `hover-demolish-building` (keyframe sem `translate`).

### [src/index.css](file:///c:/DEV/farmer/src/index.css)
- **`demolish-shake-building`:** Novo keyframe para construções usando `rotate` (propriedade standalone) em vez de `transform: rotate`, evitando conflito com o translate inline.
- **`.terrain-owned` / `.terrain-unowned`:** Novas classes para os limites de terreno com borda tracejada.

---

## Explicação das Alterações
1. **Limites de Terreno:** Feedback visual claro sobre o que pertence ao jogador e o que pode ser comprado.
2. **Fantasma Consistente:** O comportamento do modo Mover agora espelha 100% o modo de Construção.
3. **Demolição Restaurada:** O keyframe foi reescrito para não conflitar com o `transform` inline dos prédios.

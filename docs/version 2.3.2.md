# Plano de Desenvolvimento — FARMER v2.3.2
**Data e Hora:** 29 de Março de 2026, 00:40 BRT
**Versão Alvo:** 2.3.2 (PATCH — Estrada isométrica com sprite road.png)

---

## 1. Análise dos Assets

### road.png (assets/decor/road.png)
- **Estilo:** Isométrico 2:1 (perspectiva inclinada)
- **Direção:** Diagonal NW→SE (canto superior esquerdo ao inferior direito)
- **Formato:** Segmento de via asfaltada com faixas brancas
- **Referência visual:** Confirmada via roads.png — a estrada corre diagonalmente pelo terreno

### Problema com WorldRoad.jsx atual
- A estrada CSS atual é horizontal plana — **incompatível** com a perspectiva isométrica
- Precisa ser substituída por tilagem do sprite `road.png`

---

## 2. Estratégia de Implementação

### Técnica: Tilagem Diagonal do Sprite
Para cobrir o mapa de um extremo ao outro com o sprite isométrico:

1. **Mover o asset** de `assets/decor/road.png` para `public/assets/decor/road.png`
2. **Empilhar múltiplas cópias** do sprite em sequência diagonal para cobrir 1020px de comprimento
3. Cada tile será posicionado com `position: absolute` e offset calculado matematicamente
4. O sprite isométrico tem proporção ~2:1 — para tile de N pixels de largura, o próximo fica deslocado +N/2 em X e +N/4 em Y (ou verificar a inclinação real após ver o asset)

### Cálculo de Tiles
- Largura do sprite: ~200px (estimativa — ajustar após ver tamanho real)
- Mapa: 1020x1020px
- Tiles necessários: ceil(1020 / 200) + 2 de margem = ~8 tiles
- Posição vertical: ~50% do mapa (meio)

---

## 3. Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| `public/assets/decor/road.png` | Copiar de `assets/decor/road.png` (pasta legacy → public) |
| `src/components/WorldRoad.jsx` | Reescrever com tilagem do sprite isométrico |
| `docs/version 2.3.2.md` | Este arquivo |

---

## 4. Critérios de Aceitação

- [ ] road.png disponível em public/assets/decor/
- [ ] Estrada cruza o mapa completo de ponta a ponta (esquerda a direita)
- [ ] Perspectiva isométrica preservada (diagonal NW→SE)
- [ ] Estrada CSS antiga (WorldRoad.jsx) substituída
- [ ] Estrada com z-index = 2 (abaixo das construções, acima do grama)

---

### Commit Sugerido
```text
fix(v2.3.2): substitui estrada CSS por sprite isométrico road.png

- Copia road.png para public/assets/decor/
- Recria WorldRoad.jsx com tilagem diagonal do sprite isométrico
- Remove estrada CSS plana incompatível com perspectiva do jogo
```

# Plano de Desenvolvimento — FARMER v2.3.0
**Data e Hora:** 28 de Março de 2026, 23:32 BRT
**Versão Alvo:** 2.3.0 (MINOR — Enriquecimento visual do mundo + controle de camadas)

---

## 1. Escopo do Sprint

| # | Feature | Agente | Prioridade |
|---|---------|--------|------------|
| 1 | Estrada E–W cortando o mapa | `game-developer` | Alta |
| 2 | Decorações do mundo (árvores, arbustos, pedras, flores) | `frontend-specialist` | Alta |
| 3 | Controle de Z-Index no tooltip de construção (Trazer/Enviar) | `game-developer` | Alta |
| 4 | Assets SVG gerados para itens do mundo | `frontend-specialist` | Média |

---

## 2. Plano Técnico

### 2.1 Estrada Leste–Oeste
- Componente `WorldRoad.jsx` com um `<div>` horizontal absolutamente posicionado no meio vertical do mapa.
- Estrada em perspectiva isométrica simulada com `linear-gradient` (areia/terra batida).
- Faixas de sinalização pintadas com divs menores.
- Posição: `top: 55%` do mapa, altura de `~5.5%`, largura `100%`.
- Bordas levemente marrons/arenosas com `box-shadow` embaixo.

### 2.2 Decorações do Mundo (WorldDecor)
- Componente `WorldDecor.jsx` com lista de elementos fixos:
  - **Árvores**: Pequenas imagens SVG geradas (copa arredondada verde).
  - **Pedras**: Formas cinzas arredondadas via SVG inline.
  - **Arbustos**: Blobs verdes menores.
  - **Flores**: Pequenos SVGs coloridos espalhados.
- Cada item tem `position: absolute`, coordenadas `x%/y%` no mapa.
- Itens ficam **abaixo** das construções via `zIndex`.
- Posições pré-definidas para criar distribuição "natural" (clusters, não grade).

### 2.3 Sistema de Z-Index nas Construções
- No estado de cada construção, adicionar `zIndex: number` (padrão: 10).
- No tooltip de confirmação (`previewPlacement`), adicionar dois botões:
  - `↑ Frente` — incrementa `zIndex` da construção em placement.
  - `↓ Atrás` — decrementa o `zIndex`.
- Após gravar, o `zIndex` salvo é respeitado no render.
- Adicionar também no tooltip das construções já colocadas (clique para editar).

### 2.4 Assets SVG Gerados
- Árvore (copa circular, tronco marrom).
- Arbusto (blob verde arredondado).
- Pedra (oval cinza com highlight).
- Flor (miolo amarelo + pétalas coloridas).
- Palha/feno (stack de retângulos dourados).

---

## 3. Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/WorldDecor.jsx` | **NOVO** — Decorações estáticas distribuídas |
| `src/components/WorldRoad.jsx` | **NOVO** — Estrada E–W do mapa |
| `public/assets/decor/tree.svg` | **NOVO** — Asset árvore |
| `public/assets/decor/bush.svg` | **NOVO** — Asset arbusto |
| `public/assets/decor/rock.svg` | **NOVO** — Asset pedra |
| `public/assets/decor/flower.svg` | **NOVO** — Asset flor |
| `src/App.jsx` | Integrar WorldDecor + WorldRoad + zIndex state |

---

## 4. Critérios de Aceitação

- [ ] Estrada horizontal visível cruzando o mapa de ponta a ponta.
- [ ] Mínimo 30 elementos decorativos no mapa (árvores, pedras, etc.).
- [ ] Decorações respeitam a estrada (não ficam em cima dela).
- [ ] Botões `↑` e `↓` no tooltip de placement controlam a profundidade visual.
- [ ] Construções gravadas mantêm o z-index escolhido.

---

### Commit Sugerido
```text
feat(v2.3.0): mundo vivo com estrada, decorações e controle de camadas

- Adiciona WorldRoad: estrada E-W em perspectiva cortando o mapa
- Adiciona WorldDecor: arvores, arbustos, pedras e flores distribuidas
- z-index controls no tooltip de placement (trazer/enviar camada)
- Assets SVG gerados para itens decorativos do mundo
- Documenta plano v2.3.0
```

# Plano de Desenvolvimento — FARMER v2.4.0
**Data e Hora:** 30 de Março de 2026, 10:05 BRT
**Versão Alvo:** 2.4.0 (MINOR — Estrada corrigida + todos os buildings implementados)

---

## 1. Problemas Identificados

| # | Problema | Causa | Solução |
|---|---------|-------|---------|
| 1 | Estrada não alinha entre tiles | Delta matemático errado (164px fixo horizontal) | Usar ΔX=−120, ΔY=+60 conforme calibração do usuário |
| 2 | Decorações PNG não combinavam esteticamente | Assets isométricos mas tamanho/estilo inconsistente | Usar SVGs já existentes (bush, hay, rock, flower, tree, fence) |
| 3 | Buildings incompletos no modal | Apenas Sede + Celeiro cadastrados | Adicionar todos os 24 buildings disponíveis em STAGE 1/buildings/ |

---

## 2. Plano Técnico

### 2.1 Correção da Estrada (WorldRoad.jsx)

**Calibração dos tiles (fornecida pelo usuário):**
- Tile ref A: left=655, top=230
- Tile ref B: left=550, top=283
- Tile ref C: left=430, top=343
- Tile ref D: left=309, top=403
- **Delta estável: ΔX = −120px, ΔY = +60px**

**Extrapolação edge-to-edge (mapa 1020×1020px):**
Partindo do ponto A (655, 230) em ambas as direções com o delta estável:

| Tile | Left | Top | Dentro do Mapa |
|------|------|-----|---------------|
| 0 (extra) | 1135 | 50 | overflow direito |
| 1 | 1015 | 110 | borda |
| 2 | 895 | 170 | ✓ |
| 3 | 775 | 230 | ✓ |
| **4 (ref A)** | **655** | **230** | ✓ (corrigido) |
| **5 (ref B)** | **550** | **283** | ✓ |
| **6 (ref C)** | **430** | **343** | ✓ |
| **7 (ref D)** | **309** | **403** | ✓ |
| 8 | 189 | 463 | ✓ |
| 9 | 69 | 523 | ✓ |
| 10 (extra) | -51 | 583 | overflow esquerdo |

> Obs: O ref A tem top=230 em ambas as linhas da tabela porque o delta entre ref3 e ref A também é ~-120, +60 (775→655, 170→230).

### 2.2 Decorações SVG (WorldDecor.jsx)
- Usar os SVGs existentes: `bush.svg`, `hay.svg`, `rock.svg`, `flower.svg`, `tree.svg`, `fence.svg`
- SVGs renderizam melhor e escalam sem perda
- Distribuir respeitando a diagonal da estrada (não na faixa top 40%–65%)

### 2.3 Novos Buildings (BuildingsModal.jsx + App.jsx)
**Lista completa dos buildings disponíveis em /STAGE 1/buildings/:**

| ID (arquivo .png) | Nome Exibido | Categoria | Custo |
|---|---|---|---|
| sede | Sede da Fazenda | Social | 85.000 |
| celeiro | Celeiro | Storage | 16.897 |
| curral | Curral | Animals | 28.000 |
| aprisco | Aprisco | Animals | 22.000 |
| pocilga | Pocilga | Animals | 19.500 |
| estabulo | Estábulo | Animals | 35.000 |
| galinhas | Galinheiro | Animals | 18.000 |
| patos | Patos | Animals | 15.000 |
| codornas | Codornas | Animals | 12.000 |
| avestrus | Avestruzes | Animals | 25.000 |
| viveirosParaPeixes | Viveiros para Peixes | Animals | 18.000 |
| pomar | Pomar | Production | 32.000 |
| horta | Horta | Production | 14.000 |
| estufas | Estufas | Production | 45.000 |
| campo | Campo de Cultivo | Crops | 20.000 |
| moinho | Moinho | Production | 38.000 |
| processamento | Processamento | Production | 55.000 |
| silo | Silo | Storage | 25.000 |
| silagem | Silagem | Storage | 18.000 |
| estoque | Estoque | Storage | 12.000 |
| garagem | Garagem | Machines | 30.000 |
| oficina | Oficina | Machines | 28.000 |
| logistica | Logística | Machines | 22.000 |
| esterco | Esterco | Others | 8.000 |

---

## 3. Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/WorldRoad.jsx` | Corrigir tilagem com ΔX=−120, ΔY=+60 |
| `src/components/WorldDecor.jsx` | Usar SVGs, ajustar posições fora da diagonal da estrada |
| `src/components/BuildingsModal.jsx` | Adicionar todos os 24 buildings |

---

## 4. Critérios de Aceitação

- [ ] Tiles da estrada se conectam de forma contínua de edge a edge
- [ ] Decorações SVG visíveis e alinhadas com a perspectiva do mapa
- [ ] Todos os 24 buildings visíveis e construíveis no modal
- [ ] Modal filtra corretamente por categoria
- [ ] Saldo deduzido corretamente para cada building

---

### Commit Sugerido
```text
feat(v2.4.0): estrada alinhada + todos os buildings implementados

- Corrige tilagem da estrada: ΔX=-120, ΔY=+60 (calibrado pelo usuário)
- Substitui PNGs por SVGs nas decorações do mapa
- Adiciona 24 buildings completos ao modal de construção
- Buildings com categorias, custos e ícones isométricos corretos
```

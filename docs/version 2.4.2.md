# Plano de Desenvolvimento — FARMER v2.4.2
**Data e Hora:** 30 de Março de 2026, 11:05 BRT
**Versão Alvo:** 2.4.2 (PATCH — Alteração da estrada para SVG e explicação de coordenadas)

---

## 1. Escopo da Modificação

| # | Alteração | Motivo |
|---|-----------|--------|
| 1 | Mudar formato da estrada de PNG para SVG | Usuário providenciou arquivo `road.svg` em mais alta qualidade |
| 2 | Levantamento topográfico da estrada | Explicar para o usuário os pontos de início e fim da tilagem na matriz de 1020x1020px |

---

## 2. Posição da Estrada (Topografia)

A estrada utiliza como base (Tile 0) o ponto que o usuário informou: `Left: 655px, Top: 230px`.
Um Delta Matemático fixo de ΔX=-120, ΔY=+60 é aplicado para criar a diagonal de Leste a Oeste.
Rodamos um loop que gera 68 tiles (do índice `i = -7` ao `i = 60`) criando uma linha gigantesca que atravessa a tela inteira.

- **Tile -7 (Início Real da tela à direita):** Nasce fora da tela na posição `Left: 1495px, Top: -190px` 
- **Tile 0 (Ponto de Âncora do User):** Fica em `Left: 655px, Top: 230px`
- **Tile 14 (Último tile visível à esquerda):** Sai da tela em `Left: -1025px, Top: 1070px`
- **Tile 60 (Fim técnico da linha virtual):** Toca o chão distante em `Left: -6545px, Top: 3830px`

## 3. Arquivos a Alterar
- `src/components/WorldRoad.jsx` (Substituir `.png` por `.svg` no render da imagem)

---
### Commit Sugerido
```text
style(v2.4.2): altera estrada de road.png para road.svg para melhor escalonamento vetorial
```

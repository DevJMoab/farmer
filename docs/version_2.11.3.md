# Plano do Mapa Isométrico de Terrenos - Versão 2.11.3

**Data**: 04/04/2026
**Hora**: 18:00

## Prompt Reescrito e Corrigido
"Os 'quadrados' (linhas imaginárias) que delimitam os terrenos comprados no mapa do jogo estão apenas como quadrados em perspectiva distorcida. O primeiro está num formato 2D incorreto e os demais estão totalmente fora do prumo. Preciso que coloque detalhadamente todos os setores na exata angulação da estrada, e que fiquem em perfeita perspectiva isométrica verdadeira."

## Sugestão de Mensagem de Commit
`feat(map): implement true 2:1 isometric grid projection for all terrain sectors v2.11.3`

## Análise e Planejamento (project-planner)
A malha rodoviária `road.png` tem uma proporção matemática em tela correspondente à translação de `ΔY = +60` / `ΔX = -120` (Ratio 2:1). O atual polígono visual desenhava posições rígidas por porcentagem (ex:`69,13 67,88 31,87 32,12`), o que produzia um balão com bordas esticadas que não reflete a isométrica. A proposta é gerar um array com a matriz `3x3` lógica mapeando as tuplas cartesianas `(col, row)` para uma grade `viewBox="0 0 1020 1020"` via uma conversão geométrica pura, utilizando a fórmula de tile `Width = 340px` & `Height = 170px`.

## Arquivos e Linhas Editadas

### [App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Linhas 584-629**: Deleção dos retângulos estáticos isolados (Norte, Leste, Sul, Oeste, Central). Criação de um bloco lógico com a função Array `.map({ id, col, row })` passando pelos 9 quadrantes (`nw..se`). 
Reagrupamento via cálculos vetoriais automáticos `cx` e `cy`, pintando de tracejados verdes (terrenos possuídos) e escuros (terrenos travados).

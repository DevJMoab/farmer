# Plano de Balanceamento do Terreno e Motor de Colisão Isométrico - Versão 2.11.4

**Data**: 04/04/2026
**Hora**: 18:15

## Prompt Reescrito e Corrigido
"Perfeito, a visualização isométrica 2:1 ficou exata com a rua, mas preciso aumentar a escala real dos 9 terrenos no mapa. O terreno que você recriou tem cerca de 186 pixels em cada aresta. Agora eu preciso que o lado de cada losango seja exatamente de 600x600 pixels. Além disso, quando o usuário tentar depositar ou construir algo nas áreas (setores) cujo território ele não comprou, o sistema deve impedir energicamente o preview de construção."

## Sugestão de Mensagem de Commit
`refactor(map): scale isometric sectors to 600px sides and enable strict bounding box collision v2.11.4`

## Análise e Planejamento (project-planner)
Uma aresta isométrica real em 600px na regra de visão 2:1 (`Y = X/2`) representa uma "Bounding Box" visual em tela de aproximadamente `Width: 1080px` e `Height: 540px`.
*   A dimensão da malha SVG foi mantida amarrada a base de % nativa da div central `1020px`.
*   Entretanto, o laço de repetição (`.map()`) passará a ter Multiplicadores de Escala Gigantes: eixo X de `170px para 540px` (rx), e eixo Y de `85px para 270px` (ry).
*   **O Grande Motor**: O método React `isInsideOwnedSector` será destruído. Iremos substituir os números fantasmas Mínimo/Máximo (`minX: 20` e cia.) por uma **Fórmula Reversa de Transformação Rotacional e Isométrica**, transformando o clique/hover em cartesianas `col` e `row` lógicas e retornando `false` caso não caia em setores incluídos no array `ownedSectors`.

## Arquivos e Linhas Editadas

### [App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Linhas 177-186**: Atualização e rescrita do algoritmo matemático de verificação `isInsideOwnedSector()`. Mapeamento de `colExact` e `rowExact`.
- **Linhas 584-629**: Multiplicador escalar dos Polígonos SVG (o novo raio horizontal em tela será de 540px e vertical de 270px). A propriedade de vazamento natural do CSS e do Canvas SVG farão o limite transbordar e será facilmente visível através da engine nativa de Panning (Pan & Drag já implementada).

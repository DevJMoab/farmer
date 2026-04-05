# Plano de Expansão e Desbravamento de Decorações e Mapa 5x5 - Versão 2.11.5

**Data**: 04/04/2026
**Hora**: 18:35

## Prompt Reescrito e Corrigido
"Ao invés de 9 terrenos na grade (matriz 3x3), gostaria que fossem disponibilizados 25 terrenos (matriz 5x5). Para a parte de decoração natural e cenário (como as árvores nativas procedurais), quero que as peças somente surjam e ocupem a renderização se, e somente se, o jogador possuir aquele setor/terreno específico (exceto pelo cenário do terreno central que já vem destravado). Caso ele compre novos terrenos, o matagal natural deve emergir."

## Sugestão de Mensagem de Commit
`feat(map): rewrite map engine for 5x5 grid sectors and implement owned-territory-based lazy world decoration v2.11.5`

## Análise e Planejamento (project-planner)
Transformar a matriz local base do jogo de uma 3x3 (9 lotes) para a equivalente topográfica 5x5 (25 lotes virtuais). 
*   No `LandSector.jsx`: O Array fixo `SECTOR_GRID` será destituído a favor de um Engine que gere dinamicamente 25 terrenos com ID formatadas topograficamente `{ id: 'sec_col_row' }`, utilizando um distanciamento em camada (`Math.max(x, y)`) para definir preços mais baixos próximos ao centro, e mais caros nas bordas mais extremas. O grid visual de CSS passará de `grid-cols-3` para `grid-cols-5`. 
*   No `App.jsx`: A colisão base Isométrica Inversa vai checar margens seguras até extremidades limitadoras de `Col < 0 || Col > 4`, suportando o eixo 5x5.
*   Em `WorldDecor.jsx`: Pela transposição do terreno 5x5 estender as coordenadas em pixels fora dos domínios do `[0~100%]` da `div` delimitatória de `1020px`, forçaremos o mapa a plantar de origens muito além (`-150% até 250%`). Mas não exibiremos elas todas de uma vez! Todo cenário da floresta procedimental e decorativa passará a receber a prop `isInsideOwnedSector`, renderizando visualmente a matriz da árvore e processando sua colisão *apenas se o seu ponto cartesiano YX flutuar sobre um setor que foi pago pelo usuário*.

## Arquivos e Linhas Editadas

### [src/components/LandSector.jsx](file:///c:/DEV/farmer/src/components/LandSector.jsx)
- **Constantes Top level**: Construção de array dinâmico iterando em `(col:0..4, row:0..4)` gerando 25 lajes. Refatoração da UI de compra alterando o grid do TailWind de `cols-3` para `cols-5`, diminuindo um pouco a fonte de títulos e removendo nomenclaturas complexas para `Lote [X,Y]`.

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Fórmula de isometria reversa**: Adequação de `Math.round((B - A) / 2)` compensando a elevação do Centro das coordenadas Lógicas de `(1,1)` para `(2,2)` usando a equação offset `+4` (e.g. `dy / 270 + 4`), subindo o cap de verificação de limites isométricos de colisão limite para `> 4`.

### [src/components/WorldDecor.jsx](file:///c:/DEV/farmer/src/components/WorldDecor.jsx)
- **Árvores Procedimentais**: Aumento agressivo de instâncias globais para cobrir os vastos limites do terreno 5x5 multiplicando `MAX_TREES` p/ cobrir o novo range de `-150` a `250` na geração. Adoção da filtragem no array de exibição onde `activeItems` executa `.filter` passando pelas chaves condicionais passivas de pertencer também à posse territorial confirmada, validando a "Descoberta de Cenário" dinamicamente conforme compras acontecem.

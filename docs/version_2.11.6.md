# Plano de Refinamento de Colisões - Versão 2.11.6

**Data**: 04/04/2026

## Objetivos e Prompt
- Bloquear que a construção saia de nossas propriedades durante a operação de mudança/posicionamento na edição de layout (`moving`).
- Escalar os blocos de terreno pra mais 200px em suas arestas (De 600px Lado Isométrico para 800x800px isométrico real).
- Dobrar/Triplicar a densidade de matagal de florestas dinâmicas pra poluição florestal intensa na vastidão.
- Implementar algoritmo de exclusão paramétrica da estrada `WorldRoad.jsx` para limpar e proibir a superposição incômoda da flora contra a via de asfalto isométrico (`0.5x + y - 557.5 = 0`).

## Sugestão de Comando Git
`feat(map): scale bounding boxes to 800px, increase flora density, apply anti-road filter, and extend ownership validation to repositioning mode v2.11.6`

## Análise e Planejamento
### Geometria
A alteração de base de lado 600px para 800px impõe uma alteração direta no bounding box (rx, ry) do polígono:
*   `Lx = 800` isométrico (projeção W e H ratio 2:1) gera `Bounding Width` de `~1440px`.
*   Logo, raios do vértice passam pra `rx = 720` e `ry = 360`.

### Motor de Colisão do Clique e Fantasma
A função master de validação será adicionada como catraca nas duas ações dependentes da div Container `handleMapClick`. Interceptaremos coordenadas antes do preview em `placementMode`, e também na conversão das coordendas lógicas pós evento de click com `isInsideOwnedSector`.

### Matemática de Bloqueio da Estrada `WorldRoad.jsx`
* A estrada atravessa diagonalmente do Ponto A `(655px, 230px)`.
* Ponto D fornece `\Delta X = -120` e `\Delta Y = 60`.
* A conversão nos dá a fórmula linear cartesiana perfeita: a distância perceptível entre ponto P e reta em plano isométrico será cortada utilizando Distância Ponto-Reta `abs((0.5 * X) + Y - 557.5) / 1.118 > raio rodovia`. Árvores na estrada serão rejeitadas e iteradas de volta p/ outra semente livre.

## Escopo Modificado (Arquivos)
- [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx): Alterar hardcodes escalares de `540->720`, `270->360`. Escorar o retorno de evento do mouse na validação do terreno comprado. Exibir feedback Toast.
- [src/components/WorldDecor.jsx](file:///c:/DEV/farmer/src/components/WorldDecor.jsx): Subir MAX_TREES muito agressivamente de `1500` p/ `3500`. Subtituição da filtragem boba (x/y pct) pela filtragem vetorial da linha para preservar intocada a Road.

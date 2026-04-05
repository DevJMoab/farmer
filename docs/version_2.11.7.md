# Plano de Feature: Construção Viária Isométrica - Versão 2.11.7

**Data**: 04/04/2026

## Objetivos e Prompt
"Quero implementar uma nova feature: construção de ruas (`street.svg`). Ao selecionar a ferramenta de construir ruas, o usuário desenha no mapa o "path" (caminho) com o mouse. O Front-end deve colocar peças de tile no caminho desenhado, garantindo que ele sempre se tranque na diagonal (perspectiva isométrica 2:1) para qualquer uma das 4 direções suportadas. Curvas serão subidas no futuro, o foco é linha reta travada nos eixos."

## Sugestão de Comando Git
`feat(map): implement 2:1 isometric path drawing tool for procedural street construction v2.11.7`

## Análise e Planejamento (project-planner)

### Mecânica de Interação (Drawing Mode)
O usuário ativará um estado novo chamado `isRoadDrawingMode`. 
* **MouseDown**: Trava a variável `roadPathTarget: { startX, startY }`. 
* **MouseMove**: Captura o ponto destino atual e ativa uma engenharia corretora de eixos isométricos.

### Motor de Perspectiva (Corrector)
A perspectiva do jogo obedece o **Ratio 2:1** (Para cada 2 pixels via X, movimenta-se 1 pixel via Y).
Quando arrastamos de A para B:
- `Δx = x2 - x1`
- `Δy = y2 - y1`

No mundo ortogonal/isométrico, as direções permitidas são puras linhas ao longo dos eixos:
1. "Nordeste-Sudoeste": `y = -0.5x` (aumentando X, sobe o Y) -> Equivale a subir na inclinação positiva. 
2. "Noroeste-Sudeste": `y = 0.5x` (aumentando X, desce o Y).

A matemática escolherá a projeção dominante (se a intenção do Drag do usuário tender mais pra NE/SW ou NW/SE) e preencherá essa reta invisível com instâncias do Tile `street.svg` divididos por um delta step estático, como `dx=80, dy=40`.

### Modificações Necessárias em Código
1. **Header.jsx / App.jsx state**: Adicionar um botão "🛣️ Construir Rua" na interface. Criar estado genérico `roadDrawing` armazenando { start, end }.
2. **App.jsx (Events)**: Incrementar o `handleMouseDown`, `handleMouseMove` e `handleMouseUp` para capturar a intenção de desenho da estrada de forma análoga a régua de medição e salvar o patch definitivo numa `gameState.roads = []` ao soltar o mouse.
3. **App.jsx (Render)**: Iterar os nós contidos num construtor de Caminhos `Array` que desenhará na tela o elemento Fantasma pre-visualizando (verde translúcido/amarelado) os "streets" gerados antes do click final, bem como as estradas fixadas finais.

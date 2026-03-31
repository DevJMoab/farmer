# Plano de Orquestração - Version 2.7.0
**Data e Hora:** 2026-03-31 17:55:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: Minor)
Atualização classificada como `MINOR` (v2.7.0) focada na reformulação da vegetação nativa do mapa.
- **Redimensionamento:** Limitar a altura máxima das árvores nativas a 75px.
- **Aumento de Densidade:** Implementar um algoritmo de geração procedural (pseudo-aleatório) para preencher o mapa com uma densidade muito maior de árvores.
- **Ordenação por Z-Index (Top-Down):** Garantir que a renderização ocorra de cima para baixo (coordenada Y), de modo que as árvores mais ao "norte" fiquem atrás das árvores ao "sul", evitando sobreposições visuais incorretas.
- **Preparação para Limpeza:** Estruturar a lista de árvores de forma que possam ser removidas gradualmente no futuro à medida que construções ocuparem o espaço.

## 2. Abordagem de Implementação

### A. Geração Procedural de Vegetação
Em vez de uma lista estática (hardcoded) no `DECOR_ITEMS`, criaremos uma função `generateNativeFlora()` que:
1. Divide o mapa em quadrantes ou usa uma amostragem aleatória massiva.
2. Evita áreas "proibidas" (como a estrada central e o centro da fazenda onde o jogador inicia).
3. Atribui um `zIndex` baseado na posição `top` (Y). Ex: `zIndex: Math.floor(top * 10)`.

### B. Especificações Técnicas
- **Tamanhos:** Sorteio entre 40px e 75px.
- **Asset Types:** `tree`, `tree2`, `tree3`.
- **Z-Index:** Crucial para isometria. Árvores com `y` maior devem ter `zIndex` maior.

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**:
  - Implementará o algoritmo de geração no `WorldDecor.jsx`.
  - Ajustará o estilo CSS/Inline para respeitar a altura máxima e o z-index dinâmico.

- **[project-planner]**:
  - Verificará as zonas de exclusão para garantir que as árvores nativas não "atropelem" a estrada ou a sede inicial.

- **[test-engineer]**:
  - Validará o impacto de performance com a alta densidade de SVGs no mapa.
  - Verificará visualmente se a ordenação Y (z-index) está correta nos clusters de floresta.

---
## 4. Sugestão de Mensagem de Commit
> `feat: implement high-density procedural native flora v2.7.0`
> 
> - Created dynamic tree generation with controlled density.
> - Capped native tree size to 75px.
> - Implemented top-to-bottom z-index sorting for correct isometric overlap.
> - Reserved central and road areas from vegetation.

**Aguardando autorização `Y` para a implementação.**

# Multi-Agent Orchestration Plan: Dynamic Rotational Tooltips (Attached to Lines)

## 1. Task Objective
- **Dynamic Measurement Tooltips:** Refatorar as caixas de informação de distância/graus para que fiquem perfeitamente fixadas no meio (coladas) e orientadas paralelamente à inclinação da linha correspondente, não importando a direção que o vértice seja puxado.

## 2. Requirements & Discovery
- Atualmente, as caixas de informação estão fixas espacialmente (ângulo 0°) com as informações usando um `foreignObject` posicionado sempre na vertical.
- **Solução Matemática (Trigonometria):**
  - Aplicar `transform="translate(...) rotate(...)"` no nó pai do tooltip, ou repassar a rotação exata para o `style={{ transform: ... }}` no HTML.
  - **Correção de Legibilidade:** Se a linha for desenhada "da direita para a esquerda" (ângulo maior que 90° e menor que 270°), a inclinação virará a caixa de cabeça para baixo. Para evitar isso, se `angle > 90 && angle < 270`, subtrai-se 180° da rotação final apenas para o texto, assim a leitura fica sempre orientada para cima.
  - O espaçamento de 1 a 2px (desejo do usuário) pode ser garantido aplicando um deslocamento em `translateY` na caixa rotacionada ou manipulando `dy` caso se utilize um elemento `<text>` do SVG.

## 3. Implementation Steps (Phase 2 - Parallel Agents)

### A. Frontend Specialist (UI & Logic)
1. **Tooltips Rotacionais no `App.jsx`:**
   - Modificar o `<foreignObject>` existente para suportar a rotação atrelada ao ângulo calculado `Math.atan2`.
   - Calcular um `displayAngle`. Se `angle > 90 && angle < 270`, `displayAngle = angle - 180`; caso contrário, `displayAngle = angle`.
   - Alterar o `transform` para incluir a rotação: `translate(-50%, -100%) rotate(${displayAngle}deg)`. (Afastando e centralizando para grudar acima da linha).
   - Diminuir o volume da caixa e remover fundos excessivos para garantir estética sem que obstrua a linha geométrica subjacente.

### B. Project Planner / Orchestrator
- Garantir que a lógica de "escalonamento reverso" (`3 / transform.scale`) implantada para o SVG ainda funcione adequadamente quando rotacionarmos as divisórias do React via CSS Transform.

### C. Test Engineer
- Testar desenhar "da direita para a esquerda" certificando-se de que o texto não fica de cabeça para baixo.
- Verificar o espaçamento perpendicular garantindo aderência na linha (+/- 2px de gap real).

---
## Approval
Aguardando aprovação do usuário para iniciar a IMPLEMENTAÇÃO em paralelo.

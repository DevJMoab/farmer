# Plano de Orquestração - Version 2.5.0
**Data e Hora:** 2026-03-30 18:40:10 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: Minor)
Atualização classificada como `MINOR` (v2.5.0) pois introduzimos duas novas funcionalidades retrocompatíveis:
- **Interatividade Isométrica Avançada:** Adicionar capacidade de "arrastar linhas" na ferramenta de medição geométrica, movendo assim os dois vértices conectados de forma sincronizada.
- **Expansão de Construções:** Criação de uma nova categoria "Decorações" (`Decorations`) e inclusão das Árvores 1, 2 e 3 para serem alocadas no terreno base.

## 2. Abordagem de Implementação e Descoberta

### A. Ferramenta de Medição: Arrasto de Linhas
O atual `draggedPointIndex` não é suficiente, pois ele amarra instantaneamente o vértice exato às coordenadas `x, y` absolutas do cursor. 
- **Solução:** Substituir `draggedPointIndex` por um super-estado lógico `dragContext = null` que guardará `type` ('point' | 'edge'), `index`, e o snapshot inicial das coordenadas associadas ao primeiro "clique" (`startPoints` e `startMouse`).
- **Movimento Relativo (`deltaX`, `deltaY`):** Quando o mouse mover enquanto segura uma "linha" (`edge`), calcularemos para onde o mouse foi (delta) e somaremos esse delta em ambos os vértices correspondentes da linha ao mesmo tempo. As linhas receberão área de contato espessada e a propriedade CSS `cursor: move` com gatilho `onMouseDown`.

### B. Categoria Decorações
- Modificar `src/components/BuildingsModal.jsx`.
- Inserir a String `'Decorations'` no `const TABS`.
- Inserir 3 novos objetos `{ id: 'arvore1', ... }`, `{ id: 'arvore2', ... }`, `{ id: 'arvore3', ... }` na lista global de `BUILDINGS`, estipulando um custo simbólico (ou valor zero se for livre).

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**:
  - Implementará a refatoração do estado React no `App.jsx` gerenciando `dragContext`. 
  - Adicionará o escutador de eventos invisível e o estilo ampliado nas `<line>` para facilitar o clique.
  - No `BuildingsModal.jsx`, adicionará os metadados de Arvores seguindo a indexação da categoria `Decorations`.

- **[project-planner] / [orchestrator]**:
  - Realiza auditoria em eventuais bugs paralelos do React state hook quando combinamos o `delta` do mouse e coordenadas flutuantes.

- **[test-engineer]**:
  - Validará o "drop" dos objetos decorações no sistema regular de terreno do `App.jsx`.
  - Checará se ao clicar na linha os dois vertices arrastados realmente não sofrem torções nas angulações originais.

---
## 4. Sugestão de Mensagem de Commit (Para o fim)
> `feat: add edge-dragging metric tool and decoration tree objects`
> 
> - Introduzido estado delta (dragContext) no Mapeador Isométrico permitindo transladar linhas completas sem deturpar os ângulos.
> - Nova categoria 'Decorations' e árvores 1, 2, 3 inseridas na BuildingsModal para inserção livre manual no mapa.
> - Atualização para v2.5.0

---
**Aguardando autorização `Y` para a implementação.**

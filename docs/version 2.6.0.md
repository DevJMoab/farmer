# Plano de Orquestração - Version 2.6.0
**Data e Hora:** 2026-03-31 16:30:00 (Horário de Brasília)

## 1. Objetivo da Tarefa (SemVer: Minor)
Atualização classificada como `MINOR` (v2.6.0) para correções de caminhos de ativos e melhorias na UX da ferramenta de medição.
- **Correção de Ativos de Decoração:** Ajustar o carregamento das árvores no `BuildingsModal` e no `App.jsx` para apontar para `/assets/decor/` (em vez de `STAGE 1/buildings/`) e usar os nomes de arquivo corretos (`tree.svg`, `tree2.svg`, `tree3.svg` mapeados de `arvore1`, `arvore2`, `arvore3`).
- **Melhoria da UX do Mapeador:**
  - Reposicionar o quadro de instruções para o **bottom centralizado** com escala reduzida em ~30%.
  - Adicionar o **mapeamento do cursor** (X, Y em pixels) em tempo real enquanto o modo de medição estiver ativo, mantendo as funcionalidades de arrasto de vértices e arestas.
- **Estabilização do Ambiente:** Investigar falha no comando `npm run dev` (erro de reconhecimento do comando `vite`).

## 2. Abordagem de Implementação e Descoberta

### A. Caminhos dos Ativos
- Os arquivos identificados na pasta `public/assets/decor` são: `tree.svg`, `tree2.svg`, `tree3.svg`.
- No `BuildingsModal.jsx`, a lógica de `BuildingThumb` e a definição do array `BUILDINGS` precisam de uma condicional para a categoria `Decorations`.
- No `App.jsx`, a renderização das construções confirmadas e o preview precisam discriminar o caminho baseado na categoria ou ID da construção.

### B. Mapeador Isométrico (UX)
- **Instruções:** Mover o `div` de instruções para `bottom-10` (em vez de centralizado no meio da tela ou no topo).
- **Cursor Tracker:** Reintroduzir o tooltip flutuante que segue o mouse mostrando `mouseX` e `mouseY` (em %) ou pixels relativos ao mapa, permitindo precisão cirúrgica no desenho.

## 3. Etapas de Agentes Paralelos (FASE 2)

- **[frontend-specialist]**:
  - Ajustará a lógica de `src` no `BuildingsModal.jsx` e `App.jsx`.
  - Atualizará o layout do `isMeasuringMode` overlay no `App.jsx` para incluir o bottom-gui e o mouse-tracker.

- **[devops-engineer]**:
  - Verificará a integridade do `node_modules`. Se o `vite` não é reconhecido, provavelmente é necessário um `npm install` ou usar `npx vite`.

- **[test-engineer]**:
  - Validará se as árvores aparecem no menu e no mapa.
  - Testará a legibilidade das coordenadas do cursor sob diferentes zooms.

---
## 4. Sugestão de Mensagem de Commit
> `fix: correct decor assets path and improve isometric tool UX v2.6.0`
> 
> - Fixed decoration assets loading from /assets/decor/ folder.
> - Improved measuring tool UI by centering instructions at the bottom.
> - Added real-time cursor coordinate tracking to the measuring tool.
> - Updated version to 2.6.0.

**Aguardando autorização `Y` para a implementação.**

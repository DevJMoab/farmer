# Planejamento do Projeto FARMER
**Data e Hora:** 28 de Março de 2026, 22:45 BRT
**Versão:** 2.1.0

## 1. Visão Geral Biográfica
Esta atualização consolida a mudança do antigo modelo estático em HTML para o formato tático e interativo (*Grand Strategy*). Retomando o que foi desenvolvido logo em seguida da migração para o React, percebeu-se a necessidade de transformar a tela principal em um grande mapa com interação livre através do mouse.

## 2. Padrão de Versionamento (SemVer) Atualização
A versão subiu para a **MINOR 2.1.0**. Novas funcionalidades massivas de front-end nativo interativo (Sem quebrar a infraestrutura V2 do vite).
- **2.1.0:** Inclusão de Drag-n-Drop tático para construções, Hook robusto de Zoom/Pan do mapa. Refinamento de controles UI (Troca de textos para ícones minimalistas e slider para redimensionamento). 

## 3. Resumo Temático do Desenvolvimento (Status Phase 2 Ocorrendo)

### 3.1. Reconstrução Espacial (`frontend-specialist`)
- O Container principal de visualização recebeu os eventos OnWheel, OnMouseUp, OnMouseDown e permitiu o arrasto contínuo da câmera livre pelo terreno.
- As "Sidebars" originais viraram caixas transparentes (glassmorphism) e flutuantes para não quebrar a imersão.
- Retirou-se o indicador numérico e botões fixos de escala (Zoom Bar inferior).

### 3.2. Mecânica de Planta de Construção (`game-developer` e `ux-designer`)
- **Placement System:** As construções deixaram de ser embutidas em local hardcoded. Os prédios entram ao redor do mouse em modo translúcido (preview), e após o clique aguardam no terreno final com um tooltip.
- **UI do Tooltip Customizável:** Substituímos os gigantescos botões por ícones minimalistas e claros: (✕ Cancelar | ✥ Reposicionar | ✓ Fixar Local).
- O controle de tamanho passou a usar um deslize simples (`<input type="range" />`) acelerando muito a configuração do cenário pelo usuário.

## 4. Próxima Fronteira Base (Planejamento Atual)
Deixando o sistema de HUD polido, a arquitetura deve rumar para as logísticas core do jogo da fazenda:
1. **Game Loop (Clima e Relógio Real):** Fazer a temperatura e os dias evoluírem. Propagar essas informações globais em componentes filhos sem poluir a árvore.
2. **Sistema Econômico (Estatísticas Ativas):** Centralizar os fundos ($16.000.000) de modo que cada compra seja lida e validada antes de o tooltip deixar o usuário implantar, reduzindo o caixa instantaneamente.
3. **Responsividade Mobile Universal:** Garantir que todos os modais fiquem tocáveis na tela dos celulares (`touch-events`).

## 5. Critérios de Validação Futuros
- O Header deverá exibir os `props` que vêm do contêiner mestre (`App.jsx`).
- O deslize do tamanho não pode conflitar com o arrasto natural do mapa.

---
### Mensagem Sugerida para o Commit (GitHub)
```text
feat: aprimora mecânica tycon do HUD e adiciona suporte nativo do mapa

- Remove barras coloridas solidas substituido por visao focada no terreno.
- Insere modal flutuante de construcao, com controles esteticos via icones 
  de confirmacao (check), recusa (x) e movimentacao (setas).
- Modifica redimensionamento do preview pra usar input range (slider fluid).
- Documenta planos v2.1.0 prevendo motor de ciclo dia/noite logico.
```

# Plano de Correção da UI Mobile - Versão 2.11.1
**Data**: 04/04/2026
**Hora**: 12:49

## Prompt Reescrito e Corrigido
"Os botões sumiram no modo mobile. Preciso que você corrija esse erro, garantindo que todos os botões de interação (Construção, Medição, Demolição, Compra de Terreno, Tarefas, Alertas, Loja e Configurações) estejam visíveis e funcionais em dispositivos móveis, mantendo a responsividade. Levando em consideração que muitos celulares tem uma barra de navegação na parte inferior, os botões não devem ficar sobrepostos a ela"

## Sugestão de Mensagem de Commit
`fix(ui): unify mobile sidebars into a single bottom dock to fix visibility issues v2.11.1`

## Arquivos e Linhas Editadas

### [App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Linhas 1058-1140**: As duas `aside` atuais (esquerda e direita) serão ocultadas em telas pequenas (`hidden sm:flex`).
- **Nova Seção**: Será adicionada uma nova `aside` exclusiva para mobile (`flex sm:hidden`) no final do arquivo (antes dos modais) que agrupa todos os 8 botões em uma dock inferior centralizada e elegante.

## Mudanças Propostas

### 1. Unificação da HUD Mobile
- Atualmente, as duas barras laterais competem por espaço no rodapé do mobile, o que causa sobreposição e desaparecimento de botões em telas estreitas.
- Solução: Criar um container único `fixed bottom-4 left-1/2 -translate-x-1/2` para mobile.
- Este container usará `grid grid-cols-4 gap-2` ou `flex flex-wrap` para garantir que os 8 botões caibam perfeitamente.

### 2. Ajuste de Escala
- Como solicitado anteriormente, os ícones no mobile serão ligeiramente menores para não obstruir a visão do jogo.

## Plano de Verificação
- **Desktop**: Validar que as barras laterais continuam nas posições originais (esquerda e direita).
- **Mobile**: Validar que os 8 botões aparecem na dock inferior e que todos abrem seus respectivos modais/modos.

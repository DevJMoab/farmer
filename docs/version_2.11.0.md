# Plano de Reorganização da UI - Versão 2.11.0
**Data**: 04/04/2026
**Hora**: 12:41

## Prompt Reescrito e Corrigido
"Gostaria de trabalhar no reposicionamento dos itens de interação da tela. O campo de dinheiro, trabalhadores, estações e o controle de tempo (avançar e pausar) devem ser reorganizados em uma 'barra de cabeçalho' (header) no topo da tela, de forma elegante e funcional, com suporte a design responsivo.

No modo mobile, utilize ícones menores. O ícone da estação deve ficar junto à temperatura no canto superior direito, com os botões de controle de tempo posicionados ao redor dele. Ao clicar no ícone da estação, as informações de 'dia' e 'estação' devem ser exibidas; ao clicar fora, elas devem sumir.

Quanto aos botões laterais:
- À esquerda: Construção, Medição, Demolição e Compra de Terreno.
- À direita: Tarefas (antigo 'Relatórios'), Alerta, Loja e Configurações.

A ferramenta de medição deve exibir suas informações/instruções diretamente no header quando estiver ativa. O botão de tarefas abrirá, futuramente, um popup com as atividades a serem realizadas."

## Sugestão de Mensagem de Commit
`feat(ui): reorganize header and sidebars for better accessibility and mobile experience v2.11.0`

## Arquivos e Linhas Editadas

### [Header.jsx](file:///c:/DEV/farmer/src/components/Header.jsx)
- **Linhas 1-98**: Reestruturação completa do componente para suportar a barra unificada, novos estados para exibição de info no mobile (clique no ícone da estação) e integração das instruções da ferramenta de medição.

### [App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Linhas 1057-1131**: Reorganização dos botões nos componentes `aside` (esquerda e direita).
- **Linhas 1174-1185**: Remoção do componente de instruções flutuante da ferramenta de medição (movido para o Header).

## Mudanças Propostas

### 1. Novo Header Unificado
- Design minimalista e elegante com `backdrop-blur`.
- Ordem: Dinheiro | Trabalhadores | [Espaço para Medição] | Clima + Tempo.
- **Mobile**: Lógica de "Expandir ao clicar" no ícone da estação para mostrar os detalhes da data.

### 2. Sidebars Rebalanceadas
- **Esquerda**: Foco em ferramentas de edição de mundo (Construir, Medir, Demolir, Comprar).
- **Direita**: Foco em gestão e sistema (Tarefas, Alertas, Loja, Configurações).

### 3. Integração do Medidor
- As coordenadas e instruções do medidor serão exibidas no centro do Header quando a ferramenta estiver ativa, limpando a tela principal.

Data: 2026-04-02
Prompt Original do Usuário:
"o botao redimensionar quero que coloque o icone das setas para os quatro lados. quando habilita o modo de edição segurando o click por 2s, a construção precisa ficar no modo 'fantasma'. o botao de espelhamento, quero que fique no tamanho dos outros botoes abrindo mais espaço para o input das camadas."

---

## Sugestão de Mensagem de Commit
`chore: edit menu ui polish - move icon, flip button size, layer section expanded (SemVer 2.10.2)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Botão Mover:** Ícone `✥` com layout idêntico aos outros botões de ação (`w-12 h-12`). Remove texto "Mover/Reposicionar" — apenas ícone.
- **Botão Espelho:** Largura fixa `w-12` (não mais `flex-1`), mesmo padrão visual dos demais.
- **Seção Camada:** Expandida com `flex-1`, valor do Z-Index centralizado com mais espaço disponível.

---

## Explicação das Alterações
1. **Consistência Visual:** Todos os botões de ação do menu de edição agora seguem o mesmo design system.
2. **Densidade de Informação:** A seção de Camada ganhou mais espaço, facilitando a leitura do valor.

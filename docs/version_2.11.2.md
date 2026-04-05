# Plano de Refatoração do Header (Glassmorphism e Bordas Livres) - Versão 2.11.2

**Data**: 04/04/2026
**Hora**: 17:55

## Prompt Reescrito e Corrigido
"O fundo dos componentes do header pode ser em glassmorphism, sem usar uma barra inteira. Se puder colocar ainda mais colado para cima e para os lados, vou gostar ainda mais. Não esqueça do que foi pedido nas anotações de formatação e versionamento de plano."

## Sugestão de Mensagem de Commit
`feat(ui): apply isolated glassmorphism to header components and push to screen edges v2.11.2`

## Arquivos e Linhas Editadas

### [Header.jsx](file:///c:/DEV/farmer/src/components/Header.jsx)
- **Linhas 42-46**: Remoção do padding remanescente no principal `<header>` (de `p-2` para `p-0 sm:p-1`). Remoção dos recuos laterais (como `pl-4` e `pr-2`) nas divs filhas, permitindo ficar colado na beirada.
- **Linhas 48 e 56**: Atualização do "Dinheiro" e "Trabalhadores" transformando a classe atual de fundo fraco (`bg-white/5`) numa verdadeira pílula de glassmorphism individual (`bg-black/50 backdrop-blur-md shadow-xl border border-white/10`).
- **Linhas 80 e 116**: Atualização dos "Controles de Tempo" e da "Estação/Clima" para o mesmo estilo de glassmorphism denso (`bg-black/50 backdrop-blur-md`), mantendo o arredondamento (`rounded-full`) independente.

## Análise (project-planner)
O objetivo principal é destruir totalmente a barra horizontal coesa e substituí-la por "pílulas" voadoras e transparentes (glassmorphism individual). As pílulas serão ancoradas em coordenadas absolutas nos extremos vértices (`top-left` e `top-right`), permitindo uma maximização insana da área de gameplay ao cento e nas laterais da header.

## Fase Seguinte
Na Fase 2 (Implementação), a especialidade Frontend irá alterar as classes TailWind diretamente.

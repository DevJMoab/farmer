Data: 2026-04-02 19:10:00
Prompt Original do Usuário Corrigido:
"Continuar com a evolução do projeto, focando na aplicação das escalas de construção definidas no arquivo de comentários e em melhorias na experiência de posicionamento e edição isométrica."

---

## Sugestão de Mensagem de Commit
`feat: implement individualized building scales and isometric z-indexing (SemVer 2.10.0)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Linhas 23-53 (Configurações):** Adição da constante `BUILDING_CONFIG` com escalas dinâmicas e extensões de arquivo mapeadas do `comentarios.txt`.
- **Linhas 56 (Helper):** Implementação da função `calculateIsometricZIndex(y)` para profundidade automática.
- **Linhas 118-125 (Posicionamento):** Melhoria no `handleBuildInitiate` para carregar a escala inicial proporcional ao tipo de construção.
- **Linhas 186-200 (Gravação):** Cálculo automático de Z-Index no momento da construção definitiva.
- **Linhas 410-425 (Edição):** Atualização dinâmica da profundidade (Z-Index) ao reposicionar itens no mapa.
- **Linhas 547, 587, 725 (Renderização):** Suporte flexível a arquivos `.png` e `.svg` baseado na configuração por ID.
- **Linhas 875-900 (UI de Edição):** Inclusão do botão de **Demolir** (🗑️) com confirmação nativa.

### [src/components/BuildingsModal.jsx](file:///c:/DEV/farmer/src/components/BuildingsModal.jsx)
- **Linhas 57-60:** Ajuste na lógica de thumbnails para suportar extensões mistas (.svg para sede/silo, .png para os demais).

---

## Explicação das Alterações
1. **Escalas Customizadas:** Cada construção agora respeita a proporção visual solicitada (ex: Silo ocupa menor área relativa que o Celeiro).
2. **Z-Index Isométrico Automático:** O sistema organiza a profundidade visual baseado na posição vertical (Y), garantindo que construções "mais ao fundo" sejam corretamente cobertas pelas "da frente".
3. **Gestão de Assets:** Compatibilidade garantida entre arquivos vetoriais e bitmaps no motor de renderização.
4. **Remoção Facilitada:** O menu de edição agora permite destruir a estrutura selecionada sem precisar sair do modo de edição.

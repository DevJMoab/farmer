# Plano de Versão - 2.8.8
**Data e Hora:** 2026-04-01 08:02:00 (Horário de Brasília)

## 📝 Registro do Prompt Original (Corrigido)
> "Agora que o cursor mudou de tamanho, gostaria que ele fosse reduzido em 30%. Além disso, ao pressionar a tecla ESC, o modo de demolição deve ser desativado automaticamente."

---

## 🛠️ Detalhes da Implementação (SemVer: PATCH)

### 1. Refinamento do Cursor Customizado
- **Ação:** Reduzir o tamanho do elemento `CustomCursor` no `App.jsx`.
- **Cálculo:** De 64px para 45px (redução de ~30%).
- **Efeito:** Melhor precisão visual sem perder o destaque conquistado na versão anterior.

### 2. Controle de Estado via Teclado
- **Ação:** Implementar um listener de evento `keydown` no `window`.
- **Lógica:** Se `event.key === 'Escape'`, disparar `setGameState` para desligar o `isDemolitionMode`.
- **Melhoria UX:** Permite sair rapidamente de ferramentas de edição/demolição sem precisar clicar no botão lateral.

---

## 📂 Arquivos e Linhas Editadas

### [App.jsx](file:///d:/---%20DEV%20---/farmer/src/App.jsx)
- **Linhas 369 a 378:** Implementação do `useEffect` para escutar a tecla 'Escape' e desativar o modo de demolição (Função: UX/Acessibilidade).
- **Linhas 391 e 392:** Alteração dos valores de `width` e `height` de 64px para 45px para reduzir o tamanho do cursor em ~30% (Função: Redimensionamento visual).
- **Linha 381:** Adição de classe condicional `cursor-none` vinculada ao estado global para ocultar o ponteiro nativo.

---

## 🚀 Sugestão de Commit
`refactor: scale down custom cursor and add ESC shortcut v2.8.8`

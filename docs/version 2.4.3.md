# Plano de Desenvolvimento — FARMER v2.4.3
**Data e Hora:** 30 de Março de 2026, 11:21 BRT
**Versão Alvo:** 2.4.3 (PATCH — Centralização da estrada e adensamento florestal)

---

## 1. Escopo das Modificações

| # | Alteração | Motivo e Implementação |
|---|-----------|------------------------|
| 1 | Centralização Matemática da Estrada | O usuário pediu que a estrada cresça isotropicamente (igualmente para os dois lados) a partir do Ponto Zero (`left:655, top:230`). O loop atual (-7 a +60) é assimétrico; o novo será simétrico: de `-30 a +30`. |
| 2 | Limpeza de Assets Órfãos | Foram deletados da pasta os assets `bush`, `rock`, `hay`, `flower` e `fence`. Manter referências a eles geraria poluição no console. O WorldDecor será atualizado para focar APENAS nas árvores. |
| 3 | Adensamento Florestal | Aumentar drasticamente o número de árvores usando as recém-criadas `tree.svg`, `tree2.svg` e `tree3.svg` para criar matas fechadas e florestas contornando a região da estrada e bordas do mapa. |

---

## 2. Detalhamento - WorldDecor (Florestamento)

Com a limpa de assets, agora vamos nos concentrar em criar uma fronteira de floresta usando as 3 espécies de árvores que o usuário criou:
- **tree.svg** (Espécie 1 - tamanho 70-80)
- **tree2.svg** (Espécie 2 - tamanho 65-75)
- **tree3.svg** (Espécie 3 - tamanho 55-65)

Vamos posicionar cerca de **45 a 55 árvores** contornando os 4 cantos do mapa (Noroeste, Nordeste, Sudoeste e Sudeste), criando um aspecto de borda florestal natural que deixa a faixa central e a estrada livres.

---

## 3. Arquivos a Alterar

| Arquivo | Ação |
|---------|------|
| `src/components/WorldRoad.jsx` | Alterar o iterador do for loop para `i = -30` até `i <= 30` |
| `src/components/WorldDecor.jsx` | Reescrever matriz `DECOR_ITEMS`, aumentar número de objetos e usar somente tree, tree2 e tree3 |
| `docs/version 2.4.3.md` | Este plano |

---
### Commit Sugerido
```text
feat(v2.4.3): road cresce isotropicamente e aumenta densidade florestal com 3 tipos de arvores
```

# Plano de Desenvolvimento — FARMER v2.3.1
**Data e Hora:** 28 de Março de 2026, 23:50 BRT
**Versão Alvo:** 2.3.1 (PATCH — Substituição de assets 2D por assets em perspectiva isométrica)

---

## ⚠️ Contexto e Problema Identificado

Na versão 2.3.0, os assets de decoração foram criados como SVGs 2D simples (top-view plano). O jogo utiliza uma perspectiva isométrica/inclinada (como visto nos arquivos E.png, E1.png em `assets/`). Isso cria uma **inconsistência visual grave**: elementos decorativos achatados num cenário tridimensional.

---

## 1. Diagnóstico

| Item | Status | Problema |
|------|--------|---------|
| `tree.svg` | ❌ Incorreto | Vista superior 2D, não combina com perspectiva do jogo |
| `bush.svg` | ❌ Incorreto | 2D plano |
| `rock.svg` | ❌ Incorreto | 2D plano |
| `flower.svg` | ❌ Incorreto | 2D plano |
| `hay.svg` | ❌ Incorreto | 2D plano |
| `WorldDecor.jsx` | ⚠️ Lógica OK | Sistema correto, só precisa de novos assets |
| `WorldRoad.jsx` | ✅ Correto | Estrada em perspectiva funciona bem |

---

## 2. Solução

### Opção A — Assets do Icograms.com *(preferencial)*
- Verificar se é possível extrair SVGs da galeria pública do icograms.com
- O site usa perspectiva isométrica que combina com o estilo do jogo
- Se acessível: baixar ~10 a 20 itens de natureza (árvores, pedras, arbustos, cercas, etc.)

### Opção B — Assets Fornecidos pelo Usuário *(fallback)*
- O usuário coloca os assets diretamente em `public/assets/decor/`
- Nomear seguindo o padrão: `tree_iso.png`, `bush_iso.png`, `rock_iso.png`, etc.
- O sistema `WorldDecor.jsx` está pronto para aceitar qualquer imagem nova

---

## 3. Mudanças Técnicas Planejadas (após assets disponíveis)

| # | Arquivo | Ação |
|---|---------|------|
| 1 | `public/assets/decor/*.svg` ou `*.png` | Trocar assets 2D por isométricos |
| 2 | `src/components/WorldDecor.jsx` | Ajustar tamanhos base para o novo formato |
| 3 | `docs/version 2.3.1.md` | Registrar alteração |

---

## 4. Próxima Ação Necessária (Aguardando Confirmação do Usuário)

> **PERGUNTA:** Conseguimos verificar se o icograms.com permite baixar assets sem login.
> 
> - **Se sim**: colocarei os assets corretos automaticamente.
> - **Se não**: coloque os assets de perspectiva na pasta `public/assets/decor/` com os nomes que desejar, e eu atualizo o `WorldDecor.jsx` para utilizá-los.

---

### Estados dos Sistemas Ativos
| Sistema | Versão | Status |
|---------|--------|--------|
| Motor de Tempo | v2.2.0 | ✅ Ativo |
| Motor de Economia | v2.2.0 | ✅ Ativo |
| Efeitos Climáticos | v2.2.0 | ✅ Aleatórios |
| Placement + Z-Index | v2.3.0 | ✅ Ativo |
| Estrada E–W | v2.3.0 | ✅ Ativa |
| Decorações | v2.3.0 | ⚠️ Assets 2D (a substituir) |

---

### Commit Sugerido (após resolução)
```text
fix(v2.3.1): substitui assets 2D por perspectiva isométrica

- Remove SVGs flat (tree.svg, bush.svg, rock.svg, flower.svg, hay.svg)
- Insere assets em perspectiva isométrica compatíveis com visual do jogo
- Ajusta tamanhos base em WorldDecor.jsx para nova proporção dos assets
```

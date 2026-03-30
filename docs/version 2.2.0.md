# Plano de Desenvolvimento — FARMER v2.2.0
**Data e Hora:** 28 de Março de 2026, 23:10 BRT
**Versão Alvo:** 2.2.0 (MINOR — grandes funcionalidades novas, sem quebra de retrocompatibilidade)

---

## 1. Escopo do Sprint

### Funcionalidades a Implementar

| # | Feature | Agente Responsável | Prioridade |
|---|---------|-------------------|------------|
| 1 | Vinheta (Vignette) na tela | `frontend-specialist` | Alta |
| 2 | Motor de Economia (deducao real de moedas ao confirmar) | `game-developer` | Alta |
| 3 | Motor de Tempo (relógio automatico avancando data e temperatura) | `game-developer` | Alta |
| 4 | Mudanca de Estacao via clique + Efeitos Climáticos (Chuva, Neve, Primavera) | `frontend-specialist` + `game-developer` | Alta |
| 5 | Responsividade Mobile (ajuste de HUD e Modais) | `mobile-developer` | Média |
| 6 | Sistema de Setores (Terreno inicial delimitado + compra futura de fronteiras) | `game-developer` | Média |

---

## 2. Plano Técnico Detalhado

### 2.1 Vinheta de Tela
- Adicionar um `<div>` fixo com `pointer-events-none`, `position: absolute, inset: 0`, e `background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)`.
- Ela estará sempre no topo de tudo, `z-index: 100`, sem bloquear cliques.

### 2.2 Motor de Economia
- Em `App.jsx`, o `handleBuildInitiate(buildingId)` terá um novo parâmetro: `cost`.
- Ao chamar `confirmPlacement()`, o custo será deduzido de `gameState.money` usando `setGameState`.
- Na `BuildingsModal`, cada edificio terá seu custo numérico (ex: `cost: 16897.26`).
- O Header exibirá o valor formatado atualizado instantaneamente.

### 2.3 Motor de Tempo
- Usar `useEffect` com `setInterval` em `App.jsx`.
- A cada X milissegundos (velocidade ajustável para teste), avança 1 dia no jogo.
- A data evolui dia a dia. As estacões:
  - Primavera: Março–Maio
  - Verão: Junho–Agosto
  - Outono: Setembro–Novembro
  - Inverno: Dezembro–Fevereiro
- A temperatura varia conforme a estação (min/max aleatório dentro de faixa).
- O clique no ícone de estação avança manualmente para a próxima (modo teste).

### 2.4 Efeitos Climáticos por Estação
- Criar componente `WeatherEffect.jsx`.
- Usa `position: absolute, inset: 0, pointer-events-none, z-index: 60`.
- Cada estação tem efeito CSS animado:
  - **Verão:** Tela clara, sem efeito base. Ao final da estação (Agosto): partículas de chuva intensa.
  - **Outono:** Overlay laranja sutil. Chuva no início da estação (Setembro).
  - **Inverno:** Flocos de neve CSS animados com `@keyframes snowfall`.
  - **Primavera:** Partículas de pétalas de cores rosa/branco + brilho suave na tela (brightness).
- As partículas são `<div>` absolutas geradas por `Array.from({length: N})` com `Math.random()` para posição e atraso.

### 2.5 Responsividade Mobile
- Header: Os dois grupos do Header (esquerdo/direito) viram `flex-col` em `<sm` com tamanho reduzido.
- Asides flutuantes: Em mobile, se reposicionam para a borda inferior (dock estilo iOS) em vez de laterais.
- BuildingsModal: `max-h-[85vh]` com `overflow-y-auto`.
- Touch events para Pan no Mapa: Suporte a `onTouchStart`, `onTouchMove`, `onTouchEnd`.

### 2.6 Sistema de Setores de Terreno
- Remover a imagem `E0.png` como fundo. O fundo agora sera a cor `#99cc33` pura.
- Definir Setor Inicial como uma zona delimitada centralizada no mapa.
- Representar o setor como um `<div>` com `border-dashed border-2 border-white/40`, posicionado absolutamente no centro.
- O sistema de colisão verificará se `previewPlacement.x` e `previewPlacement.y` estão dentro dos limites do setor.
- Se tentar construir fora: exibe toast de erro "Compre este terreno para construir aqui!".
- Componente `LandSector.jsx`: exibe os setores adjacentes como tiles com botão "Comprar" que deduz o custo do terreno de `gameState.money`.

---

## 3. Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/App.jsx` | Motor de tempo, economia, setores, integração geral |
| `src/components/Header.jsx` | Props climáticas, clique em estação, responsividade |
| `src/components/WeatherEffect.jsx` | **NOVO** — Efeito visual de clima por estação |
| `src/components/LandSector.jsx` | **NOVO** — Grade de setores compráveis |
| `src/components/BuildingsModal.jsx` | Custo numérico real em cada edificio |
| `src/index.css` | Keyframes para neve, chuva, pétalas |
| `docs/version 2.2.0.md` | **NOVO** — Documentação deste sprint |

---

## 4. Critérios de Aceitação

- [ ] Vinheta visível nas bordas da tela em todos os modos.
- [ ] Moedas diminuem corretamente ao gravar local de uma construção.
- [ ] Data avança automaticamente e temperatura muda por estação.
- [ ] Chuva animada aparece no final do Verão e início do Outono.
- [ ] Neve CSS animada funciona no Inverno.
- [ ] Primavera tem efeito visual de pétalas/brilho.
- [ ] Layout da sidebar move para baixo em viewport < 640px.
- [ ] Construir fora do setor exibe feedback de erro.
- [ ] Botão "Comprar Terreno" nos setores adjacentes deduz o custo.

---

## 5. SemVer

- Esta versão é **2.2.0** pois adiciona múltiplos sistemas sem quebrar a arquitetura existente.
- Commit sugerido ao final do sprint abaixo.

---

### Mensagem Sugerida para o Commit

```text
feat(v2.2.0): motores de economia e tempo, efeitos climáticos e setores de terreno

- Adiciona vinheta (vignette) em todas as telas do jogo
- Economia: dedução real de moedas ao confirmar construção
- Motor de tempo: data e temperatura avançam automaticamente
- Estações changeáveis via clique + efeitos visuais animados (chuva, neve, pétalas)
- Responsividade Mobile: sidebar dock inferior e touch pan no mapa
- Sistema de Setores: terreno inicial delimitado + expansão via compra
- Documenta plano v2.2.0 para rastreamento de sprint
```

# Plano de Desenvolvimento — FARMER v2.4.1
**Data e Hora:** 30 de Março de 2026, 10:20 BRT
**Versão Alvo:** 2.4.1 (PATCH — Hotfix Infinite Loop)

---

## ⚠️ Problema Crítico (Crash do Navegador)

**Causa do Travamento:** 
O browser estava travando e a tela ficava branca porque o código encalhou em um **Loop Infinito** no arquivo `WorldRoad.jsx`.
No trecho:
```javascript
let startIdx = 0;
while (ANCHOR.left + (startIdx + 1) * (-DELTA_X) < 1020 + ROAD_W) {
  startIdx--; 
}
```
O erro de sinal na matemática fez com que a condição `(startIdx + 1) * 120` ficasse cada vez mais *negativa*, e portanto sempre menor que `1020 + ROAD_W`. O loop nunca acabava travando a renderização do React 18 e do Vite.

## Solução (Hotfix Imediato)

1. **Remover o `while` matemático dinâmico** que calcula limites com base no `1020px`.
2. Como o mapa tem um tamanho base previsível (1020x1020px), podemos simplesmente iterar um range de tiles fixo e seguro (ex: do índice `-8` ao índice `12`).
3. 20 iteradores rodando são inofensivos para a performance e **100% à prova de falhas** e travamentos.

## Ação

1. Substituir a geração de memória (`useMemo`) em `WorldRoad.jsx` por um loop estatístico forçado de -10 a 15.
2. Salvar o arquivo e aguardar o Vite realizar o HMR (Hot Module Replacement), o que destravará a tela imediatamente.

---
### Commit Sugerido
```text
hotfix(v2.4.1): resolve infinite loop no cálculo do WorldRoad que travava a aplicação
```

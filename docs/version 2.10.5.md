Data: 2026-04-02
Prompt Original do Usuário:
"as areas tracejadas estão em forma de quadrado 2d, preciso que eles fiquem em perspectiva. a animação de demolição está balançando demais, diminuir a frequência."

---

## Sugestão de Mensagem de Commit
`feat: isometric terrain svg polygons, demolition animation smoother (SemVer 2.10.5)`

---

## Alterações Realizadas

### [src/App.jsx](file:///c:/DEV/farmer/src/App.jsx)
- **Limites de Terreno — SVG Isométrico:** Os divs retangulares foram substituídos por um overlay SVG com polígonos em formato de losango (rhombus/diamante), simulando a perspectiva isométrica do mapa.
  - Terreno central (adquirido): polígono verde tracejado — pontos `50,15 → 85,42 → 50,85 → 15,42`
  - Terrenos Norte, Sul, Leste, Oeste: polígonos brancos translúcidos complementando o losango central
  - `viewBox="0 0 100 100"` + `preserveAspectRatio="none"` para escalar com o mapa
- **Versões retroativas:** Documentados `version 2.10.1.md` até `version 2.10.4.md`

### [src/index.css](file:///c:/DEV/farmer/src/index.css)
- **Animação de demolição:** Duração aumentada de `0.25s` para `0.7s` nas classes `.hover-demolish` e `.hover-demolish-building`.
- **Amplitude reduzida:** Ângulos de rotação diminuídos de `±1.5deg` para `±1deg` e `±0.7deg`.

---

## Explicação das Alterações
1. **Perspectiva Isométrica:** O SVG com `preserveAspectRatio="none"` se adapta ao mapa 1020x1020, e os losangos são definidos em coordenadas percentuais (`viewBox 0 0 100 100`). O resultado visual é um grid de terrenos que seguem a perspectiva do mundo do jogo.
2. **Demolição Suave:** `0.7s` de ciclo (era `0.25s`) + menor amplitude → balançar sutil e elegante, não frenético.

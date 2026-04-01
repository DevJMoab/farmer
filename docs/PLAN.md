# Multi-Agent Orchestration Plan: v2.8.0 - Demolition & Refinement

## 1. Task Objective
Implement version 2.8.0 focusing on map maintenance and UI precision.
- **Strict Tree Height**: Enforce a 75px maximum height for native trees.
- **Topmost Measurement**: Ensure the measurement tool is never hidden by game objects.
- **Demolition System**: Introduce a tool to remove buildings and native trees.

## 2. Discovery & Technical Strategy
- **Trees**: `WorldDecor.jsx` uses `width` for sizing. Since nature isn't square, tall SVGs are exceeding 75px height. 
  - *Fix*: Set `height` style to the random size and cap with `max-height: 75px`.
- **Z-Index**: Measurement tool is currently at `z-[160]`. High-positioned buildings or future UI might clash.
  - *Fix*: Move to `z-[1000]`.
- **Demolition**:
  - *State*: `isDemolitionMode: boolean` + `removedNativeIds: string[]`.
  - *UI*: Button in `App.jsx` (left sidebar). Icon: `tractor.svg` or a custom "conveyor with loader" emoji/icon.
  - *Interaction*: When active, cursor changes to `crosshair` or `url('/assets/icons/remove.cur')`. Clicking an object triggers removal.

## 3. Implementation Steps (Phase 2)

### A. Frontend Specialist (UI & Flow)
1. **App.jsx**:
   - Add `isDemolitionMode` state.
   - Implement `handleDemolish(type, id)` function.
   - Add the Demolition Button to the sidebar.
   - Update measurement tool `z-index` to `1000`.
2. **WorldDecor.jsx**:
   - Change `width: px` to `height: px` + `max-height: 75px` + `width: auto`.
   - Accept `removedIds` prop and filter `DECOR_ITEMS`.
   - Enable `pointer-events: auto` only when `isDemolitionMode` is true.

### B. Project Planner / Technical Lead
- Ensure that removing native trees doesn't cause a re-render performance hit for the procedural generation (keep using `useMemo`).
- Verify building removal logic doesn't break indices.

### C. Test Engineer
- Verify height of `tree2.svg` and `tree3.svg` stays within 75px bounds.
- Test demolition of native trees in dense clusters.
- Confirm measurement lines stay visible over the tallest buildings.

---
## Approval
**Awaiting user response to Socratic questions and approval (Y/N).**

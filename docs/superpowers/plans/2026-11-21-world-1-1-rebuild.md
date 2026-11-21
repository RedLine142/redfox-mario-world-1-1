# RED FOX World 1-1 Reconstruction — Implementation Plan

> **For agentic workers:** Execute inline with test-driven development. Steps use checkbox syntax.

**Goal:** Replace the approximate platformer with a deterministic, testable reconstruction of the recognizable Super Mario Bros. World 1-1 gameplay flow while preserving the single-script site embed.

**Architecture:** Keep `redfox-mario-embed.js` as the only script referenced by the site. It loads a same-version `mario-core.js` from jsDelivr, then renders custom pixel art and UI. The core is a dependency-free UMD module so the same real simulation can be tested with Node's built-in test runner.

**Tech Stack:** Browser Canvas 2D, plain JavaScript, Node.js built-in `node:test`.

**Spec:** Conversation requirements: World 1-1 (1985) as the reference; custom recolored art; no Replit; preserve `#pp-mario-game` and the site's embed pattern.

## Global Constraints
- No backend, build step, package dependency, or Replit.
- Existing HTML target remains `#pp-mario-game`.
- Embed remains one external script; the embed script loads core from its own versioned CDN directory.
- Original-style mechanics and level sequence; custom pixel artwork and no extracted Nintendo assets/audio.
- Keyboard and touch controls; responsive canvas with pixelated rendering.
- Do not claim full frame-perfect ROM accuracy; test observable mechanics and level landmarks.

## Review Focus
- Repeated script injection must not mount duplicate games.
- Large Mario must not become trapped when changing height under a ceiling.
- Falling into pits and touching enemies must consume lives predictably.
- Touch buttons must release keys even when pointer interaction ends outside the button.
- CDN core-load failure must show a useful in-game error rather than a blank area.

---

### Task 1: Deterministic simulation core

**Files:**
- Create: `mario-core.js`
- Test: `tests/mario-core.test.js`

**Interfaces:**
- `createGame()` returns initial simulation state.
- `stepGame(game, input, frames = 1)` advances deterministic simulation.
- `getLevelData()` returns immutable level geometry and entity placements.

- [ ] Write tests for initial spawn/level landmarks, running acceleration and jump arc, solid-tile collision, question-block reward exactly once, stomp vs side-hit, mushroom growth, pit death, and flagpole completion.
- [ ] Run `node --test tests/mario-core.test.js`; confirm missing module/API failures.
- [ ] Implement the smallest core API satisfying those behaviors, with a tile-authored World 1-1 sequence and deterministic fixed-step simulation.
- [ ] Re-run tests and record results.

### Task 2: Browser embed and rendering

**Files:**
- Replace: `redfox-mario-embed.js`

**Interfaces:**
- Loads `mario-core.js` from the same CDN version path as the embed script.
- Mounts once into `#pp-mario-game`.
- Renders the core state without owning gameplay rules.

- [ ] Add a browser smoke harness for mount, canvas creation, input binding and core-load failure handling.
- [ ] Verify the harness fails before the embed implementation.
- [ ] Implement renderer, custom sprite palette, HUD, start/end overlays, keyboard controls, and pointer-safe touch controls.
- [ ] Run core tests and browser smoke checks.

### Task 3: Integration review and publish

**Files:**
- Modify: `README.md`

- [ ] Review all embed/core interfaces and CDN path resolution.
- [ ] Run the complete test suite and syntax checks.
- [ ] Publish files to main using fresh blob SHAs and report exact commit-pinned embed URL plus ready-to-paste site HTML.

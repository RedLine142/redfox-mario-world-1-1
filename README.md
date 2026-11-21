# RED FOX — World 1-1 Arcade

A browser-embedded, side-scrolling reconstruction of the recognizable World 1-1 route from the 1985 NES platform game, with original recolored pixel art and a dependency-free JavaScript simulation core.

## Embed on the RED FOX task page

Keep the existing `pp-mario-game` container. Use the version-pinned URL returned by the latest GitHub commit so the embed and its `mario-core.js` dependency always load from the same revision:

```html
<div id="pp-mario-game"></div>
<script src="https://cdn.jsdelivr.net/gh/RedLine142/redfox-mario-world-1-1@COMMIT_SHA/redfox-mario-embed.js"></script>
```

The embed script automatically loads `mario-core.js` from the same jsDelivr directory. No second script tag, backend, build process, or Replit project is required.

## Controls

- Left / Right arrows or A / D — move.
- Space, Up arrow, or W — jump; release and press again for a new jump.
- Shift or X — run.
- Z or C — throw a fireball after collecting a Fire Flower.
- Down arrow or S while standing on the third pipe — enter the underground bonus room.
- On touch devices, use the on-screen directional and action buttons.
- Escape — pause/resume.

## Included gameplay systems

- Scrolling overworld, ground gaps, pipes, block formations, stairs, flagpole and castle.
- Acceleration, run speed, gravity, variable jump height, tile collision and camera tracking.
- Question blocks, breakable bricks, hidden 1-Up, ten-coin brick, mushroom, Fire Flower and Starman.
- Goombas, one Koopa Troopa, shell kick/rolling behavior and fireballs.
- Third-pipe underground route with 19 collectible coins and return near the later pipe.
- Score, coins, lives and 400-second timer.

The simulation and layout are independently authored; this project does not include a ROM, extracted Nintendo sprites, or original game audio. It is a playable reconstruction, not a frame-perfect emulator of Nintendo's original executable.

## Tests

Run with Node.js 18 or newer:

```sh
node --test
```

The suite covers the simulation API and an embed-mount smoke test using a lightweight DOM/canvas test double.

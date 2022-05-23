<h1>Documentation of PixiJS Expansion</h1>

PIXI.input: Contains functionality for handling input

- keyMap: A map which stores keyboard keys as keys and a boolean value if getKeyFired() has been called for it yet.

- getKeyFired() returns true if this is the first time it has been called since the key has been pressed

- getKeyDown() returns true if the key is actively pressed down

PIXI.collision: Contains helpful collision math
- aabb() checks if the two provided objects are colliding with the aabb algorithm

PIXI.utils.openFullScreen(view) the element passed in (use app.view) will go fullscreen
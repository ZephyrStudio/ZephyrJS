# Documentation of PixiJS Expansion

## PIXI.input

PIXI.input.getKeyFired(keyStr): Returns boolean
 - Returns true if this is the first time it has been called since the key has been pressed.

PIXI.input.getKeyDown(keyStr): Returns boolean
 - Returns true if the key is actively pressed down.

## PIXI.collision

PIXI.collision.aabb(a, b): Returns boolean
 - Checks if the two provided objects are colliding with the aabb algorithm
 - NOTE: Both a and b are formatted as a javascript object with x, y, width, and height where (x,y) is the top-leftmost point.

## PIXI.utils

PIXI.utils.openFullScreen(view)
 - The element passed in (typically use the Application view) will attempt to go fullscreen

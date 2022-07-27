# Documentation of PIXI Expansion

## PIXI.input

PIXI.input.getKeyFired(keyString): Returns boolean
 - Returns true if this is the first time it has been called since the key has been pressed. **keyString** is e.code

PIXI.input.getKeyDown(keyString): Returns boolean
 - Returns true if the key is actively pressed down. **keyString** is e.code

PIXI.input.mouseContainer: [DOM Element]
 - Is used to scale the mouse's coordinates to the desired element.
 - USAGE: PIXI.input.mouseContainer = [DOM Element];

PIXI.getMouseFired(mouseButton): Returns boolean
 - Returns true if this is the first time it has been called since the button has been pressed.
 - NOTE: Mouse buttons are integers 0 (primary, typically left) 1 (middle), and 2 (secondary, typically right).

PIXI.getMouseDown(mouseButton): Returns boolean
 - Returns true if the button is actively pressed down.
 - NOTE: Mouse buttons are integers 0 (primary, typically left) 1 (middle), and 2 (secondary, typically right).

PIXI.getMouseX(): Returns number
 - Returns the last seen mouse X coordinate, where 0.0-1.0 is within the mouseContainer horizontally from left to right.

PIXI.getMouseY(): Returns number
 - Returns the last seen mouse Y coordinate, where 0.0-1.0 is within the mouseContainer vertically from top to bottom.

## PIXI.collision

PIXI.collision.aabb(a, b): Returns boolean
 - Checks if the two provided objects are colliding with the aabb algorithm
 - NOTE: Both a and b are formatted as a javascript object with x, y, width, and height where (x,y) is the top-leftmost point.

PIXI.collision.radius(a, b): Returns boolean
 - Checks if the two provided objects are colliding with the standard point-radius method of circle collision
 - NOTE: Both a and b are formatted as a javascript object with x, y, and r where (x,y) is the centermost point and r is the radius.

## PIXI.utils

PIXI.utils.openFullScreen(view)
 - The element passed in (typically use the Application view) will attempt to go fullscreen

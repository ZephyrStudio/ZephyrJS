"use strict"
// ZEPHYR.js directly builds on top of PixiJS for ease of use
PIXI.zephyr = "ZephyrJS version 22.7.14";

PIXI.input = {
    keyMap: new Map(),
    // getKeyFired returns true the first time it is called for a key while the key is down
    getKeyFired: (keyStr) => {
        let r = false;
        if (PIXI.input.keyMap.has(keyStr)) {
            r = PIXI.input.keyMap.get(keyStr)
            PIXI.input.keyMap.set(keyStr, false);
        }
        return r;
    },
    // getKeyDown returns true always if the key is down
    getKeyDown: (keyStr) => {
        if (PIXI.input.keyMap.has(keyStr)) {
            PIXI.input.keyMap.set(keyStr, false);
            return true;
        }
        return false;
    },
}

PIXI.collision = {
    aabb: (a, b) => { // Axis-Aligned Bounding Box method
        return !(
            a.x + a.width < b.x ||
            a.y + a.height < b.y ||
            a.x > b.x + b.width ||
            a.y > b.y + b.height
        );
    },
    radius: (a, b) => { // Circle collision
        return (
            Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) <= a.r + b.r
        );
    }
}

// https://www.w3schools.com/jsref/met_element_requestfullscreen.asp
PIXI.utils.openFullScreen = (view) => {
    if (view.requestFullscreen)
        view.requestFullscreen(); // Standard
    else if (view.webkitRequestFullscreen)
        view.webkitRequestFullscreen(); // Safari
    else if (view.msRequestFullscreen)
        view.msRequestFullscreen(); // IE11
}

// Keyboard
window.addEventListener('keydown', (e) => {
    PIXI.input.keyMap.set(e.key.toLowerCase(), true);
});
window.addEventListener('keyup', (e) => {
    PIXI.input.keyMap.delete(e.key.toLowerCase());
});

// Catches/Blocks right click
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log(PIXI.zephyr + " is extending Pixi!");
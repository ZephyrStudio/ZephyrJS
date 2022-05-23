"use strict"
// ZEPHYR.js directly builds on top of PixiJS for ease of use
PIXI.zephyr = "ZephyrJS version 22.5.23";

PIXI.input = {
    keyMap: new Map(),

    // getKeyFired returns true the first time it is called for a key while the key is down
    getKeyFired: (keyStr) => {
        let r = PIXI.input.keyMap.get(keyStr);
        PIXI.input.keyMap.set(keyStr, false);
        return r;
    },

    // getKeyDown returns true always if the key is down
    getKeyDown: (keyStr) => {
        return PIXI.input.keyMap.has(keyStr);
    },
}

PIXI.collision = {
    aabb: (a, b) => {
        return !(
            a.x + a.width < b.x ||
            a.y + a.height < b.y ||
            a.x > b.x + b.width ||
            a.y > b.y + b.height
        );
    },
}

// https://www.w3schools.com/jsref/met_element_requestfullscreen.asp
PIXI.utils.openFullScreen = (view) => { // w3schools <3
    if (view.requestFullscreen) {
        view.requestFullscreen();
    } else if (view.webkitRequestFullscreen) { /* Safari */
        view.webkitRequestFullscreen();
    } else if (view.msRequestFullscreen) { /* IE11 */
        view.msRequestFullscreen();
    }
}

// Keyboard
window.addEventListener('keydown', (e) => {
    PIXI.input.keyMap.set(e.key.toUpperCase(), true);
});
window.addEventListener('keyup', (e) => {
    PIXI.input.keyMap.delete(e.key.toUpperCase())
});

console.log(PIXI.zephyr + " is extending Pixi!");
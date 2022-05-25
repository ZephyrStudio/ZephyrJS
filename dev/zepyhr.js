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

    mouseMap: new Map(),
    getMouseFired: (btnStr) => {
        let r = PIXI.input.mouseMap.get(btnStr);
        PIXI.input.keyMap.set(btnStr, false);
        return r;
    },
    getMouseDown: (btnStr) => {
        return PIXI.input.mouseMap.has(btnStr);
    },
    getMouseX: () => {
        return PIXI.input.mouseMap.get('x');
    },
    getMouseY: () => {
        return PIXI.input.mouseMap.get('y');
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

// Mouse
window.addEventListener('mousemove', (e) => {
    PIXI.input.mouseMap.set('x', e.x / window.innerWidth);
    PIXI.input.mouseMap.set('y', e.y / window.innerHeight);
});
window.addEventListener('mousedown', (e) => {
    PIXI.input.mouseMap.set(e.button, true);
});
window.addEventListener('mouseup', (e) => {
    PIXI.input.mouseMap.delete(e.button);
});

// Catches/Blocks right click
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log(PIXI.zephyr + " is extending Pixi!");
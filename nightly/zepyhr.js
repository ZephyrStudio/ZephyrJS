"use strict"
PIXI.zephyr = "ZephyrJS version 22.7.27";

PIXI.input = {
    keyMap: new Map(),
    getKeyFired: (keyStr) => {
        if (PIXI.input.keyMap.size > 0 && PIXI.input.keyMap.get(keyStr)) {
            PIXI.input.keyMap.set(keyStr, false);
            return true;
        }
        return false;
    },
    getKeyDown: (keyStr) => {
        if (PIXI.input.keyMap.size > 0 && PIXI.input.keyMap.has(keyStr)) {
            PIXI.input.keyMap.set(keyStr, false);
            return true;
        }
        return false;
    },

    mouseContainer: document.getElementsByTagName("html")[0],
    mouseMap: new Map(),
    getMouseFired: (btn) => {
        if (PIXI.input.mouseMap.get(btn)) {
            PIXI.input.mouseMap.set(btn, false);
            return true;
        }
        return false;
    },
    getMouseDown: (btn) => {
        if (PIXI.input.mouseMap.has(btn)) {
            PIXI.input.mouseMap.set(btn, false);
            return true;
        }
        return false;
    },
    getMouseX: () => {
        return PIXI.input.mouseMap.get('x');
    },
    getMouseY: () => {
        return PIXI.input.mouseMap.get('y');
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

PIXI.utils.openFullScreen = (view) => {
    if (view.requestFullscreen)
        view.requestFullscreen(); // Standard
    else if (view.webkitRequestFullscreen)
        view.webkitRequestFullscreen(); // Safari
    else if (view.msRequestFullscreen)
        view.msRequestFullscreen(); // IE11
}

// Keys
window.addEventListener('keydown', (e) => {
    PIXI.input.keyMap.set(e.code, true);
});

window.addEventListener('keyup', (e) => {
    PIXI.input.keyMap.delete(e.code);
});

// Mouse
window.addEventListener('mousemove', (e) => {
    let bounds = PIXI.input.mouseContainer.getBoundingClientRect();
    PIXI.input.mouseMap.set('x', (e.x - bounds.left) / bounds.width);
    PIXI.input.mouseMap.set('y', (e.y - bounds.top) / bounds.height);
});
window.addEventListener('mousedown', (e) => {
    PIXI.input.mouseMap.set(e.button, true);
});
window.addEventListener('mouseup', (e) => {
    PIXI.input.mouseMap.delete(e.button);
});

// Stop rClick
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log(PIXI.zephyr + " is extending Pixi!");
"use strict"
PIXI.zephyr = "ZephyrJS 22.8.3";

PIXI.input = {
    useKeyListener: () => {
        PIXI.input.keyMap = new Map();
        PIXI.input.getKeyFired = (keyStr) => {
            if (PIXI.input.keyMap.size > 0 && PIXI.input.keyMap.get(keyStr)) {
                PIXI.input.keyMap.set(keyStr, false);
                return true;
            }
            return false;
        };
        PIXI.input.getKeyDown = (keyStr) => {
            if (PIXI.input.keyMap.size > 0 && PIXI.input.keyMap.has(keyStr)) {
                PIXI.input.keyMap.set(keyStr, false);
                return true;
            }
            return false;
        };

        window.addEventListener('keydown', (e) => {
            PIXI.input.keyMap.set(e.code, true);
        });

        window.addEventListener('keyup', (e) => {
            PIXI.input.keyMap.delete(e.code);
        });
    },
    useMouseListener: () => {
        PIXI.input.mouseContainer = document.getElementsByTagName("html")[0];
        PIXI.input.mouseMap = new Map();
        PIXI.input.getMouseFired = (btn) => {
            if (PIXI.input.mouseMap.get(btn)) {
                PIXI.input.mouseMap.set(btn, false);
                return true;
            }
            return false;
        };
        PIXI.input.getMouseDown = (btn) => {
            if (PIXI.input.mouseMap.has(btn)) {
                PIXI.input.mouseMap.set(btn, false);
                return true;
            }
            return false;
        };
        PIXI.input.getMouseX = () => {
            return PIXI.input.mouseMap.get('x');
        };
        PIXI.input.getMouseY = () => {
            return PIXI.input.mouseMap.get('y');
        };

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
    }
}

PIXI.collision = {
    aabb: (a, b) => { // Axis-Aligned Bounding Box method
        let aFix = {
            x: a.x - a.width * a.anchor.x,
            y: a.y - a.height * a.anchor.y,
        }
        let bFix = {
            x: b.x - b.width * b.anchor.x,
            y: b.y - b.height * b.anchor.y,
        }
        return !(
            aFix.x + a.width < bFix.x ||
            aFix.y + a.height < bFix.y ||
            aFix.x > bFix.x + b.width ||
            aFix.y > bFix.y + b.height
        );
    },
    radius: (a, b) => { // Circle collision
        let aFix = {
            x: a.x - a.width * a.anchor.x,
            y: a.y - a.height * a.anchor.y,
        }
        let bFix = {
            x: b.x - b.width * b.anchor.x,
            y: b.y - b.height * b.anchor.y,
        }
        return (
            Math.sqrt(Math.pow(aFix.x - bFix.x, 2) + Math.pow(aFix.y - bFix.y, 2)) <= a.r + b.r
        );
    }
}

// Returns the value of x if it is between the bounds of min and max, or the closest bound if x is outside
PIXI.clamp = (x, min, max) => {
    return Math.min(Math.max(x, min), max);
};

// Linearly interpolate between values a and b
PIXI.mix = (a, b, m) => {
    return a * (1 - m) + b * (m);
}

// Generates a random integer between min and max, inclusive
PIXI.rand = (min, max) => {
    return (Math.random() * (max - min + 1)) ^ 0 + min;
};

// Requests fullscreen for the provided element (view)
PIXI.utils.openFullScreen = (view) => {
    if (view.requestFullscreen)
        view.requestFullscreen(); // Standard
    else if (view.webkitRequestFullscreen)
        view.webkitRequestFullscreen(); // Safari
    else if (view.msRequestFullscreen)
        view.msRequestFullscreen(); // IE11
}

// Stop rClick
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log("%cUsing " + PIXI.zephyr + "! https://github.com/OttCS/ZephyrJS", "text-decoration: none;border-radius: 4px;margin: 4px 0;padding: 4px;color: #EF6F6C;border: 2px solid #EF6F6C;");
"use strict"
// ZEPHYR.js directly builds on top of PixiJS for ease of use
PIXI.zephyr = "ZephyrJS version 22.5.26";

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

    mouseContainer: document.getElementsByTagName("html")[0],
    mouseMap: new Map(),
    getMouseFired: (btn) => {
        let r = PIXI.input.mouseMap.get(btn);
        PIXI.input.keyMap.set(btn, false);
        return r;
    },
    getMouseDown: (btn) => {
        return PIXI.input.mouseMap.has(btn);
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

// https://www.w3schools.com/jsref/met_element_requestfullscreen.asp
PIXI.utils.openFullScreen = (view) => {
    if (view.requestFullscreen)
        view.requestFullscreen(); // Standard
    else if (view.webkitRequestFullscreen)
        view.webkitRequestFullscreen(); // Safari
    else if (view.msRequestFullscreen)
        view.msRequestFullscreen(); // IE11
}

PIXI.utils.saveObjectToFile = (name, state) => {
    let blobState = new Blob([JSON.stringify(state)], {type: 'text/plain'});
    let a = document.createElement('a');
    a.download = name + ".json";
    a.href = window.URL.createObjectURL(blobState);
    a.click();
};

PIXI.utils.readObjectFromFile = () => {
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        document.body.onfocus = () => {
            if (input) {
                let res = null;
                if(input.target) {
                    console.log("Files picked");
                    let file = input.target.files[0]; 
                    let reader = new FileReader();
                    reader.readAsText(file,'UTF-8');
                    reader.onload = readerEvent => {
                        res = JSON.parse(readerEvent.target.result);
                    }
                } else {
                    console.log("No files picked");
                }
                input = null;
                resolve(res);
            }
        }

        input.click();
    });
};

// Keyboard
window.addEventListener('keydown', (e) => {
    PIXI.input.keyMap.set(e.key.toLowerCase(), true);
});
window.addEventListener('keyup', (e) => {
    PIXI.input.keyMap.delete(e.key.toLowerCase());
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

// Catches/Blocks right click
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log(PIXI.zephyr + " is extending Pixi!");
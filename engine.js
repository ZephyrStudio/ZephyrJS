console.clear();
const ENGINE = {
    version: "22.4.4",
}
console.log("ENGINE.version " + ENGINE.version);

const HEAD_ELEMENT = document.getElementsByTagName("head")[0];
const BODY_ELEMENT = document.getElementsByTagName("body")[0];
const KEYBOARD = new Map();
var MOUSE;

ENGINE.setName = function (string) {
    document.title = string
}

ENGINE.cursor = function (style) {
    BODY_ELEMENT.style.cursor = style;
}

ENGINE.createKeyboardListener = function () {
    document.onkeydown = function (e) {
        KEYBOARD.set(e.key.toLowerCase(), true);
    }
    document.onkeyup = function (e) {
        KEYBOARD.set(e.key.toLowerCase(), false);
    }
}

ENGINE.createMouseListener = function () {
    MOUSE = {
        x: 0,
        y: 0,
        left: false,
        middle: false,
        right: false
    }

    BODY_ELEMENT.onmousedown = function (e) {
        if (e.button == 0) {
            MOUSE.left = true;
        } else if (e.button == 2) {
            MOUSE.right = true;
        } else if (e.button == 1) {
            MOUSE.middle = true;
        }
    }

    BODY_ELEMENT.onmouseup = function (e) {
        if (e.button == 0) {
            MOUSE.left = false;
        } else if (e.button == 2) {
            MOUSE.right = false;
        } else if (e.button == 1) {
            MOUSE.middle = false;
        }
    }

    BODY_ELEMENT.onmousemove = function (e) {
        MOUSE.x = e.clientX / window.innerWidth;
        MOUSE.y = e.clientY / window.innerHeight;
    }
}

ENGINE.make = async function (src) {
    let img;
    const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = src;
    });
    await imageLoadPromise;
    return img;
}

// Prerender canvas
ENGINE.prCanvas = document.createElement('canvas');
ENGINE.prCrtx = ENGINE.prCanvas.getContext('2d');

// Sets prerender canvas size
ENGINE.setPreRenderSize = function(w, h) {
    prCanvas.width = w;
    prCanvas.height = h;
}

ENGINE.getPreRenderIMG = function() {
    let res = new Image();
}

ENGINE.lap = Date.now();
ENGINE.getLap = function () {
    let t = ENGINE.lap;
    ENGINE.lap = Date.now();
    return ENGINE.lap - t;
}

// Block standard right click context menu
document.oncontextmenu = function (e) {
    e.preventDefault();
    return false;
}

// Add required styleSheet
HEAD_ELEMENT.innerHTML += '<link type="text/css" rel="stylesheet" href="engine/style.css">';

// Scene DOM setup
var SCENE = document.createElement('div');
SCENE.id = "scene";
SCENE.style.backgroundColor = "#fff";

// Scene Object setup`
SCENE.layers = new Map();
SCENE.active = {};
SCENE.imageSmoothing = false;

SCENE.setSize = function (width, height) {
    // Set Size in pixels
    SCENE.w = width;
    SCENE.h = height;

    // Rework max-size styling
    SCENE.style.width = "calc(100vh * " + (width / height) + ")";
    SCENE.style.height = "100vh";
    SCENE.style.maxWidth = "100vw";
    SCENE.style.maxHeight = "calc(100vw * " + (height / width) + ")";
}

SCENE.smoothImage = function (enable) {
    SCENE.imageSmoothing = enable;
}

SCENE.addLayer = function (name) {
    let c = document.createElement('canvas');
    c.id = name;
    c.width = SCENE.w;
    c.height = SCENE.h;
    let ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = SCENE.imageSmoothing;

    SCENE.layers.set(name, {
        element: c,
        ctx: ctx,
        minXDraw: 0,
        minYDraw: 0,
        maxXDraw: SCENE.w,
        maxYDraw: SCENE.h
    });
    SCENE.active = SCENE.layers.get(name);
    SCENE.appendChild(c);
}

SCENE.activeLayer = function (name) {
    SCENE.active = SCENE.layers.get(name);
}

SCENE.getPixel = function () {
    return { x: 1.0 / SCENE.w, y: 1.0 / SCENE.h };
}

SCENE.clear = function () {
    SCENE.active.ctx.clearRect(
        Math.max(SCENE.active.minXDraw, 0),
        Math.max(SCENE.active.minYDraw, 0),
        Math.min(SCENE.active.maxXDraw, SCENE.w),
        Math.min(SCENE.active.maxYDraw, SCENE.h)
    );
    SCENE.active.minXDraw = SCENE.w;
    SCENE.active.minYDraw = SCENE.h;
    SCENE.active.maxXDraw = 0;
    SCENE.active.maxYDraw = 0;
}

SCENE.drawImg = function (img, x, y) {
    if (img.complete) {
        // Bitwise floor coordinates
        let xFlr = (x * SCENE.w) | 0;
        let yRnd = (y * SCENE.h) | 0;
        // Actually draw image
        SCENE.active.ctx.drawImage(img, xFlr, yRnd);
        // Store drawing coords for faster clear
        SCENE.active.minXDraw = Math.min(SCENE.active.minXDraw, xFlr);
        SCENE.active.minYDraw = Math.min(SCENE.active.minYDraw, yRnd);
        SCENE.active.maxXDraw = Math.max(SCENE.active.maxXDraw, xFlr + img.width);
        SCENE.active.maxYDraw = Math.max(SCENE.active.maxYDraw, yRnd + img.height);
    }
}

SCENE.blendMode = function (mode) {
    SCENE.active.element.style.mixBlendMode = mode;
}

SCENE.setVisible = function (show) {
    let style = show ? "auto" : "none";
    SCENE.active.element.style.display = style;
}

SCENE.setOpacity = function (transparency) {
    SCENE.active.element.style.opacity = transparency;
}

BODY_ELEMENT.appendChild(SCENE);
"use strict"

const ZEPHYR = {
    version: "ZephyrJS 22.4.15",
    cacheMap: new Map(),
    layerMap: new Map(),
    spriteMap: new Map(),
    utils: {},
    scene: {
        width: 0,
        height: 0,
        antialias: false,
        view: document.createElement('div'),
        pxScale: {},
        viewCenter: {}
    },
    system: {
        lap: performance.now(),
        width: -1,
        height: -1,
        x: -1,
        y: -1
    },
    math: {},
    stat: {
        active: false
    }
}
console.log(ZEPHYR.version);

// Setup because it's a website
document.head.innerHTML += '<link type="text/css" rel="stylesheet" href="zephyr/style.css">';

document.oncontextmenu = (e) => { e.preventDefault(); return false; }
window.onresize = async (e) => {
ZEPHYR.system.getSceneDOMBounds();
}
ZEPHYR.utils.setTitle = (title) => {
    document.title = title;
}
// Image asset caching
ZEPHYR.utils.cache = async (imgURL) => {
    if (ZEPHYR.cacheMap.has(imgURL)) return;
    let img;
    const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = imgURL;
    });
    await imageLoadPromise;
    ZEPHYR.cacheMap.set(imgURL, img);
}
// Layering functionality
ZEPHYR.utils.addLayer = (layerName) => {

    // DOM canvas setup
    let c = document.createElement('canvas');
    c.id = layerName;
    c.width = ZEPHYR.scene.width;
    c.height = ZEPHYR.scene.height;
    let ctx = c.getContext('2d');
    // imageSmoothingEnabled should be user-controllable, but
    // as long as Sprites aren't getting scaled and they're
    // drawn at whole integer positions, we don't need this
    ctx.imageSmoothingEnabled = false;

    let layer = {
        edited: true,
        element: c,
        ctx: ctx,
        minXDraw: 0,
        minYDraw: 0,
        maxXDraw: ZEPHYR.scene.width,
        maxYDraw: ZEPHYR.scene.height
    }
    ZEPHYR.layerMap.set(layerName, layer);
    ZEPHYR.scene.view.appendChild(layer.element);
}
ZEPHYR.utils.setSprite = (spriteName, obj) => {
    if (!ZEPHYR.spriteMap.has(spriteName)) { // Create default Sprite if new
        let defSprite = {
            layer: "",
            src: "",
            x: 0,
            y: 0,
            anchor: {
                x: 0,
                y: 0
            },
            draw: false,
            cameraDependantPosition: false,
            data: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
        ZEPHYR.spriteMap.set(spriteName, defSprite);
    }
    let edited = false;
    let srcEdit = false;
    let o = ZEPHYR.spriteMap.get(spriteName); // Original Sprite

    if (obj.layer && o.layer !== obj.layer) {
        o.layer = obj.layer;
        edited = true;
    }
    if (ZEPHYR.cacheMap.has(obj.src) && o.src !== obj.src) {
        o.src = obj.src;
        edited = srcEdit = true;
    }
    if (o.x !== obj.x) {
        o.x = obj.x;
        edited = true;
    }
    if (o.y !== obj.y) {
        o.y = obj.y;
        edited = true;
    }
    if (obj.anchor) {
        if (obj.anchor.x !== o.anchor.x) {
            o.anchor.x = obj.anchor.x;
            edited = true;
        }
        if (obj.anchor.y !== o.anchor.y) {
            o.anchor.y = obj.anchor.y;
            edited = true;
        }
    }
    if (obj.draw != undefined && (o.draw ^ obj.draw)) {
        o.draw = obj.draw;
        edited = true;
    }
    if (obj.cameraDependantPosition != undefined) {
        o.cameraDependantPosition = obj.cameraDependantPosition;
        edited = true;
    }
    if (edited) {
        if (srcEdit) {
            let img = ZEPHYR.cacheMap.get(obj.src);
            o.data.width = img.width;
            o.data.height = img.height;
        }
        o.data.x = (o.x * ZEPHYR.scene.width - o.anchor.x * o.data.width) | 0;
        o.data.y = (o.y * ZEPHYR.scene.height - o.anchor.y * o.data.height) | 0;
        if (o.cameraDependantPosition) {
            o.data.x -= ZEPHYR.scene.x;
            o.data.y -= ZEPHYR.scene.y;
        }
        o.data.inScene = ZEPHYR.math.inScene(o.data);
    }
    ZEPHYR.layerMap.get(o.layer).edited = edited;
}
ZEPHYR.utils.getSprite = (spriteName) => {
    return ZEPHYR.spriteMap.get(spriteName);
}
ZEPHYR.utils.lap = async () => {
    let t = performance.now() - ZEPHYR.system.lap;
    ZEPHYR.system.lap = performance.now();
    return t;
}
ZEPHYR.utils.createMouseListener = () => {
    ZEPHYR.mouse = {
        data: new Map()
    }

    ZEPHYR.mouse.getX = () => {
        return +(ZEPHYR.mouse.data.get("x"));
    }
    ZEPHYR.mouse.getY = () => {
        return +(ZEPHYR.mouse.data.get("y"));
    }
    ZEPHYR.mouse.isDown = (str) => {
        return !!(ZEPHYR.mouse.data.get(str));
    }

    document.body.onmousedown = async (e) => {
        switch (e.button) {
            case (0): // Left click
                ZEPHYR.mouse.data.set("left", true);
                break;
            case (1): // Left click
                ZEPHYR.mouse.data.set("middle", true);
                break;
            case (2): // Left click
                ZEPHYR.mouse.data.set("right", true);
                break;
        }
    }
    document.body.onmouseup = async (e) => {
        switch (e.button) {
            case (0): // Left click
                ZEPHYR.mouse.data.set("left", false);
                break;
            case (1): // Left click
                ZEPHYR.mouse.data.set("middle", false);
                break;
            case (2): // Left click
                ZEPHYR.mouse.data.set("right", false);
                break;
        }
    }
    document.onmousemove = async (event) => {
        ZEPHYR.mouse.data.set("x", (event.clientX - ZEPHYR.system.x) / ZEPHYR.system.width);
        ZEPHYR.mouse.data.set("y", (event.clientY - ZEPHYR.system.y) / ZEPHYR.system.height);
    }
    ZEPHYR.system.getSceneDOMBounds();
}
ZEPHYR.utils.createKeyListener = () => {
    ZEPHYR.key = {
        data: new Map()
    }
    ZEPHYR.key.isDown = (str) => {
        return !!(ZEPHYR.key.data.get(str));
    }
    document.body.onkeydown = async (e) => {
        ZEPHYR.key.data.set(e.key.toLowerCase(), true);
    }
    document.body.onkeyup = async (e) => {
        ZEPHYR.key.data.set(e.key.toLowerCase(), false);
    }
}
ZEPHYR.utils.setViewCenter = (obj) => {
    if (ZEPHYR.scene.viewCenter.x != obj.x || ZEPHYR.scene.viewCenter.y != obj.y) {
        // Assign new value
        ZEPHYR.scene.viewCenter.x = obj.x;
        ZEPHYR.scene.viewCenter.y = obj.y;

        // Recalculate ZEPHYR.scene x and y
        ZEPHYR.scene.x = (obj.x - 0.5) * ZEPHYR.scene.width;
        ZEPHYR.scene.y = (obj.y - 0.5) * ZEPHYR.scene.height;

        ZEPHYR.spriteMap.forEach(function (sprite) {
            if (sprite.cameraDependantPosition) {
                sprite.data.x = (sprite.x * ZEPHYR.scene.width - sprite.anchor.x * sprite.data.width - ZEPHYR.scene.x) | 0;
                sprite.data.y = (sprite.y * ZEPHYR.scene.height - sprite.anchor.y * sprite.data.height - ZEPHYR.scene.y) | 0;
                sprite.data.inScene = ZEPHYR.math.inScene(sprite.data);
            }
        });
    }
}
// Application "constructor"
ZEPHYR.Application = (settings) => {
    // Pass in an object with width, height, sharp, etc.

    // Pixel dimensions
    ZEPHYR.scene.width = settings.width || screen.width; // Specified or screen
    ZEPHYR.scene.height = settings.height || screen.height; // Specified or system
    ZEPHYR.scene.x = 0;
    ZEPHYR.scene.y = 0;
    // Maxing visual size
    ZEPHYR.scene.view.style.width = "calc(100vh * " + (ZEPHYR.scene.width / ZEPHYR.scene.height) + ")";
    ZEPHYR.scene.view.style.maxHeight = "calc(100vw * " + (ZEPHYR.scene.height / ZEPHYR.scene.width) + ")";

    // Misc. Settings
    ZEPHYR.scene.smooth = !!(settings.smooth) || false;
    if (!ZEPHYR.scene.smooth) {
        ZEPHYR.scene.view.classList.toggle("sharp");
    }

    ZEPHYR.scene.view.id = "zephyr-scene"; // Add id so stylings work

    if (settings.statistics) {
        let s = document.createElement('p');
        s.id = "statistics";
        ZEPHYR.stat.active = true;
        ZEPHYR.stat.element = s;
        ZEPHYR.stat.fps = 0;
        ZEPHYR.stat.ms = 0;
        ZEPHYR.stat.layerCulledSprites = 0;
        ZEPHYR.stat.culledSprites = 0;
        document.body.appendChild(ZEPHYR.stat.element);
    }

    ZEPHYR.scene.pxScale = { x: 1.0 / ZEPHYR.scene.width, y: 1.0 / ZEPHYR.scene.height };
    ZEPHYR.utils.setViewCenter(0.5, 0.5);

    document.body.appendChild(ZEPHYR.scene.view);

    ZEPHYR.system.renderLoop();
}
ZEPHYR.system.getSceneDOMBounds = async () => {
    let bound = ZEPHYR.scene.view.getBoundingClientRect();
    ZEPHYR.system.width = bound.width;
    ZEPHYR.system.height = bound.height;
    ZEPHYR.system.x = bound.x;
    ZEPHYR.system.y = bound.y;
}
ZEPHYR.system.renderLoop = async () => {
    window.requestAnimationFrame(ZEPHYR.system.renderLoop);

    // Statistic stuff
    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.fps += 50.0 / (performance.now() - ZEPHYR.stat.ms);
        ZEPHYR.stat.fps /= 1.05;
        ZEPHYR.stat.ms = performance.now();
        ZEPHYR.stat.layerCulledSprites = 0;
        ZEPHYR.stat.culledSprites = 0;
    }

    // Clear layers that have been edited
    ZEPHYR.layerMap.forEach(function (layer) {
        if (layer.edited) {
            layer.ctx.clearRect(Math.max(layer.minXDraw, 0), Math.max(layer.minYDraw, 0), Math.max(layer.maxXDraw, ZEPHYR.scene.width), Math.max(layer.maxYDraw, ZEPHYR.scene.height));
            layer.minXDraw = ZEPHYR.scene.width;
            layer.minYDraw = ZEPHYR.scene.height;
            layer.maxXDraw = 0;
            layer.maxYDraw = 0;
        }
    });
    
    ZEPHYR.spriteMap.forEach(function (sprite) {
        /*
        Ok so this if statement checks:
            If the layer has been edited and needs to be redrawn
            If the user says that the sprite is visible
            If the sprite is actually within the visual bounds of the canvas
        */
        if (ZEPHYR.layerMap.get(sprite.layer).edited && sprite.draw && sprite.data.inScene) { // Sprite should be drawn
            // Draw Sprite from pre-calculated data
            let l = ZEPHYR.layerMap.get(sprite.layer);
            l.ctx.drawImage(ZEPHYR.cacheMap.get(sprite.src), sprite.data.x, sprite.data.y);

            // Optimized clearing coordinates
            l.minXDraw = Math.min(l.minXDraw, sprite.data.x);
            l.minYDraw = Math.min(l.minYDraw, sprite.data.y);
            l.maxXDraw = Math.max(l.maxXDraw, sprite.data.x + sprite.data.width);
            l.maxYDraw = Math.max(l.maxYDraw, sprite.data.y + sprite.data.height);
        } else {
            ZEPHYR.stat.layerCulledSprites += !ZEPHYR.layerMap.get(sprite.layer).edited;
            ZEPHYR.stat.culledSprites += !sprite.data.inScene;
        }
    });

    ZEPHYR.layerMap.forEach(function (layer) {
        layer.edited = false;
    });

    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.element.innerText = "FPS: " + ((ZEPHYR.stat.fps + 0.1) | 0) + '\nFrametime: ' + ((performance.now() - (ZEPHYR.stat.ms)) * 0.001).toFixed(3) + "s\n\nScene:\n" + ZEPHYR.spriteMap.size + " sprites on " + ZEPHYR.layerMap.size + " layers\nAvoided Sprite Redraws: " + ZEPHYR.stat.layerCulledSprites + "\nOffscreen-Culled Sprites: " + ZEPHYR.stat.culledSprites;
    }
}
ZEPHYR.math.inScene = (a) => {
    return ZEPHYR.math.collision(a, {x: 0, y: 0, width: ZEPHYR.scene.width, height: ZEPHYR.scene.height});
}
ZEPHYR.math.collision = (a, b) => {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
}
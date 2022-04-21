"use strict"

const ZEPHYR = {
    version: 220420,
    cacheMap: new Map(),
    layerMap: new Map(),
    spriteMap: new Map(),
    ticker: new Set(),
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
        delta: performance.now(),
        width: -1,
        height: -1,
        x: -1,
        y: -1
    },
    math: {},
    stat: {
        active: false
    },
}

// Setup because it's a website
// document.head.innerHTML += '<link type="text/css" rel="stylesheet" href="zephyr/style.css">';

document.oncontextmenu = (e) => { e.preventDefault(); return false; }
window.onresize = async () => {
    ZEPHYR.system.getSceneDOMBounds();
}
ZEPHYR.utils.setTitle = (title) => {
    document.title = title;
}
// Image asset caching
ZEPHYR.utils.cache = async (imgURL) => {
    if (ZEPHYR.cacheMap.has(imgURL)) return;
    let img = new Image();
    img.src = imgURL;
    await img.decode();
    ZEPHYR.cacheMap.set(imgURL, img);
}
// Cache array of URLs
ZEPHYR.utils.cacheAll = async (imgURLs) => {
    imgURLs.forEach(async (currentValue) => {
        await ZEPHYR.utils.cache(currentValue);
    });
}
// Layering functionality
ZEPHYR.utils.setLayer = (layerName, settingsObj) => {
    let layer = {};
    if (!ZEPHYR.layerMap.has(layerName)) {
        // DOM canvas setup
        let c = document.createElement('canvas');
        c.id = layerName;
        c.width = ZEPHYR.scene.width;
        c.height = ZEPHYR.scene.height;
        c.style.position = "absolute";
        c.style.top = 0;
        c.style.left = 0;
        c.style.width = "100%";
        c.style.height = "100%";
        c.innerText = "Canvas is not supported in your browser";
        let ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        layer = {
            edited: true,
            element: c,
            ctx: ctx,
            minXDraw: 0,
            minYDraw: 0,
            maxXDraw: ZEPHYR.scene.width,
            maxYDraw: ZEPHYR.scene.height,
            settings: {}
        }
    } else {
        layer = ZEPHYR.layerMap.get(layerName);
    }

    if (layer.settings.blend != settingsObj.blend) {
        layer.settings.blend = settingsObj.blend;
        layer.element.style.mixBlendMode = settingsObj.blend;
    }

    if (layer.settings.opacity != settingsObj.opacity) {
        layer.settings.opacity = settingsObj.opacity;
        layer.element.style.opacity = settingsObj.opacity;
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
        if (ZEPHYR.layerMap.has(o.layer)) {
            ZEPHYR.layerMap.get(o.layer).edited |= edited; // Let old layer know that it has changed
        }
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
    ZEPHYR.layerMap.get(o.layer).edited |= edited;
}
ZEPHYR.utils.getSprite = (spriteName) => {
    return ZEPHYR.spriteMap.get(spriteName);
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
    let changeX = ZEPHYR.scene.viewCenter.x != ((obj.x * ZEPHYR.scene.width + 0.5) | 0);
    let changeY = ZEPHYR.scene.viewCenter.y != ((obj.y * ZEPHYR.scene.height + 0.5) | 0);
    if (changeX || changeY) {
        // Assign new value
        ZEPHYR.scene.viewCenter.x = obj.x;
        ZEPHYR.scene.viewCenter.y = obj.y;
        // Recalculate ZEPHYR.scene x and y
        ZEPHYR.scene.x = (obj.x - 0.5) * ZEPHYR.scene.width;
        ZEPHYR.scene.y = (obj.y - 0.5) * ZEPHYR.scene.height;
        ZEPHYR.spriteMap.forEach(function (sprite) {
            if (sprite.cameraDependantPosition) {
                if (changeX)
                    sprite.data.x = (sprite.x * ZEPHYR.scene.width - sprite.anchor.x * sprite.data.width - ZEPHYR.scene.x) | 0;
                if (changeY)
                    sprite.data.y = (sprite.y * ZEPHYR.scene.height - sprite.anchor.y * sprite.data.height - ZEPHYR.scene.y) | 0;
                sprite.data.inScene = ZEPHYR.math.inScene(sprite.data);
                ZEPHYR.layerMap.get(sprite.layer).edited = true;
            }
        });
    }
}
// Gets the size of a pixel in the scene
ZEPHYR.utils.getPixelScale = () => {
    return { x: 1.0 / ZEPHYR.scene.width, y: 1.0 / ZEPHYR.scene.height };
}
// Application "constructor"
ZEPHYR.Application = (settings) => {
    // Pass in an object with width, height, sharp, etc.

    // Pixel dimensions
    ZEPHYR.scene.width = settings.width || screen.width; // Specified or screen
    ZEPHYR.scene.height = settings.height || screen.height; // Specified or system
    ZEPHYR.scene.x = 0;
    ZEPHYR.scene.y = 0;

    ZEPHYR.scene.view.style.position = "relative";
    ZEPHYR.scene.view.style.backgroundColor = "#000";

    // ZEPHYR.scene.v
    // ZEPHYR.scene.view.style.width = "calc(100vh * " + (ZEPHYR.scene.width / ZEPHYR.scene.height) + ")";
    // ZEPHYR.scene.view.style.maxHeight = "calc(100vw * " + (ZEPHYR.scene.height / ZEPHYR.scene.width) + ")";

    // Misc. Settings
    ZEPHYR.scene.smooth = !!(settings.smooth) || false;
    if (!ZEPHYR.scene.smooth) {
        ZEPHYR.scene.view.style.imageRendering = "pixelated";
        ZEPHYR.scene.view.style.imageRendering = "-moz-crisp-edges";
        ZEPHYR.scene.view.style.imageRendering = "crisp-edges";
    }

    ZEPHYR.scene.view.id = "zephyr-scene"; // Add id so stylings work

    if (settings.statistics) {
        let s = document.createElement('p');
        s.id = "statistics";
        ZEPHYR.stat.active = true;
        ZEPHYR.stat.element = s;
        ZEPHYR.stat.element.style.position = "absolute";
        ZEPHYR.stat.element.style.display = "block";
        ZEPHYR.stat.element.style.top = "2px";
        ZEPHYR.stat.element.style.left = "4px";
        ZEPHYR.stat.element.style.filter = "grayscale(100%) invert(100%)";
        ZEPHYR.stat.element.style.mixBlendMode = "difference";
        ZEPHYR.stat.element.style.fontFamily = "Consolas, monospace";
        ZEPHYR.stat.element.style.fontSize = "11px";
        ZEPHYR.stat.element.style.lineHeight = "14px";
        ZEPHYR.stat.element.style.zIndex = 999;

        ZEPHYR.stat.fps = 0;
        ZEPHYR.stat.ms = 0;
        ZEPHYR.stat.layerCulledSprites = 0;
        ZEPHYR.stat.culledSprites = 0;
        ZEPHYR.scene.view.appendChild(ZEPHYR.stat.element);
    }

    ZEPHYR.utils.setViewCenter(0.5, 0.5);

    ZEPHYR.system.renderLoop();
}

ZEPHYR.appendScene = (parent) => {
    parent.appendChild(ZEPHYR.scene.view);
}

ZEPHYR.system.getSceneDOMBounds = () => {
    let bound = ZEPHYR.scene.view.getBoundingClientRect();
    ZEPHYR.system.width = bound.width;
    ZEPHYR.system.height = bound.height;
    ZEPHYR.system.x = bound.x;
    ZEPHYR.system.y = bound.y;
}

ZEPHYR.system.renderLoop = async () => {
    window.requestAnimationFrame(ZEPHYR.system.renderLoop);
    ZEPHYR.ticker.forEach((fn) => {
        fn(performance.now() - ZEPHYR.system.delta);
    });
    ZEPHYR.system.delta = performance.now();

    // Statistic stuff
    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.fps += 50.0 / (performance.now() - ZEPHYR.stat.ms);
        ZEPHYR.stat.fps /= 1.05;
        ZEPHYR.stat.ms = performance.now();
        ZEPHYR.stat.layerCulledSprites = 0;
        ZEPHYR.stat.culledSprites = 0;
    }

    // Clear layers that have been edited
    ZEPHYR.layerMap.forEach(async (layer) => {
        if (layer.edited) {
            layer.ctx.clearRect(0, 0, ZEPHYR.scene.width, ZEPHYR.scene.height);
            layer.ctx.clearRect(Math.max(layer.minXDraw, 0), Math.max(layer.minYDraw, 0), Math.min(layer.maxXDraw - layer.minXDraw, ZEPHYR.scene.width), Math.min(layer.maxYDraw - layer.minYDraw, ZEPHYR.scene.height));
            //layer.ctx.fillRect(Math.max(layer.minXDraw, 0), Math.max(layer.minYDraw, 0), Math.min(layer.maxXDraw - layer.minXDraw, ZEPHYR.scene.width), Math.min(layer.maxYDraw - layer.minYDraw, ZEPHYR.scene.height));
            layer.minXDraw = Math.MAX_SAFE_INTEGER;
            layer.minYDraw = Math.MAX_SAFE_INTEGER;
            layer.maxXDraw = Math.MIN_SAFE_INTEGER;
            layer.maxYDraw = Math.MIN_SAFE_INTEGER;
        }
    });

    ZEPHYR.spriteMap.forEach(async (sprite) => {
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

    ZEPHYR.layerMap.forEach(async (layer) => {
        layer.edited = false;
    });

    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.element.innerText = "FPS: " + ((ZEPHYR.stat.fps + 0.1) | 0) + '\nFrametime: ' + ((performance.now() - (ZEPHYR.stat.ms)) * 0.001).toFixed(3) + "s\n\nScene:\n" + ZEPHYR.spriteMap.size + " sprites on " + ZEPHYR.layerMap.size + " layers\nAvoided Sprite Redraws: " + ZEPHYR.stat.layerCulledSprites + "\nOffscreen-Culled Sprites: " + ZEPHYR.stat.culledSprites;
    }
}
ZEPHYR.math.inScene = (a) => {
    return a.x <= ZEPHYR.scene.width && a.x + a.width >= 0 && a.y <= ZEPHYR.scene.height && a.y + a.height >= 0;
    // return ZEPHYR.math.collision(a, { x: 0, y: 0, width: ZEPHYR.scene.width, height: ZEPHYR.scene.height });
}
ZEPHYR.math.collision = (a, b) => {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
}
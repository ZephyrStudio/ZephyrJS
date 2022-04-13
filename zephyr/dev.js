"use strict"

const ZEPHYR = {
    version: "ZephyrJS 22.4.8",
    cacheMap: new Map(),
    layerMap: new Map(),
    spriteMap: new Map(),
    utils: {},
    scene: {
        width: 0,
        height: 0,
        antialias: false,
        view: document.createElement('div')
    },
    system: {
        lap: performance.now()
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
    ctx.imageSmoothingEnabled = ZEPHYR.antialias;

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
    let sprite = {
        layer: obj.layer,
        src: obj.src,
        x: obj.x || 0,
        y: obj.y || 0,
        anchor: {},
        draw: !!(obj.draw)
    }
    if (obj.anchor) {
        sprite.anchor.x = obj.anchor.x || 0.0;
        sprite.anchor.y = obj.anchor.y || 0.0;
    } else {
        sprite.anchor = { x: 0.0, y: 0.0 };
    }
    sprite.data = {};
    if (ZEPHYR.spriteMap.has(spriteName) && ZEPHYR.spriteMap.get(spriteName).src == sprite.src) {
        sprite.data.width = ZEPHYR.spriteMap.get(spriteName).data.width;
        sprite.data.height = ZEPHYR.spriteMap.get(spriteName).data.height;
    } else {
        let img = ZEPHYR.cacheMap.get(sprite.src);
        sprite.data.width = img.width;
        sprite.data.height = img.height;
    }
    sprite.data.x = (sprite.x * ZEPHYR.scene.width - sprite.anchor.x * sprite.data.width) | 0;
    sprite.data.y = (sprite.y * ZEPHYR.scene.height - sprite.anchor.y * sprite.data.height) | 0;
    ZEPHYR.spriteMap.set(spriteName, sprite);
    ZEPHYR.layerMap.get(sprite.layer).edited = true;
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
    
}

// Application "constructor"
ZEPHYR.Application = (settings) => {
    // Pass in an object with width, height, antialias, etc.

    // Pixel dimensions
    ZEPHYR.scene.width = settings.width || screen.width; // Specified or screen
    ZEPHYR.scene.height = settings.height || screen.height; // Specified or system
    // Maxing visual size
    ZEPHYR.scene.view.style.width = "calc(100vh * " + (ZEPHYR.scene.width / ZEPHYR.scene.height) + ")";
    ZEPHYR.scene.view.style.maxHeight = "calc(100vw * " + (ZEPHYR.scene.height / ZEPHYR.scene.width) + ")";

    // Misc. Settings
    ZEPHYR.scene.antialias = !!(settings.antialias) || false;

    ZEPHYR.scene.view.id = "zephyr-scene"; // Add id so stylings work

    if (settings.statistics) {
        let s = document.createElement('p');
        s.id = "statistics";
        ZEPHYR.stat.active = true;
        ZEPHYR.stat.element = s;
        ZEPHYR.stat.fps = 999;
        ZEPHYR.stat.ms = 0;
        ZEPHYR.stat.layerCulledSprites = 0;
        ZEPHYR.stat.culledSprites = 0;
        document.body.appendChild(ZEPHYR.stat.element);
    }

    ZEPHYR.scene.viewPx = { x: 1.0 / ZEPHYR.scene.width, y: 1.0 / ZEPHYR.scene.height };

    document.body.appendChild(ZEPHYR.scene.view);
    ZEPHYR.system.renderLoop();
}

ZEPHYR.system.renderLoop = () => {
    window.requestAnimationFrame(ZEPHYR.system.renderLoop);

    // Statistic stuff
    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.fps += 150.0 / (performance.now() - ZEPHYR.stat.ms);
        ZEPHYR.stat.fps /= 1.15;
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
        if (ZEPHYR.layerMap.get(sprite.layer).edited && sprite.draw && ZEPHYR.math.collision(sprite.data, { x: 0, y: 0, width: ZEPHYR.scene.width, height: ZEPHYR.scene.height })) { // Sprite should be drawn
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
            ZEPHYR.stat.culledSprites += !ZEPHYR.math.collision(sprite.data, { x: 0, y: 0, width: ZEPHYR.scene.width, height: ZEPHYR.scene.height });
        }
    });

    ZEPHYR.layerMap.forEach(function (layer) {
        layer.edited = false;
    });

    if (ZEPHYR.stat.active) {
        ZEPHYR.stat.element.innerText = "FPS: " + ((ZEPHYR.stat.fps + 0.3) | 0) + '\nFrametime: ' + ((performance.now() - (ZEPHYR.stat.ms)) * 0.001).toFixed(3) + "s\n\nScene:\n" + ZEPHYR.spriteMap.size + " sprites on " + ZEPHYR.layerMap.size + " layers\nAvoided Sprite Redraws: " + ZEPHYR.stat.layerCulledSprites + "\nOffscreen-Culled Sprites: " + ZEPHYR.stat.culledSprites;
    }
}

ZEPHYR.math.collision = (a, b) => {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
}
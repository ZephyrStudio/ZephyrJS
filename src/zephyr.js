/* 
 * ZephyrJS - FOSS Game Engine Features for PixiJS
 * https://zephyrjs.netlify.app/
 * 
 * ZephyrJS is licensed under the MIT License. Consider contributing on our Github
 * https://github.com/ZephyrJS-Project/ZephyrJS
 */
PIXI = (function (exports) {
    'use strict';

    // NON-BUNDLE SETUP
    let index = exports.utils;

    /* START ZEPHYR BUNDLE ZONE */

    const Zephyr = {
        VERSION: "23.4.13",
        _spriteFix: (s) => { // Returns the actual x/y width/height of a scaled and anchored Sprite
            let w = s.width * (s.scale ? s.scale.x : 1);
            let h = s.height * (s.scale ? s.scale.y : 1);
            return {
                x: s.x - (s.anchor ? s.anchor.x * w : 0) + Math.min(0, w),
                y: s.y - (s.anchor ? s.anchor.y * h : 0) + Math.min(0, h),
                width: Math.abs(w),
                height: Math.abs(h)
            }
        },
        useAudio: () => { console.error('ZephyrJS: useAudio() is deprecated') },
        useFile: () => { console.error('ZephyrJS: useFile() is deprecated') },
        useKeys: () => { console.error('ZephyrJS: useKeys() is deprecated') },
        useMouse: () => { console.error('ZephyrJS: useMouse() is deprecated') },
        useParticles: () => { console.error('ZephyrJS: useParticles() is deprecated') },
    }

    var Audio = (function (a) {
        a._ctx = new AudioContext();
        a._buffers = new Map(), // Stores all audio buffers
            a._player = function () { // Shared function for all Audio objects
                if (a._buffers.has(this.src)) {
                    let aud = a._ctx.createBufferSource();
                    aud.buffer = a._buffers.get(this.src);
                    this._gainNode.gain.value = this.volume;
                    aud.connect(this._gainNode).connect(a._ctx.destination);
                    aud.start(0);
                } else {
                    console.warn('ZephyrJS Audio: ' + this.src + ' is not ready to be played');
                }
            }
        a.from = function (src) {
            let r = new XMLHttpRequest();
            r.open('GET', src, true);
            r.responseType = 'arraybuffer';
            r.onload = () => { PIXI.Audio._ctx.decodeAudioData(r.response, function (buffer) { PIXI.Audio._buffers.set(src, buffer) }) }
            r.send();
            return { _gainNode: PIXI.Audio._ctx.createGain(), src: src, volume: 1, play: PIXI.Audio._player };
        }
        return a;
    })(Audio || {});

    // FILE IS BUGGY AND BAD
    var File = (function (f) {
        f.write = async (object, fName) => {
            let file = new Blob([JSON.stringify(object)], { type: JSON });
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = fName + ".json";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        };
        f.open = async function () {
            [fileHandle] = await window.showOpenFilePicker();
            let file = await fileHandle.getFile();
            let contents = await file.text();
            return JSON.parse(contents);
        };
    })(File || {});

    var Keys = (function (k) {
        k._map = new Map(),
            k.down = function (key) {
                if (k._map.size > 0 && k._map.has(key)) {
                    k._map.set(key, false);
                    return true;
                }
                return false;
            };
        k.fired = function (key) {
            if (k._map.size > 0 && k._map.get(key)) {
                k._map.set(key, false);
                return true;
            }
            return false;
        };
        return k;
    })(Keys || {});

    var Mouse = (function (m) {
        m._bounds = document.getElementsByTagName("html")[0].getBoundingClientRect();
        m._container = document.getElementsByTagName("html")[0];
        m.x = 0;
        m.y = 0;
        m.anchor = { x: 0, y: 0 };
        m.width = 1;
        m.height = 1;
        m.setContainer = function (view) {
            let b = view.getBoundingClientRect();
            if (b.width * b.height == 0) {
                console.error("Cannot use PIXI.Mouse.setContainer() with an invalid element.");
            } else {
                Mouse._container = view;
                Mouse._bounds = Mouse._container.getBoundingClientRect();
            }
        };
        m._btns = ["Primary", "Middle", "Secondary"];
        m._map = new Map();
        m.down = function (btn) {
            if (PIXI.Mouse._map.size > 0 && PIXI.Mouse._map.has(btn)) {
                PIXI.Mouse._map.set(btn, false);
                return true;
            }
            return false;
        };
        m.fired = function (btn) {
            if (PIXI.Mouse._map.size > 0 && PIXI.Mouse._map.get(btn)) {
                PIXI.Mouse._map.set(btn, false);
                return true;
            }
            return false;
        }
        return m;
    })(Mouse || {});

    var Particles = (function (p) {
        p._init = function (particle) {
            let r = (Math.random() - 0.5) * this.spread + this.direction;
            particle.alpha = 1;
            particle.move = { x: this.speed * Math.cos(r), y: this.speed * Math.sin(r) };
            particle.x = this.spawn.x;
            particle.y = this.spawn.y;
            particle.life = this.life;
            particle.scale.x = particle.scale.y = this.scaling;
            if (this.rotate)
                particle.rotation = r + Math.PI * 0.5;
        };
        p._step = function (deltaTime) {
            this.children.forEach(particle => {
                if ((particle.life -= deltaTime * this.speed) <= 0) {
                    if (this.fresh)
                        this._init(particle);
                    else
                        this.removeChild(particle);
                } else {
                    particle.x += particle.move.x * deltaTime;
                    particle.y += particle.move.y * deltaTime;
                }
            });
            if (this.children.length < this.maxCount && this.fresh) {
                this._spawnTimer -= deltaTime;
                if (this._spawnTimer <= 0) {
                    this._spawnTimer = this.life / this.maxCount;
                    let particle = new PIXI.Sprite(this.baseTexture);
                    particle.anchor = { x: 0.5, y: 0.5 }
                    this._init(particle);
                    this.addChild(particle);
                }
            }
        };
        p.from = function (src, maxCount, options) {
            if (!options) options = {};
            let res = new PIXI.ParticleContainer(maxCount);
            res._init = p._init;
            res._spawnTimer = 0;
            res.baseTexture = PIXI.Texture.from(src);
            res.direction = (options.direction ? options.direction : 0);
            res.life = (options.life ? options.life : 128);
            res.maxCount = maxCount;
            res.rotate = (options.rotate ? options.rotate : false);
            res.scaling = (options.scaling ? options.scaling : 1)
            res.spawn = { x: 0, y: 0 };
            res.speed = (options.speed ? options.speed : 1);
            res.spread = (options.spread ? options.spread : 0);
            res.step = p._step;
            return res;
        }
        return p;
    })(Particles || {});

    index = (function (u) {
        u.clamp = function (x, min, max) { return Math.min(Math.max(x, min), max) };
        u.mix = function (a, b, m) { return a * (1 - m) + b * (m) };
        u.random = function random(min, max) { return (Math.random() * (max - min + 1)) ^ 0 + min };
        u.toggleFullScreen = function (view) {
            if (!view.fullscreenElement &&
                !view.mozFullScreenElement && !view.webkitFullscreenElement) {
                if (view.requestFullscreen) {
                    view.requestFullscreen();
                } else if (view.mozRequestFullScreen) {
                    view.mozRequestFullScreen();
                } else if (view.webkitRequestFullscreen) {
                    view.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (view.cancelFullScreen) {
                    view.cancelFullScreen();
                } else if (view.mozCancelFullScreen) {
                    view.mozCancelFullScreen();
                } else if (view.webkitCancelFullScreen) {
                    view.webkitCancelFullScreen();
                }
            }
        }
        return u;
    })(index || {});

    const Collision = {
        aabb: (a, b) => { // Axis-Aligned Bounding Box method
            let aFix = PIXI.Zephyr._spriteFix(a);
            let bFix = PIXI.Zephyr._spriteFix(b);
            return !(aFix.x + a.width < bFix.x || aFix.y + a.height < bFix.y || aFix.x > bFix.x + b.width || aFix.y > bFix.y + b.height);
        },
        radius: (a, b) => { // Circle collision, for objects a and b
            return Math.hypot(a.x - b.x + (a.width - b.width) * 0.5, a.y - b.y + (a.height - b.height) * 0.5) <= (Math.max(a.width, a.height) + Math.max(b.width, b.height)) * 0.5;
        }
    }

    function toggleFullScreen(view) {
        if (!view.fullscreenElement &&
            !view.mozFullScreenElement && !view.webkitFullscreenElement) {  // current working methods
            if (view.requestFullscreen) {
                view.requestFullscreen();
            } else if (view.mozRequestFullScreen) {
                view.mozRequestFullScreen();
            } else if (view.webkitRequestFullscreen) {
                view.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (view.cancelFullScreen) {
                view.cancelFullScreen();
            } else if (view.mozCancelFullScreen) {
                view.mozCancelFullScreen();
            } else if (view.webkitCancelFullScreen) {
                view.webkitCancelFullScreen();
            }
        }
    }

    (function listenerSetup() {
        // CTX MENU BLOCK
        window.addEventListener('contextmenu', e => { e.preventDefault() });
        // KEYBOARD
        window.addEventListener('keydown', e => { Keys._map.set(e.code, true) });
        window.addEventListener('keyup', e => { Keys._map.delete(e.code) });
        // MOUSE
        window.addEventListener('resize', () => { Mouse._bounds = Mouse._container.getBoundingClientRect() });
        window.addEventListener('mouseup', e => { Mouse._map.delete(Mouse._btns[e.button]) });
        window.addEventListener('mousedown', e => { Mouse._map.set(Mouse._btns[e.button], true) });
        window.addEventListener('mousemove', e => {
            Mouse.x = (e.x - Mouse._bounds.left + window.pageXOffset) / Mouse._bounds.width * Mouse._container.width;
            Mouse.y = (e.y - Mouse._bounds.top + window.pageYOffset) / Mouse._bounds.height * Mouse._container.height;
        });
    })();

    exports.Zephyr = Zephyr;
    exports.Audio = Audio;
    exports.File = File;
    exports.Keys = Keys;
    exports.Mouse = Mouse;
    exports.Particles = Particles;
    exports.Collision = Collision;
    exports.toggleFullScreen = toggleFullScreen;

    /* END ZEPHYR BUNDLE ZONE */
    exports.utils = index;

    return exports;
})(PIXI || {});
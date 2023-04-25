/* 
 * ZephyrJS - FOSS Game Engine Features for PixiJS
 * 
 * ZephyrJS is licensed under the MIT License.
 * 
 * Consider contributing to the project!
 * https://github.com/ZephyrJS-Project/ZephyrJS
 */
PIXI = (function (exports) {
    'use strict';

    // NON-BUNDLE SETUP
    let index = exports.utils;

    /* START ZEPHYR BUNDLE ZONE */

    var Zephyr = (function (z) {
        z.VERSION = '23.4.18'; // Version number, yy.mm.dd format

        z._audio = {};
        z._audio.buffers = new Map(); // Store all decoded audio buffers in one location
        z._audio.ctx = new AudioContext(); // More than one audio context causes lag
        z._audio.buffer = function (src) {
            if (!z._audio.buffers.has(src)) {
                z._audio.buffers.set(src, false);
                let r = new XMLHttpRequest();
                r.open('GET', src, true);
                r.responseType = 'arraybuffer';
                r.onload = function () { z._audio.ctx.decodeAudioData(r.response, function (buffer) { z._audio.buffers.set(src, buffer) }) };
                r.send();
            }
        };

        z._spriteFix = function (s) { // Returns the actual x/y width/height of a scaled and anchored Sprite
            let w = s.width * (s.scale ? s.scale.x : 1);
            let h = s.height * (s.scale ? s.scale.y : 1);
            return {
                x: s.x - (s.anchor ? s.anchor.x * w : 0) + Math.min(0, w),
                y: s.y - (s.anchor ? s.anchor.y * h : 0) + Math.min(0, h),
                width: Math.abs(w),
                height: Math.abs(h)
            }
        };
        z.useAudio = () => { console.error('ZephyrJS: useAudio() is deprecated') };
        z.useFile = () => { console.error('ZephyrJS: useFile() is deprecated') };
        z.useKeys = () => { console.error('ZephyrJS: useKeys() is deprecated') };
        z.useMouse = () => { console.error('ZephyrJS: useMouse() is deprecated') };
        z.useParticles = () => { console.error('ZephyrJS: useParticles() is deprecated') };
        return z;
    })(Zephyr || {});

    var collision = (function (c) {
        c.aabb = function (a, b) { // Axis-Aligned Bounding Box method
            let aFix = PIXI.Zephyr._spriteFix(a);
            let bFix = PIXI.Zephyr._spriteFix(b);
            return !(aFix.x + a.width < bFix.x || aFix.y + a.height < bFix.y || aFix.x > bFix.x + b.width || aFix.y > bFix.y + b.height);
        };
        c.radius = function (a, b) { // Circle collision, for objects a and b
            return Math.hypot(a.x - b.x + (a.width - b.width) * 0.5, a.y - b.y + (a.height - b.height) * 0.5) <= (Math.max(a.width, a.height) + Math.max(b.width, b.height)) * 0.5;
        };
        return c;
    })(collision || {});

    var DirectAudio = (function (d) {
        let ctx = Zephyr._audio.ctx;
        let buffers = Zephyr._audio.buffers;
        d._starter = function () {
            if (buffers.has(this.src)) {
                if (buffers.get(this.src)) {
                    d._stopper();
                    this._source = ctx.createBufferSource();
                    this._source.buffer = buffers.get(this.src);

                    this._gainNode.gain.value = this.gain; // 0 mute, 1 full
                    this._panNode.pan.value = this.pan; // -1 full left, 0 original, 1 full right

                    this._source.connect(this._gainNode).connect(this._panNode).connect(ctx.destination);
                    this._source.start(0);
                } else {
                    console.warn('ZephyrJS Audio: ' + this.src + ' decoding is in progress.');
                }
            } else {
                Zephyr._audio.buffer(this.src);
                console.warn('ZephyrJS Audio: ' + this.src + ' has not been buffered, starting now.');
            }
        }
        d._stopper = function () {
            if (this._source) {
                this._source.stop(0);
                this._source.disconnect();
                this._source = null;
            }
        }
        d.from = function (src) {
            Zephyr._audio.buffer(src);
            return {
                _source: null,
                _gainNode: ctx.createGain(),
                _panNode: ctx.createStereoPanner(),
                gain: 1,
                pan: 0,
                start: d._starter,
                stop: d._stopper,
                src: src,
            };
        }
        return d;
    })(DirectAudio || {});

    // FILE IS BUGGY AND BAD
    var File = (function (f) {
        f.write = function (content, fName) {
            if (typeof content === "string") {
                const a = document.createElement('a');
                a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
                a.download = (typeof fName === "string") ? fName : document.title + '.txt';
                a.click();
                a.remove();
            } else {
                console.error("PIXI.File: Content to be written into " + fName + " is not a string.\nTry JSON.stringify(obj)?");
            }
        };
        f.open = function (type) {
            let res = { fulfilled: false, result: undefined };
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = (typeof type === "string") ? type : '*';
            input.addEventListener('change', function () {
                const reader = new FileReader();
                reader.readAsText(input.files[0]);
                reader.onload = function () {
                    res.fulfilled = true;
                    res.result = reader.result;
                };
            });
            input.click();
            input.remove();
            return res;
        };
        return f;
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
        p.from = function (src, maxCount) {
            let res = new PIXI.ParticleContainer(maxCount);
            res._init = p._init;
            res._spawnTimer = 0;
            res.baseTexture = PIXI.Texture.from(src);
            res.direction = 0;
            res.life = 128;
            res.maxCount = maxCount;
            res.rotate = false;
            res.scaling = 1;
            res.spawn = { x: 0, y: 0 };
            res.speed = 1;
            res.spread = 0;
            res.step = p._step;
            return res;
        }
        return p;
    })(Particles || {});

    var SpatialAudio = (function (s) {
        let ctx = Zephyr._audio.ctx;
        let buffers = Zephyr._audio.buffers;
        s._starter = function () {
            if (buffers.has(this.src)) {
                if (buffers.get(this.src)) {
                    s._stopper();
                    this._source = ctx.createBufferSource();
                    this._source.buffer = buffers.get(this.src);

                    this._gainNode.gain.value = this.gain; // 0 mute, 1 full
                    this._panNode.pan.value = this.pan; // -1 full left, 0 original, 1 full right

                    this._source.connect(this._gainNode).connect(this._panNode).connect(ctx.destination);
                    this._source.start(0);
                } else {
                    console.warn('ZephyrJS Audio: ' + this.src + ' decoding is in progress.');
                }
            } else {
                Zephyr._audio.buffer(this.src);
                console.warn('ZephyrJS Audio: ' + this.src + ' has not been buffered, starting now.');
            }
        }
        s._stopper = function () {
            if (this._source) {
                this._source.stop(0);
                this._source.disconnect();
                this._source = null;
            }
        }
        s.from = function (src) {
            Zephyr._audio.buffer(src);
            return {
                _source: null,
                _gainNode: ctx.createGain(),
                maxDistance: 10000,
                position: { x: 0, y: 0 },
                listener: { x: 0, y: 0 , angle: 0},
                start: s._starter,
                stop: s._stopper,
                src: src,
            };
        }
        return s;
    })(SpatialAudio || {});

    // UTILITIES (For some reason it's called index inside PIXI setup?)
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
    exports.collision = collision;
    exports.DirectAudio = DirectAudio;
    exports.File = File;
    exports.Keys = Keys;
    exports.Mouse = Mouse;
    exports.Particles = Particles;
    exports.SpatialAudio = SpatialAudio;
    exports.toggleFullScreen = toggleFullScreen;

    /* END ZEPHYR BUNDLE ZONE */
    exports.utils = index;

    return exports;
})(PIXI || {});
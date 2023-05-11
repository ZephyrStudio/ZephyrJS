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
        z.VERSION = '23.4.26'; // Version number, yy.mm.dd format
        z._audio = {};
        z._audio.buffers = new Map(); // Store all decoded audio buffers in one location
        z._audio.ctx = new AudioContext(); // More than one audio context causes lag
        z._audio.buffer = function (sound) {
            let onload = function (sound) {
                if (sound.autoplay) sound.start();
                if (typeof sound.onload === 'function') sound.onload();
            }
            if (!z._audio.buffers.get(sound.src)) {
                z._audio.buffers.set(sound.src, false);
                let r = new XMLHttpRequest();
                r.open('GET', sound.src, true);
                r.responseType = 'arraybuffer';
                r.onload = function () {
                    z._audio.ctx.decodeAudioData(r.response, function (buffer) {
                        z._audio.buffers.set(sound.src, buffer)
                        onload(sound);
                    });
                };
                r.send();
            } else {
                onload(sound);
            }
        };
        z.SpriteFix = {
            rect: function (s) { // Returns the actual x/y width/height of a scaled and anchored Sprite
                if (!s.scale) s.scale = { x: 1, y: 1 };
                let w = s.width * (s.scale.x < 0 ? -1 : 1);
                let h = s.height * (s.scale.y < 0 ? -1 : 1);
                return {
                    x: s.x - (s.anchor ? s.anchor.x * w : 0) + Math.min(0, w),
                    y: s.y - (s.anchor ? s.anchor.y * h : 0) + Math.min(0, h),
                    width: Math.abs(w),
                    height: Math.abs(h)
                }
            },
            circ: function (s) {
                if (!s.scale) s.scale = { x: 1, y: 1 };
                return {
                    x: (0.5 - s.anchor.x) * s.width * (s.scale.x < 0 ? -1 : 1) + s.x,
                    y: (0.5 - s.anchor.y) * s.height * (s.scale.y < 0 ? -1 : 1) + s.y,
                    r: (s.width + s.height) * 0.25
                }
            }
        }
        z.useAudio = () => { console.error('ZephyrJS: useAudio() is deprecated') };
        z.useFile = () => { console.error('ZephyrJS: useFile() is deprecated') };
        z.useKeys = () => { console.error('ZephyrJS: useKeys() is deprecated') };
        z.useMouse = () => { console.error('ZephyrJS: useMouse() is deprecated') };
        z.useParticles = () => { console.error('ZephyrJS: useParticles() is deprecated') };
        return z;
    })(Zephyr || {});

    // Collision
    var collision = (function (c) {
        c.rectangle = function (a, b) { // Axis-Aligned Bounding Box method
            let aFix = PIXI.Zephyr.SpriteFix.rect(a);
            let bFix = PIXI.Zephyr.SpriteFix.rect(b);
            return !(aFix.x + a.width < bFix.x || aFix.y + a.height < bFix.y || aFix.x > bFix.x + b.width || aFix.y > bFix.y + b.height);
        };
        c.circle = function (a, b) { // Circle collision, for objects a and b
            let aFix = PIXI.Zephyr.SpriteFix.circ(a);
            let bFix = PIXI.Zephyr.SpriteFix.circ(b);
            return Math.hypot(bFix.x - aFix.x, bFix.y - aFix.y) <= aFix.r + bFix.r;
        };
        return c;
    })(collision || {});

    // DirectAudio
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
                    this._source.loop = this.loop; // True loop, False don't
                    this._panNode.pan.value = this.pan; // -1 full left, 0 original, 1 full right
                    this._source.playbackRate.value = this.speed; // Change speed

                    this._source.connect(this._gainNode).connect(this._panNode).connect(ctx.destination);
                    this._source.start(0);
                } else {
                    console.warn('ZephyrJS DirectAudio: ' + this.src + ' decoding is in progress.');
                }
            } else {
                Zephyr._audio.buffer(this.src);
                console.warn('ZephyrJS DirectAudio: ' + this.src + ' has not been buffered, starting now.');
            }
        }
        d._stopper = function () {
            if (this._source) {
                this._source.stop(0);
                this._source.disconnect();
                this._source = null;
            }
        }
        d.from = function (arg, onload) {
            let DSound = {
                _source: null,
                _gainNode: ctx.createGain(),
                _panNode: ctx.createStereoPanner(),
                autoplay: false,
                gain: 1.0,
                loop: false,
                onload: onload,
                pan: 0.0,
                speed: 1,
                src: null,
                start: d._starter,
                stop: d._stopper
            };
            switch (typeof arg) {
                case 'string':
                    DSound.src = arg;
                    Zephyr._audio.buffer(DSound);
                    break;
                case 'object':
                    DSound = {
                        ...DSound,
                        ...arg
                    }
                    Zephyr._audio.buffer(DSound);
                    break;
            }
            return DSound;
        }
        return d;
    })(DirectAudio || {});

    // File
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
        f.open = function (arg, onload) {
            let res = {
                fulfilled: false,
                onload: onload,
                result: null,
                type: '*'
            };
            switch (typeof arg) {
                case 'string':
                    res.type = arg;
                    break;
                case 'object':
                    res = {
                        ...res,
                        ...arg
                    }
                    break;
            }
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = res.type;
            input.addEventListener('change', function () {
                const reader = new FileReader();
                reader.readAsText(input.files[0]);
                reader.onload = function () {
                    res.fulfilled = true;
                    res.result = reader.result;
                    if (typeof res.onload === 'function') res.onload();
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

    // Mouse
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

    // Particles
    var Particles = (function (p) {
        p._init = function (particle) {
            let r = (Math.random() - 0.5) * this.spread + this.direction;
            particle.move = { x: this.distance / (this.life * 0.001) * Math.cos(r), y: this.distance / (this.life * 0.001) * Math.sin(r) };
            particle.x = this.spawn.x;
            particle.y = this.spawn.y;
            particle.life = this.life;
            particle.scale.x = particle.scale.y = this.scaling;
            if (this.rotate)
                particle.rotation = r + Math.PI * 0.5;
        };
        p._step = function (elapsedMS) {
            let msPerParticle = this.life / this.maxCount;
            this.children.forEach(p => {
                if ((p.life -= elapsedMS) < 0) {
                    this.removeChild(p);
                } else {
                    p.x += p.move.x * elapsedMS * 0.001;
                    p.y += p.move.y * elapsedMS * 0.001;
                }
            });
            if (this.children.length < this.maxCount && this.fresh) {
                this._spawnTimer -= elapsedMS;
                while (this._spawnTimer < 0) {
                    let p = new PIXI.Sprite(this.baseTexture);
                    p.anchor = { x: 0.5, y: 0.5 }
                    this._init(p);
                    this.addChild(p);
                    this._spawnTimer += msPerParticle;
                }
            }
        };
        p.from = function (arg1, arg2) {
            const DEFAULTS = {
                _init: p._init,
                _spawnTimer: 0,
                direction: 0,
                distance: 256,
                life: 1000,
                maxCount: 512,
                rotate: false,
                scaling: 1,
                spawn: { x: 0, y: 0 },
                spread: Math.PI * 0.5,
                step: p._step
            }
            let res;
            switch (typeof arg1) {
                case 'string':
                    res = new PIXI.ParticleContainer(arg2);
                    for (const k in DEFAULTS) res[k] = DEFAULTS[k];
                    res.baseTexture = PIXI.Texture.from(arg1);
                    res.maxCount = arg2;
                    res.src = arg1;
                    break;
                case 'object':
                    res = new PIXI.ParticleContainer(arg1.maxCount);
                    for (const k in DEFAULTS) res[k] = DEFAULTS[k];
                    for (const k in arg1) res[k] = arg1[k];
                    res.baseTexture = PIXI.Texture.from(arg1.src);
                    break;
            }
            return res;
        }
        return p;
    })(Particles || {});

    // SpatialAudio - In progress
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
                    console.warn('ZephyrJS SpatialAudio: ' + this.src + ' decoding is in progress.');
                }
            } else {
                Zephyr._audio.buffer(this.src);
                console.warn('ZephyrJS SpatialAudio: ' + this.src + ' has not been buffered, starting now.');
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
            console.warning("Creating SpatialAudio of " + src + ". Please not this is VERY unstable currently")
            Zephyr._audio.buffer(src);
            return {
                _source: null,
                _gainNode: ctx.createGain(),
                maxDistance: 10000,
                position: { x: 0, y: 0 },
                listener: { x: 0, y: 0, angle: 0 },
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

    /* END ZEPHYR BUNDLE ZONE */
    exports.utils = index;

    return exports;
})(PIXI || {});
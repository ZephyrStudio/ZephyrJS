"use strict"
PIXI.Zephyr = {
    version: "ZephyrJS 23.4.13",
    compatible: "PixiJS v7.2.4",
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
    useKeys: () => {
        PIXI.Keys = {
            _map: new Map(),
            down: (key) => {
                if (PIXI.Keys._map.size > 0 && PIXI.Keys._map.has(key)) {
                    PIXI.Keys._map.set(key, false);
                    return true;
                }
                return false;
            },
            fired: (key) => {
                if (PIXI.Keys._map.size > 0 && PIXI.Keys._map.get(key)) {
                    PIXI.Keys._map.set(key, false);
                    return true;
                }
                return false;
            },
        };
        // EVENTS //
        window.addEventListener('keydown', (e) => {
            PIXI.Keys._map.set(e.code, true);
        });
        window.addEventListener('keyup', (e) => {
            PIXI.Keys._map.delete(e.code);
        });
    },
    useMouse: () => {
        PIXI.Mouse = {
            // COORDS //
            _bounds: document.getElementsByTagName("html")[0].getBoundingClientRect(),
            _container: document.getElementsByTagName("html")[0],
            x: 0,
            y: 0,
            anchor: { x: 0, y: 0 },
            width: 1,
            height: 1,
            setContainer: (view) => {
                let b = view.getBoundingClientRect();
                if (b.width * b.height == 0) {
                    console.error("Cannot use PIXI.Mouse.setContainer() with an invalid element.");
                } else {
                    PIXI.Mouse._container = view;
                    PIXI.Mouse._bounds = PIXI.Mouse._container.getBoundingClientRect();
                }
            },
            // BUTTONS //
            _ALIAS: ["Primary", "Middle", "Secondary"],
            _map: new Map(),
            down: (btn) => {
                if (PIXI.Mouse._map.size > 0 && PIXI.Mouse._map.has(btn)) {
                    PIXI.Mouse._map.set(btn, false);
                    return true;
                }
                return false;
            },
            fired: (btn) => {
                if (PIXI.Mouse._map.size > 0 && PIXI.Mouse._map.get(btn)) {
                    PIXI.Mouse._map.set(btn, false);
                    return true;
                }
                return false;
            }
        }
        // EVENTS //
        window.onresize = () => {
            PIXI.Mouse._bounds = PIXI.Mouse._container.getBoundingClientRect();
        }
        window.addEventListener('mouseup', (e) => {
            PIXI.Mouse._map.delete(PIXI.Mouse._ALIAS[e.button]);
        });
        window.addEventListener('mousedown', (e) => {
            PIXI.Mouse._map.set(PIXI.Mouse._ALIAS[e.button], true);
        });
        window.addEventListener('mousemove', (e) => {
            PIXI.Mouse.x = (e.x - PIXI.Mouse._bounds.left + window.pageXOffset) / PIXI.Mouse._bounds.width * PIXI.Mouse._container.width;
            PIXI.Mouse.y = (e.y - PIXI.Mouse._bounds.top + window.pageYOffset) / PIXI.Mouse._bounds.height * PIXI.Mouse._container.height;
        });
    },
    useAudio: () => {
        PIXI.Audio = {
            _ctx: new AudioContext(),
            _buffers: new Map(), // Stores all audio buffers
            _player: function () { // Shared function for all Audio objects
                if (PIXI.Audio._buffers.has(this.src)) {
                    let aud = PIXI.Audio._ctx.createBufferSource();
                    aud.buffer = PIXI.Audio._buffers.get(this.src);
                    this._gainNode.gain.value = this.volume;
                    aud.connect(this._gainNode).connect(PIXI.Audio._ctx.destination);
                    aud.start(0);
                }
            },
            from: (src) => {
                let r = new XMLHttpRequest();
                r.open('GET', src, true);
                r.responseType = 'arraybuffer';

                r.onload = () => { // Decode asynchronously
                    PIXI.Audio._ctx.decodeAudioData(r.response, function (buffer) {
                        PIXI.Audio._buffers.set(src, buffer); // Store audio buffer once
                    })
                }
                r.send();
                return { _gainNode: PIXI.Audio._ctx.createGain(), src: src, volume: 1, play: PIXI.Audio._player };
            }
        }
    },
    useFile: () => {
        PIXI.File = {
            write: async (object, fName) => {
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
            },
            open: async () => {
                [fileHandle] = await window.showOpenFilePicker();
                let file = await fileHandle.getFile();
                let contents = await file.text();
                return JSON.parse(contents);
            }
        }
    },
    useParticles: () => {
        PIXI.Particles = {
            _step: function (deltaTime) {
                const init = (p) => {
                    let r = (Math.random() - 0.5) * this.spread + this.direction;
                    p.alpha = 1;
                    p.move = { x: this.speed * Math.cos(r), y: this.speed * Math.sin(r) };
                    p.x = this.spawn.x;
                    p.y = this.spawn.y;
                    p.life = this.life;
                    p.scale.x = p.scale.y = this.scaling;
                    if (this.rotate)
                        p.rotation = r + Math.PI * 0.5;
                }
                this.children.forEach(p => {
                    if ((p.life -= deltaTime * this.speed) <= 0) {
                        if (this.fresh)
                            init(p);
                        else
                            this.removeChild(p);
                    } else {
                        p.x += p.move.x * deltaTime;
                        p.y += p.move.y * deltaTime;
                    }

                });
                if (this.children.length < this.maxCount && this.fresh) {
                    this._spawnTimer -= deltaTime;
                    if (this._spawnTimer <= 0) {
                        this._spawnTimer = this.life / this.maxCount;
                        let p = new PIXI.Sprite(this.baseTexture);
                        p.anchor = { x: 0.5, y: 0.5 }
                        init(p);
                        this.addChild(p);
                    }
                }
            },
            from: (src, maxCount, options) => {
                if (!options) options = {};
                let res = new PIXI.ParticleContainer(maxCount);
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
                res.step = PIXI.Particles._step;
                return res;
            }
        }
    }
}

// Collision testing methods
PIXI.collision = {
    aabb: (a, b) => { // Axis-Aligned Bounding Box method
        let aFix = PIXI.Zephyr._spriteFix(a);
        let bFix = PIXI.Zephyr._spriteFix(b);
        return !(
            aFix.x + a.width < bFix.x ||
            aFix.y + a.height < bFix.y ||
            aFix.x > bFix.x + b.width ||
            aFix.y > bFix.y + b.height
        );
    },
    radius: (a, b) => { // Circle collision, for objects a and b
        return Math.hypot(a.x - b.x + (a.width - b.width) * 0.5, a.y - b.y + (a.height - b.height) * 0.5) <= (Math.max(a.width, a.height) + Math.max(b.width, b.height)) * 0.5;
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
PIXI.toggleFullScreen = (view) => {
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
// Stop rClick
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log("%cUsing " + PIXI.Zephyr.version + "! https://github.com/OttCS/ZephyrJS", "color:#ef6f6c");
console.log("%cCompatible with " + PIXI.Zephyr.compatible, "color:#ea1e63")
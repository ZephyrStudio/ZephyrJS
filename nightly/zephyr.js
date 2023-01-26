"use strict"
PIXI.Keys = {};
PIXI.Mouse = {};
PIXI.Audio = {};
PIXI.File = {};
PIXI.Particles = {};

PIXI.Zephyr = {
    version: "ZephyrJS 23.1.26",
    compatible: "PixiJS v7.1.1",
    useKeys: () => {
        PIXI.Keys.map = new Map();
        PIXI.Keys.down = (key) => {
            if (PIXI.Keys.map.size > 0 && PIXI.Keys.map.has(key)) {
                PIXI.Keys.map.set(key, false);
                return true;
            }
            return false;
        };
        PIXI.Keys.fired = (key) => {
            if (PIXI.Keys.map.size > 0 && PIXI.Keys.map.get(key)) {
                PIXI.Keys.map.set(key, false);
                return true;
            }
            return false;
        };

        window.addEventListener('keydown', (e) => {
            PIXI.Keys.map.set(e.code, true);
        });
        window.addEventListener('keyup', (e) => {
            PIXI.Keys.map.delete(e.code);
        });
    },
    useMouse: () => {
        PIXI.Mouse.bounds = document.getElementsByTagName("html")[0].getBoundingClientRect();
        PIXI.Mouse.container = document.getElementsByTagName("html")[0];
        PIXI.Mouse.x = -1;
        PIXI.Mouse.y = -1;
        PIXI.Mouse.setContainer = (view) => {
            let b = view.getBoundingClientRect();
            if (b.width * b.height == 0) {
                console.error("Cannot use PIXI.Mouse.setContainer() with an invalid element.");
            } else {
                PIXI.Mouse.container = view;
                PIXI.Mouse.bounds = PIXI.Mouse.container.getBoundingClientRect();
            }
        }
        window.onresize = () => {
            PIXI.Mouse.bounds = PIXI.Mouse.container.getBoundingClientRect();
        }
        window.onscroll = () => {
            PIXI.Mouse.bounds = PIXI.Mouse.container.getBoundingClientRect();
            PIXI.Mouse.bounds.left -= window.pageXOffset;
            PIXI.Mouse.bounds.top -= window.pageYOffset;
        }

        PIXI.Mouse.alias = ["Primary", "Middle", "Secondary"];

        PIXI.Mouse.map = new Map();
        PIXI.Mouse.down = (btn) => {
            if (PIXI.Mouse.map.size > 0 && PIXI.Mouse.map.has(btn)) {
                PIXI.Mouse.map.set(btn, false);
                return true;
            }
            return false;
        }

        PIXI.Mouse.fired = (btn) => {
            if (PIXI.Mouse.map.size > 0 && PIXI.Mouse.map.get(btn)) {
                PIXI.Mouse.map.set(btn, false);
                return true;
            }
            return false;
        }

        window.addEventListener('mouseup', (e) => {
            PIXI.Mouse.map.delete(PIXI.Mouse.alias[e.button]);
        });
        window.addEventListener('mousedown', (e) => {
            PIXI.Mouse.map.set(PIXI.Mouse.alias[e.button], true);
        });
        window.addEventListener('mousemove', (e) => {
            PIXI.Mouse.x = (e.x - PIXI.Mouse.bounds.left) / PIXI.Mouse.bounds.width * PIXI.Mouse.container.width;
            PIXI.Mouse.y = (e.y - PIXI.Mouse.bounds.top) / PIXI.Mouse.bounds.height * PIXI.Mouse.container.height;
        });
    },
    useAudio: () => {
        PIXI.Audio.ctx = new AudioContext();
        PIXI.Audio.buffers = new Map();
        PIXI.Audio.player = function () {
            if (PIXI.Audio.buffers.has(this.src)) {
                let aud = PIXI.Audio.ctx.createBufferSource();
                aud.buffer = PIXI.Audio.buffers.get(this.src);
                aud.connect(PIXI.Audio.ctx.destination);
                aud.start(0);
            }
        }
        PIXI.Audio.from = (src) => {
            let r = new XMLHttpRequest();
            r.open('GET', src, true);
            r.responseType = 'arraybuffer';

            // Decode asynchronously
            r.onload = () => {
                PIXI.Audio.ctx.decodeAudioData(r.response, function (buffer) {
                    PIXI.Audio.buffers.set(src, buffer);
                });
            }
            r.send();
            return {
                src: src,
                play: PIXI.Audio.player
            }
        }
    },
    useFile: () => {
        PIXI.File.write = async (object, fName) => {
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
        PIXI.File.open = async () => {
            [fileHandle] = await window.showOpenFilePicker();
            let file = await fileHandle.getFile();
            let contents = await file.text();
            return JSON.parse(contents);
        };
    },
    useParticles: () => {
        PIXI.Particles.from = (src, size) => {
            let res = new PIXI.ParticleContainer(size);
            res.baseTexture = PIXI.Texture.from(src);
            res.life = 128;
            res.speed = 1;
            res.direction = 0;
            res.spread = 6.2831853072;
            res.spawnTime = 0;
            res._initParticle = (p) => {
                let r = (Math.random() - 0.5) * res.spread + res.direction;
                p.move = { x: res.speed * Math.cos(r), y: res.speed * Math.sin(r) };
                p.x = p.y = 0;
                p.life = res.life;
                return p;
            }
            res.step = (deltaTime) => {
                if (res.children.length < size) {
                    res.spawnTime -= deltaTime;
                    if (res.spawnTime <= 0) {
                        res.spawnTime = res.life / size;
                        let p = res._initParticle(new PIXI.Sprite(res.baseTexture));
                        p.anchor = { x: 0.5, y: 0.5 }
                        res.addChild(p);
                    }
                }
                res.children.forEach(p => {
                    p.x += p.move.x * deltaTime;
                    p.y += p.move.y * deltaTime;
                    if ((p.life -= deltaTime * res.speed) <= 0)
                        p = res._initParticle(p);
                });
            }
            return res;
        }
    },
    helper: {
        spriteFix: (s) => { // Returns the actual x/y width/height of a scaled and anchored Sprite
            let w = s.width * (s.scale ? s.scale.x : 1);
            let h = s.height * (s.scale ? s.scale.y : 1);
            return {
                x: s.x - (s.anchor ? s.anchor.x * w : 0) + Math.min(0, w),
                y: s.y - (s.anchor ? s.anchor.y * h : 0) + Math.min(0, h),
                width: Math.abs(w),
                height: Math.abs(h)
            }
        }
    }
}
// Collision testing methods
PIXI.collision = {
    aabb: (a, b) => { // Axis-Aligned Bounding Box method
        let aFix = PIXI.Zephyr.helper.spriteFix(a);
        let bFix = PIXI.Zephyr.helper.spriteFix(b);
        return !(
            aFix.x + a.width < bFix.x ||
            aFix.y + a.height < bFix.y ||
            aFix.x > bFix.x + b.width ||
            aFix.y > bFix.y + b.height
        );
    },
    radius: (a, b) => { // Circle collision, for objects a and b, provided they ha
        let aFix = PIXI.Zephyr.helper.spriteFix(a);
        let bFix = PIXI.Zephyr.helper.spriteFix(b);
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
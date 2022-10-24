"use strict"
PIXI.Keys = {};
PIXI.Mouse = {};
PIXI.Audio = {};
PIXI.File = {};

PIXI.Zephyr = {
    color: {
        PRIMARY: "#ef6f6c",
        WARNING: "#f0cf6b",
        SUCCESS: "#6bf097",
        MESSAGE: "#6c6fef",
        ADVANCE: "#a36cef",
        PIXIJS: "#ea1e63",
    },
    version: "ZephyrJS 22.10.22",
    compatible: "PixiJS v6.5.7",
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
            e.preventDefault();
            PIXI.Keys.map.set(e.code, true);
        });
        window.addEventListener('keyup', (e) => {
            PIXI.Keys.map.delete(e.code);
        });
    },
    useMouse: () => {
        PIXI.Mouse.bounds = document.getElementsByTagName("html")[0].getBoundingClientRect();
        PIXI.Mouse.container = document.getElementsByTagName("html")[0];
        PIXI.Mouse.x = screen.width / 2;
        PIXI.Mouse.y = screen.height / 2;
        PIXI.Mouse.setContainer = (view) => {
            PIXI.Mouse.container = view;
            PIXI.Mouse.bounds = PIXI.Mouse.container.getBoundingClientRect();
        }
        window.onresize = () => {
            PIXI.Mouse.bounds = PIXI.Mouse.container.getBoundingClientRect();
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
    spriteFix: (s) => { // "Fixes" the provided sprite/object for use with the collision functions, adjusting for anchor positions
        let anchor = (s.anchor ? s.anchor : { x: 0, y: 0 });
        return {
            x: -s.width * anchor.x + s.x,
            y: -s.height * anchor.y + s.y,
            width: s.width,
            height: s.height
        }
    }
}
// Collision testing methods
PIXI.collision = {
    aabb: (a, b) => { // Axis-Aligned Bounding Box method
        let aFix = PIXI.Zephyr.spriteFix(a);
        let bFix = PIXI.Zephyr.spriteFix(b);
        return !(
            aFix.x + a.width < bFix.x ||
            aFix.y + a.height < bFix.y ||
            aFix.x > bFix.x + b.width ||
            aFix.y > bFix.y + b.height
        );
    },
    radius: (a, b) => { // Circle collision, for objects a and b, provided they ha
        let aFix = PIXI.Zephyr.spriteFix(a);
        let bFix = PIXI.Zephyr.spriteFix(b);
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
PIXI.utils.requestFullScreen = (view) => {
    if (view.requestFullscreen)
        view.requestFullscreen();
    else if (view.webkitRequestFullscreen)
        view.webkitRequestFullscreen();
    else if (view.msRequestFullscreen)
        view.msRequestFullscreen();
}
// Stop rClick
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

console.log("%cUsing " + PIXI.Zephyr.version + "! https://github.com/OttCS/ZephyrJS", "color:" + PIXI.Zephyr.color.PRIMARY);
console.log("%cCompatible with " + PIXI.Zephyr.compatible, "color:" + PIXI.Zephyr.color.PIXIJS)
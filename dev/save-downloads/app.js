const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x111111 });
app.view.id = "PIXI";
document.body.appendChild(app.view);

const ballTex = PIXI.Texture.from('assets/ball.png');

const scene = new PIXI.Container();
app.stage.addChild(scene);

let bouncer = PIXI.Sprite.from(ballTex);
bouncer.anchor = { x: 0.5, y: 0.5 };
bouncer.x = app.view.width * 0.5;
bouncer.y = app.view.height * 0.5;
bouncer.mVec = { x: 0, y: 0 };
scene.addChild(bouncer);

let paused = false;

app.ticker.add(async (deltaTime) => {
    if (!paused) {
        bouncer.x += bouncer.mVec.x += (Math.random() - 0.5 + PIXI.input.getKeyDown("d") - PIXI.input.getKeyDown("a")) * 0.1 * deltaTime + app.view.width;
        bouncer.x %= app.view.width;
        bouncer.y += bouncer.mVec.y += (Math.random() - 0.5) * 0.1 * deltaTime + app.view.height;
        bouncer.y %= app.view.height;
    
        if (PIXI.input.getKeyFired("s")) {
            paused = true;
            let msg = await PIXI.utils.saveObjectToFile("bouncerGameSave" + Date.now(), {
                health: Math.random() * 100,
                inventory: [null],
                playerName: "Joe Mama",
                x: bouncer.x,
                y: bouncer.y,
                mVec: bouncer.mVec
            });
            paused = false;
        } else if (PIXI.input.getKeyFired("o")) {
            paused = true;
            let loadedState = await PIXI.utils.readObjectFromFile();
            if (loadedState) {
                bouncer.x = loadedState.x;
                bouncer.y = loadedState.y;
                bouncer.mVec = loadedState.mVec;
            }
            paused = false;
        }
    }
});

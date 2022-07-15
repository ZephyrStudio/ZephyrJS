const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0xffffff });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

PIXI.utils.TextureCache["assets/rage.png", "assets/sleepy.png"];

const menu = new PIXI.Container();
app.stage.addChild(menu);

const scene = new PIXI.ParticleContainer();
app.stage.addChild(scene);

const states = {
    start: false,
    fellas: new Set()
}

const textStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 64
});

const startText = new PIXI.Text("Click to start", textStyle);
startText.x = app.view.width * 0.5;
startText.y = app.view.height * 0.4;
startText.anchor = {x: 0.5, y: 0.5};
menu.addChild(startText);

const infoText = new PIXI.Text("[F]ullscreen", textStyle);
infoText.x = app.view.width * 0.5;
infoText.y = app.view.height * 0.6;
infoText.anchor = {x: 0.5, y: 0.5};
menu.addChild(infoText);

app.ticker.add((deltaTime) => {
    if (PIXI.input.getKeyFired("f")) {
        PIXI.utils.openFullScreen(app.view);
    }
    if (!states.start) {

        menu.visible = true;
        scene.visible = false;

        states.start = PIXI.input.getMouseFired(0);
    } else {

        scene.visible = true;
        menu.visible = false;

        if (PIXI.input.getMouseFired(0)) {
            let newFella = PIXI.Sprite.from("assets/rage.png");
            newFella.x = PIXI.input.getMouseX() * app.view.width;
            newFella.y = PIXI.input.getMouseY() * app.view.height;
            newFella.vec = {x: Math.random() - 0.5, y: 0};
            newFella.anchor = {x: 0.5, y: 0.5};
            states.fellas.add(newFella);
            scene.addChild(newFella);
        }

        states.fellas.forEach((fella) => {
            if (fella.y >= app.view.height) {
                fella.vec.x = (Math.random() - 0.5) * fella.vec.y * 0.2;
                fella.vec.y *= -.96;
                fella.y = app.view.height;
            }
            if (fella.x <= 0 || fella.x >= app.view.width) {
                fella.vec.x *= -.96;
            }
            fella.vec.y += 1;
            fella.x += fella.vec.x;
            fella.y += fella.vec.y;
        })

    }
});
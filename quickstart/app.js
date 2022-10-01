PIXI.Zephyr.useMouse();
PIXI.Zephyr.useKeys();
PIXI.Zephyr.useAudio();

const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x333333 });
app.view.id = "PIXI";
document.body.appendChild(app.view);
PIXI.Mouse.setContainer(app.view);

PIXI.utils.TextureCache['assets/character.png'];

const character = PIXI.Sprite.from('assets/character.png');
character.anchor = {x: 0.5, y: 0.5};
character.vector = {x: 0, y: 0}

app.stage.addChild(character);

app.ticker.add((deltaTime) => {
    if (PIXI.Keys.fired("KeyF")) {
        PIXI.utils.requestFullScreen(app.view);
    }
    if (PIXI.Mouse.down("Primary")) {
        character.vector.x = PIXI.Mouse.x - character.x;
        character.vector.y = PIXI.Mouse.y - character.y;
    }
    character.x += character.vector.x;
    character.y += character.vector.y;

});
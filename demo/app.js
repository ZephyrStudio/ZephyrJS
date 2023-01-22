PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST
PIXI.Zephyr.useMouse();

const app = new PIXI.Application({ width: screen.width, height: screen.height * .9 - 72, backgroundColor: 0xf0f0f0 });
app.view.id = "DISPLAY";
document.querySelector('#gameShowcase').appendChild(app.view);
PIXI.Mouse.setContainer(app.view);

const tex = {
    bg: PIXI.Texture.from('/demo/assets/Purple.png'),
    player: PIXI.Texture.from('/demo/assets/character2x.png'),
    planet: PIXI.Texture.from('/demo/assets/planet.png'),
}

let backdrop = new PIXI.TilingSprite(tex.bg);
backdrop.width = app.view.width;
backdrop.height = app.view.height;
backdrop.anchor = { x: 0, y: 0 };
app.stage.addChild(backdrop);

let planet = new PIXI.Sprite(tex.planet);
planet.anchor = { x: 0.5, y: 0.5 };
app.stage.addChild(planet);

let player = new PIXI.Sprite(tex.player);
player.anchor = { x: 0.5, y: 1 };
player.x = app.view.width * 0.5;
player.y = app.view.height;
player.scale.y = 1;
player.vec = { x: 0, y: 0 };
app.stage.addChild(player);

let fTime = 0;

app.ticker.add((deltaTime) => {
    planet.x = PIXI.Mouse.x;
    planet.y = PIXI.Mouse.y;
    fTime *= 0.99;
    fTime += 0.01 * deltaTime;
    if (player.y > app.view.height) {
        player.vec.y = 0;
        player.y = app.view.height;
    }
    if (player.x - PIXI.Mouse.x > 16) {
        player.scale.x = -player.scale.y;
    } else if (PIXI.Mouse.x - player.x > 16) {
        player.scale.x = player.scale.y;
    }

    player.vec.x = player.vec.x * 0.995 + 0.005 * PIXI.clamp(PIXI.Mouse.x - player.x, -8, 8) * deltaTime;
    player.vec.y = player.vec.y * 0.995 + 0.005 * PIXI.clamp(PIXI.Mouse.y - planet.height * 0.5 - player.y, -8, 8) * deltaTime;
    player.x += player.vec.x;
    player.y += player.vec.y;
});
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
player.vec = { x: 0, y: 0 };
player.turnTarget = {x: 1, y: 1};
player.speedMult = 8;
app.stage.addChild(player);

app.ticker.add((deltaTime) => {
    planet.x = (PIXI.clamp(PIXI.Mouse.x, 0, app.view.width) + 0.5) ^ 0;
    planet.y = (PIXI.clamp(PIXI.Mouse.y, 0, app.view.height) + 0.5) ^ 0;
    if (player.x - planet.x > 32) {
        player.turnTarget.x = -1;
    } else if (planet.x - player.x > 32) {
        player.turnTarget.x = 1;
    }
    player.scale.y = PIXI.clamp(planet.y - player.y, -16, 16) / 16;

    player.scale.x += 0.26 * (player.turnTarget.x - player.scale.x) * deltaTime;

    let x = planet.x - player.x;
    let y = planet.y - planet.height * 0.5 - player.y;
    let h = Math.hypot(x, y) / player.speedMult + 1;
    player.vec.x = player.vec.x * 0.995 + 0.005 * (x / h) * deltaTime;
    player.vec.y = player.vec.y * 0.995 + 0.005 * (y / h) * deltaTime;
    player.x += player.vec.x;
    player.y += player.vec.y;
});
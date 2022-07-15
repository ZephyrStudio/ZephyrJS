// SYSTEM SETUP
const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x333333, antialias: false });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

const diceImg = [PIXI.Texture.from("assets/character.png"), PIXI.Texture.from("assets/one.png"), PIXI.Texture.from("assets/two.png"), PIXI.Texture.from("assets/three.png"), PIXI.Texture.from("assets/four.png"), PIXI.Texture.from("assets/five.png"), PIXI.Texture.from("assets/six.png")];

const dangerTint = [0xffff00, 0xffff00, 0xffcc00, 0xff9900, 0xff6600, 0xff3300, 0xff0000];
const lifeTint = [0xff8877, 0xff9988, 0xffaa99, 0xffbbaa, 0xffccbb, 0xffddcc, 0xffeedd];
// USEFUL FUNCTIONS

const clamp = (x, min, max) => {
    return Math.min(Math.max(x, min), max);
}

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GAME SETUP

const scene = new PIXI.Container();
app.stage.addChild(scene);

const allocationScreen = new PIXI.Container();
app.stage.addChild(allocationScreen);

const menu = new PIXI.Container();
app.stage.addChild(menu);

const states = {
    start: true,
    pause: false,
    allocation: false,
    life: 6,
    speed: 3,
    speedMult: 3,
    jump: 3,
    jumpMult: 2,
    danger: 3,
    dangerSpawnBoost: 0,
    level: 0,
    dangerCount: 0,
}

const phys = {
    bounce: 0.4
}

const textStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 64,
    fontWeight: 600,
    fill: ['#F3FFBD']
});


// Menu stuff
const startText = new PIXI.Text("Click to start", textStyle);
startText.x = app.view.width * 0.5;
startText.y = app.view.height * 0.4;
startText.anchor = { x: 0.5, y: 0.5 };
menu.addChild(startText);

const infoText = new PIXI.Text("[F]ullscreen", textStyle);
infoText.x = app.view.width * 0.5;
infoText.y = app.view.height * 0.6;
infoText.anchor = { x: 0.5, y: 0.5 };
menu.addChild(infoText);



// Allocation stuff
const topMessage = new PIXI.Text("Ms. Fortune rolls again!", textStyle)
topMessage.x = app.view.width * 0.5;
topMessage.y = app.view.height * 0.1;
topMessage.anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(topMessage);

const newRolls = [3, 3, 3, 3];

const rollSprite = [];

rollSprite[0] = new PIXI.Sprite.from(diceImg[3]);
rollSprite[0].x = app.view.width * 0.2;
rollSprite[0].y = app.view.height * 0.2;
rollSprite[0].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(rollSprite[0]);

rollSprite[1] = new PIXI.Sprite.from(diceImg[3]);
rollSprite[1].x = app.view.width * 0.4;
rollSprite[1].y = app.view.height * 0.2;
rollSprite[1].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(rollSprite[1]);

rollSprite[2] = new PIXI.Sprite.from(diceImg[3]);
rollSprite[2].x = app.view.width * 0.6;
rollSprite[2].y = app.view.height * 0.2;
rollSprite[2].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(rollSprite[2]);

rollSprite[3] = new PIXI.Sprite.from(diceImg[3]);
rollSprite[3].x = app.view.width * 0.8;
rollSprite[3].y = app.view.height * 0.2;
rollSprite[3].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(rollSprite[3]);

// Scene stuff
const player = PIXI.Sprite.from(diceImg[6]);
player.x = app.view.width * 0.5;
player.y = app.view.height;
player.anchor = { x: 0.5, y: 1.0 };
player.vec = { x: 0, y: 0 };
player.tint = 0x33ff44;
scene.addChild(player);

const objectSet = new Set();
const dangerSet = new Set();

const pauseText = new PIXI.Text("Paused [Esc]", textStyle);
pauseText.x = app.view.width * 0.5;
pauseText.y = app.view.height * 0.5;
pauseText.anchor = { x: 0.5, y: 0.5 };
pauseText.visible = false;
scene.addChild(pauseText);

menu.visible = false;
scene.visible = true;
allocationScreen.visible = false;

// PLAY GAME

app.ticker.add((deltaTime) => {
    if (PIXI.input.getKeyFired("f")) {
        PIXI.utils.openFullScreen(app.view);
    }
    if (!states.start) {

        menu.visible = true;
        scene.visible = false;
        allocationScreen.visible = false;

        states.start = PIXI.input.getMouseFired(0);
    } else {

        menu.visible = false;

        if (!states.pause && PIXI.input.getKeyFired("escape")) {
            states.pause = true;
            pauseText.visible = true;
        }

        if (states.allocation) {

            scene.visible = false;
            allocationScreen.visible = true;

        } else if (!states.pause) {

            allocationScreen.visible = false;
            scene.visible = true;

            let t = Math.max(states.life, 1);
            player.texture = diceImg[t];
            player.tint = lifeTint[t];

            // X velocity
            player.vec.x = clamp(player.vec.x * (1 - (0.1 * deltaTime) * (player.vec.y == 0)) + (PIXI.input.getKeyDown("d") - PIXI.input.getKeyDown("a")) * (player.vec.y == 0) * states.speedMult, states.speed * -states.speedMult, states.speed * states.speedMult);

            // Y velocity
            if (player.y < app.view.height) {
                player.vec.y += 1 + 1.5 * (!PIXI.input.getKeyDown("w") || (player.vec.y > 0));
            } else {
                if (PIXI.input.getKeyFired("w")) {
                    player.vec.y = -14 - states.jump * states.jumpMult;
                } else {
                    player.vec.y = 0;
                    player.y = app.view.height;
                }
            }

            // Player X position
            player.x += player.vec.x;
            if (player.x < player.width * 0.5) {
                player.x = player.width * 0.5;
                player.vec.x *= -phys.bounce;
            } else if (player.x > app.view.width - player.width * 0.5) {
                player.x = (app.view.width - player.width * 0.5);
                player.vec.x *= -phys.bounce;
            }
            // Player Y position
            player.y = Math.min(player.y + player.vec.y, app.view.height) ^ 0;

            // Dangers
            dangerSet.forEach((danger) => {
                switch (danger.type) {
                    case 0:
                        danger.vec.y++;
                        danger.y = (danger.y + danger.vec.y) ^ 0;
                        if (danger.y >= app.view.height) {
                            danger.y = app.view.height;
                            danger.vec.y *= -phys.bounce;
                            danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                            if (danger.vec.y < -2) {
                                danger.facing = rand(1, 6);
                                danger.texture = diceImg[danger.facing];
                                danger.tint = dangerTint[danger.facing];
                            }
                        }
                        danger.x = (danger.x + danger.vec.x) ^ 0;
                        if (danger.x < danger.width * 0.5) {
                            danger.x = danger.width * 0.5;
                            danger.vec.x *= -phys.bounce;
                        } else if (danger.x > app.view.width - danger.width * 0.5) {
                            danger.x = app.view.width - danger.width * 0.5;
                            danger.vec.x *= -phys.bounce;
                        }
                        break;
                }
                if (PIXI.collision.aabb(player, danger)) {
                    states.life -= danger.facing;
                    scene.removeChild(danger);
                    dangerSet.delete(danger);
                } else if (Math.abs(danger.vec.y) < 0.25 && danger.y == app.view.height) {
                    states.dangerCount++;
                    scene.removeChild(danger);
                    dangerSet.delete(danger);
                }
            });

            if (dangerSet.size < states.danger + states.level && Math.random() < 0.0002 + states.dangerSpawnBoost) {
                states.dangerSpawnBoost = 0;
                let num = rand(1, 6);
                let newDanger = PIXI.Sprite.from(diceImg[num]);
                newDanger.type = 0;
                newDanger.facing = num;
                switch (newDanger.type) {
                    case 0:
                        newDanger.width = 64;
                        newDanger.height = 64;
                        newDanger.y = 0;
                        newDanger.x = clamp(player.x + ((Math.random() - 0.5) * app.view.width), newDanger.width * 0.5, app.view.width - newDanger.width * 0.3) ^ 0;
                        newDanger.vec = {
                            x: 0,
                            y: 0
                        }
                        newDanger.anchor = {
                            x: 0.5,
                            y: 1.0
                        }
                        newDanger.tint = dangerTint[num];
                        break;
                }
                scene.addChild(newDanger);
                dangerSet.add(newDanger);
            } else {
                states.dangerSpawnBoost += 0.0001 * (states.danger + states.level);
            }

            if (states.dangerCount >= 28 + states.level * 2) {
                states.dangerCount = 0;
                states.level++;
                states.pause = true;
                states.allocation = true;
                newRolls[0] = rand(1, 6)
                rollSprite[0].texture = diceImg[newRolls[0]];
                newRolls[1] = rand(1, 6);
                rollSprite[1].texture = diceImg[newRolls[1]];
                newRolls[2] = rand(1, 6);
                rollSprite[2].texture = diceImg[newRolls[2]];
                newRolls[3] = rand(1, 6);
                rollSprite[3].texture = diceImg[newRolls[3]];
            }

        } else {
            if (PIXI.input.getKeyFired("escape")) {
                states.pause = false;
                pauseText.visible = false;
            }
        }

    }
});
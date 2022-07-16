// SYSTEM SETUP
const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x111111, antialias: false });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

const diceImg = [null, PIXI.Texture.from("assets/one.png"), PIXI.Texture.from("assets/two.png"), PIXI.Texture.from("assets/three.png"), PIXI.Texture.from("assets/four.png"), PIXI.Texture.from("assets/five.png"), PIXI.Texture.from("assets/six.png")];

const sound = {
    hurt: PIXI.sound.Sound.from("assets/hurt.mp3"),
}

// const dangerTint = [0xffffff, 0xffff00, 0xffcc00, 0xff9900, 0xff6600, 0xff3300, 0xff0000];
const dangerTint = [0xffffff, 0xff20ff, 0x8020ff, 0x2020ff, 0x2080ff, 0x20ffff, 0x20ff80];

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

const bloomContainer = new PIXI.ParticleContainer();
bloomContainer.visible = false;
app.stage.addChild(bloomContainer);

const allocationScreen = new PIXI.Container();
app.stage.addChild(allocationScreen);

const menuContainer = new PIXI.Container();
app.stage.addChild(menuContainer);

const states = {
    start: false,
    allocation: false,
    life: 6,
    speed: 3,
    speedMult: 3,
    jump: 3,
    jumpMult: 3,
    danger: 3,
    dangerSpawnBoost: 0,
    level: 0,
    dangerCount: 0,
    score: 0
}

const phys = {
    bounce: 0.4,
    shake: 64
}

const textStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 32,
    fontWeight: 600,
    fill: ["#ffffff"]
});

// Menu stuff
const menu = {
    score: new PIXI.Text("", textStyle),
    info: new PIXI.Text("  [F] to enter fullscreen\n\n [A] is left, [D] is right\n[W] is jump, [S] is to drop\n\nGetting hit by an enemy die\n will lower your health by\n the shown number, jumping\n on top of it will restore\n your health by the number\n\n\n          Press [E]", textStyle)
}

menu.score = new PIXI.Text("", textStyle);
menu.score.x = app.view.width * 0.5;
menu.score.y = app.view.height * 0.05;
menu.score.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.score);

menu.info.x = app.view.width * 0.5;
menu.info.y = app.view.height * 0.5;
menu.info.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.info);

// Allocation stuff
const topMessage = new PIXI.Text("Lady Luck rolls again!", textStyle)
topMessage.x = app.view.width * 0.5;
topMessage.y = app.view.height * 0.1;
topMessage.anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(topMessage);

let newRolls = [];

let rollSprite = [];

const statName = [];

statName[0] = new PIXI.Text("Jump Height", textStyle)
statName[0].x = app.view.width * 0.2;
statName[0].y = app.view.height * 0.4;
statName[0].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(statName[0]);

statName[1] = new PIXI.Text("Top Speed", textStyle)
statName[1].x = app.view.width * 0.4;
statName[1].y = app.view.height * 0.4;
statName[1].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(statName[1]);

statName[2] = new PIXI.Text("Difficulty", textStyle)
statName[2].x = app.view.width * 0.6;
statName[2].y = app.view.height * 0.4;
statName[2].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(statName[2]);

statName[3] = new PIXI.Text("Starting Health", textStyle)
statName[3].x = app.view.width * 0.8;
statName[3].y = app.view.height * 0.4;
statName[3].anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(statName[3]);

const directions = new PIXI.Text("Press [W] try your luck in the next level...", textStyle)
directions.x = app.view.width * 0.5;
directions.y = app.view.height * 0.9;
directions.anchor = { x: 0.5, y: 0.5 };
directions.visible = false;
allocationScreen.addChild(directions);

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

const score = new PIXI.Text(0, textStyle)
score.x = app.view.width * 0.5;
score.y = app.view.height * 0.05;
score.anchor = { x: 0.5, y: 0.5 };
scene.addChild(score);

// PLAY GAME

app.ticker.add((deltaTime) => {
    if (PIXI.input.getKeyFired("f")) {
        PIXI.utils.openFullScreen(app.view);
    }
    if (!states.start || states.life <= 0) {

        menuContainer.visible = true;
        scene.visible = false;
        allocationScreen.visible = false;
        menu.score.text = "Level " + states.level + " | " + states.score + " points";

        if (PIXI.input.getKeyFired("e")) {
            states.start = true;
            states.allocation = true;
            states.life = 6;
            states.speed = 3;
            states.speedMult = 2;
            states.jump = 3;
            states.jumpMult = 3;
            states.danger = 3;
            states.dangerSpawnBoost = 0;
            states.level = 0;
            states.dangerCount = 0;
            states.score = 0;

            player.x = app.view.width * 0.5;
            player.y = app.view.height;
            player.anchor = { x: 0.5, y: 1.0 };
            player.vec = { x: 0, y: 0 };
        }
    } else {

        menuContainer.visible = false;

        if (states.allocation) {

            scene.visible = false;
            allocationScreen.visible = true;

            if (rollSprite.length == 0) {
                for (let i = 0; i < 4; i++) {
                    let num = rand(1, 6);
                    rollSprite[i] = new PIXI.Sprite.from(diceImg[num]);
                    rollSprite[i].x = (app.view.width * (i + 1) * 0.2) ^ 0;
                    rollSprite[i].y = (0.3 * app.view.height) ^ 0;
                    rollSprite[i].anchor = { x: 0.5, y: 1 };
                    rollSprite[i].facing = num;
                    rollSprite[i].tint = dangerTint[7 - num];
                    rollSprite[i].vec = { x: 0, y: 0 };
                    rollSprite[i].roll = true;
                    rollSprite[i].slot = i;
                    allocationScreen.addChild(rollSprite[i]);
                }
            }

            rollSprite.forEach((danger) => {
                if (danger.roll) {
                    danger.vec.y++;
                    danger.y = (danger.y + danger.vec.y) ^ 0;
                    if (danger.y >= app.view.height) {
                        danger.y = app.view.height;
                        danger.vec.y *= -phys.bounce;
                        danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                        if (danger.vec.y < -1) {
                            danger.facing = rand(1, 6);
                            danger.texture = diceImg[danger.facing];
                            danger.tint = dangerTint[7 - danger.facing];
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
                    if (Math.abs(danger.vec.y) < 0.25 && danger.y == app.view.height) {
                        newRolls[danger.slot] = danger.facing;
                        danger.x = ((danger.slot + 1) * 0.2 * app.view.width) ^ 0;
                        danger.y = (0.3 * app.view.height) ^ 0;
                        danger.roll = false;
                    }
                }
            });

            if (newRolls.length == 4) {
                directions.visible = true;
                if (PIXI.input.getKeyFired("w")) {
                    states.dangerCount = 0;
                    states.level++;
                    states.allocation = false;
                    states.jump = newRolls[0];
                    states.speed = newRolls[1];
                    states.danger = newRolls[2];
                    states.life = newRolls[3];
                    for (let i = 0; i < 4; i++) {
                        allocationScreen.removeChild(rollSprite[i]);
                    }
                    rollSprite = [];
                    newRolls = [];
                    directions.visible = false;

                    dangerSet.forEach((danger) => {
                        scene.removeChild(danger);
                        dangerSet.delete(danger);
                    });
                    scene.x = 0; // Reset screen shake
                }
            }

        } else {
            allocationScreen.visible = false;
            scene.visible = true;

            if (scene.x != 0) {
                scene.x += (0 - scene.x) * 1.875;
            }

            let t = Math.max(states.life, 1);
            player.texture = diceImg[t];
            player.tint = lifeTint[t];

            score.text = "Level " + states.level + " | " + states.score + " points, " + (25 + states.level * 5 - states.dangerCount) + " dice left";

            // X velocity
            player.vec.x = clamp(player.vec.x * (1 - (0.1 * deltaTime) * (player.vec.y == 0)) + (PIXI.input.getKeyDown("d") - PIXI.input.getKeyDown("a")) * (player.vec.y == 0) * states.speedMult, (states.speed + 2) * -states.speedMult, (states.speed + 2) * states.speedMult);

            // Y velocity
            if (player.y < app.view.height) {
                player.vec.y += 1 + 1.5 * (!PIXI.input.getKeyDown("w") || (player.vec.y > 0)) + 2.5 * PIXI.input.getKeyDown("s");
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
                danger.vec.y++;
                danger.y = (danger.y + danger.vec.y) ^ 0;
                if (danger.y >= app.view.height) {
                    danger.y = app.view.height;
                    danger.vec.y *= -phys.bounce;
                    danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                    if (danger.vec.y < -2) {
                        states.score += danger.facing;
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
                if (PIXI.collision.aabb(player, danger)) {
                    if (player.y + player.height * 0.35 < danger.y) {
                        // Jumped on top, score up AND heal AND bounce
                        states.life = clamp(states.life + danger.facing, 1, 6)
                        player.vec.y = -24 - states.jump * states.jumpMult;
                        states.score += danger.facing * 3;
                        states.dangerCount++;
                    } else {
                        // Hit by danger, lose life
                        states.life -= danger.facing;
                        scene.x += phys.shake;
                        sound.hurt.play();
                    }
                    scene.removeChild(danger);
                    dangerSet.delete(danger);
                } else if (Math.abs(danger.vec.y) < 0.25 && danger.y == app.view.height) {
                    states.score += danger.facing;
                    states.dangerCount++;
                    scene.removeChild(danger);
                    dangerSet.delete(danger);
                }
            });

            if (dangerSet.size < states.danger + states.level && Math.random() < states.dangerSpawnBoost) {
                states.dangerSpawnBoost = 0;
                let num = rand(1, 6);
                let newDanger = PIXI.Sprite.from(diceImg[num]);
                newDanger.facing = num;
                newDanger.width = 64;
                newDanger.height = 64;
                newDanger.y = 0;
                newDanger.x = clamp(player.x + ((Math.random() - 0.5) * app.view.width), newDanger.width * 0.5, app.view.width - newDanger.width * 0.5) ^ 0;
                newDanger.vec = {
                    x: 0,
                    y: 0
                }
                newDanger.anchor = {
                    x: 0.5,
                    y: 1.0
                }
                newDanger.tint = dangerTint[num];
                scene.addChild(newDanger);
                dangerSet.add(newDanger);
            } else {
                states.dangerSpawnBoost += 0.00005 * (states.danger + states.level);
            }

            if (states.dangerCount >= 25 + states.level * 5) {
                states.allocation = true;
            }
        }

    }
});
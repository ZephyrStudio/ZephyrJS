// SYSTEM SETUP
const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x000000, antialias: false });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

const diceImg = [null, PIXI.Texture.from("assets/one.png"), PIXI.Texture.from("assets/two.png"), PIXI.Texture.from("assets/three.png"), PIXI.Texture.from("assets/four.png"), PIXI.Texture.from("assets/five.png"), PIXI.Texture.from("assets/six.png")];

const img = {
    bg: PIXI.Texture.from("assets/background.png"),
    edgeLight: PIXI.Texture.from("assets/edgeLight.png"),
}

const sound = {
    hit: [PIXI.sound.Sound.from("assets/hitS.wav"), PIXI.sound.Sound.from("assets/hitM.wav"), PIXI.sound.Sound.from("assets/hitL.wav")],
    bounce: [PIXI.sound.Sound.from("assets/bounceS.wav"), PIXI.sound.Sound.from("assets/bounceM.wav"), PIXI.sound.Sound.from("assets/bounceL.wav")]
}

// const dangerTint = [0xffffff, 0xffff00, 0xffcc00, 0xff9900, 0xff6600, 0xff3300, 0xff0000];
const dangerTint = [
    0xffffff,
    0xD92BBC,
    0xD92B9F,
    0xD92B82,
    0xD92B65,
    0xD92B48,
    0xD92B2B
];

const lifeTint = [
    0xff8877,
    0xff9988,
    0xffaa99,
    0xffbbaa,
    0xffccbb,
    0xffddcc,
    0xffeedd
];

const bgTint = [
    0x100808,
    0x34092D,
    0x340926,
    0x34091F,
    0x340917,
    0x340910,
    0x340909
]

const ladyLuck = [
    "Lady Luck: Ah, my favorite little die... WHAT?!? You don't want to work for me anymore? Let's see how lucky you are without me!",
    "Lady Luck: Look at that, a die on a hot streak. I play by my own rules though, so let's change yours!",
    "Lady Luck: You keep on getting lucky breaks... Makes sense for a die.",
    "Lady Luck: I don't have time for these games of chance... What? What do you mean that's all I do?!",
    "Lady luck: Come back and I'll decide your fate... What do you mean that sounds unfair?",
    "Lady Luck: Alright, you've had your fun, give me a second chance?",
    "Lady Luck: Your luck's bound to run out soon, I'm not giving you any more!",
    "YOU'VE BEAT LADY LUCK!\n\nKeep playing to see how far you can push your luck!"
]

// USEFUL FUNCTIONS

const clamp = (x, min, max) => {
    return Math.min(Math.max(x, min), max);
}

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GAME SETUP
let bg = PIXI.Sprite.from(img.bg);
bg.anchor = { x: 0.5, y: 0 };
bg.x = 0.5 * app.view.width;
bg.y = 0;
app.stage.addChild(bg);

const scene = new PIXI.Container();
app.stage.addChild(scene);

const allocationScreen = new PIXI.Container();
app.stage.addChild(allocationScreen);

const menuContainer = new PIXI.Container();
app.stage.addChild(menuContainer);

const states = {
    start: false,
    menu: true,
    requestAllocationRolls: false,
    allocation: false,
    life: 3,
    speed: 3,
    speedMult: 2,
    jump: 3,
    jumpMult: 3,
    danger: 3,
    dangerSpawnBoost: 0,
    level: 0,
    dangerCount: 0,
    score: 0
}

const phys = {
    bThresh: 2,
    bounce: 0.4,
    shake: 64
}

const textStyle = new PIXI.TextStyle({
    align: "center",
    wordWrap: true,
    wordWrapWidth: 1200,
    fontFamily: "Courier New",
    fontSize: 32,
    fontWeight: 300,
    fill: ["#ffffff"]
});

// Menu stuff
const menu = {
    score: new PIXI.Text("", textStyle),
    title: new PIXI.Text("Lucky Break", new PIXI.TextStyle({
        align: "center",
        fill: [
            "#d92bbc",
            "#d92b2b"
        ],
        fillGradientType: 1,
        fontFamily: "Courier New",
        fontSize: 192,
        letterSpacing: -16,
    })),
    options: new PIXI.Text("Start [←]\t\t\t\tControls [↓]\t\t\t\tAbout [→]", textStyle),
    info: new PIXI.Text("", textStyle)
}

menu.score.x = app.view.width * 0.5;
menu.score.y = app.view.height * 0.1;
menu.score.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.score);

menu.title.x = app.view.width * 0.5;
menu.title.y = app.view.height * 0.3;
menu.title.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.title);

menu.options.x = app.view.width * 0.5;
menu.options.y = app.view.height * 0.5;
menu.options.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.options);

menu.info.x = app.view.width * 0.5;
menu.info.y = app.view.height * 0.75;
menu.info.anchor = { x: 0.5, y: 0.5 };
menuContainer.addChild(menu.info);

// Allocation stuff
const topMessage = new PIXI.Text("Lady Luck's Rules:", textStyle)
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

const allocation = {
    ladyLuck: new PIXI.Text("Text", new PIXI.TextStyle({
        align: "center",
        wordWrap: true,
        wordWrapWidth: 1200,
        fontFamily: "Courier New",
        fontSize: 32,
        fontWeight: 300,
        fill: ["#D92B2B"]
    })),
}

allocation.ladyLuck.x = app.view.width * 0.5;
allocation.ladyLuck.y = app.view.height * 0.65;
allocation.ladyLuck.anchor = { x: 0.5, y: 0.5 };
allocationScreen.addChild(allocation.ladyLuck);

const directions = new PIXI.Text("Test your luck in the next round... [↑]", textStyle)
directions.x = app.view.width * 0.5;
directions.y = app.view.height * 0.9;
directions.anchor = { x: 0.5, y: 0.5 };
directions.visible = false;
allocationScreen.addChild(directions);

// Scene stuff
const gameOver = new PIXI.Text("Looks like that's the end of your lucky break... [↑]", new PIXI.TextStyle({
    align: "center",
    wordWrap: true,
    wordWrapWidth: 1200,
    fontFamily: "Courier New",
    fontSize: 32,
    fontWeight: 300,
    fill: ["#D92B2B"]
}));

gameOver.x = app.view.width * 0.5;
gameOver.y = app.view.height * 0.9;
gameOver.anchor = { x: 0.5, y: 0.5 };
gameOver.visible = false;
scene.addChild(gameOver);

const player = PIXI.Sprite.from(diceImg[6]);
player.x = app.view.width * 0.5;
player.y = app.view.height;
player.anchor = { x: 0.5, y: 1.0 };
player.vec = { x: 0, y: 0 };
player.tint = 0xffffff;
player.allowJump = true;
scene.addChild(player);

const objectSet = new Set();
const dangerSet = new Set();

const score = new PIXI.Text(0, textStyle)
score.x = app.view.width * 0.5;
score.y = app.view.height * 0.1;
score.anchor = { x: 0.5, y: 0.5 };
scene.addChild(score);

const edgeLight = PIXI.Sprite.from(img.edgeLight);
edgeLight.anchor = { x: 0.5, y: 0 };
edgeLight.x = 0.5 * app.view.width;
edgeLight.y = 0;
edgeLight.alpha = 0.25;
app.stage.addChild(edgeLight);

// PLAY GAME

app.ticker.add((deltaTime) => {

    if (PIXI.input.getKeyFired("f")) {
        PIXI.utils.openFullScreen(app.view);
    }

    // Shake screen and flare lights
    app.stage.x *= -0.75;
    edgeLight.alpha -= (edgeLight.alpha > 0.25) * 0.01;

    if (!states.start || states.menu) {
        menuContainer.visible = true;
        scene.visible = false;
        allocationScreen.visible = false;
        menu.score.text = "Previous Run: " + states.level + " round" + (states.level == 1 ? "" : "s") + ", " + states.score + " points";

        bg.tint = bgTint[0];

        if (PIXI.input.getKeyFired("arrowleft")) {
            menu.info.text = "";
            states.start = true;
            states.menu = false;
            states.allocation = true;
            states.requestAllocationRolls = false;
            states.life = 3;
            states.speed = 3;
            states.speedMult = 2;
            states.jump = 3;
            states.jumpMult = 3;
            states.danger = 3;
            states.dangerSpawnBoost = 0;
            states.level = 0;
            states.dangerCount = 0;
            states.score = 0;

            newRolls = [3, 3, 3, 3];
        } else if (PIXI.input.getKeyFired("arrowdown")) {
            menu.info.text = "Fullscreen [F]\n\nJump [↑]\tLeft [←]\tDrop [↓]\tRight [→]\n\nDodge or destroy Lady Luck's falling dice. Getting hit by one will lower your health by the number shown, but jumping on top of it will heal you by that same amount, and net you some extra points based on the risk! Take a chance and roll the dice!";
        } else if (PIXI.input.getKeyFired("arrowright")) {
            menu.info.text = 'You play as a die, fed up with Lady Luck telling you what to do, but trying to break away is easier said than done.\n\nThis game was made for the GMTK Game Jam 2022, with the theme "Roll of the Dice." The role of artist, programmer, and game designer were all filled by Cooper Ott.';
        }
    } else {

        menuContainer.visible = false;

        if (states.allocation) {

            scene.visible = false;
            allocationScreen.visible = true;

            allocation.ladyLuck.text = ladyLuck[clamp(states.level, 0, ladyLuck.length - 1)];

            bg.tint = bgTint[0];

            if (states.requestAllocationRolls) {
                if (rollSprite.length == 0) {
                    for (let i = 0; i < 4; i++) {
                        let num = rand(1, 6);
                        rollSprite[i] = new PIXI.Sprite.from(diceImg[num]);
                        rollSprite[i].x = app.view.width * (i + 1) * 0.2;
                        rollSprite[i].y = 0.3 * app.view.height;
                        rollSprite[i].anchor = { x: 0.5, y: 1 };
                        rollSprite[i].facing = num;
                        rollSprite[i].tint = dangerTint[7 - num];
                        rollSprite[i].vec = { x: rand(-16, 16), y: rand(-16, 16) };
                        rollSprite[i].roll = true;
                        rollSprite[i].slot = i;
                        allocationScreen.addChild(rollSprite[i]);
                    }
                }
            } else if (rollSprite.length == 0) {
                for (let i = 0; i < 4; i++) {
                    rollSprite[i] = new PIXI.Sprite.from(diceImg[newRolls[i]]);
                    rollSprite[i].x = app.view.width * (i + 1) * 0.2;
                    rollSprite[i].y = 0.3 * app.view.height;
                    rollSprite[i].anchor = { x: 0.5, y: 1 };
                    rollSprite[i].facing = newRolls[i];
                    rollSprite[i].tint = dangerTint[7 - newRolls[i]];
                    rollSprite[i].vec = { x: 0, y: 0 };
                    rollSprite[i].roll = false;
                    rollSprite[i].slot = i;
                    allocationScreen.addChild(rollSprite[i]);
                }
            }


            rollSprite.forEach((danger) => {
                if (danger.roll) {
                    danger.vec.y += deltaTime;
                    danger.y += danger.vec.y * deltaTime;
                    if (danger.y >= app.view.height) {
                        danger.y = app.view.height;
                        danger.vec.y *= -phys.bounce;
                        danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                        if (danger.vec.y < -2) {
                            danger.facing = rand(1, 6);
                            danger.texture = diceImg[danger.facing];
                            danger.tint = dangerTint[7 - danger.facing];
                            sound.bounce[rand(0, 2)].play();
                        }
                    }
                    danger.x += danger.vec.x;
                    if (danger.x < danger.width * 0.5) {
                        danger.x = danger.width * 0.5;
                        danger.vec.x *= -phys.bounce;
                    } else if (danger.x > app.view.width - danger.width * 0.5) {
                        danger.x = app.view.width - danger.width * 0.5;
                        danger.vec.x *= -phys.bounce;
                    }
                    if (Math.abs(danger.vec.y) < phys.bThresh && danger.y == app.view.height) {
                        newRolls[danger.slot] = danger.facing;
                        danger.x = (danger.slot + 1) * 0.2 * app.view.width;
                        danger.y = 0.3 * app.view.height;
                        danger.roll = false;
                    }
                }
                danger.x = (danger.x + 0.5) ^ 0;
                danger.y ^= 0;
            });

            if (newRolls.length == 4) {
                directions.text = "Test your luck in round " + (states.level + 1) + "... [↑]"
                directions.visible = true;
                if (PIXI.input.getKeyFired("arrowup")) {
                    states.level++;
                    states.dangerCount = states.level * 10 + 10;
                    states.allocation = false;
                    states.jump = newRolls[0];
                    states.speed = newRolls[1];
                    states.danger = newRolls[2];
                    states.life = newRolls[3];

                    for (let i = 0; i < rollSprite.length; i++) {
                        allocationScreen.removeChild(rollSprite[i]);
                        rollSprite[i] = null;
                    }
                    rollSprite = [];

                    newRolls = [];
                    directions.visible = false;

                    bg.tint = bgTint[rand(1, bgTint.length - 1)];

                    dangerSet.forEach((danger) => {
                        scene.removeChild(danger);
                        dangerSet.delete(danger);
                    });

                    player.x = app.view.width * 0.5;
                    player.y = app.view.height;
                    player.anchor = { x: 0.5, y: 1.0 };
                    player.vec = { x: 0, y: 0 };
                    player.allowJump = true;
                }
            }

        } else {
            allocationScreen.visible = false;
            scene.visible = true;

            player.texture = diceImg[clamp(states.life, 0, 6)];
            player.tint = lifeTint[clamp(states.life, 0, 6)];

            score.text = "Round " + states.level + ", " + states.score + " points, " + states.dangerCount + " remaining";

            if (states.life > 0) {            // X velocity
                player.vec.x *= 1 - (0.2 * player.allowJump * deltaTime);
                player.vec.x += (states.speedMult * states.speed * player.allowJump * (PIXI.input.getKeyDown("arrowright") - PIXI.input.getKeyDown("arrowleft")) * deltaTime);
                player.vec.x = clamp(player.vec.x, (states.speed + 2) * -states.speedMult, (states.speed + 2) * states.speedMult);

                // Y velocity
                player.vec.y += (2 * PIXI.input.getKeyDown("arrowdown")) * deltaTime;
                if (player.allowJump && PIXI.input.getKeyFired("arrowup")) {
                    sound.bounce[rand(1, 2)].play();
                    player.allowJump = false;
                    player.vec.y = -14 - states.jump * states.jumpMult;
                }
            } else {
                gameOver.visible = true;
                if (PIXI.input.getKeyFired("arrowup")) {
                    states.menu = true;
                    gameOver.visible = false;
                }
            }

            // Player X position
            player.x += player.vec.x * deltaTime;
            if (player.x < player.width * 0.5) {
                player.x = player.width * 0.5;
                player.vec.x *= -phys.bounce;
            } else if (player.x > app.view.width - player.width * 0.5) {
                player.x = (app.view.width - player.width * 0.5);
                player.vec.x *= -phys.bounce;
            }
            player.x = (player.x + 0.5) ^ 0;
            // Player Y position
            player.vec.y += (1 + (player.vec.y > 0)) * deltaTime;
            player.y += player.vec.y * deltaTime;
            if (player.y >= app.view.height) {
                if (!player.allowJump) sound.bounce[rand(0, 2)].play();
                player.y = app.view.height;
                player.allowJump = true;
            }
            player.y ^= 0;

            // Dangers
            dangerSet.forEach((danger) => {
                danger.vec.y += deltaTime;
                danger.y += danger.vec.y * deltaTime;
                if (danger.y >= app.view.height) {
                    danger.y = app.view.height;
                    danger.vec.y *= -phys.bounce;
                    danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                    if (danger.vec.y < -2) {
                        states.score += danger.facing * (states.life > 0);
                        danger.facing = rand(1, 6);
                        danger.texture = diceImg[danger.facing];
                        danger.tint = dangerTint[danger.facing];
                        sound.bounce[rand(0, 2)].play();
                    }
                }
                danger.x += danger.vec.x * deltaTime;
                if (danger.x < danger.width * 0.5) {
                    danger.x = danger.width * 0.5;
                    danger.vec.x *= -phys.bounce;
                } else if (danger.x > app.view.width - danger.width * 0.5) {
                    danger.x = app.view.width - danger.width * 0.5;
                    danger.vec.x *= -phys.bounce;
                }
                if (PIXI.collision.aabb(player, danger) && states.life > 0) {
                    if (player.y + player.height * 0.5 < danger.y && player.vec.y != 0) {
                        // Jumped on top, score up AND heal AND bounce
                        states.life = clamp(states.life + danger.facing, 1, 6)
                        player.y -= player.height;
                        player.vec.y = -14 - states.jump * states.jumpMult;
                        states.score += danger.facing * 5;
                        states.dangerCount--;
                        scene.removeChild(danger);
                        dangerSet.delete(danger);
                        edgeLight.alpha = 0.65;
                    } else {
                        // Hit by danger, lose life
                        states.life -= danger.facing;
                        app.stage.x += phys.shake;
                        danger.vec = { x: rand(-16, 16), y: -16 };
                        danger.y -= player.height;
                    }
                    sound.hit[rand(0, 2)].play();
                } else if (Math.abs(danger.vec.y) < phys.bThresh && danger.y == app.view.height) {
                    if (states.life > 0) {
                        states.score += danger.facing;
                        states.dangerCount--;
                    }
                    scene.removeChild(danger);
                    dangerSet.delete(danger);
                }
                danger.x = (danger.x + 0.5) ^ 0
                danger.y ^= 0;
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
                    y: rand(0, 4),
                }
                newDanger.anchor = {
                    x: 0.5,
                    y: 1.0
                }
                newDanger.tint = dangerTint[num];
                scene.addChild(newDanger);
                dangerSet.add(newDanger);
            } else {
                states.dangerSpawnBoost += 0.00003 * (states.danger + states.level * 3) * deltaTime;
            }

            if (states.dangerCount <= 0) {
                states.allocation = true;
                states.requestAllocationRolls = true;
            }
        }

    }
});
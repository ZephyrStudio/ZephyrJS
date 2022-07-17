// SYSTEM SETUP
const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x000000, antialias: false });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

const diceImg = [null, PIXI.Texture.from("assets/one.png"), PIXI.Texture.from("assets/two.png"), PIXI.Texture.from("assets/three.png"), PIXI.Texture.from("assets/four.png"), PIXI.Texture.from("assets/five.png"), PIXI.Texture.from("assets/six.png")];

const img = {
    bg: PIXI.Texture.from("assets/background.png"),
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
    0xff2211,
    0xff4433,
    0xff6655,
    0xff8877,
    0xffaa99,
    0xffccbb,
    0xffeedd
];

const bgTint = [
    0x100808,
    0x775533,
    0x557733,
    0x553377,
    0x335577,
    0x337755,
]

const ladyLuck = [
    "Ah, my favorite little die... WHAT?!? You don't want to work for me anymore? Let's see how lucky you are without me!",
    "Look at that, a die being on a hot streak. I play by my own rules though, so let's change yours!",
    "Enough chances, you keep on getting lucky breaks... Figures for a die.",
    "Will you quit it? A dice without luck is just a cube, come back and I'll decide your fate... What do you mean that sounds unfair?"
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

const particle = {
    tex: PIXI.Texture.from("assets/particle.png"),
    container: new PIXI.ParticleContainer(),
    set: new Set()
}

app.stage.addChild(particle.container);

const states = {
    start: false,
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
        letterSpacing: -7,
    })),
    options: new PIXI.Text("[A] Start\t\t\t\t[S] Controls\t\t\t\t[D] About", textStyle),
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
player.tint = 0xffffff;
player.allowJump = true;
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
score.y = app.view.height * 0.1;
score.anchor = { x: 0.5, y: 0.5 };
scene.addChild(score);

// PLAY GAME

app.ticker.add((deltaTime) => {

    if (PIXI.input.getKeyDown("f")) {
        PIXI.utils.openFullScreen(app.view);
    }

    // Shake screen return
    app.stage.x *= -0.75;

    // Particle decay
    particle.set.forEach((p) => {
        if (--p.life <= 0) {
            particle.container.removeChild(p);
            particle.set.delete(p);
        }
    });

    if (!states.start || states.life <= 0) {
        menuContainer.visible = true;
        scene.visible = false;
        allocationScreen.visible = false;
        particle.container.visible = false;
        menu.score.text = "Previous Run: " + states.level + " round" + (states.level == 1 ? "" : "s") + ", " + states.score + " points";

        bg.tint = bgTint[0];

        if (PIXI.input.getKeyFired("a")) {
            menu.info.text = "";
            states.start = true;
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

            player.x = app.view.width * 0.5;
            player.y = app.view.height;
            player.anchor = { x: 0.5, y: 1.0 };
            player.vec = { x: 0, y: 0 };
            player.allowJump = true;
        } else if (PIXI.input.getKeyFired("s")) {
            menu.info.text = "[F] Fullscreen\n\n[W] Jump\t[A] Left\t[S] Drop\t[D] Right\n\nDodge or destroy Lady Luck's falling dice. Getting hit by one will lower your health by the number shown, but jumping on top of it will destroy it and heal you by that same amount. Take a chance and roll the dice!";
        } else if (PIXI.input.getKeyFired("d")) {
            menu.info.text = 'This game was made for the GMTK Game Jam 2022, with the theme "Roll of the Dice". The role of artist, programmer, and game designer were all filled by Cooper Ott.\n\nYou are a die fed up with Lady Luck telling you what to do, but trying to break free is easier said than done';
        }
    } else {

        menuContainer.visible = false;

        if (states.allocation) {

            scene.visible = false;
            allocationScreen.visible = true;
            particle.container.visible = false;

            allocation.ladyLuck.text = "Lady Luck: " + ladyLuck[clamp(states.level, 0, ladyLuck.length)];

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
                    danger.y += danger.vec.y;
                    if (danger.y >= app.view.height) {
                        danger.y = app.view.height;
                        danger.vec.y *= -phys.bounce;
                        danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                        if (danger.vec.y < -1) {
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
                    if (Math.abs(danger.vec.y) < 0.25 && danger.y == app.view.height) {
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
                directions.visible = true;
                if (PIXI.input.getKeyFired("w")) {
                    states.level++;
                    states.dangerCount = 15 + states.level * 5;
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

                    bg.tint = dangerTint[rand(1, 6)];

                    dangerSet.forEach((danger) => {
                        scene.removeChild(danger);
                        dangerSet.delete(danger);
                    });
                }
            }

        } else {
            allocationScreen.visible = false;
            scene.visible = true;
            particle.container.visible = true;

            let t = Math.max(states.life, 1);
            player.texture = diceImg[t];
            player.tint = lifeTint[t];

            score.text = "Round " + states.level + ", " + states.score + " points, " + states.dangerCount + " remaining";

            // X velocity
            player.vec.x *= 1 - (0.2 * player.allowJump);
            player.vec.x += (states.speedMult * states.speed * player.allowJump * (PIXI.input.getKeyDown("d") - PIXI.input.getKeyDown("a")));
            player.vec.x = clamp(player.vec.x, (states.speed + 2) * -states.speedMult, (states.speed + 2) * states.speedMult);

            // Y velocity
            player.vec.y += (1 + (player.vec.y > 0) + 2 * PIXI.input.getKeyDown("s"));
            if (player.allowJump && PIXI.input.getKeyFired("w")) {
                player.allowJump = false;
                player.vec.y = -14 - states.jump * states.jumpMult;
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
            player.y += player.vec.y * deltaTime;
            if (player.y >= app.view.height) {
                player.y = app.view.height;
                player.allowJump = true;
                player.vec.y *= -phys.bounce * 0.1;
            }
            player.y ^= 0;

            // Dangers
            dangerSet.forEach((danger) => {
                danger.vec.y++;
                danger.y += danger.vec.y * deltaTime;
                if (danger.y >= app.view.height) {
                    danger.y = app.view.height;
                    danger.vec.y *= -phys.bounce;
                    danger.vec.x = danger.vec.x * phys.bounce + (Math.random() - 0.5) * danger.vec.y;
                    if (danger.vec.y < -2) {
                        states.score += danger.facing;
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
                if (PIXI.collision.aabb(player, danger)) {
                    if (player.y - player.vec.y * 0.5 < danger.y) {
                        // Jumped on top, score up AND heal AND bounce
                        states.life = clamp(states.life + danger.facing, 1, 6)
                        player.y -= player.height;
                        player.vec.y = -14 - states.jump * states.jumpMult;
                        states.score += danger.facing * 4;
                        states.dangerCount--;
                        scene.removeChild(danger);
                        dangerSet.delete(danger);
                    } else {
                        // Hit by danger, lose life
                        states.life -= danger.facing;
                        app.stage.x += phys.shake;
                        danger.vec = { x: rand(-16, 16), y: -16 };
                        danger.y -= player.height;
                    }
                    let i = 6;
                    while (--i >= 0) {
                        let p = PIXI.Sprite.from(particle.tex);
                        p.x = player.x + rand(-64, 64);
                        p.y = player.y + rand(-64, 64);
                        p.life = rand(15, 30);
                        p.tint = player.tint;
                        particle.set.add(p);
                        particle.container.addChild(p);
                    }
                    sound.hit[rand(0, 2)].play();
                } else if (Math.abs(danger.vec.y) < 0.25 && danger.y == app.view.height) {
                    states.score += danger.facing;
                    states.dangerCount--;
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
                states.dangerSpawnBoost += 0.00004 * (states.danger + states.level * 2);
            }

            if (states.dangerCount <= 0) {
                states.allocation = true;
                states.requestAllocationRolls = true;
            }
        }

    }
});
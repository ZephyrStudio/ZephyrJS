ZEPHYR.Application({ width: 640, height: 360, smooth: false, statistics: true });
ZEPHYR.appendScene(document.body);

ZEPHYR.utils.createKeyListener();

const pxScale = ZEPHYR.utils.getPixelScale();

const idleCount = 1000;

let camera = {
    x: 0.5,
    y: 0.5
}

let player = {
    src: "movement/idleUpLeft.png",
    x: 0.5,
    y: 0.9,
    speed: 0.07,
    movement: {
        x: 0,
        y: 0,
    }
};

window.onload = async () => {
    ZEPHYR.utils.setLayer("npc", {});
    ZEPHYR.utils.setLayer("main", {});
    ZEPHYR.utils.setLayer("fx", {opacity: 0.4, blend: "lighten"});
    let sources = [
        "movement/shyLeft.png",
        "movement/shyRight.png",
        "movement/sleepy.png",
        "movement/suspiciousLeft.png",
        "movement/suspiciousRight.png",
        "movement/idleDownRight.png",
        "movement/idleUpRight.png",
        "movement/idleDownleft.png",
        "movement/idleUpLeft.png"
    ];
    await ZEPHYR.utils.cacheAll(sources);
    await ZEPHYR.utils.cache("movement/light.png");
    ZEPHYR.utils.setSprite("player", { layer: "main", src: "movement/idleUpLeft.png", anchor: { x: 0.5, y: 1.0 }, draw: true, cameraDependantPosition: true });
    let i = 0;
    while (i++ < idleCount) {
        ZEPHYR.utils.setSprite("idle" + i, { layer: "npc", src: sources[(Math.random() * 5) | 0], x: Math.random() * 100 - 50, y: 0.9, anchor: { x: 0.5, y: 1.0 }, draw: true, cameraDependantPosition: true });
    }

    ZEPHYR.ticker.add(update);
}

update = (delta) => {
    if (player.y < 0.9) { // In air
        if (ZEPHYR.key.isDown("w") && player.movement.y < 0.0) {
            player.movement.y += pxScale.y * (0.03) * delta;
        } else {
            player.movement.y += pxScale.y * 0.08 * delta;
        }
        if (player.movement.x > 0.0) {
            player.src = "movement/idleDownRight.png";
        } else {
            player.src = "movement/idleDownleft.png";
        }
    } else {
        player.movement.y = 0;
        player.movement.x *= 0.8;
        if (ZEPHYR.key.isDown("d")) {
            player.src = "movement/idleUpRight.png";
            player.movement.x += pxScale.x * player.speed * delta;
        }
        if (ZEPHYR.key.isDown("a")) {
            player.src = "movement/idleUpLeft.png";
            player.movement.x -= pxScale.x * player.speed * delta;
        }
        if (ZEPHYR.key.isDown("w")) { // Request jump
            player.movement.y = pxScale.y * -10.0;
        }
    }
    player.x += player.movement.x;
    player.y = Math.min(player.y + player.movement.y, 0.9);
    ZEPHYR.utils.setSprite("player", player);

    camera.x = camera.x * 0.9 + player.x * 0.1; // Track player

    ZEPHYR.utils.setViewCenter(camera);
};
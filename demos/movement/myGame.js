ZEPHYR.Application({ width: 640, height: 360, smooth: false, statistics: true });
ZEPHYR.appendScene(document.body);

const pxScale = ZEPHYR.utils.getPixelScale();

const idleCount = 10000;

let camera = {
    x: 0.5,
    y: 0.5
}

let player = {
    src: "movement/idleUpLeft.png",
    x: 0.5,
    y: 0.9,
    speed: 1.0,
    movement: {
        x: 0,
        y: 0,
    }
};

window.onload = async () => {

    // ZEPHYR.utils.createMouseListener();
    ZEPHYR.utils.createKeyListener();

    ZEPHYR.utils.addLayer("npc");
    ZEPHYR.utils.addLayer("main");

    await ZEPHYR.utils.cache("movement/ground.png");
    await ZEPHYR.utils.cache("movement/idleDownRight.png");
    await ZEPHYR.utils.cache("movement/idleUpRight.png");
    await ZEPHYR.utils.cache("movement/idleDownleft.png");
    await ZEPHYR.utils.cache("movement/idleUpLeft.png");

    let sources = [
        "movement/shyLeft.png",
        "movement/shyRight.png",
        "movement/sleepy.png",
        "movement/suspiciousLeft.png",
        "movement/suspiciousRight.png",
    ];

    await ZEPHYR.utils.cache(sources[0]);
    await ZEPHYR.utils.cache(sources[1]);
    await ZEPHYR.utils.cache(sources[2]);
    await ZEPHYR.utils.cache(sources[3]);
    await ZEPHYR.utils.cache(sources[4]);

    ZEPHYR.utils.setSprite("player", { layer: "main", src: "movement/idleUpLeft.png", anchor: { x: 0.5, y: 1.0 }, draw: true, cameraDependantPosition: true });

    let i = 0;
    while (i++ < idleCount) {
        ZEPHYR.utils.setSprite("idle" + i, { layer: "npc", src: sources[(Math.random() * 5) | 0], x: Math.random() * 1000 - 500, y: 0.9, anchor: { x: 0.5, y: 1.0 }, draw: true, cameraDependantPosition: true })
    }

    update();
}

update = async () => {
    window.requestAnimationFrame(update);

    if (player.y < 0.9) { // In air
        player.movement.y += pxScale.y * (1.0 - (player.movement.y < 0) * 0.4);
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
            player.movement.x += pxScale.x * player.speed;
        }
        if (ZEPHYR.key.isDown("a")) {
            player.src = "movement/idleUpLeft.png";
            player.movement.x -= pxScale.x * player.speed;
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
}
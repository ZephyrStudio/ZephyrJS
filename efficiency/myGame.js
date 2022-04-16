ZEPHYR.Application({ width: 1920, height: 1080, smooth: false, statistics: true });

const pxScale = ZEPHYR.scene.pxScale;
let testCoconut = {};
let camera = {x: 0.5, y: 0.5};

window.onload = async () => {

    testCoconut = {
        src: "efficiency/coconut.png",
        health: 20,
        movement: 0,
        dialog: "I am a coconut",
        x: 0,
        y: 0
    }

    ZEPHYR.utils.createMouseListener();
    ZEPHYR.utils.createKeyListener();


    await ZEPHYR.utils.cache("efficiency/coconut.png");
    await ZEPHYR.utils.cache("efficiency/background.jpg");

    ZEPHYR.utils.addLayer("background");
    ZEPHYR.utils.addLayer("foreground");
    ZEPHYR.utils.addLayer("cursor");

    ZEPHYR.utils.setSprite("merryGoRound", { layer: "background", src: "efficiency/background.jpg", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    i = 0;
    while (i++ < 98) {
        ZEPHYR.utils.setSprite("coconut" + i, { layer: "foreground", src: "efficiency/coconut.png", x: Math.random() * 2.0 - 0.5, y: Math.random() * 2.0 - 0.5, anchor: { x: Math.random(), y: Math.random() }, draw: true, cameraDependantPosition: true });
    }

    ZEPHYR.utils.setSprite("cursor", { layer: "cursor", src: "efficiency/coconut.png", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    update();
}

update = async () => {
    window.requestAnimationFrame(update);

    camera.x += (ZEPHYR.key.isDown("d") - ZEPHYR.key.isDown("a")) * pxScale.x * 5;
    camera.y += (ZEPHYR.key.isDown("s") - ZEPHYR.key.isDown("w")) * pxScale.x * 5;
    ZEPHYR.utils.setViewCenter(camera);

    let i = 0;
    while (i++ < 98) {
        let c = ZEPHYR.utils.getSprite("coconut" + i);
        c.x += (Math.random() - 0.5) * pxScale.x;
        c.y += (Math.random() - 0.5) * pxScale.y;
        ZEPHYR.utils.setSprite("coconut" + i, c);
    }
    testCoconut.x = ZEPHYR.mouse.getX();
    testCoconut.y = ZEPHYR.mouse.getY();

    ZEPHYR.utils.setSprite("cursor", testCoconut);
}
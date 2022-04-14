ZEPHYR.Application({ width: 1920, height: 1080, smooth: false, statistics: true });

window.onload = async () => {

    ZEPHYR.utils.createMouseListener();
    ZEPHYR.utils.createKeyListener();

    ZEPHYR.utils.setTitle("coconut");

    await ZEPHYR.utils.cache("app/coconut.png");
    await ZEPHYR.utils.cache("app/background.jpg");

    ZEPHYR.utils.addLayer("background");
    ZEPHYR.utils.addLayer("foreground");
    ZEPHYR.utils.addLayer("cursor");

    ZEPHYR.utils.setSprite("merryGoRound", { layer: "background", src: "app/background.jpg", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    i = 0;
    while (i++ < 99) {
        ZEPHYR.utils.setSprite("coconut" + i, { layer: "foreground", src: "app/coconut.png", x: Math.random() * 2.0 - 0.5, y: Math.random() * 2.0 - 0.5, anchor: { x: Math.random(), y: Math.random() }, draw: true });
    }

    ZEPHYR.utils.setSprite("cursor", { layer: "cursor", src: "app/coconut.png", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    update();
}

update = async () => {
    window.requestAnimationFrame(update);
    let i = 0;
    while (i++ < 99) {
        let c = ZEPHYR.utils.getSprite("coconut" + i);
        c.x += (Math.random() - 0.5 + ZEPHYR.key.isDown("d") - ZEPHYR.key.isDown("a")) * ZEPHYR.scene.viewPx.x;
        c.y += (Math.random() - 0.5 + ZEPHYR.key.isDown("s") - ZEPHYR.key.isDown("w")) * ZEPHYR.scene.viewPx.y;
        ZEPHYR.utils.setSprite("coconut" + i, c);
    }
    let cursor = ZEPHYR.utils.getSprite("cursor");
    cursor.x = ZEPHYR.mouse.getX();
    cursor.y = ZEPHYR.mouse.getY();
    ZEPHYR.utils.setSprite("cursor", cursor);
}
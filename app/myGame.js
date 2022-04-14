ZEPHYR.Application({ width: 1920, height: 1080, smooth: false, statistics: true });

window.onload = async () => {

    ZEPHYR.utils.setTitle("coconut");

    await ZEPHYR.utils.cache("app/coconut.png");
    await ZEPHYR.utils.cache("app/background.jpg");

    ZEPHYR.utils.addLayer("background");
    ZEPHYR.utils.addLayer("foreground");

    ZEPHYR.utils.setSprite("merryGoRound", { layer: "background", src: "app/background.jpg", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    i = 0;
    while (i++ < 99) {
        ZEPHYR.utils.setSprite("coconut" + i, { layer: "foreground", src: "app/coconut.png", x: Math.random() * 2.0 - 0.5, y: Math.random() * 2.0 - 0.5, anchor: { x: Math.random(), y: Math.random() }, draw: true });
    }

    update();
}

update = async () => {
    window.requestAnimationFrame(update);
    let i = 0;
    while (i++ < 99) {
        let c = ZEPHYR.utils.getSprite("coconut" + i);
        c.x += (Math.random() - 0.5) * ZEPHYR.scene.viewPx.x;
        c.y += (Math.random() - 0.5) * ZEPHYR.scene.viewPx.y;
        // c.draw = Math.random() < 0.001 ? !c.draw : c.draw;
        ZEPHYR.utils.setSprite("coconut" + i, c);
    }
}
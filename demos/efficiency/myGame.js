ZEPHYR.Application({ width: 1920, height: 1080, smooth: true, statistics: true });
ZEPHYR.appendScene(document.body);

const pxScale = ZEPHYR.utils.getPixelScale();
let camera = {x: 0.5, y: 0.5};
const coconutCount = 249;

window.onload = async () => {
    ZEPHYR.utils.setLayer("background", {});
    ZEPHYR.utils.setLayer("foreground", {});
    
    await ZEPHYR.utils.cache("efficiency/coconut.png");
    await ZEPHYR.utils.cache("efficiency/background.jpg");

    ZEPHYR.utils.setSprite("merryGoRound", { layer: "background", src: "efficiency/background.jpg", x: 0.5, y: 0.5, anchor: { x: 0.5, y: 0.5 }, draw: true });

    i = 0;
    while (i++ < coconutCount) {
        ZEPHYR.utils.setSprite("coconut" + i, { layer: "foreground", src: "efficiency/coconut.png", x: Math.random() * 2.0 - 0.5, y: Math.random() * 2.0 - 0.5, anchor: { x: Math.random(), y: Math.random() }, draw: true, cameraDependantPosition: true });
    }
    ZEPHYR.utils.setViewCenter(camera);

    ZEPHYR.ticker.add(update);
}

update = (delta) => {
    let i = 0;
    while (i++ < coconutCount) {
        let c = ZEPHYR.utils.getSprite("coconut" + i);
        c.x += (Math.random() - 0.5) * pxScale.x * (delta / 20);
        c.y += (Math.random() - 0.5) * pxScale.y * (delta / 20);
        ZEPHYR.utils.setSprite("coconut" + i, c);
    }
}
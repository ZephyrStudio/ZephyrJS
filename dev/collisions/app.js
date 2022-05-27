const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x111111 });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.input.mouseContainer = app.view;

const goodTex = PIXI.Texture.from('assets/good.png');
const badTex = PIXI.Texture.from('assets/bad.png');

const scene = new PIXI.Container();
app.stage.addChild(scene);

const bubbleSet = new Set();

let i = 0;
while (i++ < 100) {
    let bubble = PIXI.Sprite.from(goodTex);
    bubble.r = 50;
    bubble.anchor = { x: 0.5, y: 0.5 };
    bubble.x = app.view.width * 0.5;
    bubble.y = app.view.height * 0.5;
    bubble.mVec = { x: 0, y: 0 };
    scene.addChild(bubble);
    bubbleSet.add(bubble);
}

const cursor = PIXI.Sprite.from(goodTex);
cursor.anchor = { x: 0.5, y: 0.5 };
cursor.r = 50;
scene.addChild(cursor);

app.ticker.add((deltaTime) => {
    cursor.x = PIXI.input.getMouseX() * app.view.width;
    cursor.y = PIXI.input.getMouseY() * app.view.height;

    bubbleSet.forEach((bubble) => {
        bubble.x += bubble.mVec.x += (Math.random() - 0.5) * 0.1 * deltaTime + app.view.width;
        bubble.x %= app.view.width;
        bubble.y += bubble.mVec.y += (Math.random() - 0.5) * 0.1 * deltaTime + app.view.height;
        bubble.y %= app.view.height;

        if (PIXI.collision.radius(cursor, bubble)) {
            bubble.texture = badTex;
        } else {
            bubble.texture = goodTex;
        }
    });


});

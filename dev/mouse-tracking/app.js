const app = new PIXI.Application({ width: 480, height: 270, backgroundColor: 0xffffff, antialias: false});
app.view.id = "PIXI";
document.body.appendChild(app.view);
PIXI.input.mouseContainer = app.view;

const sleepTex = PIXI.Texture.from('assets/sleepy.png');
const rageTex = PIXI.Texture.from('assets/rage.png');

const scene = new PIXI.Container();
app.stage.addChild(scene);

const cursor = new PIXI.Sprite.from(sleepTex);
cursor.x = 0;
cursor.y = 0;
cursor.anchor = {x: 0.5, y: 0.5};
scene.addChild(cursor);

console.log(document.getElementsByTagName("html")[0].getBoundingClientRect());

app.ticker.add((deltaTime) => {
    cursor.x = (PIXI.input.getMouseX() * app.view.width + 0.5) ^ 0;
    cursor.y = (PIXI.input.getMouseY() * app.view.height + 0.5) ^ 0;
    if (PIXI.input.getMouseDown(0)) {
        cursor.texture = rageTex;
    } else {
        cursor.texture = sleepTex;
    }
});
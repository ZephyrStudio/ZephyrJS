const app = new PIXI.Application({ width: 480, height: 270, backgroundColor: 0xffffff, antialias: false});
app.view.id = "PIXI";
document.body.appendChild(app.view);
PIXI.input.mouseContainer = app.view;

const solidTex = PIXI.Texture.from('assets/solid.png');

const scene = new PIXI.Container();
app.stage.addChild(scene);

const player = PIXI.Sprite.from(solidTex);

scene.addChild(player);

// const ui = new PIXI.Container();
// app.stage.addChild(scene);

app.ticker.add((deltaTime) => {

});
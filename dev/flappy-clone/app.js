const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x80c0e0 });
app.view.id = "PIXI";
document.body.appendChild(app.view);

PIXI.utils.TextureCache['assets/bird.png', "assets/pipe.png"];

const scene = new PIXI.Container();
app.stage.addChild(scene);

const gameState = {
    pause: false,
    dead: false,
    distanceTraveled: 0,
    score: 0,
    requestPipe: true,
    pipeSpacing: 0.5
}

const pipes = new PIXI.Container();
scene.addChild(pipes);

const pipeSet = new Set();

createPipe = (pos) => {
    let gapPos = ((Math.random() * 0.5 + 0.25) * app.view.height) ^ 0;

    let bottomPipe = PIXI.Sprite.from("assets/pipe.png");
    bottomPipe.x = app.view.width * pos * gameState.pipeSpacing;
    bottomPipe.y = gapPos + 250;
    bottomPipe.anchor = { x: 0, y: 0 };
    pipes.addChild(bottomPipe);
    pipeSet.add(bottomPipe);

    let topPipe = PIXI.Sprite.from("assets/pipe.png");
    topPipe.x = app.view.width * pos * gameState.pipeSpacing;
    topPipe.y = gapPos - 250 - 1920;
    topPipe.anchor = {x: 0, y: 1};
    topPipe.scale.y = -1;
    pipes.addChild(topPipe);
    pipeSet.add(topPipe);
}

let i = 0;
while (i++ < 100) {
    createPipe(i + 1);
}

const bird = PIXI.Sprite.from('assets/bird.png');
bird.x = 400;
bird.y = app.view.height * 0.5;
bird.yVel = 0.0;
scene.addChild(bird);

let score = new PIXI.Text('0');
score.x = 20;
score.y = 20;
scene.addChild(score);


app.ticker.add((deltaTime) => {
    if (!gameState.dead && !gameState.pause) {
        birdControl(gameState.pause, deltaTime);
        gameState.distanceTraveled += deltaTime * 10;
        pipes.x = -gameState.distanceTraveled;
        score.text = ((gameState.distanceTraveled - 640) / app.view.width / gameState.pipeSpacing) ^ 0;
    }
    updateGameState();
});

birdControl = (pause, delta) => {
    if (!pause) {
        bird.yVel += delta;
        if (PIXI.input.getKeyFired(" ")) {
            bird.yVel = -14;
        }
        bird.y += bird.yVel;
        bird.y = Math.min(app.view.height, bird.y);
    }
}

updateGameState = () => {
    gameState.pause = PIXI.input.getKeyDown('ESCAPE');
    gameState.dead = bird.y + bird.height >= app.view.height;
    let correctedBird = {x: bird.x + gameState.distanceTraveled, y: bird.y, width: bird.width, height: bird.height}
    pipeSet.forEach((pipe) => {
        gameState.dead |= PIXI.collision.aabb(correctedBird, pipe);
    });
}
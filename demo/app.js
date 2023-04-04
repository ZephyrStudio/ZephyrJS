PIXI.Zephyr.useKeys();
PIXI.Zephyr.useMouse();
PIXI.Zephyr.useParticles();
// PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

const mvScale = 2.5;

const app = new PIXI.Application({ width: screen.width, height: screen.height, backgroundColor: 0x0, antialias: true });
app.view.id = "DISPLAY";
document.querySelector('#gameShowcase').appendChild(app.view);
PIXI.Mouse.setContainer(app.view);

const tex = {
    player: PIXI.Texture.from('assets/character2x.png'),
}

const emitter = PIXI.Particles.from('assets/star.png', 512, {
    life: 256,
    performant: true,
    spread: Math.PI * .5,
    speed: mvScale
});
app.stage.addChild(emitter);

let wreight = 0;

let player = new PIXI.Sprite(tex.player);
player.anchor = { x: 0.5, y: 0.5 };
player.vec = { x: 0, y: 0 };
player.x = app.view.width * 0.5;
player.y = wreight += window.innerHeight * 0.25;
app.stage.addChild(player);

let content = new PIXI.Container();
content.x = app.view.width * 0.5;
content.y = 0;
content.anchor = { x: 0.5, y: 1 };
app.stage.addChild(content);

let zjsColor = '#ef6f6c';

let title = new PIXI.Text('ZephyrJS', {
    fontFamily: 'monospace',
    fontSize: 60,
    fontWeight: 600,
    fill: zjsColor,
    lineJoin: 'round'
});
title.y = wreight += window.innerHeight * 0.25;
title.anchor = {x: 0.5, y: 1};
content.addChild(title);

const subtitleStyle = {
    fontFamily: 'monospace',
    fontSize: 30,
    fontWeight: 600,
    fill: '#ffffff',
    lineJoin: 'round',
    dropShadow: true,
    dropShadowColor: zjsColor,
    dropShadowDistance: 0,
    dropShadowBlur: 5,
};

let subtitle = new PIXI.Text('PixiJS + FOSS Game Engine Features', subtitleStyle);
subtitle.y = wreight += 32;
subtitle.anchor = {x: 0.5, y: 0};
content.addChild(subtitle);

const basicTextStyle = {
    fontFamily: 'monospace',
    fontSize: 16,
    fill: '#ffffff',
    lineJoin: 'round',
    wordWrap: true,
    wordWrapWidth: Math.min(window.innerWidth * 0.8, 1000),
}

let txt = new PIXI.Text('Use the arrow keys to explore what ZephyrJS has to offer!', basicTextStyle);
txt.y = wreight += 60;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + (window.innerHeight * 0.15);
txt = new PIXI.Text('Input Handling', subtitleStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + 16;
txt = new PIXI.Text("What's the point in making a game if it's not interactive? ZephyrJS' mouse and keyboard handling uses an extremely efficient backend, benchmarked in both Chromium and Firefox to ensure the best performance no matter the user.\n\nUsage is even easier, just call Zephyr.useMouse() or Zephyr.useKeys() and you're ready to go! Due to the way ZephyrJS actually stores input data, you can determine if a key/mouse button is newly pressed with PIXI.Mouse.fired(k), or if it's held down with PIXI.Mouse.down(k)", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + (window.innerHeight * 0.15);
txt = new PIXI.Text('Sound Effects and Music', subtitleStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + 16;
txt = new PIXI.Text("A game without sound effects sounds... like nothing at all? But YOU want sound for your games, so why bother wrestling with having <audio> elements offscreen, or trying to wrangle WebAudio? Well ZephyrJS does the latter for you, using the extremely fast API with a backend to minimize memory usage while providing a dead-simple interface for it!\n\nUse Zephyr.useAudio() to get going, then use PIXI.Audio.from(src) to get an object back with a volume attribute and a play() function. Zephyr takes care of the audio storing, buffering, and creating WebAudio nodes!", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + (window.innerHeight * 0.15);
txt = new PIXI.Text('Particles', subtitleStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + 16;
txt = new PIXI.Text("PixiJS provides a particle container, but it acts just like a faster but more limited container. So why not use ZephyrJS' particle emitters, which take care of all of the hard work and further optimization to provide an extremely customizable particle emitter!\n\nCall Zephyr.useParticles(), then you can create an emitter with PIXI.Particles.from(src, maxCount, options). After that, add it to your scene and call the step() function in the returned object from your ticker loop!", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

PIXI.Mouse.x = app.view.width * 0.5;
PIXI.Mouse.y = app.view.height * 0.5;

app.ticker.add((deltaTime) => {

    let applied = {
        x: (PIXI.Keys.down('ArrowRight') - PIXI.Keys.down('ArrowLeft')),
        y: (PIXI.Keys.down('ArrowDown') - PIXI.Keys.down('ArrowUp'))
    }

    emitter.step(deltaTime);
    emitter.fresh = false;
    emitter.spawn.x = player.x - emitter.x;
    emitter.spawn.y = player.y - emitter.y;
    emitter.fresh = applied.x != 0 || applied.y != 0;
    if (emitter.fresh) {
        emitter.direction = (applied.y != 0 ? Math.PI * 0.5 * -applied.y : (1 + applied.x) * Math.PI * 0.5); 
    }

    player.vec.x *= 0.97;
    player.vec.y *= 0.97;
    let h = Math.hypot(applied.x, applied.y);
    if (h != 0) {
        player.vec.x += applied.x / h * deltaTime / 15;
        player.vec.y += applied.y / h * deltaTime / 15;
    }
    player.x += player.vec.x;
    player.y += player.vec.y;
    if (applied.x != 0)
        player.scale.x = applied.x;
    

    player.x = PIXI.clamp(player.x, 0, app.view.width);
    player.y = PIXI.clamp(player.y, 0, app.view.height);

    content.x = emitter.x = (app.view.width * 0.5 - player.x) * mvScale + app.view.width * 0.5;
    content.y = emitter.y = ((window.innerHeight * 0.25) - player.y) * mvScale;
});
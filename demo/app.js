// PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

const mvScale = 2;

const app = new PIXI.Application({ width: screen.width, height: screen.height, backgroundColor: 0x0, antialias: true });
app.view.id = "DISPLAY";
document.querySelector('#gameShowcase').appendChild(app.view);

const tex = {
    player: PIXI.Texture.from('assets/character2x.png'),
}

// Individual attribute declaration, easiest
// const emitter = PIXI.Particles.from('assets/star.png', 512);
// emitter.life = 2000;
// Object parameter, specify all of the attributes you want at creation time

let wreight = 0;

let player = new PIXI.Sprite(tex.player);
player.anchor = { x: 0.5, y: 0.5 };
player.vec = { x: 0, y: 0 };
player.x = app.view.width * 0.5;
player.y = wreight += (window.innerHeight * 0.25) ^ 0;
player.speed = 4;
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

let subtitle = new PIXI.Text('FOSS Game Engine Features for any Stack', subtitleStyle);
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
txt = new PIXI.Text("What's the point in making a game if it's not interactive? ZephyrJS' mouse and keyboard handling uses an extremely efficient backend, benchmarked in both Chromium and Firefox to ensure the best performance no matter the user.\n\nUsage is even easier, just call the ZEPHYR.Mouse and/or ZEPHYR.Keys functions! Due to the way ZephyrJS actually stores input data, you can determine if a key/mouse button is newly pressed with fired(keyOrBtnName), or if it's held down with down(keyOrBtnName)", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + (window.innerHeight * 0.15);
txt = new PIXI.Text('Sound Effects and Music', subtitleStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + 16;
txt = new PIXI.Text("A game without sound effects sounds... like nothing at all? But YOU want sound for your games, so why bother wrestling with having <audio> elements offscreen, or trying to wrangle WebAudio? Well ZephyrJS does the latter for you, using the extremely fast API with a backend to minimize memory usage while providing a dead-simple interface for it!\n\nUse ZEPHYR.Audio.from(src) to get an object back with a customizable attributes like gain and pan, as well as play() and start functions. Zephyr takes care of the audio storing, buffering, and creating WebAudio nodes!", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + (window.innerHeight * 0.15);
txt = new PIXI.Text('File IO', subtitleStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

wreight += txt.height + 16;
txt = new PIXI.Text("Whether it's level data or player save states, you'll need to handle files input/output. Zephyr adds a super-simple interface for using the native file dialogue system to open and save data in file format.", basicTextStyle);
txt.y = wreight;
txt.anchor = {x: 0.5, y: 0};
content.addChild(txt);

let time = {
    now: performance.now(),
    elapsedMS: 0
}
app.ticker.add(function () {
    time.elapsedMS = -time.now + (time.now = performance.now());
    let applied = {
        x: (ZEPHYR.Keys.down('ArrowRight') - ZEPHYR.Keys.down('ArrowLeft')),
        y: (ZEPHYR.Keys.down('ArrowDown') - ZEPHYR.Keys.down('ArrowUp'))
    }

    player.vec.x *= 0.97;
    player.vec.y *= 0.97;
    let h = Math.hypot(applied.x, applied.y);
    if (h != 0) {
        player.vec.x += applied.x / h * time.elapsedMS * 0.001 * player.speed;
        player.vec.y += applied.y / h * time.elapsedMS * 0.001 * player.speed;
    }
    player.x += player.vec.x;
    player.y += player.vec.y;
    if (applied.x != 0)
        player.scale.x = applied.x;
    

    player.x = Math.clamp(player.x, 0, app.view.width);
    player.y = Math.clamp(player.y, 0, app.view.height);

    content.x = (app.view.width * 0.5 - player.x) * mvScale + app.view.width * 0.5;
    content.y = ((window.innerHeight * 0.25) - player.y) * mvScale;
});
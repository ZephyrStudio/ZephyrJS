// Activate Zephyr features
PIXI.Zephyr.useMouse();
PIXI.Zephyr.useKeys();
PIXI.Zephyr.useAudio();

// Create PIXI application (id is optional) and append  to body
const app = new PIXI.Application({ width: 1920, height: 1080, backgroundColor: 0x333333 });
app.view.id = "PIXI";
document.body.appendChild(app.view);

// Set the Mouse coordinates to be 0-1 inside the width and height of the app.view
PIXI.Mouse.setContainer(app.view);

PIXI.utils.TextureCache['assets/character.png'];

const soundEffect = PIXI.Audio.from("assets/hitL.wav");

const character = PIXI.Sprite.from('assets/character.png');
character.anchor = { x: 0.5, y: 0.5 };
character.vector = { x: 0, y: 0 };
character.bounce = 0.65;

app.stage.addChild(character);

app.ticker.add((deltaTime) => {

    // If F key is pressed
    if (PIXI.Keys.fired("KeyF")) {

        // Go fullscreen
        PIXI.utils.requestFullScreen(app.view);
    }

    // If primary mouse key is pressed down
    if (PIXI.Mouse.down("Primary")) {

        // Make the character's vector the vector between it and the mouse
        character.vector.x = PIXI.Mouse.x - character.x;
        character.vector.y = PIXI.Mouse.y - character.y;
    } else {

        // Add gravity
        character.vector.y += deltaTime;
    }

    // Check if character is within the horizontal bounds
    if (PIXI.clamp(character.x, 0, app.view.width) != character.x) {

        // Fix x coord, then apply bounce momentum loss
        character.x = PIXI.clamp(character.x, 0, app.view.width);
        character.vector.x *= -character.bounce;
        character.vector.y *= character.bounce;
        if (Math.abs(character.vector.x) > 5)
        soundEffect.play();
    }

    // Check if player is within vertical bounds
    if (PIXI.clamp(character.y, 0, app.view.height) != character.y) {

        // Fix y coord, then apply bounce momentum loss
        character.y = PIXI.clamp(character.y, 0, app.view.height);
        character.vector.x *= character.bounce;
        character.vector.y *= -character.bounce;
        if (Math.abs(character.vector.y) > 5)
            soundEffect.play();
    }

    // Adjust character position by the vector
    character.x += character.vector.x + 0.5;
    character.x ^= 0;
    character.y += character.vector.y + 0.5;
    character.y ^= 0;
});
<h2>How to Read the Documentation</h2>
 <p><span class="warning">WARNINGS</span> are just general knowledge to be aware of when using a particular feature.</p>
 <p>Lines color coded as <span class="return">RETURN</span> below the function indicates the object type that is returned.</p>
 <p>Lines coded as <span class="nightly">NIGHTLY</span> can only be found in the current nightly version of Zephyr.
 Consider trying it out, and letting us know of any bugs you find!</p>
 <p><span class="deprecated">DEPRECATED</span> lines specify features are set to be removed in the next stable release.</p>
 <h2 id="PIXI.Audio">PIXI.Audio</h2>
 <dl>
 <dt>PIXI.Audio.from(src)</dt>
 <dd>Returns a "Pixi Audio" object. These can have .play() called on them to play their sound.</dd>
 <dd class="return">Pixi Audio object</dd>
 <dd>.play() starts the sound
 <br><span class="nightly">.volume</span> = the gain/volume of the sound when it is played. 1 is normal volume, 0 is muted.

 </dd>
 </dl>
 <h2 id="PIXI.collision">PIXI.collision</h2>
 <dl>
 <dt>PIXI.collision.aabb(Sprite, Sprite)</dt>
 <dd>Checks if the two provided Sprites are colliding with the aabb algorithm - NOTE: Both a and b are
 formatted
 as javascript objects with x, y, width, and height, and optionally anchor positions.</dd>
 <dd class="return">Boolean</dd>
 <dt>PIXI.collision.radius(Sprite, Sprite)</dt>
 <dd>Checks if the two provided Sprites are colliding with the standard point-radius method of circle
 collision -
 NOTE: Both a and b are formatted as javascript objects with x, y, and r, and optionally anchor
 positions.
 </dd>
 <dd class="return">Boolean</dd>
 </dl>
 <h2 id="PIXI.File">PIXI.File</h2>
 <dl>
 <dt>PIXI.File.write(object, fileName)</dt>
 <dd>Converts the passed object into JSON and prompting the user to download the resulting fileName.json</dd>
 <dt>PIXI.File.open()</dt>
 <dd>Prompts the user to select a file, which it then attempts to parse as JSON and return</dd>
 <dd class="return">Object</dd>
 </dl>
 <h2 id="PIXI.Keys">PIXI.Keys</h2>
 <p>keyName is a string that is returned by keyboardEvent.code. Check out the <a
 href="keyName.html">Key Namer</a> to get specific key names.</p>
 <dl>
 <dt>PIXI.Keys.down(keyName)</dt>
 <dd>Returns true if the key is actively pressed down.</dd>
 <dd class="return">Boolean</dd>
 <dt>PIXI.Keys.fired(keyName)</dt>
 <dd>Returns true if this is the first time the key value has been accessed since the key has been pressed.
 </dd>
 <dd class="return">Boolean</dd>
 </dl>
 <h2 id="PIXI.Mouse">PIXI.Mouse</h2>
 <p>For button-related functions, the button names are 'Primary', 'Middle', and 'Secondary'</p>
 <dl>
 <dt>PIXI.Mouse.setContainer(domElement)</dt>
 <dd>What the mouse’s coordinates should be scaled according to (Generally, this should be your Pixi
 app.view).
 </dd>
 <dd class="warning"><strong>NOTE</strong>: Please ensure that this element has already been appended to the
 DOM.
 As of version 23.1, calling this method with an unappended element will fail with a console error about
 using an "invalid element".</dd>
 <dt>PIXI.Mouse.down([mouse button])</dt>
 <dd>Returns true if the button is actively pressed down.</dd>
 <dd class="return">Boolean</dd>
 <dt>PIXI.Mouse.fired(mouseEvent.button)</dt>
 <dd>Returns true if this is the first time the button value has been accessed since the button has been
 pressed.
 </dd>
 <dd class="return">Boolean</dd>
 <dt>PIXI.Mouse.x</dt>
 <dd>The last seen mouse X coordinate, scaled to the mouseContainer horizontally from left to right.</dd>
 <dd class="return">Number</dd>
 <dt>PIXI.Mouse.y</dt>
 <dd>The last seen mouse Y coordinate, scaled to the mouseContainer vertically from top to bottom.</dd>
 <dd class="return">Number</dd>
 </dl>
 <h2 id="PIXI.Particles">PIXI.Particles</h2>
 <dl>
 <dt>PIXI.Particles.from(src, maxParticleCount<em>, optionObject</em>)</dt>
 <dd>Returns a "PIXI Particle Emitter" which is a particleContainer with a built-in <strong>step()</strong>
 function to progress the animation. The different attributes of the container specify how the particles
 are emitted.</dd>
 <dd>An object can optionally be passed in to different behaviors, where the attributes are the associated values, for example:
 <br>{direction: Math.PI, life: 30, <span class="nightly">rotate: true,</span> speed: 0.5, spread: Math.PI * 0.5}.</dd>
 <dd class="return">Pixi Particle Emitter</dd>
 <dd>.life = how far the particles can move away from the emitter's location, in pixels (default 128)
 <br>.direction = specifies the direction (in radians) that the particles will move (default 0)
 <br>.speed = quickly the particles move to their end of life distance (default 1)
 <br>.spawn = {x, y} object that indicates where particles will be created
 <br>.spread = the angle (in radians) of how closely particles should follow the direction. 0 is no
 deviation, 2 PI is in a full circle (default is 2 PI)
 <br>.step() = a shared function that moves and updates all particles
 </dd>
 </dl>
 <h2 id="PIXI.utils">PIXI.utils</h2>
 <dl>
 <dt>PIXI.utils.requestFullScreen(domElement)</dt>
 <dd>The element passed in (typically the Application view) will attempt to go fullscreen</dd>
 </dl>
 <h2>Additional Functions</h2>
 <dl>
 <dt>PIXI.clamp(x, min, max)</dt>
 <dd>Returns the value of x if it is between the bounds of min and max, or the closest bound if x is outside
 </dd>
 <dd class="return">Number</dd>
 <dt>PIXI.mix(a, b, m)</dt>
 <dd>Linearly interpolate between values a and b</dd>
 <dd class="return">Number</dd>
 <dt>PIXI.rand(min, max)</dt>
 <dd>Generates a random integer between min and max, inclusive</dd>
 <dd class="return">Number</dd>
 </dl>
<h1>PIXI.Particles</h1>
<dl>
<dt>PIXI.Particles.from(src, maxParticleCount)</dt>
<dd>Creates a Particle Emitter (a particleContainer with a built-in<strong>step()</strong>function to progress the animation). The different attributes of the container specify how the particles are emitted.</dd>
<dd><strong class="return">RETURN</strong>
<pre><code>{
    life: 128
    - how far the particles last in pixels
    direction: 0
    - The direction (in radians) that the particles move.
    speed: 1
    - How fast the particles move to end of life.
    spawn: {0, 0}
    - A relative {x,y} where particles will be created.
    spread: 2PI
    - The angle (in radians) of particle dispersion.
    step(): Function
    - Progresses particle emission
}</code></pre>
</dd>
</dl>
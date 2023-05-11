<h1>PIXI.Particles</h1>
<p>A well-optimized and heavily-customizable particle emission system.</p>

<p><pre><code>{
    direction: The direction (in radians) that the particles move.
    distance: How far the particles travel in total pixels
    life: In milliseconds, how long it takes for particles to reach the distance
    maxCount: The target total number of particles to be emitting.
    speed: How fast the particles move to end of life.
    spawn: A relative {x,y} where particles will be created.
    spread: The angle (in radians) of particle dispersion.
    step(elapsedMS): Progresses particle emission animation
}</code></pre>
<em>Standard ParticleEmitter Sprite. This also includes the standard properties of a Pixi ParticleContainer.</em></p>

<dl>
<dt>PIXI.Particles.from(src, maxParticleCount)</dt>
<dd>Creates a Particle Emitter (a particleContainer with a built-in <strong>step()</strong> function to progress the animation). The different attributes of the container specify how the particles are emitted.</dd>
<dd><strong class="return">RETURN </strong>A standard ParticleEmitter Sprite, that target the maxParticleCount of particles with the src texture.</dd>
<dt>PIXI.Particles.from(optionsObject)</dt>
<dd>Creates a Particle Emitter (a particleContainer with a built-in <strong>step()</strong> function to progress the animation). The different attributes of the container specify how the particles are emitted.</dd>
<dd><strong class="warning">NOTE </strong> The optionsObject MUST include a maxCount attribute.</dd>
<dd><strong class="return">RETURN </strong>A standard ParticleEmitter Sprite, with the specified properties.</dd>
</dl>
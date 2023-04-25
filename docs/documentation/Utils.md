<h1>PIXI.utils</h1>
<p>On top of Pixi's already provided utilities, Zephyr adds relied-upon and expected features that are heavily optimized for easy and painless developer usage.</p>

<dl>
<dt>PIXI.utils.clamp(x, min, max)</dt>
<dd><strong class="return">RETURN </strong>The value of x constrained to lie between the minimum and maximum.</dd>
<dt>PIXI.utils.mix(a, b, mixer)</dt>
<dd>This function mixes the Numbers a and b. 0.0 means the returned value is 100% of a, 1.0 means the returned value is 100% of b, and 0.5 means it is 50% of each.</dd>
<dd><strong class="return">RETURN </strong>The weighted average of a and b.</dd>
<dt>PIXI.utils.random(min, max)</dt>
<dd><strong class="return">RETURN </strong>A random value from min to max, inclusive.</dd>
<dt>PIXI.utils.requestFullScreen(domElement)</dt>
<dd>The domElement will attempt to enter/leave fullscreen in all browsers.</dd>
</dl>
<h1>Utilities</h1>
<p>On top of Pixi's already provided utilities, Zephyr adds relied-upon and expected features that are heavily optimized for easy and painless developer usage.</p>

<dl>
<dt>Math.clamp(x, min, max)</dt>
<dd><strong class="return">RETURN </strong>The value of x constrained to lie between the minimum and maximum.</dd>
<dt>Math.mix(a, b, mixer)</dt>
<dd>This function mixes the Numbers a and b. 0.0 means the returned value is 100% of a, 1.0 means the returned value is 100% of b, and 0.5 means it is 50% of each.</dd>
<dd><strong class="return">RETURN </strong>The weighted average of a and b.</dd>
<dt>Math.rand_int(min, max)</dt>
<dd><strong class="return">RETURN </strong>A random value from min to max, inclusive.</dd>
<dt>Math.withinRange(x, min, max)</dt>
<dd><strong class="return">RETURN </strong>A number value, being the distace x is from the bounds. Positive means outside, 0 is equal to a bound, negative is inside bounds.</dd>
<dt>ZEPHYR.utils.toggleFullScreen(domElement)</dt>
<dd>The domElement will attempt to enter/leave fullscreen in all browsers.</dd>
</dl>
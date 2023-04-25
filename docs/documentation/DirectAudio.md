<h1>PIXI.DirectAudio</h1>
<p><strong>DirectAudio</strong> adds sound effects and music that you (the developer) can start/stop, set gain and pan, etc. Zephyr sets up an efficient WebAudio API backend, and only exposes useful features for the developer.</p>

<dl>
<dt>PIXI.DirectAudio.from(src)</dt>
<dd>Creates a DirectAudio object</dd>
<dd><strong class="return">RETURN </strong>
<pre><code>{
    gain: 1.0
    - 0.0 through 2.0 (sound multiplier for volume control)
    pan: 0.0
    - -1.0 through 1.0 (0.0 center, -1.0 left, 1.0 right)
    src: [parameter]
    - The source of the audio file
    start(): Function
    - Plays the sound
    stop: Function
    - Stops the sound
}</code></pre>
</dd>
</dl>
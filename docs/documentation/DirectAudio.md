<h1>ZEPHYR.DirectAudio</h1>
<p><strong>DirectAudio</strong> adds sound effects and music that you (the developer) can start/stop, set gain and pan, looping, speed, etc. Zephyr sets up an efficient WebAudio API backend, and only exposes useful features for the developer. Zephyr also processes audio files once and keeps the buffers in memory, so that audio is as responsive as possible.</p>

<p><pre><code>{
    autoplay: true/false is sound is played after loading
    <span class="warning">// The WebAudio API requires page interaction before playing</span>
    gain: 0.0 through 2.0 (sound multiplier for volume control)
    loop: Boolean true/false if the sound should continue looping
    onload: Can be assigned a function which runs when audio loads
    pan: -1.0 through 1.0 (0.0 center, -1.0 left, 1.0 right)
    speed: Sample rate multiplier for playing audio, 1.0 is normal
    src: The source of the audio file
    start(): Plays the sound
    stop(): Stops the sound
}</code></pre>
<em>A standard DirectAudio Sprite.</em></p>

<dl>
<dt>ZEPHYR.DirectAudio.from(src)</dt>
<dd>Creates a DirectAudio object with the desired audio source. An example for this usage is below:
<pre><code>let normalAttackSound = ZEPHYR.DirectAudio.from('sfx/attack.wav', function () {
    console.log("Normal attack loaded!");
});</code></pre>
</dd>
<dd><strong class="return">RETURN </strong> A DirectAudio Sprite</dd>
<dt>ZEPHYR.DirectAudio.from(srcObject)</dt>
<dd>Creates a DirectAudio object with the desired attributes. This can have any of the values of the standard DirectAudio Sprite shown above. An example for this usage is below:
<pre><code>let heavyAttackSound = ZEPHYR.DirectAudio.from({
    src: 'sfx/attack.wav',
    gain: 1.2,
    speed: 0.8,
    onload: function () {
        console.log("Heavy attack loaded!");
    }
});</code></pre>
</dd>
<dd><strong class="return">RETURN </strong> A DirectAudio Sprite, where default values are replaced with any provided in the srcObject</dd>
</dl>
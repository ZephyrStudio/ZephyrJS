<h1>Quickstart Guide</h1>
<ol>
<li>Create your HTML file
<p>The main parts to indlude are the PixiJS and ZephyrJS scripts. Include the lines:</p>
<p><code>&lt;script src="https://ottcs.github.io/ZephyrJS/nightly/pixi.js"&gt;&lt;/script&gt;</code></p>
<p><code>&lt;script src="https://ottcs.github.io/ZephyrJS/nightly/zepyhr.js"&gt;&lt;/script&gt;</code></p>
<p>If you're working with a long-term project, you should use the stable version. Replace "nightly" with "stable" in the code above, and there will only be updates at the start of each month.</p>
<p>Next, include your script to run the project:</p>
<p><code>&lt;script src="app.js"&gt;&lt;/script&gt;</code></p>
<p>The full code of your HTML file should be as follows:</p>
<code>
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;title&gt;Physics&lt;/title&gt;
    &lt;link rel="preload" as="style" href="default.css" onload="this.rel='stylesheet'"&gt;
    &lt;script src="https://ottcs.github.io/ZephyrJS/nightly/pixi.js"&gt;&lt;/script&gt;
    &lt;script src="https://ottcs.github.io/ZephyrJS/nightly/zepyhr.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt; &lt;!-- Testing --&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>
</li>
</ol>
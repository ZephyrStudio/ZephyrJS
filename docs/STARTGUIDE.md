<h2 id="getting-started">Getting Started</h2>

<p>The <a href="https://pixijs.io/guides/basics/getting-started.html" class="pixi">PixiJS Getting Started</a> guide is very good, there's really nothing to expand upon in it.</p>
        
<p>When you are loading PixiJS, you have a couple options. Following the instructions on the linked page, is reliable, but for speed (and to be considerate to their servers), link our hosted, minified versions or <a href="https://github.com/ZephyrJS-Project/ZephyrJS/releases">download</a> it. Immediately after the PixiJS script tag, include a script tag linking your downloaded zephyr.js file, or our hosted one. Example code is below:</p>

<code class="dark">&lt;head&gt;<br>&lt;script src="https://zephyrjs.netlify.app/git/stable/pixi.js"&gt;&lt;/script&gt;<br><span class="zephyr">&lt;script src="https://zephyrjs.netlify.app/git/stable/zephyr.js"&gt;&lt;/script&gt;</span><br>&lt;/head&gt;</code>

=<p>If you'd like to test out the nightly version, awesome! Thanks for helping out with development, and <a href="https://github.com/ZephyrJS-Project/ZephyrJS/issues">issue</a> reports are super helpful. Just replace where it says <code>stable</code> above with <code>nightly</code> and you're good to go!</p>

<p>When you're wanting to use one of Zephyr's features, you can call the <strong>Zephyr.use______()</strong> methods. The options are listed at the top of the <a href="documentation.html">documentation</a>. After that, you're ready to go! Feel free to browse the <a href="https://github.com/ZephyrJS-Project/ZephyrJS/tree/main/demo">demo code</a> if you're looking for a jumping-off point.</p>
<h2 id="getting-started">Getting Started</h2>

<p>The <a href="https://pixijs.io/guides/basics/getting-started.html" class="pixi">PixiJS Getting Started</a> guide is very good, there's really nothing to expand upon in it.</p>
        
<p>There are two versions of Zephyr: <strong>stable</strong> which is released monthly with the latest compatible PixiJS version, and <strong>nightly</strong> which is our frequently updated development branch. For most projects, we recommend <a href="https://github.com/ZephyrJS-Project/ZephyrJS/releases" title="ZephyrJS Github Releases">downloading the latest stable release</a>. When you get to the "Loading PixiJS" section, use the path to your downloaded and extracted pixi and zephyr files:</p>

<pre><code class="dark">&lt;head&gt;<br>&lt;script src="/path/to/pixi.js"&gt;&lt;/script&gt;<br><span class="zephyr">&lt;script src="/path/to/zephyr.js"&gt;&lt;/script&gt;</span><br>&lt;/head&gt;</code></pre>

<p>For trying it out, don't feel obligated to download our code! Just use the delivered stable versions:</p>

<pre><code class="dark">&lt;head&gt;<br>&lt;script src="https://zephyrjs.netlify.app/pixi.js"&gt;&lt;/script&gt;<br><span class="zephyr">&lt;script src="https://zephyrjs.netlify.app/zephyr.js"&gt;&lt;/script&gt;</span><br>&lt;/head&gt;</code></pre>

<p>By default, Zephyr doesn't change Pixi or implement any features. When you need one, you enable it by calling its respective <strong>PIXI.Zephyr.use</strong> methods. The options are listed at the top of the <a href="documentation.html">documentation</a>. After that, you're ready to go! Feel free to browse the <a href="https://github.com/ZephyrJS-Project/ZephyrJS/tree/main/demo">demo code</a> if you're looking for a jumping-off point.</p>
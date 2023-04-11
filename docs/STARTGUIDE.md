<h1 id="getting-started">Getting Started</h1>

<p>For most projects, it's recommended to download the latest version of Zephyr and the compatible version of Pixi from our Github releases. If you're new to Zephyr though, don't feel obligated to download our code! We have hosted files that you can link to for trying it out.</p>

<p><a href="https://github.com/ZephyrJS-Project/ZephyrJS/releases" title="ZephyrJS Github Releases" class="button">Download ZephyrJS</a></p>

<p>For a first project, following the <a href="https://pixijs.io/guides/basics/getting-started.html">PixiJS Getting Started</a> guide is a great way to go. When you're all set up, your code should have a script tag that links to PixiJS. If you downloaded our version of Pixi, use that file here. Otherwise, replace the script src with <strong class="pixi">https://zephyrjs.netlify.app/pixi.js</strong> an you're all set:</p>

<code>&lt;script src="<span class="pixi">/path/to/pixi.js</span>"&gt;&lt;/script&gt;</code>

<h2>Adding Zephyr</h2>

<p>Add a script tag for Zephyr <strong>after</strong> the one for Pixi, using the path to the Zephyr file or the delivered version from <strong class="zephyr">https://zephyrjs.netlify.app/zephyr.js</strong>.</p>

<code>&lt;script src="/path/to/pixi.js"&gt;&lt;/script&gt;<br>&lt;script src="<span class="zephyr">/path/to/zephyr.js</span>"&gt;&lt;/script&gt;</code>

<p>By default, Zephyr doesn't change Pixi or implement any features. When you need one, you enable it by calling its respective <strong>PIXI.Zephyr.use</strong> methods. The options are listed at the top of the <a href="documentation.html">documentation</a>. After that, you're ready to go! Feel free to browse the <a href="https://github.com/ZephyrJS-Project/ZephyrJS/tree/main/demo">demo code</a> if you're looking for a jumping-off point.</p>
<header>ZephyrJS Documentation</header><div id="gameShowcase"><div id="showcaseOverlay"><h1>Game Development for Everyone</h1><hr><p>ZephyrJS expands the fastest web renderer with game engine features so you can develop games quickly for
 everyone on the internet.</p><a href="#getting-started" class="button zephyr">Get Started</a><a href="documentation.html" class="button zephyr">Documentation</a><a href="https://github.com/ZephyrJS-Project/ZephyrJS/" class="button">Github</a></div></div><article><h2>Why Zephyr?</h2><p>Web-based content has been providing a way to access all sorts of entertainment, and being able to game on
 the web is the next step. While flash games existed in the past, browsers didn't have the kind of power to
 run full games. But now they do, and browsers have been able to directly use the available hardware to speed
 up rendering for some time now. ZephyrJS is an expansion of the fastest, most flexible 2D WebGL renderer <a
 href="https://github.com/pixijs/pixijs" class="pixi">PixiJS</a>, letting anybody have access to a
 blazing fast renderer with standard game engine features that developers have come to rely on.</p><p>PixiJS on its own is very powerful, but a lot of work is needed to make it work for web-based interactive
 content, specifically games. Other alternatives typically wrap the PixiJS functions, making it tough to
 translate what you've become accustomed to back to Pixi, or learn how to use it in the first place. Zephyr
 directly ADDS to PixiJS instead of wrapping it, letting you use the full functionality of Pixi and use their
 provided documentation, supplemented by ours. By doing this, it allows for developers to know they will
 always have plenty of documentation and examples to learn from.</p><p>And ZephyrJS is <strong>quick</strong> to setup and use. After following PixiJS's standard setup
 instructions, it only takes adding <strong>one line of code to add Zephyr</strong>. No more installing
 packages, no more trying to figure out which plugins you need, just add Zephyr and you're ready to go.
 Simply call Zephyr's methods in your javascript to add webgl audio, mouse and keyboard control, and file io,
 and every piece you need is at your fingertips.</p><br><h2 id="getting-started">Getting Started</h2><p>The <a href="https://pixijs.io/guides/basics/getting-started.html" class="pixi">PixiJS Getting Started</a>
 guide is very good, there's really nothing to expand upon in it.</p><p>When you are loading PixiJS, you have a couple options. Following the instructions on the linked page, is
 reliable, but for speed (and to be considerate to their servers), link our hosted, minified versions or <a
 href="https://github.com/ZephyrJS-Project/ZephyrJS/releases">download</a> it. Immediately after the
 PixiJS script tag, include a script tag linking your downloaded zephyr.js file, or our hosted one. Example
 code is below:</p><code>&lt;head&gt;<br>&lt;script src="https://zephyrjs.netlify.app/stable/pixi.js"&gt;&lt;/script&gt;<br><span class="zephyr">&lt;script src="https://zephyrjs.netlify.app/stable/zephyr.js"&gt;&lt;/script&gt;</span><br>&lt;/head&gt;</code><p>If you'd like to test out the nightly version, awesome! Thanks for helping out with development, and <a
 href="https://github.com/ZephyrJS-Project/ZephyrJS/issues">issue</a> reports are super helpful. Just
 replace where it says <code>stable</code> above with <code>nightly</code> and you're good to go!</p><p>When you're wanting to use one of Zephyr's features, you can call the <strong>Zephyr.use______()</strong>
 methods! The options
 are listed at <a href="documentation.html">the top of the documentation</a>. After that, you're ready to go!
 Feel free to download the <a
 href="https://github.com/ZephyrJS-Project/ZephyrJS/raw/main/quickstart/bundle.zip">quickstart bundle</a>
 if you'd like!</p></article>
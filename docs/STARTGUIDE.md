<h1 id="getting-started">Getting Started</h1>

<p>Selecting an appropriate version of Zephyr for your project is very important, and is the first thing you really have to do. Think about the scope of your project: if you're making a quick test that'll be done in a day or two, you're most likely good with just linking one of our hosted versions. If this is a larger project, consider downloading the version that works for you through the <a href="https://github.com/ZephyrStudio/ZephyrJS/releases">Github Releases</a> page.</p>

<p>That's it! All Zephyr features are automatically added, and you're ready to go.</p>

<h2>Standalone</h2>
<p>If you already have your own stack in place, don't change a thing. Just add a script tag with Zephyr as the source, and it's ready to use.</p>

<code>&lt;script src="<strong class="zephyr">https://zephyrjs.pages.dev/src/zephyr.js</strong>"&gt;&lt;/script&gt;</code>

<p>If you <a href="https://raw.githubusercontent.com/ZephyrStudio/ZephyrJS/main/src/zephyr.js">download Zephyr</a> instead, replace the src of the script tag with the <strong class="bundle">path/to/zephyr.js</strong>.

<h2>The Bundle</h2>
<p>This is the easiest way to use Zephyr. Since Zephyr 23.4.13, we've distributed a version of Pixi and Zephyr combined and minified for ease of use.</p>

<code>&lt;script src="<strong class="bundle">https://zephyrjs.pages.dev/src/bundle.js</strong>"&gt;&lt;/script&gt;</code>

<p>If you <a href="https://raw.githubusercontent.com/ZephyrStudio/ZephyrJS/main/src/bundle.js">download the bundle</a> instead, replace the src of the script tag with the <strong class="bundle">path/to/bundle.js</strong>.

<h2>PIXI + Zephyr</h2>
<p>If you're looking to keep Zephyr and Pixi separate (maybe you want to use a specific version combination of the two, etc), you can link each file independantly.</p>

<code>&lt;script src="<strong class="pixi">https://zephyrjs.pages.dev/pixi.js</strong>"&gt;&lt;/script&gt;<br>&lt;!-- Pixi must come before Zephyr --&gt;<br>&lt;script src="<strong class="zephyr">https://zephyrjs.pages.dev/zephyr.js</strong>"&gt;&lt;/script&gt;</code>

<p>If you <a href="https://raw.githubusercontent.com/ZephyrStudio/ZephyrJS/main/src/pixi.js">download PixiJS</a> instead, replace the src of the script tag with the <strong class="pixi">path/to/pixi.js</strong>.</p>
<p>Likewise, <a href="https://raw.githubusercontent.com/ZephyrStudio/ZephyrJS/main/src/pixi.js">download ZephyrJS</a> and replace the src of the script tag with the <strong class="zephyr">path/to/zephyr.js</strong>.</p>
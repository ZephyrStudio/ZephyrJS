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
<pre><code>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>Physics</title>
    <link rel="preload" as="style" href="default.css" onload="this.rel='stylesheet'">
    <script src="https://ottcs.github.io/ZephyrJS/nightly/pixi.js"></script>
    <script src="https://ottcs.github.io/ZephyrJS/nightly/zepyhr.js"></script>
</head>

<body>
    <script src="app.js"></script> <!-- Testing -->
</body>

</html>
</code</pre>
</li>
</ol>
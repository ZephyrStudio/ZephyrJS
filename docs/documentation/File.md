<h1>PIXI.File</h1>
<p>Adds file writing/downloading/opening</p>

<dl>
<dt>PIXI.File.write(content, <em>fileName</em>)</dt>
<dd>Prompts the user to download a file <em>with the default fileName</em> with the provided text content</dd>
<dd><strong class="warning">NOTE </strong>The content parameter must be of the string type. Check out <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">JSON.stringify()</a> for how to turn objects into strings.</dd>
<dt>PIXI.File.open(<em>extension</em>)</dt>
<dd>Prompts the user to select a file <em>of a specific type</em>.</dd>
<dd><strong class="return">RETURN </strong>
<pre><code>{
    fulfilled: initially false, is set to true when loaded
    result: initially undefined, is set to content string when loaded
}</code></pre>
</dd>
</dl>
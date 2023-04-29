<h1>PIXI.File</h1>
<p>Adds file writing/downloading/opening.</p>

<p><pre><code>{
    fulfilled: False, but set to true when loaded
    onload: A function to run when file loaded
    result: Equals string content when file is loaded
    type: '*' (any) by default, but can be specified
}</code></pre>
<em>Standard File structure.</em></p>

<dl>
<dt>PIXI.File.write(content, <em>fileName</em>)</dt>
<dd>Prompts the user to download a file <em>with the default fileName</em> with the provided text content. Example usage:
<pre><code>PIXI.File.write("Hello, filesystem!");</code></pre>
</dd>
<dd><strong class="warning">NOTE </strong>The content parameter must be of the string type. Check out <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">JSON.stringify()</a> for how to turn objects into strings.</dd>
<dt>PIXI.File.open(<em>extension</em>, <em>onload</em>)</dt>
<dd>Prompts the user to select a file of an optional type, with the additional option of setting a function to run when it is loaded. Example usage:
<pre><code>let saveData = PIXI.File.open('*', function () {
    console.log(data.result);
});</code></pre>
</dd>
<dd><strong class="return">RETURN </strong>A standard PIXI.File object</dd>
<dt>PIXI.File.open(<em>optionObject</em>)</dt>
<dd>Prompts the user to select a file, using any parameters specified in the optionObject. This optionObject should be in the format of the standard File structure. Example usage:
<pre><code>let saveData = PIXI.File.open({
    onload: function () { console.log(data.result),
    type: '*'
});</code></pre>
</dd>
<dd><strong class="return">RETURN </strong>A standard PIXI.File object</dd>
</dl>
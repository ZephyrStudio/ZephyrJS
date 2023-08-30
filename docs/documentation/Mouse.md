<h1>ZEPHYR.Mouse</h1>
<p><strong>ZEPHYR.Mouse</strong> keeps track of the mouse position, as well as its buttons.</p>
<p><strong class="warning">NOTE </strong>For all "mouseButton" parameters, the button names are 'Primary' (typically left), 'Middle' (typically the scroll), and 'Secondary' (typically right)</p>

<dl>
<dt>ZEPHYR.Mouse.setContainer(domElement)</dt>
<dd>What the mouse’s coordinates should be scaled according to (Generally, this should be your app viewport).</dd>
<dd><strong class="warning">NOTE</strong> To get properly scaled mouse coordinates, this should be called as soon as your element is appended to the DOM.</dd>
<dt>ZEPHYR.Mouse.down(mouseButton)</dt>
<dd>Returns true if the button is actively pressed down.</dd>
<dd class="return">Boolean</dd>
<dt>ZEPHYR.Mouse.fired(mouseButton)</dt>
<dd>Returns true if this is the first time the button value has been accessed since the button has been pressed.</dd>
<dd class="return">Boolean</dd>
<dt>ZEPHYR.Mouse.x</dt>
<dd>The last seen mouse X coordinate, scaled to the mouseContainer horizontally from left to right.</dd>
<dd class="return">Number</dd>
<dt>ZEPHYR.Mouse.y</dt>
<dd>The last seen mouse Y coordinate, scaled to the mouseContainer vertically from top to bottom.</dd>
<dd class="return">Number</dd>
</dl>
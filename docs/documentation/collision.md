<h1>ZEPHYR.collision</h1>
<p><strong>Collision</strong> adds functions to check if two objects (sprites work!) are colliding using different algorithms.</p>
<p><strong class="warning">NOTE </strong>The "Sprite" parameters should be objects with x, y, width, and height attributes</p>

<dl>
<dt>ZEPHYR.collision.rectangle(Sprite, Sprite)</dt>
<dd>Checks if the two provided Sprites are colliding with the aabb (box collision) algorithm</dd>
<dd><strong class="return">RETURN </strong>Boolean (True if the sprites are colliding, false if not)</dd>
<dt>ZEPHYR.collision.circle(Sprite, Sprite)</dt>
<dd>Checks if the two provided Sprites are colliding with the point-radius (circle collision) algorithm</dd>
<dd><strong class="return">RETURN </strong>Boolean (True if the sprites are colliding, false if not)</dd>
</dl>
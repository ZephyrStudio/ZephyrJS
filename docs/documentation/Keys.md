<h1>ZEPHYR.Keys</h1>
<p><strong>ZEPHYR.Keys</strong> keeps track of user keyboard presses</p>
<p><strong class="warning">NOTE </strong>keyName is a string that is returned by keyboardEvent.code. Check out the <a href="keyName.html">Key Namer</a> to get specific key names.</p>

<dl>
<dt>ZEPHYR.Keys.down(keyName)</dt>
<dd>Returns true if the key is actively pressed down.</dd>
<dd><strong class="return">RETURN </strong>Boolean</dd>
<dt>ZEPHYR.Keys.fired(keyName)</dt>
<dd>Returns true if this is the first time the key value has been accessed since the key has been pressed. </dd>
<dd><strong class="return">RETURN </strong>Boolean</dd>
</dl>
define(function (require, exports, module)
{
	Keyboard = function( )
	{
		this._states = {
			up : 0,
			down : 1
		}

		this._keyCodes = {
			// ***********
			// * ARROWS *
			// ***********
			37 :
			{
				label : 'left',
				state : 0,
				preventBubble : true
			},
			38 :
			{
				label : 'up',
				state : 0,
				preventBubble : true
			},
		 	39 :
		 	{
				label : 'right',
				state : 0,
				preventBubble : true
			},
			40 :
			{
				label : 'down',
				state : 0,
				preventBubble : true
			},
			// ***********
			// * NUMBERS *
			// ***********
			49 :
			{
				label : '1',
				state : 0,
				preventBubble : true
			},
			50 :
			{
				label : '2',
				state : 0,
				preventBubble : true
			},
			51 :
			{
				label : '3',
				state : 0,
				preventBubble : true
			},
			52 :
			{
				label : '4',
				state : 0,
				preventBubble : true
			},
			53 :
			{
				label : '5',
				state : 0,
				preventBubble : true
			},
			54 :
			{
				label : '6',
				state : 0,
				preventBubble : true
			},
			55 :
			{
				label : '7',
				state : 0,
				preventBubble : true
			},
			56 :
			{
				label : '8',
				state : 0,
				preventBubble : true
			},
			57 :
			{
				label : '9',
				state : 0,
				preventBubble : true
			},
			97 :
			{
				label : 'numpad1',
				state : 0,
				preventBubble : true
			},
			98 :
			{
				label : 'numpad2',
				state : 0,
				preventBubble : true
			},
			99 :
			{
				label : 'numpad3',
				state : 0,
				preventBubble : true
			},
			100 :
			{
				label : 'numpad4',
				state : 0,
				preventBubble : true
			},
			101 :
			{
				label : 'numpad5',
				state : 0,
				preventBubble : true
			},
			102 :
			{
				label : 'numpad6',
				state : 0,
				preventBubble : true
			},
			103 :
			{
				label : 'numpad7',
				state : 0,
				preventBubble : true
			},
			104 :
			{
				label : 'numpad8',
				state : 0,
				preventBubble : true
			},
			105 :
			{
				label : 'numpad9',
				state : 0,
				preventBubble : true
			},
			// ***********
			// * OTHERS *
			// ***********
			13 :
			{
				label : 'enter',
				state : 0,
				preventBubble : false
			},
			32 :
			{
				label : 'space',
				state : 0,
				preventBubble : true
			},
			65 :
			{
				label : 'a',
				state : 0,
				preventBubble : true
			},
			68 :
			{
				label : 'd',
				state : 0,
				preventBubble : true
			},
			83 :
			{
				label : 's',
				state : 0,
				preventBubble : true
			},
			87 :
			{
				label : 'w',
				state : 0,
				preventBubble : true
			},
			89 :
			{
				label : 'y',
				state : 0,
				preventBubble : true
			},
			90 :
			{
				label : 'z',
				state : 0,
				preventBubble : true
			},
			88 :
			{
				label : 'x',
				state : 0,
				preventBubble : true
			},

		}

		this.hash = {};
		this.hashUp = {};

		this.started = false;
		this.disabled = false;
		this.start();
		this.dirty = false;

	}

	Keyboard.prototype.start = function()
	{
		if(this.started)return;

		this.started = true;

		var _this = this;

		this._onKeyDown = function (event) {
	        return _this.processKeyDown(event);
	    };

	    this._onKeyUp = function (event) {
	        return _this.processKeyUp(event);
	    };

	    window.addEventListener('keydown', this._onKeyDown, false);
	    window.addEventListener('keyup', this._onKeyUp, false);
	}

	Keyboard.prototype.stop = function()
	{
		if(!this.started)return;
		this.started = false;

		for (var i in this._keyCodes)
		{
			this._keyCodes[i].state = this._states.up;
		};

		this.dirty = true;

	    window.removeEventListener('keydown', this._onKeyDown);
	    window.removeEventListener('keyup', this._onKeyUp);
	}

	Keyboard.prototype.processKeyDown = function(event)
	{
		if(this.disabled === true) return;

		var keyCode = event.keyCode;

	//	console.log(keyCode);

		this.keyCode = keyCode;

		if(this._keyCodes.hasOwnProperty(keyCode))
		{
			var Key = this._keyCodes[keyCode];
			if (Key.preventBubble)
	        {
				event.preventDefault();
	        }

	        if(Key.state !=  this._states.down)
	        {
				Key.state = this._states.down;
				this.dirty = true;

				if(this.hash[Key.label])
		        {
		        	this.hash[Key.label](Key);
		        }
	        }


		}

	}

	Keyboard.prototype.processKeyUp = function(event)
	{
		if(this.disabled === true) return;

		var keyCode = event.keyCode;

		this.keyCode = null;

		if(this._keyCodes.hasOwnProperty(keyCode))
		{
			var Key = this._keyCodes[keyCode];
			if (Key.preventBubble)
	        {
				event.preventDefault();
	        }
			if(Key.state != this._states.up)
	        {
				Key.state = this._states.up;
				this.dirty = true

	       		if(this.hashUp[Key.label])
		        {
		        	this.hashUp[Key.label](Key);
		        }
	        }


		}

	}


	Keyboard.prototype.isPressed = function(id)
	{
		var keyCode = this.getCodeFromLabel(id);

		if(keyCode)
		{
			return this._keyCodes[keyCode].state === this._states.down;
		}
		else
		{
			console.log("Key ID doesn't exist. - (" + id + ")");
		}
		return false;
	}

	Keyboard.prototype.getCodeFromLabel = function(label)
	{
		for(var t in this._keyCodes)
		{
			if(this._keyCodes[t].label === label) return t;
		}
		return false;
	}

	/** TO DO **/

	Keyboard.prototype.onKeyPress = function(id, onKeyDown)
	{
		this.hash[id] = onKeyDown;
	}

	Keyboard.prototype.onKeyRelease = function(id, onKeyUp)
	{
		this.hashUp[id] = onKeyUp;
	}

	module.exports = Keyboard;

});

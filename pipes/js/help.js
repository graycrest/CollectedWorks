
var main = {
	vars: {
		setup: false,
		count: 0,
		index: 0,
		animation: [
			{x: 1, y: 3, shape: '1100'},
			{x: 2, y: 3, shape: '1001'},
			{x: 1, y: 2, shape: '0110'},
			{x: 2, y: 2, shape: '1111'},
			{x: 3, y: 2, shape: '0101'},
			{x: 4, y: 2, shape: '1001'},
			{x: 4, y: 1, shape: '0011'},
			{x: 3, y: 1, shape: '0101'},
			{x: 2, y: 1, shape: '0110'}
		]
	},

	clear: function()
	{
		main.vars.context.fillStyle = '#eee';
		main.vars.context.fillRect(0, 0, main.vars.canvas.width, main.vars.canvas.height);
		main.vars.context.fillStyle = '#fff';
		var y = 1;
		for (var j = 0; j < 3; j += 1)
		{
			var x = 1;
			for (var i = 0; i < 4; i += 1)
			{
				main.vars.context.fillRect(x, y, 16, 16);
				x += 1 + 16;
			}
			y += 1 + 16;
		}
		return true;
	},

	parts: {
		center: function(x, y)
		{
			return main.vars.context.fillRect(x + 5, y + 5, 6, 6);
		},
		top: function(x, y)
		{
			return main.vars.context.fillRect(x + 5, y + 0, 6, 5);
		},
		bottom: function(x, y)
		{
			return main.vars.context.fillRect(x + 5, y + 11, 6, 5);
		},
		left: function(x, y)
		{
			return main.vars.context.fillRect(x + 0, y + 5, 5, 6);
		},
		right: function(x, y)
		{
			return main.vars.context.fillRect(x + 11, y + 5, 5, 6);
		}
	},

	interval: function()
	{
		if (main.vars.index >= main.vars.animation.length)
		{
			if ((main.vars.count += 1) > 32)
			{
				// clearInterval(main.vars.interval);
				// return true;
			}
			main.vars.index = 0;
			main.clear();
			main.vars.animation.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});
			return true;
		}
		var current = main.vars.animation[main.vars.index];
		var x = (current.x - 1) * 16 + 1 + (current.x - 1);
		var y = (current.y - 1) * 16 + 1 + (current.y - 1);
		main.vars.context.fillStyle = 'RoyalBlue';
		main.parts.center(x, y);
		if (current.shape.charAt(0) == '1')
		{
			main.parts.top(x, y);
		}
		if (current.shape.charAt(1) == '1')
		{
			main.parts.right(x, y);
		}
		if (current.shape.charAt(2) == '1')
		{
			main.parts.bottom(x, y);
		}
		if (current.shape.charAt(3) == '1')
		{
			main.parts.left(x, y);
		}
		main.vars.index += 1;
		return true;
	},

	interface: {
		init: function()
		{
			if (main.vars.setup)
			{
				return true;
			}
			main.vars.setup = true;

			main.vars.canvas = js('#pipes').element();
			main.vars.context = main.vars.canvas.getContext('2d');
			main.clear();
			main.vars.interval = setInterval(function()
				{
					return main.interval();
				}, 750);

			return true;
		}
	}
};


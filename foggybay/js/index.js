
const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;


var gui = function(x, y)
{
	var self = {};

	x = parseInt(x);
	y = parseInt(y);

	self.b = 'button[data-xy="' + x + ',' + y + '"]';

	self.count = function(number)
	{
		if (number)
		{
			js(self.b).html('<b>' + number + '</b>');
		}
		else
		{
			js(self.b).html('<span class="small emoji purple-circle"></span>');
		}
		return true;
	};

	self.mine = function()
	{
		js(self.b).class('red-border').add();
		if (!board(x, y).mark())
		{
			js(self.b).html('<span class="small emoji bomb"></span>');
		}
		return true;
	};

	self.mark = function()
	{
		if (board(x, y).mark(!board(x, y).mark()))
		{
			js(self.b).html('<span class="small emoji green-circle"></span>');
		}
		else
		{
			js(self.b).html('<span class="small emoji white-circle"></span>');
		}
		return true;
	};

	self.enter = function()
	{
		if (board(x, y).mark())
		{
			return true;
		}
		if (!board(x, y).active())
		{
			return true;
		}
		board.directions.forEach((function(x, y, direction)
			{
				while (board.exists(x, y))
				{
					var b = 'button[data-xy="' + x + ',' + y + '"]';
					if (board(x, y).mark())
					{
						js(b).class('yellow-border').add();
						break;
					}
					if (!board(x, y).active())
					{
						js(b).html('<span class="small emoji yellow-circle"></span>');
					}
					x += direction.x;
					y += direction.y;
				}
				return true;
			}).bind(null, x, y));
		return true;
	};

	self.leave = function()
	{
		if (board(x, y).mark())
		{
			return true;
		}
		if (!board(x, y).active())
		{
			return true;
		}
		board.directions.forEach((function(x, y, direction)
			{
				while (board.exists(x, y))
				{
					var b = 'button[data-xy="' + x + ',' + y + '"]';
					if (board(x, y).mark())
					{
						js(b).class('yellow-border').remove();
						break;
					}
					if (!board(x, y).active())
					{
						js(b).html('<span class="small emoji white-circle"></span>');
					}
					x += direction.x;
					y += direction.y;
				}
				return true;
			}).bind(null, x, y));
		return true;
	};

	return self;
};

gui.new = function()
{
	js('#board').clear();

	for (var y = 0; y < board.size.y; y += 1)
	{
		var div = '<div>';
		for (var x = 0; x < board.size.x; x += 1)
		{
			div += '<button type="button" data-xy="' + x + ',' + y + '"></button>';
		}
		div += '</div>';
		js('#board').append(div);
	}

	js('#board button')
		.event('mouseenter', main.controls.mouse.enter)
		.event('mouseleave', main.controls.mouse.leave)
		.html('<span class="small emoji white-circle"></span>');

	return true;
};

gui.win = function()
{
	js('#board button').class('green-border').add();
	return true;
};
gui.lost = function()
{
	for (var y = 0; y < board.size.y; y += 1)
	{
		for (var x = 0; x < board.size.x; x += 1)
		{
			if (board(x, y).mine())
			{
				gui(x, y).mine();
			}
		}
	}
	return true;
};


var board = function(x, y)
{
	var self = {};

	x = parseInt(x);
	y = parseInt(y);

	self.set = function(key, value)
	{
		if (board.exists(x, y))
		{
			board.a[board.i(x, y)][key] = value;
		}
		return value;
	};

	self.get = function(key)
	{
		if (!board.exists(x, y))
		{
			return null;
		}
		switch (key)
		{
			case 'count':
				var count = 0;
				board.directions.forEach((function(x, y, direction)
					{
						while (board.exists(x, y))
						{
							if (board(x, y).mine())
							{
								count += 1;
								break;
							}
							x += direction.x;
							y += direction.y;
						}
						return true;
					}).bind(null, x, y));
				return count;
			default:
				return board.a[board.i(x, y)][key];
		}
		return self;
	};

	self.getorset = function()
	{
		switch (arguments.length)
		{
			case 1:
				return self.get(arguments[0]);
			case 2:
				return self.set(arguments[0], arguments[1]);
			default:
				break;
		}
		return self;
	};

	self.mine = function()
	{
		return self.getorset('mine', ...arguments);
	};
	self.mark = function()
	{
		return self.getorset('mark', ...arguments);
	};
	self.active = function()
	{
		return self.getorset('active', ...arguments);
	};
	self.count = function()
	{
		return self.getorset('count', ...arguments);
	};

	return self;
}

board.exists = function(x, y)
{
	return x >= 0 && x < board.size.x && y >= 0 && y < board.size.y;
};
board.i = function(x, y)
{
	return x + board.size.x * y;
};

board.init = function()
{
	board.a = [];

	board.size = {x: 7, y: 7};

	board.directions = [
		{x: -1, y: -1},
		{x: -1, y: 0},
		{x: -1, y: 1},
		{x: 0, y: -1},
		{x: 0, y: 1},
		{x: 1, y: -1},
		{x: 1, y: 0},
		{x: 1, y: 1},
	];
	return true;
};

board.new = function()
{
	board.a = [];
	board.a.length = 0;

	for (var y = 0; y < board.size.y; y += 1)
	{
		for (var x = 0; x < board.size.x; x += 1)
		{
			board.a[board.i(x, y)] = {
				mine: false,
				mark: false,
				active: false
			};
		}
	}

	gui.new();
	return true;
}

board.setup = {
	check: function(not_x, not_y, test_x, test_y)
	{
		var result = true;
		board.directions.forEach((function(x, y, direction)
			{
				while (board.exists(x, y))
				{
					if (x == test_x && y == test_y)
					{
						result = false;
					}
					x += direction.x;
					y += direction.y;
				}
			}).bind(null, not_x, not_y));
		return result;
	},
	new: function(not_x, not_y)
	{
		var list = [];

		for (y = 0; y < board.size.y; y += 1)
		{
			for (x = 0; x < board.size.x; x += 1)
			{
				if (board.setup.check(not_x, not_y, x, y))
				{
					list.push({x: x, y: y});
				}
			}
		}

		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});

		for (var i = 0; i < board.mines; i += 1)
		{
			var mine = list.pop();
			board(mine.x, mine.y).mine(true);
		}
		return false;
	}
};

board.win = function()
{
	var marked = 0;

	for (var i in board.a)
	{
		if (board.a[i].mark == true && board.a[i].mine == true)
		{
			marked += 1;
		}
		if (board.a[i].mark == true && board.a[i].mine != true)
		{
			return false;
		}
		if (board.a[i].mark != true && board.a[i].mine == true)
		{
			return false;
		}
	}

	return marked == board.mines;
};


var game = {
	vars: {
		state: STATE_INIT
	},

	init: function()
	{
		game.vars.state = STATE_INIT;
		board.init();
		return true;
	},

	new: function()
	{
		game.vars.state = STATE_READY;

		var size = parseInt(js('#difficulty').value());
		board.size.x = size;
		board.size.y = size;

		board.mines = parseInt((size * size + 6) / 10);
		if (Math.random() - Math.random() <= 0.0)
		{
			board.mines += 1;
		}

		board.new();
		return true;
	},

	click: {
		left: function(button)
		{
			board(button.x, button.y).active(true);

			if (board(button.x, button.y).mine())
			{
				game.vars.state = STATE_END;
				gui.lost();
				return true;
			}

			gui(button.x, button.y).count(board(button.x, button.y).count());

			if (board(button.x, button.y).count() == 0)
			{
				board.directions.forEach((function(x, y, direction)
					{
						while (board.exists(x, y))
						{
							if (!board(x, y).active())
							{
								game.click.left({x: x, y: y});
							}
							x += direction.x;
							y += direction.y;
						}
					}).bind(null, button.x, button.y));
			}
			return true;
		},

		right: function(button)
		{
			if (board(button.x, button.y).active())
			{
				return true;
			}

			gui(button.x, button.y).mark();

			if (board.win())
			{
				game.vars.state = STATE_END;
				gui.win();
			}
			return true;
		}
	}
};


var main = {
	vars: {
		setup: false,
	},

	button: function(event)
	{
		var data = js(event.element).data('xy').split(',');
		return {x : parseInt(data[0]), y : parseInt(data[1])};
	},

	controls: {
		new: function(event)
		{
			game.new();
			return false;
		},

		click: {
			left: function(event)
			{
				event.preventDefault();
				var button = main.button(event);
				switch (game.vars.state)
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						board.setup.new(button.x, button.y);
						game.click.left(button);
						return true;
					case STATE_RUNNING:
						if (js('#mode').value())
						{
							game.click.right(button);
						}
						else
						{
							if (board(button.x, button.y).mark(false))
							{
								var b = 'button[data-xy="' + button.x + ',' + button.y + '"]';
								js(b).html('<span class="small emoji white-circle"></span>');
							}
							game.click.left(button);
						}
						return true;
					case STATE_END:
						return false;
					default:
						return false;
				}
				return false;
			},

			right: function(event)
			{
				event.preventDefault();
				var button = main.button(event);
				switch (game.vars.state)
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						return false;
					case STATE_RUNNING:
						return game.click.right(button);
					case STATE_END:
						return false;
					default:
						return false;
				}
				return false;
			}
		},

		mouse: {
			enter: function(event)
			{
				var button = main.button(event);
				if (button == null)
				{
					return false;
				}
				switch (game.vars.state)
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						return false;
					case STATE_RUNNING:
						break;
					case STATE_END:
						return false;
					default:
						return false;
				}
				return gui(button.x, button.y).enter();
			},

			leave: function(event)
			{
				var button = main.button(event);
				if (button == null)
				{
					return false;
				}
				switch (game.vars.state)
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						return false;
					case STATE_RUNNING:
						break;
					case STATE_END:
						return false;
					default:
						return false;
				}
				return gui(button.x, button.y).leave();
			}
		}
	},

	interface: {
		init: function()
		{
			if (main.vars.setup)
			{
				return true;
			}
			main.vars.setup = true;

			js('#control_new').event('click', main.controls.new);

			js('#board').event('click', 'button[data-xy]', main.controls.click.left);
			js('#board').event('contextmenu', 'button[data-xy]', main.controls.click.right);

			js('#mode').event('change', function(event)
				{
					if (js(event.element).value())
					{
						js('#switch-text').html('&#x1f7e2; Mark mode');
					}
					else
					{
						js('#switch-text').html('<b>?</b> Select mode');
					}
					return true;
				});

			js('form').event('submit', false);

			game.init();
			game.new();

			return true;
		}
	}
};


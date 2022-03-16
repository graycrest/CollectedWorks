
const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

const MODE_ONESHOT = 0;
const MODE_CLASSIC = 1;

const CONNECTED_TOP = 0;
const CONNECTED_RIGHT = 1;
const CONNECTED_BOTTOM = 2;
const CONNECTED_LEFT = 3;

const colors = {
	border: 'Silver',
	fill: 'White',
	pipes: 'RoyalBlue',
};


var board = function(x, y)
{
	var self = {};

	self.set = function()
	{
		if (!board.exists(x, y))
		{
			return false;
		}
		switch (arguments.length)
		{
			case 1:
				board.a[board.i(x, y)] = arguments[0];
				break;
			case 2:
				var result = board.a[board.i(x, y)][arguments[0]];
				board.a[board.i(x, y)][arguments[0]] = arguments[1];
				return result;
			default:
				break;
		}
		return self;
	};
	self.get = function()
	{
		if (!board.exists(x, y))
		{
			return null;
		}
		switch (arguments.length)
		{
			case 0:
				return board.a[board.i(x, y)];
			case 1:
				return board.a[board.i(x, y)][arguments[0]];
			default:
				break;
		}
		return null;
	};

	self.shape = function()
	{
		if (x == null || y == null)
		{
			switch (arguments.length)
			{
				case 1:
					for (y = 0; y < board.size.y; y += 1)
					{
						for (x = 0; x < board.size.x; x += 1)
						{
							board(x, y).shape(arguments[0]);
						}
					}
					break;
				default:
					break;
			}
			return true;
		}
		if (!board.exists(x, y))
		{
			return null;
		}
		switch (arguments.length)
		{
			case 0:
				return board(x, y).get('shape');
			case 1:
				return board(x, y).set('shape', arguments[0]);
			default:
				break;
		}
		return true;
	};
	self.checked = function()
	{
		if (x == null || y == null)
		{
			switch (arguments.length)
			{
				case 1:
					for (y = 0; y < board.size.y; y += 1)
					{
						for (x = 0; x < board.size.x; x += 1)
						{
							board(x, y).checked(arguments[0]);
						}
					}
					break;
				default:
					break;
			}
			return true;
		}
		if (!board.exists(x, y))
		{
			return null;
		}
		switch (arguments.length)
		{
			case 0:
				return board(x, y).get('checked');
			case 1:
				return board(x, y).set('checked', arguments[0]);
			default:
				break;
		}
		return true;
	};

	self.connected = function(direction)
	{
		return board(x, y).shape() != null && board(x, y).shape().charAt(direction) == '1';
	};
	self.closed = function()
	{
		if (board(x, y).shape() == null)
		{
			return false;
		}
		if (board(x, y).checked())
		{
			return true;
		}
		board(x, y).checked(true);
		var result = true;
		if (board(x, y).connected(CONNECTED_TOP))
		{
			if (!board(x, y - 1).connected(CONNECTED_BOTTOM))
			{
				return false;
			}
			result = result && board(x, y - 1).closed();
		}
		if (board(x, y).connected(CONNECTED_RIGHT))
		{
			if (!board(x + 1, y).connected(CONNECTED_LEFT))
			{
				return false;
			}
			result = result && board(x + 1, y).closed();
		}
		if (board(x, y).connected(CONNECTED_BOTTOM))
		{
			if (!board(x, y + 1).connected(CONNECTED_TOP))
			{
				return false;
			}
			result = result && board(x, y + 1).closed();
		}
		if (board(x, y).connected(CONNECTED_LEFT))
		{
			if (!board(x - 1, y).connected(CONNECTED_RIGHT))
			{
				return false;
			}
			result = result && board(x - 1, y).closed();
		}
		return result;
	};

	return self;
};

board.exists = function(x, y)
{
	x = parseInt(x);
	y = parseInt(y);
	return x >= 0 && x < board.size.x && y >= 0 && y < board.size.y;
};
board.i = function(x, y)
{
	return parseInt(x) + parseInt(y) * board.size.x;
};

board.init = function()
{
	board.a = [];
	board.size = {x: 9, y: 7};
};

board.new = function()
{
	for (var y = 0; y < board.size.y; y += 1)
	{
		for (var x = 0; x < board.size.x; x += 1)
		{
			board(x, y).set({shape: null, checked: false});
			canvas('main').clear(x, y);
		}
	}
	return true;
};


var canvas = function(id)
{
	var self = {};
	self.canvas = js('#' + id).element();
	self.context = self.canvas.getContext('2d');

	self.width = function()
	{
		return self.canvas.width;
	};
	self.height = function()
	{
		return self.canvas.height;
	};

	self.rect = function(style, x, y, w, h)
	{
		self.context.fillStyle = style;
		self.context.fillRect(x, y, w, h);
		return self;
	};

	self.clear = function()
	{
		switch (arguments.length)
		{
			case 0:
				// canvas(id).rect(colors.border, 0, 0, self.canvas.width, self.canvas.height);
				// canvas(id).rect(colors.fill, 1, 1, self.canvas.width - 2, self.canvas.height - 2);
				canvas(id).rect(colors.fill, 0, 0, self.canvas.width, self.canvas.height);
				break;
			case 2:
				var x = parseInt(arguments[0]);
				var y = parseInt(arguments[1]);
				canvas(id).rect(colors.border, x * 33, y * 33, 34, 34);
				canvas(id).rect(colors.fill, x * 32 + x + 1, y * 32 + y + 1, 32, 32);
				break;
			default:
				break;
		}
		return self;
	};

	self.shape = function()
	{
		var x = 1;
		var y = 1;
		var shape = '0000';
		switch (arguments.length)
		{
			case 1:
				canvas(id).clear();
				shape = arguments[0];
				break;
			case 3:
				canvas(id).clear(arguments[0], arguments[1]);
				x = parseInt(arguments[0]) * 32 + parseInt(arguments[0]) + 1;
				y = parseInt(arguments[1]) * 32 + parseInt(arguments[1]) + 1;
				shape = arguments[2];
				break;
			default:
				break;
		}
		if (shape == null)
		{
			return self;
		}
		if (shape.indexOf('1') >= 0)
		{
			canvas(id).rect(colors.pipes, x + 10, y + 10, 12, 12);
		}
		if (shape.charAt(CONNECTED_TOP) == '1')
		{
			canvas(id).rect(colors.pipes, x + 10, y + 0, 12, 10);
		}
		if (shape.charAt(CONNECTED_RIGHT) == '1')
		{
			canvas(id).rect(colors.pipes, x + 22, y + 10, 10, 12);
		}
		if (shape.charAt(CONNECTED_BOTTOM) == '1')
		{
			canvas(id).rect(colors.pipes, x + 10, y + 22, 12, 10);
		}
		if (shape.charAt(CONNECTED_LEFT) == '1')
		{
			canvas(id).rect(colors.pipes, x + 0, y + 10, 10, 12);
		}
		return self;
	};

	return self;
};


var game = {
	vars: {
		state: STATE_INIT,
		mode: MODE_ONESHOT,
		selected: 0,
		previous: null,
		timer: null
	},

	init: function()
	{
		game.vars.state = STATE_INIT;
		board.init();
		if (js.storage('pipes').get('gametime'))
		{
			js.storage('pipes').remove();
		}
		js.storage('pipes').init({
			oneshot: ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
			classic: ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
		});
		game.vars.highscores = js.storage('pipes').get();
		return true;
	},

	new: function()
	{
		game.vars.state = STATE_READY;

		board.new();

		switch (js('#mode').value())
		{
			case 'oneshot':
				game.vars.mode = MODE_ONESHOT;
				js('#highscore').html(game.vars.highscores.oneshot.join('<br />'));
				break;
			case 'classic':
				game.vars.mode = MODE_CLASSIC;
				js('#highscore').html(game.vars.highscores.classic.join('<br />'));
				break;
			default:
				game.vars.mode = MODE_ONESHOT;
				break;
		}

		game.timer.stop();
		game.vars.score = 0;
		js('#score').text('-');
		js('#movetime').text('-');
		js('#gametime').text('-');

		game.vars.list = [];
		game.vars.list.length = 0;
		game.next(false);

		game.vars.undo = [];
		game.vars.undo.length = 0;
		js('#undo').attribute('disabled').set(true);

		game.vars.selected = 0;
		game.vars.previous = null;

		canvas('next_0').shape(game.vars.list[0]);
		canvas('next_1').shape(game.vars.list[1]);
		canvas('next_2').shape(game.vars.list[2]);
		canvas('next_3').shape(game.vars.list[3]);
		canvas('next_4').shape(game.vars.list[4]);

		return false;
	},

	next: function(flag)
	{
		while (game.vars.list.length < 10)
		{
			var list = [];
			var shapes = [
				{shape: '1111', count: 4},

				{shape: '1010', count: 8},
				{shape: '0101', count: 8},

				{shape: '1100', count: 10},
				{shape: '0110', count: 10},
				{shape: '0011', count: 10},
				{shape: '1001', count: 10},

				{shape: '1110', count: 6},
				{shape: '1101', count: 6},
				{shape: '1011', count: 6},
				{shape: '0111', count: 6},
				];
			for (var i in shapes)
			{
				for (var j = 0; j < shapes[i].count; j += 1)
				{
					list.push(shapes[i].shape);
				}
			}
			list.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});
			while (list.length)
			{
				game.vars.list.push(list.pop());
			}
		}
		if (!flag)
		{
			return true;
		}
		var removed = game.vars.list.splice(game.vars.selected, 1);
		game.vars.selected = 0;
		game.vars.previous = null;
		return removed[0];
	},

	scoring: function(shape)
	{
		switch (shape)
		{
			case '1111':
				return 7;
			case '1110':
			case '1101':
			case '1011':
			case '0111':
				return 5;
			case '1010':
			case '0101':
				return 3;
			case '1100':
			case '0110':
			case '0011':
			case '1001':
				return 2;
			default:
				return 1;
		}
		return 1;
	},

	click: {
		left: function(x, y)
		{
			if (board(x, y).shape())
			{
				return false;
			}
			var shape = game.next(true);
			board(x, y).shape(shape);
			canvas('main').shape(x, y, shape);
			canvas('next_0').shape(game.vars.list[0]);
			canvas('next_1').shape(game.vars.list[1]);
			canvas('next_2').shape(game.vars.list[2]);
			canvas('next_3').shape(game.vars.list[3]);
			canvas('next_4').shape(game.vars.list[4]);
			game.vars.undo.push({x: x, y: y});
			js('#undo').attribute('disabled').set(false);
			board(null, null).checked(false);
			if (board(x, y).closed())
			{
				game.vars.undo = [];
				game.vars.undo.length = 0;
				js('#undo').attribute('disabled').set(true);
				var list = [];
				for (var y = 0; y < board.size.y; y += 1)
				{
					for (x = 0; x < board.size.x; x += 1)
					{
						if (board(x, y).checked())
						{
							list.push(game.scoring(board(x, y).shape(null)));
							canvas('main').clear(x, y);
						}
					}
				}
				list.sort(function(a, b)
					{
						return b - a;
					});
				var score = 0;
				var d = 0;
				while (list.length)
				{
					score += (list.length % 10) + (d += list.pop()) + 1;
				}
				game.vars.score += score;
				js('#score').text(game.vars.score);
				var highscore = 'oneshot';
				if (game.vars.mode == MODE_CLASSIC)
				{
					highscore = 'classic';
				}
				game.vars.highscores[highscore].push(game.vars.score);
				game.vars.highscores[highscore].sort(function(a, b)
					{
						if (a == b)
						{
							return 0;
						}
						if (typeof a == 'string')
						{
							return 1;
						}
						if (typeof b == 'string')
						{
							return -1;
						}
						return b - a;
					});
				game.vars.highscores[highscore].length = 10;
				js('#highscore').html(game.vars.highscores[highscore].map(function(score)
					{
						return score == game.vars.score ? '<b>' + score + '</b>' : score;
					}).join('<br />'));
				js.storage('pipes').set(highscore, game.vars.highscores[highscore]);
				if (game.vars.mode == MODE_ONESHOT)
				{
					game.over();
				}
			}
			if (board.a.reduce(function(result, element)
				{
					return result && element.shape != null;
				}, true))
			{
				game.over();
			}
			return true;
		}
	},

	over: function()
	{
		game.vars.state = STATE_END;
		game.vars.undo = [];
		game.vars.undo.length = 0;
		js('#undo').attribute('disabled').set(true);

		var colors = ['LightGray', 'Gray', 'DarkGray'];
		for (y = 1; y < canvas('main').height() - 1; y += 2)
		{
			for (x = 1; x < canvas('main').width() - 1; x += 2)
			{
				canvas('main').rect(colors[parseInt(Math.random() * colors.length)], x, y, 1, 1);
			}
		}
		return true;
	},

	undo: function()
	{
		if (game.vars.undo.length == 0)
		{
			return false;
		}
		var undo = game.vars.undo.pop();
		game.vars.list.unshift(board(undo.x, undo.y).shape(null));
		canvas('main').clear(undo.x, undo.y);
		game.vars.selected = 0;
		game.vars.previous = null;
		canvas('next_0').shape(game.vars.list[0]);
		canvas('next_1').shape(game.vars.list[1]);
		canvas('next_2').shape(game.vars.list[2]);
		canvas('next_3').shape(game.vars.list[3]);
		canvas('next_4').shape(game.vars.list[4]);
		if (game.vars.undo.length == 0)
		{
			js('#undo').attribute('disabled').set(true);
		}
		return true;
	},

	select: function(selected)
	{
		game.vars.selected = parseInt(selected);
		if (game.vars.previous == game.vars.selected)
		{
			game.space();
		}
		game.vars.previous = game.vars.selected;
		return true;
	},

	space: function()
	{
		switch (game.vars.list[game.vars.selected])
		{
			case '1111':
				return true;

			case '1010':
				game.vars.list[game.vars.selected] = '0101';
				break;
			case '0101':
				game.vars.list[game.vars.selected] = '1010';
				break;

			case '1100':
				game.vars.list[game.vars.selected] = '0110';
				break;
			case '0110':
				game.vars.list[game.vars.selected] = '0011';
				break;
			case '0011':
				game.vars.list[game.vars.selected] = '1001';
				break;
			case '1001':
				game.vars.list[game.vars.selected] = '1100';
				break;

			case '1110':
				game.vars.list[game.vars.selected] = '0111';
				break;
			case '0111':
				game.vars.list[game.vars.selected] = '1011';
				break;
			case '1011':
				game.vars.list[game.vars.selected] = '1101';
				break;
			case '1101':
				game.vars.list[game.vars.selected] = '1110';
				break;

			default:
				return true;
		}
		canvas('next_' + game.vars.selected).shape(game.vars.list[game.vars.selected]);
		return true;
	},
		
	timer: {
		start: function()
		{
			game.timer.stop();
			game.vars.movetime = Date.now();
			game.vars.gametime = Date.now();
			game.vars.timer = setInterval(game.timer.interval, 100);
			return true;
		},

		stop: function()
		{
			if (game.vars.timer)
			{
				clearTimeout(game.vars.timer);
				game.vars.timer = null;
			}
			return true;
		},

		interval: function()
		{
			if (game.vars.mode != MODE_CLASSIC)
			{
				return game.timer.stop();
			}
			if (game.vars.state != STATE_RUNNING)
			{
				return game.timer.stop();
			}
			var movetime = Math.max(0, 20 * 1000 - (Date.now() - game.vars.movetime));
			var gametime = Math.max(0, 10 * 60 * 1000 - (Date.now() - game.vars.gametime));
			js('#movetime').text((parseInt(movetime / 100.0) / 10.0).toFixed(1));
			js('#gametime').text((parseInt(gametime / 100.0) / 10.0).toFixed(1));
			if (movetime == 0)
			{
				return game.over();
			}
			if (gametime == 0)
			{
				return game.over();
			}
			return true;
		},

		played: function()
		{
			game.vars.movetime = Date.now();
			return true;
		}
	},

	interface: {
		init: function()
		{
			return game.init();
		},
		new: function()
		{
			return game.new();
		},
		click: {
			left: function(click)
			{
				game.timer.played();
				game.click.left(click.x, click.y);
				return true;
			}
		},
		undo: function(id)
		{
			return game.undo(id);
		},
		select: function(id)
		{
			return game.select(id);
		},
		space: function()
		{
			return game.space();
		}
	}
};


var main = {
	vars: {
		setup: false,
	},

	coords: function(event)
	{
		if (!event.coords.x)
		{
			return null;
		}
		return {
			x: parseInt(event.coords.x / (event.coords.rect.width / board.size.x)),
			y: parseInt(event.coords.y / (event.coords.rect.height / board.size.y))
		};
	},

	controls: {
		new: function(event)
		{
			game.interface.new();
			return false;
		},

		undo: function(event)
		{
			game.interface.undo();
			return false;
		},

		mode: function(event)
		{
			switch (js('#mode').value())
			{
				case 'oneshot':
					js('#highscore').html(game.vars.highscores.oneshot.join('<br />'));
					break;
				case 'classic':
					js('#highscore').html(game.vars.highscores.classic.join('<br />'));
					break;
				default:
					break;
			}
			return true;
		},

		click: {
			left: function(event)
			{
				event.preventDefault();
				var coords = main.coords(event);
				if (coords == null)
				{
					return false;
				}
				switch (game.vars.state)
				{
					case STATE_INIT:
						game.interface.new(coords);
						return true;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.click.left(coords);
						game.timer.start();
						return true;
					case STATE_RUNNING:
						game.interface.click.left(coords);
						return true;
					case STATE_END:
						return false;
					default:
						return false;
				}
				return false;
			},

			button: function(event)
			{
				event.preventDefault();
				var data = js(event.element).data('selected');
				switch (game.vars.state)
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						game.interface.select(data);
						return true;
					case STATE_RUNNING:
						game.interface.select(data);
						return true;
					case STATE_END:
						return false;
					default:
						return false;
				}
				return false;
			}
		},

		key: {
			down: function(event)
			{
				if (event.code != 'Space') // || event.target != document.body)
				{
					return true;
				}
				event.preventDefault();
				game.interface.space();
				return false;
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
			js('#board').event('click', '#main', main.controls.click.left);

			js('#button_next_0').event('click', 'button', main.controls.click.button);
			js('#button_next_1').event('click', 'button', main.controls.click.button);
			js('#button_next_2').event('click', 'button', main.controls.click.button);
			js('#button_next_3').event('click', 'button', main.controls.click.button);
			js('#button_next_4').event('click', 'button', main.controls.click.button);

			js('#mode').event('change', main.controls.mode);

			js('#undo').event('click', 'button', main.controls.undo);

			js('body').event('keydown', main.controls.key.down);

			js('form').event('submit', false);

			game.interface.init();
			game.interface.new();
			return true;
		}
	}
};


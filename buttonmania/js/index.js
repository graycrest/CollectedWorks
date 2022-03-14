
var highscore = {
	vars: {
		lists: [],
		storage: 'buttonmania'
	},

	init: function()
	{
		highscore.vars.lists = [];
		highscore.vars.lists.length = 0;
		highscore.vars.lists[0] = [
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-',
				'-.-'
			];
		js('#difficulty option').each(function(element)
			{
				highscore.vars.lists[parseInt(js(element).value())] = [
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-',
					'-.-'
				];
				return true;
			});
		js.storage(highscore.vars.storage).init({highscore: highscore.vars.lists});
		highscore.vars.lists = js.storage(highscore.vars.storage).get('highscore');
		js('#highscore').html(highscore.vars.lists[5].join('<br />'));
		return true;
	},

	new: function()
	{
		return true;
	},

	add: function(score)
	{
		var list = js('#difficulty').value();
		if (js('#mode').value())
		{
			list = 0;
		}
		highscore.vars.lists[list].push(score);
		highscore.vars.lists[list].sort(function(a, b)
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
		highscore.vars.lists[list].length = 10;
		js.storage(highscore.vars.storage).set('highscore', highscore.vars.lists);
		js('#highscore').html(highscore.vars.lists[list].map(function(element)
			{
				return element == score ? '<b>' + element + '</b>' : element;
			}).join('<br />'));
		return true;
	},

	interface: {
		init: function()
		{
			return highscore.init();
		},
		new: function()
		{
			return highscore.new();
		},
		add: function(score)
		{
			return highscore.add(score);
		}
	}
};

var score = {
	vars: {
		t: null,
		timer: 0,
		moves: 0,
		score: 0,
		total: 0,
		defaults: {
			timer: 1000 - 3 * 100,
			moves: 100,
			total: 0,
			interval: 105
		}
	},

	update: function(newGame = false)
	{
		score.vars.score = parseInt(score.vars.timer + 3.0 * score.vars.moves);
		if (score.vars.timer <= 0 || score.vars.moves <= 0)
		{
			score.vars.score = 0;
		}

		if (newGame)
		{
			js('#score_score').text('-.-');
			js('#score_total').text('-.-');
		}
		else
		{
			js('#score_score').text(score.vars.score);
			if (js('#score_total_class').class('mute').exists())
			{
				js('#score_total').text('-.-');
			}
			else if (score.vars.total)
			{
				js('#score_total').text(score.vars.total);
			}
			else
			{
				js('#score_total').text('-.-');
			}
		}
		return true;
	},

	init: function()
	{
		score.vars.t = null;
		score.vars.timer = score.vars.defaults.timer;
		score.vars.moves = score.vars.defaults.moves;
		score.update(true);
		return true;
	},

	new: function()
	{
		score.stop();
		score.init();
		score.update(true);
		return true;
	},

	start: function()
	{
		score.vars.t = setInterval(score.timer, score.vars.defaults.interval);
		return true;
	},

	stop: function()
	{
		if (score.vars.t)
		{
			clearInterval(score.vars.t);
			score.vars.t = null;
			score.update();
		}
		return true;
	},

	timer: function()
	{
		score.vars.timer = Math.max(0, score.vars.timer - 1);
		score.update();
		if (score.vars.timer == 0)
		{
			score.stop();
			js('#board button').class('red-border').add();
			game.vars.state = STATE_END;
		}
		return true;
	},

	move: function()
	{
		score.vars.moves = Math.max(0, score.vars.moves - 1);
		score.update();
		return true;
	},

	interface: {
		init: function()
		{
			return score.init();
		},
		new: function(difficulty = 15)
		{
			return score.new(difficulty);
		},
		start: function()
		{
			return score.start();
		},
		stop: function(total = false)
		{
			if (total)
			{
				score.vars.total += score.vars.score;
				highscore.interface.add(score.vars.total);
			}
			return score.stop();
		},
		click: function()
		{
			switch (game.interface.state())
			{
				case STATE_INIT:
					return false;
				case STATE_READY:
					return true;
				case STATE_RUNNING:
					return score.move();
				case STATE_END:
					return false;
				default:
					return false;
			}
			return true;
		}
	}
};

var board = {
	vars: {
		a: [],
		b: [],
		size: {
			x: 6,
			y: 6
		}
	},

	exists: function(x, y)
	{
		x = parseInt(x);
		y = parseInt(y);
		return x >= 0 && x < board.vars.size.x && y >= 0 && y < board.vars.size.y;
	},

	i: function(x, y)
	{
		if (!board.exists(x, y))
		{
			return null;
		}
		return parseInt(x) + board.vars.size.y * parseInt(y);
	},

	cell: function(x, y)
	{
		this.value = function()
		{
			if (!board.exists(x, y))
			{
				return null;
			}
			return board.vars.a[board.i(x, y)].value;
		};
		this.count = function()
		{
			if (!board.exists(x, y))
			{
				return null;
			}
			return board.vars.a[board.i(x, y)].count;
		};
		this.add = function(value)
		{
			if (!board.exists(x, y))
			{
				return false;
			}
			board.vars.a[board.i(x, y)].value = ((board.vars.a[board.i(x, y)].value + value) % 4);
			if (board.vars.a[board.i(x, y)].value)
			{
				js('button[data-x="' + x + '"][data-y="' + y + '"]').html('<b>' + board.vars.a[board.i(x, y)].value + '</b>');
			}
			else
			{
				js('button[data-x="' + x + '"][data-y="' + y + '"]').html('<span class="small emoji white-circle"></span>');
			}
			return true;
		};
		this.click = function(value)
		{
			if (!board.exists(x, y))
			{
				return false;
			}
			score.interface.click();
			board.cell(x, y).add(value);
			board.cell(x + 0, y + 1).add(value);
			board.cell(x + 0, y - 1).add(value);
			board.cell(x + 1, y + 0).add(value);
			board.cell(x - 1, y + 0).add(value);
			board.vars.a[board.i(x, y)].count = ((board.vars.a[board.i(x, y)].count + value) % 4);
			return true;
		};
		x = parseInt(x);
		y = parseInt(y);
		return this;
	},

	generate: function(difficulty)
	{
		var hint = 'Classic';
		js('#difficulty option').each(function(element)
			{
				if(difficulty >= js(element).value() * 3)
				{
					hint = js(element).text();
				}
				return true;
			});
		js('#hint').text(hint);
		board.vars.a = [];
		board.vars.a.length = 0;
		board.vars.b = [];
		board.vars.b.length = 0;
		for (var y = 0; y < board.vars.size.y; y += 1)
		{
			for (var x = 0; x < board.vars.size.x; x += 1)
			{
				board.vars.a[board.i(x, y)] = {x: x, y: y, value: 0, count: 0};
				board.vars.b[board.i(x, y)] = {x: x, y: y, value: 0, count: 0};
			}
		}
		js('#board button').html('<span class="small emoji white-circle"></span>').class('green-border').remove().class('red-border').remove();
		var list = [];
		for (var y = 0; y < board.vars.size.y; y += 1)
		{
			for (var x = 0; x < board.vars.size.x; x += 1)
			{
				list.push({x: x, y: y});
				list.push({x: x, y: y});
				list.push({x: x, y: y});
			}
		}
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		for (i = 0; i < difficulty; i += 1)
		{
			var move = list.pop();
			board.cell(move.x, move.y).click(1);
		}
		for (var y = 0; y < board.vars.size.y; y += 1)
		{
			for (var x = 0; x < board.vars.size.x; x += 1)
			{
				board.vars.b[board.i(x, y)].value = board.vars.a[board.i(x, y)].value;
				board.vars.b[board.i(x, y)].count = board.vars.a[board.i(x, y)].count;
			}
		}
		return true;
	},

	interface: {
		init: function()
		{
			js('#board').clear();
			for (var y = 0; y < board.vars.size.y; y += 1)
			{
				var div = '<div>';
				for (var x = 0; x < board.vars.size.x; x += 1)
				{
					div += '<button type="button" data-x="' + x + '" data-y="' + y + '"><span class="small emoji white-circle"></span></button>';
				}
				div += '</div>';
				js('#board').append(div);
			}
			board.generate(15);
			return true;
		},
		new: function(difficulty)
		{
			board.generate(difficulty);
			score.new(difficulty);
			return true;
		},
		win: function()
		{
			var result = true;
			for (var y = 0; y < board.vars.size.y; y += 1)
			{
				for (var x = 0; x < board.vars.size.x; x += 1)
				{
					if (board.cell(x, y).value() > 0)
					{
						result = false;
					}
				}
			}
			return result;
		},
		click: function(x, y)
		{
			return board.cell(x, y).click(3);
		},
		restart: function()
		{
			js('#board button').html('<span class="small emoji white-circle"></span>').class('green-border').remove().class('red-border').remove();
			for (var y = 0; y < board.vars.size.y; y += 1)
			{
				for (var x = 0; x < board.vars.size.x; x += 1)
				{
					board.vars.a[board.i(x, y)].value = board.vars.b[board.i(x, y)].value;
					board.vars.a[board.i(x, y)].count = board.vars.b[board.i(x, y)].count;
					if (board.vars.a[board.i(x, y)].value)
					{
						js('button[data-x="' + x + '"][data-y="' + y + '"]').html('<b>' + board.vars.a[board.i(x, y)].value + '</b>');
					}
					else
					{
						js('button[data-x="' + x + '"][data-y="' + y + '"]').html('<span class="small emoji white-circle"></span>');
					}
				}
			}
			return true;
		}
	}
};


const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

var game = {
	vars: {
		state: STATE_INIT,
		difficulty: 3
	},

	interface: {
		init: function()
		{
			board.interface.init();
			score.interface.init();
			highscore.interface.init();
			game.vars.state = STATE_INIT;
			return true;
		},
		new: function()
		{
			var difficulty = parseInt(js('#difficulty').value());
			game.vars.difficulty = 0;
			if (js('#mode').value())
			{
				board.interface.new(game.vars.difficulty + 3);
			}
			else
			{
				board.interface.new(difficulty * 3);
			}
			score.vars.total = score.vars.defaults.total;
			game.vars.state = STATE_READY;
			return true;
		},
		state: function()
		{
			if (arguments.length == 0)
			{
				return game.vars.state;
			}
			game.vars.state = arguments[0];
			return true;
		},
		click: {
			left: function(button)
			{
				board.interface.click(button.x, button.y);
				if (board.interface.win())
				{
					score.interface.stop(true);
					js('#board button').class('green-border').add();
					if (js('#mode').value())
					{
						game.vars.difficulty = Math.min(64, game.vars.difficulty + 1);
						if (game.vars.difficulty < 12)
						{
							board.interface.new(parseInt(game.vars.difficulty / 1.0) + 3);
						}
						else if (game.vars.difficulty == 12)
						{
							board.interface.new(15);
							game.vars.difficulty = 24;
						}
						else
						{
							board.interface.new(parseInt(game.vars.difficulty / 2.0) + 3);
						}
						score.interface.start();
					}
					else
					{
						game.vars.state = STATE_END;
					}
				}
				else if (score.vars.moves == 0)
				{
					score.stop();
					js('#board button').class('red-border').add();
					game.vars.state = STATE_END;
				}
				return true;
			},
			right: function(button)
			{
				return true;
			}
		}
	}
};


var main = {
	vars: {
		setup: false,
	},

	controls: {
		new: function(event)
		{
			game.interface.new();
			return false;
		},

		restart: function(event)
		{
			switch (game.interface.state())
			{
				case STATE_INIT:
					return false;
				case STATE_READY:
					return true;
				case STATE_RUNNING:
					board.interface.restart();
					return true;
				case STATE_END:
					return false;
				default:
					return false;
			}
			return false;
		},

		mode: function(event)
		{
			switch (game.interface.state())
			{
				case STATE_INIT:
					break;
				case STATE_READY:
					// js('#board button').class('red-border').add();
					score.interface.stop();
					game.vars.state = STATE_END;
					break;
				case STATE_RUNNING:
					js('#board button').class('red-border').add();
					score.interface.stop();
					game.vars.state = STATE_END;
					break;
				case STATE_END:
					break;
				default:
					break;
			}
			js('#difficulty').attribute('disabled').toggle(js('#mode').value());
			js('#score_total_class').class('mute').toggle();
			return true;
		},

		highscore: function(event)
		{
			var list = js('#difficulty').value();
			if (js('#mode').value())
			{
				list = 0;
			}
			js('#highscore').html(highscore.vars.lists[list].join('<br />'));
		},

		click: {
			left: function(event)
			{
				event.preventDefault();
				var button = {x: js(event.element).data('x'), y: js(event.element).data('y')};
				switch (game.interface.state())
				{
					case STATE_INIT:
						return false;
					case STATE_READY:
						score.interface.start();
						game.vars.state = STATE_RUNNING;
						game.interface.click.left(button);
						return true;
					case STATE_RUNNING:
						game.interface.click.left(button);
						return true;
					case STATE_END:
						return false;
					default:
						return false;
				}
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
			js('#control_restart').event('click', main.controls.restart);
			js('#mode').event('change', main.controls.mode);
			js('#mode').event('change', main.controls.highscore);
			js('#difficulty').event('change', main.controls.highscore);

			js('#board').event('click', 'button', main.controls.click.left);

			js('form').event('submit', false);

			game.interface.init();
			game.interface.new();

			return true;
		}
	}
};


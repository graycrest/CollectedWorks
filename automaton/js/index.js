
const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

const BOARD_EMPTY = 0;
const BOARD_PLAYER1 = 1;
const BOARD_PLAYER2 = 2;
const BOARD_LIGHT = 3;
const BOARD_DARK = 4;
const BOARD_INVALID = 5;

const MODE_PVP = 0;
const MODE_CVP = 1;
const MODE_PVC = 2;


/*
https://en.wikipedia.org/wiki/Negamax#Negamax_with_alpha_beta_pruning

function negamax(node, depth, a, b, color) is
    if depth = 0 or node is a terminal node then
        return color × the heuristic value of node

    childNodes := generateMoves(node)
    childNodes := orderMoves(childNodes)

    score := -Infinity

    foreach child in childNodes do
	{
        score := max(score, -negamax(child, depth - 1, -b, -a, -color))

        a := max(a, score)
        if a >= b then
		{
            break (* cut-off *)
		}
	}

    return score

negamax(rootNode, depth, -Infinity, +Infinity, 1) // Initial call for Player A's root node
*/


var ai = {
	guesstimate: function(player, quick = false)
	{
		var score = 0;
		if (quick)
		{
			for (var y = 0; y < board.size.y; y += 1)
			{
				for (var x = 0; x < board.size.x; x += 1)
				{
					switch (board.a[x + y * board.size.x])
					{
						case player:
							score += 1;
							break;
						case 3 - player:
							score -= 1;
							break;
						default:
							break;
					}
				}
			}
			return score;
		}
		for (var y = 0; y < board.size.y; y += 1)
		{
			for (var x = 0; x < board.size.x; x += 1)
			{
				switch (board.a[x + y * board.size.x])
				{
					case player:
						score += 5;
						var count = [0, 0, 0, 0, 0, 0];
						for (var i in game.vars.directions)
						{
							var a = x + game.vars.directions[i].x;
							var b = y + game.vars.directions[i].y;
							if (a >= 0 && a < board.size.x && b >= 0 && b < board.size.y)
							{
								count[board.a[a + b * board.size.x]] += 1;
							}
							else
							{
								count[BOARD_INVALID] += 1;
							}
						}
						score -= 2 * count[BOARD_EMPTY];
						score += 2 * count[player];
						score -= 1 * count[3 - player];
						score -= 2 * count[BOARD_LIGHT];
						score += 3 * count[BOARD_DARK];
						score += 3 * count[BOARD_INVALID];
						break;
					case 3 - player:
						score -= 5;
						var count = [0, 0, 0, 0, 0, 0];
						for (var i in game.vars.directions)
						{
							var a = x + game.vars.directions[i].x;
							var b = y + game.vars.directions[i].y;
							if (a >= 0 && a < board.size.x && b >= 0 && b < board.size.y)
							{
								count[board.a[a + b * board.size.x]] += 1;
							}
							else
							{
								count[BOARD_INVALID] += 1;
							}
						}
						score += 2 * count[BOARD_EMPTY];
						score -= 2 * count[3 - player];
						score += 1 * count[player];
						score += 2 * count[BOARD_LIGHT];
						score -= 3 * count[BOARD_DARK];
						score -= 3 * count[BOARD_INVALID];
						break;
					default:
						break;
				}
			}
		}
		return score;
	},

	algorithm: function(depth, player, a, b)
	{
		if (depth == 0)
		{
			return {move: {x: null, y: null}, score: ai.guesstimate(player, false)}; // Detailed heuristic evaluation
		}

		var list = [];
		for (var y = 0; y < board.size.y; y += 1)
		{
			for (var x = 0; x < board.size.x; x += 1)
			{
				if (board(x, y).is(BOARD_EMPTY))
				{
					var backup = Array.from(board.a);

					board(x, y).set(player);
					game.automaton(x, y, player);

					list.push({x: x, y: y, score: ai.guesstimate(player, true)}); // Quick evaluation - ordering

					board.a = Array.from(backup);
				}
			}
		}

		if (list.length == 0)
		{
			return {move: {x: null, y: null}, score: ai.guesstimate(player, true)}; // Quick evaluation - final score
		}

		list.sort(function(a, b)
			{
				// return b.score - a.score; // Or the other way around... ?!??
				return a.score - b.score; // Or the other way around... ?!??
			});

		var score = Number.NEGATIVE_INFINITY;
		var moves = [];

		while (list.length)
		{
			var move = list.pop();

			var backup = Array.from(board.a);

			board(move.x, move.y).set(player);
			game.automaton(move.x, move.y, player);

			current = ai.algorithm(depth - 1, 3 - player, -b, -a);
			current.score = -current.score;

			board.a = Array.from(backup);

			if (current.score > score)
			{
				score = current.score;
				moves = [];
				moves.push({x: move.x, y: move.y});
			}
			else if (current.score == score)
			{
				moves.push({x: move.x, y: move.y});
			}

			a = Math.max(a, score);
			if (a >= b)
			{
				ai.abc += 1;
				break;
			}
		}

		moves.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		return {move: moves.pop(), score: score};
	},

	think: function(player)
	{
		ai.abc = 0;

		var result = null;
		var depth = 0;
		var count = board.count.all();
		var t = Date.now();
		while (depth <= count[BOARD_EMPTY])
		{
			depth += 1;
			result = ai.algorithm(depth, player, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
			if(Date.now() - t > 500)
			{
				break;
			}
		}

		/*
		var depth = 3;
		switch (js('#difficulty').value())
		{
			case 'small':
				depth = 6;
				break;
			case 'classic':
				depth = 5;
				break;
			case 'large':
				depth = 3;
				break;
			case 'huge':
				depth = 3;
				break;
			default:
				break;
		}
		var result = ai.algorithm(depth, player, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
		*/

		console.log('x:', result.move.x + 1, 'y:', result.move.y + 1, ',', 'score:', result.score, ',', 'depth:', depth, '-', 'abc:', ai.abc);
		return result.move;
	},

	play: function(player)
	{
		ai.thinking = true;
		setTimeout(function()
			{
				var move = ai.think(player);
				ai.thinking = false;
				game.interface.click.left(move);
				return true;
			}, 0);
		return true;
	}
};


var board = function(x, y)
{
	var self = {};
	self.get = function()
	{
		return board.exists(x, y) ? board.a[board.i(x, y)] : BOARD_INVALID;
	};
	self.set = function(value)
	{
		if (!board.exists(x, y))
		{
			return BOARD_INVALID;
		}
		var result = board.a[board.i(x, y)];
		board.a[board.i(x, y)] = value;
		return result;
	};
	self.show = function(value)
	{
		if (!ai.thinking)
		{
			js('button[data-xy="' + x + ',' + y + '"]')
				.class(game.vars.colors[board(x, y).get()]).remove()
				.class(game.vars.colors[value]).add();
		}
		return board(x, y).set(value);
	};
	self.is = function(value)
	{
		return board.exists(x, y) && board.a[board.i(x, y)] == value;
	};
	return self;
}

board.i = function(x, y)
{
	return x + board.size.x * y;
};
board.exists = function(x, y)
{
	x = parseInt(x);
	y = parseInt(y);
	return x >= 0 && x < board.size.x && y >= 0 && y < board.size.y;
};

board.init = function()
{
	board.a = [];
	board.size = {x: 7, y: 7};
	return true;
};

board.new = function()
{
	board.a = [];
	board.a.length = 0;
	switch (arguments.length)
	{
		case 1:
			board.size.x = arguments[0];
			board.size.y = arguments[0];
			break;
		case 2:
			board.size.x = arguments[0];
			board.size.y = arguments[1];
			break;
		default:
			board.size.x = 7;
			board.size.y = 7;
			break;
	}
	for (var i = 0; i < board.size.x * board.size.y; i += 1)
	{
		board.a.push(BOARD_EMPTY);
	}
	return true;
};

board.count = {
	adjacent: function(x, y)
	{
		var count = [0, 0, 0, 0, 0, 0];
		count[board(x + 1, y).get()] += 1;
		count[board(x - 1, y).get()] += 1;
		count[board(x, y + 1).get()] += 1;
		count[board(x, y - 1).get()] += 1;
		if (count[BOARD_PLAYER1] >= 2 && count[BOARD_PLAYER1] > count[BOARD_PLAYER2])
		{
			return BOARD_PLAYER1;
		}
		if (count[BOARD_PLAYER2] >= 2 && count[BOARD_PLAYER2] > count[BOARD_PLAYER1])
		{
			return BOARD_PLAYER2;
		}
		return BOARD_EMPTY;
	},
	all: function()
	{
		var count = [0, 0, 0, 0, 0];
		for (var i in board.a)
		{
			count[board.a[i]] += 1;
		}
		return count;
	}
};


var game = {
	vars: {
		state: STATE_INIT,
		mode: MODE_PVP,
		player: 1,
		colors: [],
		directions: [
			{x: 1, y: 0},
			{x: -1, y:0},
			{x: 0, y: 1},
			{x: 0, y: -1}
		]
	},

	init: function()
	{
		game.vars.colors[BOARD_EMPTY] = 'b_white';
		game.vars.colors[BOARD_PLAYER1] = 'b_info';
		game.vars.colors[BOARD_PLAYER2] = 'b_warning';
		game.vars.colors[BOARD_LIGHT] = 'b_silver';
		game.vars.colors[BOARD_DARK] = 'b_dimgray';
		game.vars.colors[BOARD_INVALID] = 'b_white';
		board.init();
		return true;
	},

	new: function()
	{
		switch (js('#mode').value())
		{
			case 'pvp':
				game.vars.mode = MODE_PVP;
				break;
			case 'pvc':
				game.vars.mode = MODE_PVC;
				break;
			case 'cvp':
				game.vars.mode = MODE_CVP;
				break;
			default:
				game.vars.mode = MODE_PVP;
				break;
		}
		game.vars.player = 1;
		game.announce();
		js('#board').clear();
		var size = 7;
		switch (js('#difficulty').value())
		{
			case 'small':
				size = 5;
				break;
			case 'classic':
				size = 7;
				break;
			case 'large':
				size = 9;
				break;
			case 'huge':
				size = 11;
				break;
			default:
				break;
		}
		board.new(size);
		var list = [];
		for (var y = 0; y < size; y += 1)
		{
			var s = [];
			for (var x = 0; x < size; x += 1)
			{
				if (!((x == 0 || x == size - 1) && (y == 0 || y == size - 1)))
				{
					list.push({x: x, y: y});
				}
				s.push(js.template('<button type="button" data-xy="{X},{Y}" class="{COLOR}">&nbsp;</button>').render(
					{
						x: x,
						y: y,
						color: game.vars.colors[BOARD_EMPTY]
					}));
			}
			js('#board').append('<div>' + s.join('') + '</div>');
		}
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		var i = parseInt(size * size * 0.30);
		var count = [0, 0, 0, 0, 0];
		for (i -= (i % 2); i >= 0; i -= 1)
		{
			var m = list.pop();
			var value = BOARD_EMPTY;
			switch (i % 3)
			{
				case 0:
				case 1:
					value = BOARD_LIGHT;
					break;
				case 2:
					value = BOARD_DARK;
					break;
				default:
					break;
			}
			board(m.x, m.y).show(value);
			count[value] += 1;
		}
		console.clear();
		console.log('BOARD', board.size.x * board.size.y, '-', 'Empty', board.size.x * board.size.y - count[BOARD_LIGHT] - count[BOARD_DARK], 'light', count[BOARD_LIGHT], 'dark', count[BOARD_DARK]);
		if (game.vars.mode == MODE_CVP)
		{
			game.vars.state = STATE_RUNNING;
			ai.play(game.vars.player);
		}
		return true;
	},

	automaton: function(X, Y, player)
	{
		for (var i in game.vars.directions)
		{
			var x = X + game.vars.directions[i].x;
			var y = Y + game.vars.directions[i].y;
			switch (board(x, y).get())
			{
				case 3 - player:
					var a = x;
					var b = y;
					while (board(a, b).is(3 - player))
					{
						a += game.vars.directions[i].x;
						b += game.vars.directions[i].y;
					}
					if (board(a, b).is(player))
					{
						a = x;
						b = y;
						while (board(a, b).is(3 - player))
						{
							board(a, b).show(player);
							game.automaton(a, b, player); // Cool, if somewhat confusing
							a += game.vars.directions[i].x;
							b += game.vars.directions[i].y;
						}
					}
					break;
				case BOARD_LIGHT:
					if (board.count.adjacent(x, y) == player)
					{
						board(x, y).show(player);
						game.automaton(x, y, player);
					}
					break;
				case BOARD_DARK:
					if (board.count.adjacent(x, y) == player)
					{
						board(x, y).show(BOARD_LIGHT);
					}
					break;
				default:
					break;
			}
		}
		return true;
	},

	announce: function()
	{
		switch (arguments.length)
		{
			case 0:
				js('#score_blue').text('-');
				js('#score_orange').text('-');
				break;
			case 1:
			case 2:
				js('#score_blue').text(arguments[0][BOARD_PLAYER1]);
				js('#score_orange').text(arguments[0][BOARD_PLAYER2]);
				break;
			default:
				break;
		}

		switch (arguments.length)
		{
			case 0:
			case 1:
				switch (game.vars.mode)
				{
					case MODE_PVP:
						js('#hint').clear().html(js.template('<span class="{COLOR}">{BLOCK}</span> to play').render(
							{
								color: game.vars.colors[game.vars.player],
								block: '&nbsp'.repeat(4)
							}));
						break;
					case MODE_PVC:
						if (game.vars.player == BOARD_PLAYER1)
						{
							js('#hint').clear().html(js.template('<span class="{COLOR}">{BLOCK}</span> to play, your turn').render(
								{
									color: game.vars.colors[game.vars.player],
									block: '&nbsp'.repeat(4)
								}));
						}
						else
						{
							js('#hint').clear().html(js.template('<span class="{COLOR}">{BLOCK}</span> to play, my turn').render(
								{
									color: game.vars.colors[game.vars.player],
									block: '&nbsp'.repeat(4)
								}));
						}
						break;
					case MODE_CVP:
						if (game.vars.player == BOARD_PLAYER1)
						{
							js('#hint').clear().html(js.template('<span class="{COLOR}">{BLOCK}</span> to play, my turn').render(
								{
									color: game.vars.colors[game.vars.player],
									block: '&nbsp'.repeat(4)
								}));
						}
						else
						{
							js('#hint').clear().html(js.template('<span class="{COLOR}">{BLOCK}</span> to play, your turn').render(
								{
									color: game.vars.colors[game.vars.player],
									block: '&nbsp'.repeat(4)
								}));
						}
						break;
					default:
						break;
				}
				break;
			case 2:
				var winner = 'Unknown';
				switch (game.vars.mode)
				{
					case MODE_PVP:
						if (arguments[0][BOARD_PLAYER1] > arguments[0][BOARD_PLAYER2])
						{
							winner = '<span class="emoji partying-face"></span> <span class="t_info">Blue</span>, wins';
						}
						else if (arguments[0][BOARD_PLAYER2] > arguments[0][BOARD_PLAYER1])
						{
							winner = '<span class="emoji partying-face"></span> <span class="t_warning">Orange</span>, wins';
						}
						else
						{
							winner = '<span class="emoji party-popper"></span>Draw - you win';
						}
						break;
					case MODE_CVP:
						if (arguments[0][BOARD_PLAYER1] > arguments[0][BOARD_PLAYER2])
						{
							winner = 'I win, sorry';
						}
						else if (arguments[0][BOARD_PLAYER2] > arguments[0][BOARD_PLAYER1])
						{
							winner = '<span class="emoji partying-face"></span>You win, congratulations';
						}
						else
						{
							winner = '<span class="emoji party-popper"><span>Draw - we win';
						}
						break;
					case MODE_PVC:
						if (arguments[0][BOARD_PLAYER1] > arguments[0][BOARD_PLAYER2])
						{
							winner = '<span class="emoji partying-face"></span>You win, congratulations';
						}
						else if (arguments[0][BOARD_PLAYER2] > arguments[0][BOARD_PLAYER1])
						{
							winner = 'I win, sorry';
						}
						else
						{
							winner = '<span class="emoji party-popper"><span>Draw - we win';
						}
						break;
					default:
						break;
				}
				js('#hint').clear().html(winner);
				break;
			default:
				break;
		}
		return true;
	},

	click: {
		left: function(button)
		{
			board(button.x, button.y).show(game.vars.player);
			game.automaton(button.x, button.y, game.vars.player);
			game.vars.player = 3 - game.vars.player;
			var count = board.count.all();
			if (count[BOARD_EMPTY])
			{
				game.announce(count);
				if (game.vars.mode == MODE_CVP && game.vars.player == BOARD_PLAYER1)
				{
					ai.play(game.vars.player);
				}
				else if (game.vars.mode == MODE_PVC && game.vars.player == BOARD_PLAYER2)
				{
					ai.play(game.vars.player);
				}
				return true;
			}
			game.vars.state = STATE_END;
			game.announce(count, true);
			return true;
		},

		right: function(button)
		{
			return true;
		}
	},

	interface: {
		init: function()
		{
			game.vars.state = STATE_INIT;
			game.init();
			return true;
		},
		new: function()
		{
			game.vars.state = STATE_READY;
			game.new();
			return true;
		},
		click: {
			left: function(button)
			{
				if (board(button.x, button.y).is(BOARD_EMPTY))
				{
					game.click.left(button);
				}
				return true;
			},
			right: function(button)
			{
				if (board(button.x, button.y).is(BOARD_EMPTY))
				{
					game.click.right(button);
				}
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

		click: {
			left: function(event)
			{
				event.preventDefault();
				var data = js(event.element).data('xy').split(',');
				var details = {
					button: event.element,
					x: parseInt(data[0]),
					y: parseInt(data[1])
				};
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.click.left(details);
						break;
					case STATE_RUNNING:
						game.interface.click.left(details);
						break;
					case STATE_END:
						break;
					default:
						break;
				}
				return false;
			},

			right: function(event)
			{
				event.preventDefault();
				var data = js(event.element).data('xy').split(',');
				var details = {
					button: event.element,
					x: parseInt(data[0]),
					y: parseInt(data[1])
				};
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						break;
					case STATE_RUNNING:
						game.interface.click.right(details);
						break;
					case STATE_END:
						break;
					default:
						break;
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

			js('#board').event('click', 'button', main.controls.click.left);

			game.interface.init();
			game.interface.new();

			return true;
		}
	}
};


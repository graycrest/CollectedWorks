
const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

var game = {
	vars: {
		state: STATE_INIT,
		combination: [],
		moves: []
	},

	init: function()
	{
		return true;
	},

	new: function()
	{
		js('#board').clear();
		js('select').value(0).attribute('disabled').set(false);
		js('#submit').attribute('disabled').set(true);
		game.vars.moves = [];
		return true;
	},

	check: function(played, find)
	{
		var a = [played[0], played[1], played[2], played[3]],
			b = [find[0], find[1], find[2], find[3]],
			result = {black: 0, white: 0};
		for (var i = 0; i < 4; i += 1)
		{
			if (a[i] == b[i])
			{
				a[i] = null;
				b[i] = null;
				result.black += 1;
			}
		}
		for (var i = 0; i < 4; i += 1)
		{
			if (a[i] == null)
			{
				continue;
			}
			for (var j = 0; j < 4; j += 1)
			{
				if (b[j] == null)
				{
					continue;
				}
				if (a[i] == b[j])
				{
					a[i] = null;
					b[j] = null;
					result.white += 1;
				}
			}
		}
		return result;
	},

	submit: function(played)
	{
		var list = [];
		for (var a = 1; a <= 6; a += 1)
		{
			for (var b = 1; b <= 6; b += 1)
			{
				for (var c = 1; c <= 6; c += 1)
				{
					for (var d = 1; d <= 6; d += 1)
					{
						var test = true;
						for (var i in game.vars.moves)
						{
							var result = game.check(game.vars.moves[i].played, [a, b, c, d]);
							if (result.black != game.vars.moves[i].black || result.white != game.vars.moves[i].white)
							{
								test = false;
							}
						}
						if (played[0] == a && played[1] == b && played[2] == c && played[3] == d)
						{
							test = false;
						}
						if (test)
						{
							list.push([a, b, c, d]);
						}
					}
				}
			}
		}
		if (list.length)
		{
			list.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});
			game.vars.combination = [list[0][0], list[0][1], list[0][2], list[0][3]];
		}

		var result = game.check(played, game.vars.combination);
		game.vars.moves.push({played: [played[0], played[1], played[2], played[3]], black: result.black, white: result.white});
		js('#board').append(js.template(''
			+ '<div class="d-center my-0">'
				+ '<span class="small">{LIGHTS}</small>'
				+ '<span class="value">{VALUE_1}</span>'
				+ '<span class="value">{VALUE_2}</span>'
				+ '<span class="value">{VALUE_3}</span>'
				+ '<span class="value">{VALUE_4}</span>'
			+ '</div>'
		).render(
			{
				lights:
					'<span class="emoji green-circle"></span>'.repeat(result.black)
					+ '<span class="emoji white-circle"></span>'.repeat(4 - result.black - result.white)
					+ '<span class="emoji yellow-circle"></span>'.repeat(result.white),
				value_1: played[0],
				value_2: played[1],
				value_3: played[2],
				value_4: played[3]
			}));

		js('select').value(0);
		js('#submit').attribute('disabled').set(true);

		if (result.black == 4)
		{
			game.vars.state = STATE_END;
			js('#board .value').class('green-border').add();
			js('select').attribute('disabled').set(true);
		}
		else if (js('#board div').element().length >= 12)
		{
			game.vars.state = STATE_END;
			js('#board .value').class('red-border').add();
			js('select').attribute('disabled').set(true);
		}

		return true;
	},

	interface: {
		init: function()
		{
			game.init();
			game.vars.state = STATE_INIT;
			return true;
		},
		new: function()
		{
			game.new();
			game.vars.state = STATE_READY;
			return true;
		},
		submit: function(played)
		{
			game.submit(played);
			return true;
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

		select: function(event)
		{
			js('#submit').attribute('disabled').set(parseInt(js('#select_1').value()) == 0 || parseInt(js('#select_2').value()) == 0 || parseInt(js('#select_3').value()) == 0 || parseInt(js('#select_4').value()) == 0);
			return false;
		},

		submit: function(event)
		{
			event.preventDefault();
			var a = [
				parseInt(js('#select_1').value()),
				parseInt(js('#select_2').value()),
				parseInt(js('#select_3').value()),
				parseInt(js('#select_4').value())
			];
			if (a[0] == 0 || a[1] == 0 || a[2] == 0 || a[3] == 0)
			{
				return false;
			}
			switch (game.vars.state)
			{
				case STATE_INIT:
					break;
				case STATE_READY:
					game.vars.state = STATE_RUNNING;
					game.interface.submit(a);
					break;
				case STATE_RUNNING:
					game.interface.submit(a);
					break;
				case STATE_END:
					break;
				default:
					break;
			}
			return false;
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
			js('select').event('change', main.controls.select);

			js('#combination').event('submit', main.controls.submit);

			game.interface.init();
			game.interface.new();

			return true;
		}
	}
};


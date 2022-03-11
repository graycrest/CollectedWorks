
const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

var main = {
	vars: {
		state: STATE_INIT,
		cell: {x: 2, y: 2},
		t: null,
		moves: 0,
		highscores: ['-']
	},

	i: function(x, y)
	{
		x = parseInt(x);
		y = parseInt(y);
		return x >= 0 && x < 5 && y >= 0 && y < 5 ? x + 5 * y : null;
	},

	grouped: function(a, x, y, value)
	{
		var list = [];
		list[0] = [];
		list[0].push({x: x, y: y});
		a[main.i(x, y)].visited = true;
		for (var index = 1; ; index += 1)
		{
			list[index] = [];
			list[index - 1].forEach(function(element)
				{
					var x = parseInt(element.x);
					var y = parseInt(element.y);
					if (main.i(x - 1, y) != null && a[main.i(x - 1, y)].visited == false && a[main.i(x - 1, y)].value == value)
					{
						list[index].push({x: x - 1, y: y});
						a[main.i(x - 1, y)].visited = true;
					}
					if (main.i(x + 1, y) != null && a[main.i(x + 1, y)].visited == false && a[main.i(x + 1, y)].value == value)
					{
						list[index].push({x: x + 1, y: y});
						a[main.i(x + 1, y)].visited = true;
					}
					if (main.i(x, y - 1) != null && a[main.i(x, y - 1)].visited == false && a[main.i(x, y - 1)].value == value)
					{
						list[index].push({x: x, y: y - 1});
						a[main.i(x, y - 1)].visited = true;
					}
					if (main.i(x, y + 1) != null && a[main.i(x, y + 1)].visited == false && a[main.i(x, y + 1)].value == value)
					{
						list[index].push({x: x, y: y + 1});
						a[main.i(x, y + 1)].visited = true;
					}
				});
			if (list[index].length == 0)
			{
				break;
			}
		}
		var L = [];
		for (var index = 0; list[index].length; index += 1)
		{
			list[index].forEach(function(element)
				{
					L.push(element);
				});
		}
		return L.length == 4;
	},

	swap: function(button)
	{
		var dx = Math.sign(button.x - main.vars.cell.x);
		var dy = Math.sign(button.y - main.vars.cell.y);

		for (var x = main.vars.cell.x, y = main.vars.cell.y; !(x == button.x && y == button.y); x += dx, y += dy)
		{
			js('#board').filter('[data-xy="' + x + ',' + y + '"]').data('color', js('#board').filter('[data-xy="' + (x + dx) + ',' + (y + dy) + '"]').data('color'));
			js('#board').filter('[data-xy="' + (x + dx) + ',' + (y + dy) + '"]').data('color', 0);
			main.vars.moves += 1;
		}
		js('#moves').text(main.vars.moves);

		main.vars.cell.x = button.x;
		main.vars.cell.y = button.y;

		var a = [];
		var b = [];
		for (var y = 0; y < 5; y += 1)
		{
			for (var x = 0; x < 5; x += 1)
			{
				var color = js('#board').filter('[data-xy="' + x + ',' + y + '"]').data('color');
				a.push({value: color, visited: false});
				b[color] = {x: x, y: y};
			}
		}
		for (var i = 1; i <= 6; i += 1)
		{
			if (!main.grouped(a, b[i].x, b[i].y, i))
			{
				return false;
			}
		}

		main.vars.state = STATE_END;
		main.stop();
		js('#board button').html('&#x1f604;').each(function(element)
			{
				js(element).data('color', parseInt(js(element).data('color')) + 7);
				return true;
			});
		var score = Math.max(1, 10000 - parseInt(main.vars.score * 10 + main.vars.moves * 3));
		main.vars.highscores.push(
			{
				score: score,
				time: main.vars.score,
				moves: main.vars.moves
			});
		main.sort.value();
		main.vars.highscores.length = Math.min(99, main.vars.highscores.length);
		main.sort.show(score);
		js('#hint').html(js.template(''
			+ '<div>'
			+ 'You scored <b>{SCORE}</b> points, with {MOVES} moves within {TIME} seconds'
			+ '</div>'
			+ '').render({
				score: score,
				time: main.vars.score,
				moves: main.vars.moves
			}));
		js.storage('slider').set('highscores', main.vars.highscores);
		if (js('.scrollhere').eq(':first').element())
		{
			js('.scrollhere').eq(':first').element().scrollIntoView({behavior: "auto", block: "nearest", inline: "start"});
		}
		return true;
	},

	new: function(event)
	{
		main.vars.state = STATE_READY;
		main.stop();
		js('#board button').data('color', 0).html('&nbsp;');

		var list = [];
		for (var i = 1; i <= 6; i += 1)
		{
			list.push(i);
			list.push(i);
			list.push(i);
			list.push(i);
		}
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		for (var y = 0; y < 5; y += 1)
		{
			for (var x = 0; x < 5; x += 1)
			{
				js('#board').filter('[data-xy="' + x + ',' + y + '"]').data('color', x == 2 && y == 2 ? 0 : list.pop());
			}
		}

		main.vars.cell = {x: 2, y: 2};
		main.vars.moves = 0;
		main.vars.score = 0;
		js('#timer').text('-.-');
		js('#moves').text('-.-');
		js('#hint').html('&nbsp;');
		return false;
	},

	start: function()
	{
		main.vars.time = Date.now();
		main.vars.t = setInterval(main.interval, 100);
		return true;
	},

	stop: function()
	{
		if (main.vars.t != null)
		{
			clearInterval(main.vars.t);
			main.vars.t = null;
		}
		return true;
	},

	interval: function()
	{
		main.vars.score = ((Date.now() - main.vars.time) / 1000.0).toFixed(1);
		js('#timer').text(main.vars.score);
		return true;
	},

	sort: {
		show: function(score = null)
		{
			if (main.vars.highscores.length == 0)
			{
				js('#highscoreshide').class('hidden').add();
				js('#highscores').clear().html('<div>&#x1f9fd;</div>');
				return true;
			}
			js('#highscoreshide').class('hidden').remove();
			js('#highscores').clear().html(main.vars.highscores.map(function(element, index)
				{
					return js.template(''
						+ '<div class="score" title="Time: {TIME}s, moves: {MOVES}">'
						+ '<div class="index">{INDEX}</div>'
						+ '<div class="value">{SCORE}</div>'
						+ '<div class="time">{TIME}</div>'
						+ '<div class="moves">{MOVES}</div>'
						+ '</div>'
						+ '').render({
							index: index + 1,
							score: element.score == score ? '<b class="scrollhere">' + element.score + '</b>' : element.score,
							time: element.time,
							moves: element.moves
						});
				}).join(''));
			return true;
		},
		value: function()
		{
			main.vars.highscores.sort(function(a, b)
				{
					if (a.score != b.score)
					{
						return  b.score - a.score;
					}
					if (a.moves != b.moves)
					{
						return a.moves - b.moves;
					}
					return a.time - b.time;
				});
			return true;
		},
		time: function(score = null)
		{
			main.vars.highscores.sort(function(a, b)
				{
					if (a.time != b.time)
					{
						return a.time - b.time;
					}
					if (a.moves != b.moves)
					{
						return a.moves - b.moves;
					}
					return  b.score - a.score;
				});
			return true;
		},
		moves: function(score = null)
		{
			main.vars.highscores.sort(function(a, b)
				{
					if (a.moves != b.moves)
					{
						return a.moves - b.moves;
					}
					if (a.time != b.time)
					{
						return a.time - b.time;
					}
					return  b.score - a.score;
				});
			return true;
		}
	},

	click: {
		left: function(event)
		{
			event.preventDefault();
			switch (main.vars.state)
			{
				case STATE_INIT:
					return false;
				case STATE_READY:
					main.vars.state = STATE_RUNNING;
					main.start();
					break;
				case STATE_RUNNING:
					break;
				case STATE_END:
					return false;
				default:
					return false;
			}
			var data = js(event.element).data('xy').split(',');
			var button = {x: parseInt(data[0]), y: parseInt(data[1])};
			if (Math.sign(button.x - main.vars.cell.x) != 0 && button.y == main.vars.cell.y)
			{
			}
			else if (button.x == main.vars.cell.x && Math.sign(button.y - main.vars.cell.y) != 0)
			{
			}
			else
			{
				return false;
			}
			main.swap(button);
			return false;
		},
		sort: {
			value: function(event)
			{
				main.sort.value();
				main.sort.show();
				return true;
			},
			time: function(event)
			{
				main.sort.time();
				main.sort.show();
				return true;
			},
			moves: function(event)
			{
				main.sort.moves();
				main.sort.show();
				return true;
			}
		}
	},

	key: {
		down: function(event)
		{
			switch (event.key)
			{
				case 'Shift':
				case 'Alt':
					return true;
				case 'w':
				case 'W':
				case 'ArrowUp':
				case 'a':
				case 'A':
				case 'ArrowLeft':
				case 's':
				case 'S':
				case 'ArrowDown':
				case 'd':
				case 'D':
				case 'ArrowRight':
					break;
				default:
					return true;
			}
			switch (main.vars.state)
			{
				case STATE_INIT:
					return true;
				case STATE_READY:
					main.vars.state = STATE_RUNNING;
					main.start();
					break;
				case STATE_RUNNING:
					break;
				case STATE_END:
					return true;
				default:
					return true;
			}
			event.preventDefault();
			switch (event.key)
			{
				case 'Shift':
				case 'Alt':
					return true;
				case 'w':
				case 'W':
				case 'ArrowUp':
					if (main.vars.cell.y < 5 - 1)
					{
						main.swap({x: main.vars.cell.x, y: main.vars.cell.y + 1});
					}
					break;
				case 'a':
				case 'A':
				case 'ArrowLeft':
					if (main.vars.cell.x < 5 - 1)
					{
						main.swap({x: main.vars.cell.x + 1, y: main.vars.cell.y});
					}
					break;
				case 's':
				case 'S':
				case 'ArrowDown':
					if (main.vars.cell.y > 0)
					{
						main.swap({x: main.vars.cell.x, y: main.vars.cell.y - 1});
					}
					break;
				case 'd':
				case 'D':
				case 'ArrowRight':
					if (main.vars.cell.x > 0)
					{
						main.swap({x: main.vars.cell.x - 1, y: main.vars.cell.y});
					}
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
			js.storage('slider').init({highscores: []});
			main.vars.highscores = js.storage('slider').get('highscores');

			main.sort.value();
			main.sort.show();

			js('#control_new').event('click', main.new);
			js('#board').event('click', 'button', main.click.left);
			js('body').event('keydown', main.key.down);
			js('form').event('submit', false);

			js('#highscoretable .value').event('click', main.click.sort.value);
			js('#highscoretable .time').event('click', main.click.sort.time);
			js('#highscoretable .moves').event('click', main.click.sort.moves);

			js('.dropdown-button').event('click', 'button', function(event)
				{
					js('.dropdown-content').class('hidden').toggle();
					return true;
				});
			js('body').event('click', function(event)
				{
					if (!js(event.element).class('dropdown-button').exists())
					{
						js('.dropdown-content').class('hidden').add();
					}
					return true;
				});

			main.vars.state = STATE_INIT;

			main.new();

			if ('serviceWorker' in navigator)
			{
				navigator.serviceWorker.register('/slider/worker.js').then(function(registration)
					{
						console.log('Worker registered', registration.scope);
						// registration.update();
						return true;
					}).catch(function(error)
						{
							console.log('Worker registration failed', error);
							return true;
						});;
			}

			return true;
		}
	}
};


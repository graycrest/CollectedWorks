
/*
Basic
Naked Single, Hidden Single

Easy
Naked Pair, Hidden Pair, Pointing Pairs

Medium
Naked Triple, Naked Quad, Pointing Triples, Hidden Triple, Hidden Quad

Hard
XWing, Swordfish, Jellyfish, XYWing, Skyscraper, XYZWing
*/


const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;


var gui = function(x, y)
{
	var self = {};
	x = parseInt(x);
	y = parseInt(y);

	self.mute = function(data)
	{
		js(data.button).html(data.number).class('mute').add();
		return self;
	};
	self.unmute = function(data)
	{
		js(data.button).html('<b>' + data.number + '</b>').class('mute').remove();
		return self;
	};
	self.red = function(data)
	{
		js(data.button).class('red').add();
		return self;
	};
	self.unred = function(data)
	{
		js(data.button).class('red').remove();
		return self;
	};
	self.blue = function(data)
	{
		js(data.button).class('blue').add();
		return self;
	};
	self.unblue = function(data)
	{
		js(data.button).class('blue').remove();
		return self;
	};

	self.small = function()
	{
		var data = board(x, y).get();
		switch (arguments.length)
		{
			case 0:
				break;
			case 1:
				data = arguments[0];
				break;
			default:
				break;
		}
		if (!js('#usepencilmarks').value())
		{
			data.list = [];
		}
		return gui.button(x, y, 'small', data);
	};
	self.large = function()
	{
		var data = board(x, y).get();
		switch (arguments.length)
		{
			case 0:
				break;
			case 1:
				data = arguments[0];
				break;
			default:
				break;
		}
		return gui.button(x, y, 'large', data);
	};
	self.given = function()
	{
		var data = board(x, y).get();
		switch (arguments.length)
		{
			case 0:
				break;
			case 1:
				data = arguments[0];
				break;
			default:
				break;
		}
		return gui.button(x, y, 'given', data);
	};
	self.found = function()
	{
		var data = board(x, y).get();
		switch (arguments.length)
		{
			case 0:
				break;
			case 1:
				data = arguments[0];
				break;
			default:
				break;
		}
		return gui.button(x, y, 'found', data);
	};

	return self;
};

gui.init = function()
{
	return true;
};

gui.new = function()
{
	var s = '';

	s += '<div class="container-3x3-huge">';
	for (var d = 0; d < 3; d += 1)
	{
		for (var c = 0; c < 3; c += 1)
		{
			s += '<div class="container-3x3-large">';
			for (var b = 0; b < 3; b += 1)
			{
				for (var a = 0; a < 3; a += 1)
				{
					var x = a + 3 * c;
					var y = b + 3 * d;
					s += '<div class="container-3x3-small" data-x="' + x + '" data-y="' + y + '">';
					s += gui(x, y).small({number: 0, list: []});
					s += '</div>';
				}
			}
			s += '</div>';
		}
	}
	s += '</div>';

	js('#board').clear().append(s);

	return true;
};

gui.button = function(x, y, which, data)
{
	var template = '<button type="button" data-type="small" data-number="{NUMBER}" class="button-small{CLASS}">{SHOW}</button>';
	switch (which)
	{
		case 'small':
			var s = '';
			for (var i = 1; i <= 9; i += 1)
			{
				var show = i;
				var mute = ' mute';
				if (data.list.includes(i))
				{
					show = '<b>' + i + '</b>';
					mute = '';
				}
				s += js.template(template). render({
					number: i,
					show: show,
					class: mute
				});
			}
			js('.container-3x3-small[data-x="' + x + '"][data-y="' + y + '"]').clear().append(s);
			return true;
		case 'given':
		case 'large':
		case 'found':
			template = '<button type="button" data-type="{WHICH}" data-number="{NUMBER}" class="button-{WHICH}">{SHOW}</button>';
			break;
		default:
			return '';
	}
	js('.container-3x3-small[data-x="' + x + '"][data-y="' + y + '"]').clear().append(js.template(template).render({
		number: data.number,
		show: data.number,
		which: which
	}));
	return true;
};

gui.completed = function()
{
	if (!board.verify())
	{
		for (var i = 1; i <= 9; i += 1)
		{
			js('#completed' + i).html(i).class('mute').add();
		}
		js('#completed').class('hidden').add();
		return true;
	}
	var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var all = 0;
	for (var y = 0; y < 9; y += 1)
	{
		for (var x = 0; x < 9; x += 1)
		{
			count[board(x, y).number()] += 1;
		}
	}
	for (var i = 1; i <= 9; i += 1)
	{
		if (count[i] == 9)
		{
			js('#completed' + i).html('<b>' + i + '</b>').class('mute').remove();
			all += 1;
		}
		else
		{
			js('#completed' + i).html(i).class('mute').add();
		}
	}
	if (all == 9)
	{
		js('#completed').class('hidden').remove();
	}
	else
	{
		js('#completed').class('hidden').add();
	}
	return true;
};


var board = function(x, y)
{
	var self = {};
	x = parseInt(x);
	y = parseInt(y);

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
	self.set = function()
	{
		if (!board.exists(x, y))
		{
			return self;
		}
		switch (arguments.length)
		{
			case 1:
				board.a[board.i(x, y)] = arguments[0];
				break;
			case 2:
				board.a[board.i(x, y)][arguments[0]] = arguments[1];
				break;
			default:
				break;
		}
		return self;
	};

	self.number = function()
	{
		switch (arguments.length)
		{
			case 0:
				return board(x, y).get('number');
			case 1:
				return board(x, y).set('number', arguments[0]);
			default:
				break;
		}
		return self;
	};
	self.list = function()
	{
		switch (arguments.length)
		{
			case 0:
				return board(x, y).get('list');
			case 1:
				return board(x, y).set('list', arguments[0]);
			default:
				break;
		}
		return self;
	};

	self.candidates = function()
	{
		var test = [false, true, true, true, true, true, true, true, true, true];
		for (var i = 0; i < 9; i += 1)
		{
			test[board(x, i).number()] = false;
			test[board(i, y).number()] = false;
		}
		dx = 3 * parseInt(x / 3);
		dy = 3 * parseInt(y / 3);
		for (b = 0; b < 3; b += 1)
		{
			for (a = 0; a < 3; a += 1)
			{
				test[board(dx + a, dy + b).number()] = false;
			}
		}
		board.a[x + 9 * y].list = [];
		for (var i = 1; i <= 9; i += 1)
		{
			if (test[i])
			{
				board.a[x + 9 * y].list.push(i);
			}
		}
		return self;
	},

	self.update = function()
	{
		for (var i = 0; i < 9; i += 1)
		{
			if (board(i, y).number() == 0)
			{
				board(i, y).candidates();
			}
			if (board(x, i).number() == 0)
			{
				board(x, i).candidates();
			}
		}
		var dx = 3 * parseInt(x / 3);
		var dx = 3 * parseInt(y / 3);
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				if (board(dx + a, dy + b).number() == 0)
				{
					board(dx + a, dy + b).candidates();
				}
			}
		}
		return true;
	};

	return self;
};

board.exists = function(x, y)
{
	x = parseInt(x);
	y = parseInt(y);
	return x >= 0 && x < 9 && y >= 0 && y < 9;
};
board.i = function(x, y)
{
	return parseInt(x) + parseInt(y) * 9;
}

board.init = function()
{
	board.a = [];
	return true;
};

board.new = function(s)
{
	board.a = [];
	board.a.length = 0;

	for (var y = 0; y < 9; y += 1)
	{
		for (var x = 0; x < 9; x += 1)
		{
			board.a.push({number: parseInt(s[board.i(x, y)]), list: []});
		}
	}

	for (var y = 0; y < 9; y += 1)
	{
		for (var x = 0; x < 9; x += 1)
		{
			if (board(x, y).number() == 0)
			{
				board(x, y).candidates();
				gui(x, y).small();
			}
			else
			{
				gui(x, y).given();
			}
		}
	}

	return true;
};

board.verify = function()
{
	var result = true;

	for (var j = 0; j < 9; j += 1)
	{
		var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		for (var i = 0; i < 9; i += 1)
		{
			count[board(i, j).number()] += 1;
		}
		for (var i = 1; i <= 9; i += 1)
		{
			if (count[i] > 1)
			{
				// console.log('Failed', i, 'line', j);
				result = false;
			}
		}
	}

	for (var i = 0; i < 9; i += 1)
	{
		var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		for (var j = 0; j < 9; j += 1)
		{
			count[board(i, j).number()] += 1;
		}
		for (var j = 1; j <= 9; j += 1)
		{
			if (count[j] > 1)
			{
				// console.log('Failed', j, 'column', i);
				result = false;
			}
		}
	}

	for (var d = 0; d < 3; d += 1)
	{
		for (var c = 0; c < 3; c += 1)
		{
			var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			for (var b = 0; b < 3; b += 1)
			{
				for (var a = 0; a < 3; a += 1)
				{
					var x = a + 3 * c;
					var y = b + 3 * d;
					count[board(x, y).number()] += 1;
				}
			}
			for (var i = 1; i <= 9; i += 1)
			{
				if (count[i] > 1)
				{
					// console.log('Failed', i, 'block', c + 3 * d);
					result = false;
				}
			}
		}
	}

	if (result == false)
	{
		js('#hint').html('<div class="help-danger"><header>?</header>Invalid move or position</div>');
		setTimeout(function()
			{
				js('#hint').text('');
				return true;
			}, 3000);
	}
	else
	{
		js('#hint').text('');
	}
	return result;
};


var  generate = {
	fixed: function()
	{
		// var s = '005020600 090004010 200500003 006030000 000801000 000090400 300002007 010900050 004060800'; // "Binary Fission" by shye (hint: 4 in 4,7)
		var s = '000603000 030010050 009000200 700106009 020000080 100409003 008000100 005090070 000704000'; // Total symmetry example

		// var s = '000490000 008020004 060500070 054000600 000000000 009000580 030002090 500080300 000073000'; // Keep, needs all
		// var s = '091700050 700801000 008469000 073000000 000396000 000000280 000684500 000902001 020007940'; // Needs all!
		// var s = '000200080 080001050 200508167 070690005 003415700 500073040 938106004 060700010 010004000'; // NOT unique
		// var s = '100000000 000600000 060935000 002340060 300001002 000000084 050060000 001002090 800000071'; // Nice?
		// var s = '000102000 060000070 008000900 400000003 050007000 200080001 009000805 070000060 000304000'; // "Breakthrough"

		return s.replaceAll(/[\s]/g, '').replaceAll(/[^\d]/g, '0');
	},

	completed: function()
	{
		/*
		var sudoku = [
			'123 456 789',
			'456 789 123',
			'789 123 456',

			'234 567 891',
			'567 891 234',
			'891 234 567',

			'345 678 912',
			'678 912 345',
			'912 345 678'
		];
		*/

		var board = [];

		for (var i = 0; i < 81; i += 1)
		{
			board.push(0);
		}

		var list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});

		var offset = 0;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[i];
				i += 1;
			}
		}

		var offset = 3;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 3) % 9];
				i += 1;
			}
		}

		var offset = 6;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 6) % 9];
				i += 1;
			}
		}

		var t = list[0]; list[0] = list[1]; list[1] = list[2]; list[2] = t;
		var t = list[3]; list[3] = list[4]; list[4] = list[5]; list[5] = t;
		var t = list[6]; list[6] = list[7]; list[7] = list[8]; list[8] = t;

		var offset = 27;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[i];
				i += 1;
			}
		}

		var offset = 27 + 3;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 3) % 9];
				i += 1;
			}
		}

		var offset = 27 + 6;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 6) % 9];
				i += 1;
			}
		}

		var t = list[0]; list[0] = list[1]; list[1] = list[2]; list[2] = t;
		var t = list[3]; list[3] = list[4]; list[4] = list[5]; list[5] = t;
		var t = list[6]; list[6] = list[7]; list[7] = list[8]; list[8] = t;

		var offset = 54;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[i];
				i += 1;
			}
		}

		var offset = 54 + 3;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 3) % 9];
				i += 1;
			}
		}

		var offset = 54 + 6;
		var i = 0;
		for (var b = 0; b < 3; b += 1)
		{
			for (var a = 0; a < 3; a += 1)
			{
				board[offset + a + b * 9] = list[(i + 6) % 9];
				i += 1;
			}
		}

		return board.join('').match(/........./g);
	},

	nimools: function()
	{
		var result = null;
		var count = 0;
		while (result == null)
		{
			if (((count += 1) % 1000) == 0)
			{
				console.log(count);
			}
			var a = [];
			var indexes = [];
			for (var i = 0; i < 81; i += 1)
			{
				indexes.push(i);
			}
			indexes.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});
			for (var i = 0; i < 20;)
			{
				a[indexes[i]] = (i % 9) + 1;
			}
			if (ai.think(a).indexOf('0') == -1)
			{
				result = Array.from(a);
				break;
			}
		}

		return result;
	},

	new: function()
	{
		var sudoku = generate.completed();

		generate.stats.g += 1;

		var list = [];
		for (var i = 0; i < 300; i += 1)
		{
			list.push(i % 5);
		}
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		list.forEach(function(element)
			{
				switch (element)
				{
					case 0:
						var a = [0, 1, 2];
						a.sort(function(a, b)
							{
								return Math.random() - Math.random();
							});
						var t = sudoku[a[0]]; sudoku[a[0]] = sudoku[a[1]]; sudoku[a[1]] = t;
						break;
					case 1:
						var a = [3, 4, 5];
						a.sort(function(a, b)
							{
								return Math.random() - Math.random();
							});
						var t = sudoku[a[0]]; sudoku[a[0]] = sudoku[a[1]]; sudoku[a[1]] = t;
						break;
					case 2:
						var a = [6, 7, 8];
						a.sort(function(a, b)
							{
								return Math.random() - Math.random();
							});
						var t = sudoku[a[0]]; sudoku[a[0]] = sudoku[a[1]]; sudoku[a[1]] = t;
						break;
					case 3:
						var a = [0, 3, 6];
						a.sort(function(a, b)
							{
								return Math.random() - Math.random();
							});
						for (var i = 0; i < 3; i += 1)
						{
							var t = sudoku[a[0] + i]; sudoku[a[0] + i] = sudoku[a[1] + i]; sudoku[a[1] + i] = t;
						}
						break;
					case 4:
						var t = ['', '', '', '', '', '', '', '', ''];
						for (var y = 0; y < 9; y += 1)
						{
							for (var x = 0; x < 9; x += 1)
							{
								t[x] += sudoku[y][x];
							}
						}
						sudoku = t;
						break;
					default:
						break;
				}
			});

		sudoku = sudoku.join('').replaceAll(/[^\d]/g, '');

		var symmetry = parseInt(Math.random() * 2);
		var list = [];
		for (var d = 0; d < 3; d += 1)
		{
			for (var c = 0; c < 3; c += 1)
			{
				var block = [];
				for (var b = 0; b < 3; b += 1)
				{
					for (var a = 0; a < 3; a += 1)
					{
						block.push((a + 3 * c) + 9 * (b + 3 * d));
					}
				}
				block.sort(function(a, b)
					{
						return Math.random() - Math.random();
					});
				block.length = Math.min(4, block.length);
				while (block.length)
				{
					list.push(block.pop());

				}
			}
		}

		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});

		var a = [];
		for (var i = 0; i < 81; i += 1)
		{
			a.push(0);
		}

		var result = null;
		var move = null;
		for (var i = 0; i <= 33; i += 1)
		{
			if (list.length)
			{
				generate.stats.c += 1;
				move = list.pop();
				a[move] = sudoku[move];
			}
			if (i >= 30)
			{
				generate.stats.i = i;
				generate.stats.s += 1;
				if (ai.think(a).indexOf('0') == -1)
				{
					result = Array.from(a);
					break;
				}
			}
		}

		if (result == null)
		{
			return generate.new();
		}

		return result.join('');
	}
};


var ai = {
	init: function()
	{
		ai.lines = [];
		ai.columns = [];
		ai.blocks = [];

		for (var i = 0; i < 9; i += 1)
		{
			ai.lines[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			ai.columns[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			ai.blocks[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		}

		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				var index = x + 9 * y;
				var bx = parseInt(x / 3);
				var by = parseInt(y / 3);

				ai.lines[y][x] = index;
				ai.columns[x][y] = index;
				ai.blocks[bx + 3 * by][(x - 3 * bx) + 3 * (y - 3 * by)] = index;
			}
		}
		return true;
	},

	check: function(a)
	{
		a.sort();
		return a.length == 9 && a.reduce(function(previous, current, index, data)
			{
				return previous && data[index - 1] == current - 1;
			});
	},

	found: function(where, data, announce = true)
	{
		if (typeof data.index != 'undefined')
		{
			data.x = parseInt(data.index % 9);
			data.y = parseInt(data.index / 9);
		}
		else if (typeof data.x != 'undefined' && typeof data.y != 'undefined' )
		{
			data.index = data.x + 9 * data.y;
		}
		else
		{
			console.log(data)
		}
		data.block = parseInt(data.x / 3) + 3 * parseInt(data.y / 3);

		if (announce)
		{
			console.log(where, data.x, data.y, '-', data.number);
		}

		ai.a[data.index] = data.number;
		ai.b[data.index] = [];

		ai.lines[data.y].forEach(function(index)
			{
				ai.b[index] = ai.b[index].filter(function(element)
					{
						return element != data.number;
					});
			});
		ai.columns[data.x].forEach(function(index)
			{
				ai.b[index] = ai.b[index].filter(function(element)
					{
						return element != data.number;
					});
			});
		ai.blocks[data.block].forEach(function(index)
			{
				ai.b[index] = ai.b[index].filter(function(element)
					{
						return element != data.number;
					});
			});
		return true;
	},

	block2xy: function(blockNumber, blockPosition)
	{
		return {
			x: 3 * parseInt(blockNumber % 3) + parseInt(blockPosition % 3),
			y: 3 * parseInt(blockNumber / 3) + parseInt(blockPosition / 3)
		};
	},

	methods: {
		ywing: {
			line: function(x, y, data)
			{
				var found = false;
				for (var i = 0; i < 9; i += 1)
				{
					var index = i + 9 * y;
					if (ai.c[index].includes(data[0]) && ai.c[index].includes(data[1]))
					{
						found = {x: i, y: y};
					}
				}
				return found;
			},
			column: function(x, y, data)
			{
				var found = false;
				for (var i = 0; i < 9; i += 1)
				{
					var index = x + 9 * i;
					if (ai.c[index].includes(data[0]) && ai.c[index].includes(data[1]))
					{
						found = {x: x, y: i};
					}
				}
				return found;
			},
			block: function(x, y, data)
			{
				var found = false;
				var offset = 3 * parseInt(x / 3) + 9 * 3 * parseInt(y / 3);
				for (var b = 0; b < 3; b += 1)
				{
					for (var a = 0; a < 3; a += 1)
					{
						var index = offset + a + 9 * b;
						if (ai.c[index].includes(data[0]) && ai.c[index].includes(data[1]))
						{
							found = {x: 3 * parseInt(x / 3) + a, y: 3 * parseInt(y / 3) + b};
						}
					}
				}
				return found;
			},
			list: function(x, y)
			{
				var list = [];
				ai.lines[y].forEach(function(index)
					{
						list.push(index);
					});
				ai.columns[x].forEach(function(index)
					{
						list.push(index);
					});
				ai.blocks[parseInt(x / 3) + 3 * parseInt(y / 3)].forEach(function(index)
					{
						list.push(index);
					});
				return list;
			},
			found: function(x, y, a, b, number)
			{
				var result = false;
				var lista = ai.methods.ywing.list(a.x, a.y);
				var listb = ai.methods.ywing.list(b.x, b.y);
				lista.forEach(function(index)
					{
						if (listb.includes(index))
						{
							if (index != a.x + 9 * a.y && index != b.x + 9 * b.y)
							{
								var L = ai.b[index].length;
								ai.b[index] = ai.b[index].filter(function(element)
									{
										return element != number;
									});
								if (L != ai.b[index].length)
								{
									// console.log('YWing', x + '-' + y, a.x + '-' + a.y, b.x + '-' + b.y, ', number', number, ' , list', ai.b[index].join('-'));
									result = true;
								}
							}
						}
					});
				return result;
			},
			run: function(data)
			{
				var result = false;
				for (var y = 0; y < 9; y += 1)
				{
					for (var x = 0; x < 9; x += 1)
					{
						var index = x + 9 * y;
						if (ai.c[index].includes(data.a) && ai.c[index].includes(data.b))
						{
							var ac = [
								ai.methods.ywing.line(x, y, [data.a, data.c]),
								ai.methods.ywing.column(x, y, [data.a, data.c]),
								ai.methods.ywing.block(x, y, [data.a, data.c])
							];
							var bc = [
								ai.methods.ywing.line(x, y, [data.b, data.c]),
								ai.methods.ywing.column(x, y, [data.b, data.c]),
								ai.methods.ywing.block(x, y, [data.b, data.c])
							];
							for (a = 0; a < 3; a += 1)
							{
								for (b = 0; b < 3; b += 1)
								{
									if (ac[a] && bc[b])
									{
										if (ai.methods.ywing.found(x, y, ac[a], bc[b], data.c))
										{
											result = true;
										}
									}
								}
							}
						}
					}
				}
				return result;
			},
			call: function()
			{
				var result = false;

				ai.c = [];
				ai.c.length = 0;

				for (var i = 0; i < ai.b.length; i += 1)
				{
					ai.c[i] = [];
					if (ai.b[i].length == 2)
					{
						ai.c[i] = ai.b[i];
					}
				}

				for (var a = 1; a <= 9; a += 1)
				{
					for (var b = 1; b <= 9; b += 1)
					{
						if (b == a)
						{
							continue;
						}
						for (var c = 1; c <= 9; c += 1)
						{
							if (c == a || c == b)
							{
								continue;
							}
							if (ai.methods.ywing.run({a: a, b: b, c: c}))
							{
								result = true;
							}
						}
					}
				}

				return result;
			}
		},

		xwing: {
			line: function(i, line1, line2)
			{
				var result = false;
				var found1 = [];
				var found2 = [];
				ai.lines[line1].forEach(function(index, position)
					{
						if (ai.a[index] == 0)
						{
							ai.b[index].forEach(function(number)
								{
									if (number == i)
									{
										found1.push(position);
									}
								});
						}
					});
				ai.lines[line2].forEach(function(index, position)
					{
						if (ai.a[index] == 0)
						{
							ai.b[index].forEach(function(number)
								{
									if (number == i)
									{
										found2.push(position);
									}
								});
						}
					});
				if (found1.length == 2 && found2.length == 2)
				{
					if (found1.includes(found2[0]) && found1.includes(found2[1]))
					{
						ai.columns[found1[0]].forEach(function(index, lineNumber)
							{
								if (lineNumber != line1 && lineNumber != line2)
								{
									var L = ai.b[index].length;
									ai.b[index] = ai.b[index].filter(function(element)
										{
											return element != i;
										});
									if (ai.b[index].length != L)
									{
										result = true;
									}
								}
							});
						ai.columns[found1[1]].forEach(function(index, lineNumber)
							{
								if (lineNumber != line1 && lineNumber != line2)
								{
									var L = ai.b[index].length;
									ai.b[index] = ai.b[index].filter(function(element)
										{
											return element != i;
										});
									if (ai.b[index].length != L)
									{
										result = true;
									}
								}
							});
						if (result)
						{
							// console.log('xwing', i, 'l1', line1, 'l2', line2, found1[0] + '-' + found1[1]);
						}
					}
				}
				return result;
			},
			column: function(i, column1, column2)
			{
				var result = false;
				var found1 = [];
				var found2 = [];
				ai.columns[column1].forEach(function(index, position)
					{
						if (ai.a[index] == 0)
						{
							ai.b[index].forEach(function(number)
								{
									if (number == i)
									{
										found1.push(position);
									}
								});
						}
					});
				ai.columns[column2].forEach(function(index, position)
					{
						if (ai.a[index] == 0)
						{
							ai.b[index].forEach(function(number)
								{
									if (number == i)
									{
										found2.push(position);
									}
								});
						}
					});
				if (found1.length == 2 && found2.length == 2)
				{
					if (found1.includes(found2[0]) && found1.includes(found2[1]))
					{
						ai.lines[found1[0]].forEach(function(index, columnNumber)
							{
								if (columnNumber != column1 && columnNumber != column2)
								{
									var L = ai.b[index].length;
									ai.b[index] = ai.b[index].filter(function(element)
										{
											return element != i;
										});
									if (ai.b[index].length != L)
									{
										result = true;
									}
								}
							});
						ai.lines[found1[1]].forEach(function(index, columnNumber)
							{
								if (columnNumber != column1 && columnNumber != column2)
								{
									var L = ai.b[index].length;
									ai.b[index] = ai.b[index].filter(function(element)
										{
											return element != i;
										});
									if (ai.b[index].length != L)
									{
										result = true;
									}
								}
							});
						if (result)
						{
							// console.log('xwing', i, 'c1', column1, 'c2', column2, found1[0] + '-' + found1[1]);
						}
					}
				}
				return result;
			},
			call: function()
			{
				var result = false;
				for (var i = 1; i <= 9; i += 1)
				{
					for (var a = 0; a < 9 - 1; a += 1)
					{
						for (var b = a + 1; b < 9; b += 1)
						{
							if (ai.methods.xwing.line(i, a, b))
							{
								result = true;
							}
							if (ai.methods.xwing.column(i, a, b))
							{
								result = true;
							}
						}
					}
				}
				return result;
			}
		},

		hiddenX : {
			line: function(line, data)
			{
				var result = false;
				var count = [];
				var where = [];

				for (var i = 0; i <= 9; i += 1)
				{
					count[i] = 0;
					where[i] = 0;
				}

				line.forEach(function(index, position)
					{
						ai.b[index].forEach(function(number)
							{
								if (data.includes(number))
								{
									count[number] += 1;
									where[position] += 1;
								}
							});
					});

				for (var i = 0; i < data.length; i += 1)
				{
					if (count[data[i]] < 1 || count[data[i]] > data.length)
					{
						return false;
					}
				}

				var t = 0;
				for (var i = 0; i < 9; i += 1)
				{
					if (where[i])
					{
						t += 1;
					}
				}
				if (t != data.length)
				{
					return false;
				}

				// console.log('L', data.join('-'), count.join('-'), where.join('-'));

				line.forEach(function(index, position)
					{
						var L = ai.b[index].length;
						ai.b[index] = ai.b[index].filter(function(element)
							{
								return (data.includes(element) && where[position] != 0) || (!data.includes(element) && where[position] == 0);
							});
						if (ai.b[index].length != L)
						{
							result = true;
						}
					});

				return result;
			},
			
			column: function(column, data)
			{
				var result = false;
				var count = [];
				var where = [];

				for (var i = 0; i <= 9; i += 1)
				{
					count[i] = 0;
					where[i] = 0;
				}

				column.forEach(function(index, position)
					{
						ai.b[index].forEach(function(number)
							{
								if (data.includes(number))
								{
									count[number] += 1;
									where[position] += 1;
								}
							});
					});

				for (var i = 0; i < data.length; i += 1)
				{
					if (count[data[i]] < 1 || count[data[i]] > data.length)
					{
						return false;
					}
				}

				var t = 0;
				for (var i = 0; i < 9; i += 1)
				{
					if (where[i])
					{
						t += 1;
					}
				}
				if (t != data.length)
				{
					return false;
				}

				column.forEach(function(index, position)
					{
						var L = ai.b[index].length;
						ai.b[index] = ai.b[index].filter(function(element)
							{
								return (data.includes(element) && where[position] != 0) || (!data.includes(element) && where[position] == 0);
							});
						if (ai.b[index].length != L)
						{
							result = true;
						}
					});

				return result;
			},

			block: function(block, data)
			{
				var result = false;
				var count = [];
				var where = [];

				for (var i = 0; i <= 9; i += 1)
				{
					count[i] = 0;
					where[i] = 0;
				}

				block.forEach(function(index, position)
					{
						ai.b[index].forEach(function(number)
							{
								if (data.includes(number))
								{
									count[number] += 1;
									where[position] += 1;
								}
							});
					});

				for (var i = 0; i < data.length; i += 1)
				{
					if (count[data[i]] < 1 || count[data[i]] > data.length)
					{
						return false;
					}
				}

				var t = 0;
				for (var i = 0; i < 9; i += 1)
				{
					if (where[i])
					{
						t += 1;
					}
				}
				if (t != data.length)
				{
					return false;
				}

				// console.log('B', data.join('-'), count.join('-'), where.join('-'));

				block.forEach(function(index, position)
					{
						var L = ai.b[index].length;
						ai.b[index] = ai.b[index].filter(function(element)
							{
								return (data.includes(element) && where[position] != 0) || (!data.includes(element) && where[position] == 0);
							});
						if (ai.b[index].length != L)
						{
							result = true;
						}
					});

				return result;
			},
			run: function(data)
			{
				var result = false;
				ai.lines.forEach(function(line, lineNumber)
					{
						if (ai.methods.hiddenX.line(line, data))
						{
							result = true;
						}
					});
				ai.columns.forEach(function(column, columnNumber)
					{
						if (ai.methods.hiddenX.column(column, data))
						{
							result = true;
						}
					});
				ai.blocks.forEach(function(block, blockNumber)
					{
						if (ai.methods.hiddenX.block(block, data))
						{
							result = true;
						}
					});
				return result;
			},
			call: function(type)
			{
				var result = false;
				switch (type)
				{
					case 2:
						for (var a = 1; a <= 9 - 1; a += 1)
						{
							for (var b = a + 1; b <= 9 - 0; b += 1)
							{
								if (ai.methods.hiddenX.run([a, b]))
								{
									result = true;
								}
							}
						}
						break;
					case 3:
						for (var a = 1; a <= 9 - 2; a += 1)
						{
							for (var b = a + 1; b <= 9 - 1; b += 1)
							{
								for (var c = b + 1; c <= 9 - 0; c += 1)
								{
									if (ai.methods.hiddenX.run([a, b, c]))
									{
										result = true;
									}
								}
							}
						}
						break;
					case 4:
						for (var a = 1; a <= 9 - 3; a += 1)
						{
							for (var b = a + 1; b <= 9 - 2; b += 1)
							{
								for (var c = b + 1; c <= 9 - 1; c += 1)
								{
									for (var d = c + 1; d <= 9 - 0; d += 1)
									{
										if (ai.methods.hiddenX.run([a, b, c, d]))
										{
											result = true;
										}
									}
								}
							}
						}
						break;
					default:
						break;
				}
				return result;
			}
		},

		hiddenPairs: {
			call: function()
			{
				return ai.methods.hiddenX.call(2);
			}
		},

		hiddenTriples: {
			call: function()
			{
				return ai.methods.hiddenX.call(3);
			}
		},

		hiddenQuads: {
			call: function()
			{
				return ai.methods.hiddenX.call(4);
			}
		},

		candidateLines : {
			block: function(block, blockNumber)
			{
				var result = false;
				var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var where = [[], [], [], [], [], [], [], [], [], []];
				block.forEach(function(index, blockPosition)
					{
						ai.b[index].forEach(function(number)
							{
								count[number] += 1;
								where[number].push(ai.block2xy(blockNumber, blockPosition));
							});
					});
				for (var i = 1; i < 9; i += 1)
				{
					if (count[i] == 2)
					{
						var index1 = where[i][0].x + 9 * where[i][0].y;
						var index2 = where[i][1].x + 9 * where[i][1].y;
						if (where[i][0].x == where[i][1].x)
						{
							// console.log(i, JSON.stringify(where[i][0]), JSON.stringify(where[i][1]));
							ai.columns[where[i][0].x].forEach(function(index)
								{
									if (index != index1 && index != index2)
									{
										var L = ai.b[index].length;
										ai.b[index] = ai.b[index].filter(function(element)
											{
												return element != i;
											});
										if (ai.b[index].length != L)
										{
											result = true;
										}
									}
								});
						}
						if (where[i][0].y == where[i][1].y)
						{
							// console.log(i, JSON.stringify(where[i][0]), JSON.stringify(where[i][1]));
							ai.lines[where[i][0].y].forEach(function(index)
								{
									if (index != index1 && index != index2)
									{
										var L = ai.b[index].length;
										ai.b[index] = ai.b[index].filter(function(element)
											{
												return element != i;
											});
										if (ai.b[index].length != L)
										{
											result = true;
										}
									}
								});
						}
					}
				}
				return result;
			},
			call: function()
			{
				var result = false;
				ai.blocks.forEach(function(block, blockNumber)
					{
						if (ai.methods.candidateLines.block(block, blockNumber))
						{
							result = true;
						}
					});
				return result;
			}
		},

		singlePosition: {
			line: function(line, lineNumber)
			{
				var found = [];
				var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var where = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				line.forEach(function(index, x)
					{
						if (ai.a[index] != 0)
						{
							return true;
						}
						ai.b[index].forEach(function(number)
							{
								count[number] += 1;
								where[number] = {x: x, y: lineNumber};
							});
						return true;
					});
				for (var i = 1; i <= 9; i += 1)
				{
					if (count[i] == 1)
					{
						found.push({x: where[i].x, y: where[i].y, number: i});
					}
				}
				return found;
			},
			column: function(column, columnNumber)
			{
				var found = [];
				var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var where = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				column.forEach(function(index, y)
					{
						ai.b[index].forEach(function(number)
							{
								count[number] += 1;
								where[number] = {x: columnNumber, y: y};
							});
						return true;
					});
				for (var i = 1; i <= 9; i += 1)
				{
					if (count[i] == 1)
					{
						found.push({x: where[i].x, y: where[i].y, number: i});
					}
				}
				return found;
			},
			block: function(block, blockNumber)
			{
				var found = [];
				var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				var where = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				block.forEach(function(index, blockPosition)
					{
						ai.b[index].forEach(function(number)
							{
								count[number] += 1;
								where[number] = ai.block2xy(blockNumber, blockPosition);
							});
						return true;
					});
				for (var i = 1; i <= 9; i += 1)
				{
					if (count[i] == 1)
					{
						found.push({x: where[i].x, y: where[i].y, number: i});
					}
				}
				return found;
			},
			call: function()
			{
				var result = false;
				var found = [];
				ai.lines.forEach(function(line, lineNumber)
					{
						ai.methods.singlePosition.line(line, lineNumber).forEach(function(element)
							{
								found.push(element);
							});
					});
				ai.columns.forEach(function(column, columnNumber)
					{
						ai.methods.singlePosition.column(column, columnNumber).forEach(function(element)
							{
								found.push(element);
							});
					});
				ai.blocks.forEach(function(block, blockNumber)
					{
						ai.methods.singlePosition.block(block, blockNumber).forEach(function(element)
							{
								found.push(element);
							});
					});
				for (var i in found)
				{
					ai.found('singlePosition', found[i], false);
					result = true;
				}
				return result;
			}
		},

		singleCandidate: {
			call: function()
			{
				var result = false;
				var found = [];
				ai.b.forEach(function(list, index)
				{
					if (list.length == 1)
					{
						found.push({index: index, number: list[0]});
					}
					return true;
				});
				for (var i in found)
				{
					ai.found('singleCandidate', found[i], false);
					result = true;
				}
				return result;
			}
		}
	},

	lists: function(x, y)
	{
		var index = x + 9 * y;
		var block = parseInt(x / 3) + 3 * parseInt(y / 3);

		ai.b[index] = ai.b[index].filter(function(element)
			{
				var found = false;
				ai.lines[y].forEach(function(index)
					{
						if (ai.a[index] == element)
						{
							found = true;
						}
					});
				ai.columns[x].forEach(function(index)
					{
						if (ai.a[index] == element)
						{
							found = true;
						}
					});
				ai.blocks[block].forEach(function(index)
					{
						if (ai.a[index] == element)
						{
							found = true;
						}
					});
				return !found;
			});
		return true;
	},

	think: function(a)
	{
		ai.a = [];
		ai.b = [];
		ai.a.length = 0;
		ai.b.length = 0;

		for (var i = 0; i < a.length; i += 1)
		{
			ai.a[i] = parseInt(a[i]);
			ai.b[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		}

		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				if (ai.a[x + 9 * y] == 0)
				{
					ai.lists(x, y);
				}
				else
				{
					ai.b[x + 9 * y] = [];
				}
			}
		}

		var run = {
			singleCandidate: true,
			singlePosition: true,
			candidateLines: true,
			hiddenPairs: true,
			hiddenTriples: true,
			hiddenQuads: true,
			xwing: true,
			ywing: true,
		};

		var endlessloop = 0;
		var done = false;

		while (!done)
		{
			if ((endlessloop += 1) > 255)
			{
				console.log('Freedom!');
				break;
			}

			done = true;

			if (run.singleCandidate && ai.methods.singleCandidate.call())
			{
				done = false;
			}

			if (run.singlePosition && ai.methods.singlePosition.call())
			{
				done = false;
			}

			if (run.candidateLines && ai.methods.candidateLines.call())
			{
				done = false;
			}

			if (run.hiddenPairs && ai.methods.hiddenPairs.call())
			{
				done = false;
			}

			if (run.hiddenTriples && ai.methods.hiddenTriples.call())
			{
				done = false;
			}

			if (run.hiddenQuads && ai.methods.hiddenQuads.call())
			{
				done = false;
			}

			if (run.xwing && ai.methods.xwing.call())
			{
				done = false;
			}

			if (run.ywing && ai.methods.ywing.call())
			{
				done = false;
			}

		}

		return ai.a.join('');
	},

	valid: function(board)
	{
		var result = true;

		ai.lines.forEach(function(line)
			{
				if (result)
				{
					var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					line.forEach(function(index)
						{
							count[parseInt(board[index])] += 1;
						});
					for (var i = 1; i <= 9; i += 1)
					{
						if (count[i] != 1)
						{
							result = false;
						}
					}
				}
				return true;
			});

		ai.columns.forEach(function(column)
			{
				if (result)
				{
					var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					column.forEach(function(index)
						{
							count[parseInt(board[index])] += 1;
						});
					for (var i = 1; i <= 9; i += 1)
					{
						if (count[i] != 1)
						{
							result = false;
						}
					}
				}
				return true;
			});

		ai.blocks.forEach(function(block)
			{
				if (result)
				{
					var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					block.forEach(function(index)
						{
							count[parseInt(board[index])] += 1;
						});
					for (var i = 1; i <= 9; i += 1)
					{
						if (count[i] != 1)
						{
							result = false;
						}
					}
				}
				return true;
			});

		return result;
	},

	recurse: function(depth, board, list, found)
	{
		if (depth >= list.length)
		{
			var result = ai.think(board);
			if (result.indexOf('0') < 0)
			{
				if (ai.valid(result))
				{
					found.push(Array.from(result).join(''));
				}
			}
			return true;
		}
		for (var i = 0; i < list[depth].list.length; i += 1)
		{
			board = board.substr(0, list[depth].index) + list[depth].list[i] + board.substr(list[depth].index + 1);
			ai.recurse(depth + 1, board, list, found);
		}
		board[list[depth].index] = 0;
		return true;
	},

	force: function(board, list)
	{
		var keep = Array.from(board).join('');
		var found = [];
		ai.recurse(0, Array.from(board).join(''), list, found);
		var unique = true;
		for (var i = 0; i < found.length - 1; i += 1)
		{
			for (var j = i + 1; j < found.length; j += 1)
			{
				if (found[i] == found[j])
				{
					unique = false;
				}
			}
		}
		if (!unique)
		{
			js('#hint').text('Solution is not unique');
			console.log('Solution is not unique');
		}
		if (found.length > 0)
		{
			return found[0];
		}
		console.log('No result...');
		return keep;
	}
};


var game = {
	vars: {
		state: STATE_INIT
	},

	init: function()
	{
		ai.init();
		gui.init();
		board.init();
		return true;
	},

	new: function(bycommand)
	{
		js('#board').class('hidden').add();
		js('#hint').html('<div class="help-warning"><header>Generating...</header>This may take a couple seconds</div>');

		setTimeout(function()
			{
				if (bycommand)
				{
					generate.stats = {
						g: 0,
						c: 0,
						s: 0,
						t: 0
					};
					var t = Date.now();
					var s = generate.new();
					generate.stats.t = Date.now() - t;
					console.log(
						'generate', generate.stats.g,
						'clues', generate.stats.c,
						'solves', generate.stats.s,
						'time', parseFloat((generate.stats.t / 1000.0).toFixed(2)) + 's',
						'average', parseFloat((generate.stats.t / generate.stats.s).toFixed(1)),
						'special', generate.stats.i
					);
				}
				else
				{
					var s = generate.fixed();
				}

				gui.new();
				board.new(s);

				gui.completed();

				js('#board').class('hidden').remove();
				js('#copy').text(s);
				if (s.indexOf('0') < 0)
				{
					js('#hint').html('<div class="help-info"><header>Ready</header>Nothing to do</div>');
				}
				else
				{
					js('#hint').html(
						js.template('<div class="help-info"><header>Ready</header>Puzzle has {CLUES} clues</div>')
							.render({
								clues: 81 - s.match(/0/g).length
							}));
				}
				return true;
			}, 0);
		return true;
	},

	solve: function()
	{
		var result = ai.think(board.a.reduce(function(previous, current, index, data)
			{
				return previous + current.number;
			}, ''));

		if (result.indexOf('0') >= 0 && js('#force').value())
		{
			var list = [];
			for (var i = 0; i < ai.b.length; i += 1)
			{
				if (ai.b[i].length == 2)
				{
					list.push({index: i, list: ai.b[i]});
				}
			}
			list.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});
			if (list.length > 6)
			{
				list.length = 6;
			}
			result = ai.force(result, list);
		}

		var keep = [];
		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				var index = x + 9 * y;
				var number = parseInt(result[index]);
				if (number != board.a[index].number)
				{
					board(x, y).number(number).list([]);
					keep.push(index);
				}
			}
		}
		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				var index = x + 9 * y;
				board(x, y).candidates();
				if (keep.includes(index))
				{
					gui(x, y).found();
				}
			}
		}

		gui.completed();
		if (js('#usepencilmarks').value())
		{
			game.refresh();
		}
		return true;
	},

	usepencilmarks: function()
	{
		if (js('#usepencilmarks').value())
		{
			js('#control_clear').attribute('disabled').remove();
			js('#control_refresh').attribute('disabled').remove();
		}
		else
		{
			js('#control_clear').attribute('disabled').add(true);
			js('#control_refresh').attribute('disabled').add(true);
		}
		return true;
	},

	clear: function()
	{
		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				if (board(x, y).number() == 0)
				{
					board(x, y).list([]);
					gui(x, y).small();
				}
			}
		}
		return true;
	},

	refresh: function()
	{
		for (var y = 0; y < 9; y += 1)
		{
			for (var x = 0; x < 9; x += 1)
			{
				if (board(x, y).number() == 0)
				{
					board(x, y).candidates();
					gui(x, y).small();
				}
			}
		}
		return true;
	},

	reset: function()
	{
		game.vars.state = STATE_READY;
		gui.new();
		board.new(js('#copy').text());
		gui.completed();
		return true;
	},

	solved: {
		line: function(which)
		{
			var a = [];
			for (var i = 0; i < 9; i += 1)
			{
				a.push(board(i, which).number());
			}
			return a;
		},
		column: function(which)
		{
			var a = [];
			for (var i = 0; i < 9; i += 1)
			{
				a.push(board(which, i).number());
			}
			return a;
		},
		block: function(which)
		{
			var block = [];
			var x = 3 * parseInt(which % 3);
			var y = 3 * parseInt(which / 3);
			for (var b = 0; b < 3; b += 1)
			{
				for (var a = 0; a < 3; a += 1)
				{
					block.push(board(x + a, y + b).number());
				}
			}
			return block;
		},

		check: function(a)
		{
			a.sort();
			return a.length == 9 && a.reduce(function(previous, current, index, data)
				{
					return previous && data[index - 1] == current - 1;
				});
		},

		verify: function()
		{
			for (var y = 0; y < 9; y += 1)
			{
				for (var x = 0; x < 9; x += 1)
				{
					if (board(x, y).number() == 0)
					{
						return false;
					}
				}
			}

			var done = true;

			for (var i = 0; i < 9; i += 1)
			{
				if (!game.solved.check(game.solved.line(i)))
				{
					done = false;
				}
				if (!game.solved.check(game.solved.column(i)))
				{
					done = false;
				}
				if (!game.solved.check(game.solved.block(i)))
				{
					done = false;
				}
			}

			return done;
		}
	},

	textarea: function()
	{
		var text = js('textarea').value();
		if (text.length == 0)
		{
			js('#texthint').text('No text...');
			return true;
		}
		text = text.replaceAll(/\s/g, '').replaceAll(/\D/g, '0');
		if (text.length < 81)
		{
			js('#texthint').text('This does not look like a valid puzzle');
			return true;
		}
		if (text.length > 81)
		{
			js('#texthint').text('Too many characters');
			return true;
		}
		js('textarea').parents('form').filter('.spoiler-header').trigger('click');
		js('#copy').text(text);
		game.vars.state = STATE_READY;
		gui.new();
		board.new(text);
		gui.completed();
		if (text.indexOf('0') < 0)
		{
			js('#hint').html('<div class="help-info"><header>Ready</header>Nothing to do</div>');
		}
		else
		{
			js('#hint').html(
				js.template('<div class="help-info"><header>Ready</header>Puzzle has {CLUES} clues</div>')
					.render({
						clues: 81 - text.match(/0/g).length
					}));
		}
		return true;
	},

	click: {
		left: function(button)
		{
			var x = parseInt(js(button).parents('.container-3x3-small').data('x'));
			var y = parseInt(js(button).parents('.container-3x3-small').data('y'));
			var data = {
				number: parseInt(js(button).data('number')),
				button: button
			};
			if (js(button).data('type') == 'small')
			{
				if (js(button).class('red').exists())
				{
					gui().unred(data).mute(data);
				}
				else if (js(button).class('blue').exists())
				{
					gui().unblue(data).mute(data);
				}
				else if (js(button).class('mute').exists())
				{
					gui().unmute(data);
				}
				else
				{
					board(x, y).number(data.number).list([]).update();
					gui(x, y).large();
					gui.completed();
				}
			}
			else
			{
			}
			if (game.solved.verify())
			{
				game.vars.state = STATE_END;
				js('#board button')
					.class('button-large').remove()
					.class('button-given').remove()
					.class('button-found').remove()
					.class('highlight').remove()
					.class('button-solved').add();
			}
			return true;
		},
		right: function(button)
		{
			var x = parseInt(js(button).parents('.container-3x3-small').data('x'));
			var y = parseInt(js(button).parents('.container-3x3-small').data('y'));
			var data = {
				number: parseInt(js(button).data('number')),
				button: button
			};
			if (js(button).data('type') == 'small')
			{
				if (js(button).class('red').exists())
				{
					gui().unred(data).blue(data);
				}
				else if (js(button).class('blue').exists())
				{
					gui().unblue(data).red(data);
				}
				else if (js(button).class('mute').exists())
				{
					gui().unmute(data).red(data);
				}
				else
				{
					gui().mute(data);
				}
			}
			else if (js(button).data('type') == 'large')
			{
				board(x, y).number(0).candidates().update();
				gui(x, y).small();
				gui.completed();
			}
			else
			{
			}
			return true;
		}
	},

	mouse: {
		down: function(button)
		{
			var number = parseInt(js(button).data('number'));
			for (var y = 0; y < 9; y += 1)
			{
				for (var x = 0; x < 9; x += 1)
				{
					if (board(x, y).number() == number)
					{
						js('.container-3x3-small[data-x="' + x + '"][data-y="' + y + '"]').filter('button').class('highlight').add();
					}
				}
			}
			return true;
		},
		up: function(button)
		{
			var number = parseInt(js(button).data('number'));
			for (var y = 0; y < 9; y += 1)
			{
				for (var x = 0; x < 9; x += 1)
				{
					if (board(x, y).number() == number)
					{
						js('.container-3x3-small[data-x="' + x + '"][data-y="' + y + '"]').filter('button').class('highlight').remove();
					}
				}
			}
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
		new: function(bycommand)
		{
			game.vars.state = STATE_READY;
			game.new(bycommand);
			return true;
		},
		solve: function()
		{
			// game.vars.state = STATE_END;
			game.solve();
			return true;
		},
		usepencilmarks: function()
		{
			game.usepencilmarks();
			return true;
		},
		clear: function()
		{
			game.clear();
			return true;
		},
		refresh: function()
		{
			game.refresh();
			return true;
		},
		reset: function()
		{
			game.reset();
			return true;
		},
		textarea: function()
		{
			game.textarea();
			return true;
		},
		click: {
			left: function(button)
			{
				game.click.left(button);
				return true;
			},
			right: function(button)
			{
				game.click.right(button);
				return true;
			}
		},
		mouse: {
			down: function(button)
			{
				game.mouse.down(button);
				return true;
			},
			up: function(button)
			{
				game.mouse.up(button);
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
			game.interface.new(true);
			return false;
		},

		solve: function(event)
		{
			game.interface.solve();
			return false;
		},

		usepencilmarks: function(event)
		{
			game.interface.usepencilmarks();
			return false;
		},

		clear: function(event)
		{
			game.interface.clear();
			return false;
		},

		refresh: function(event)
		{
			game.interface.refresh();
			return false;
		},

		reset: function(event)
		{
			game.interface.reset();
			return false;
		},

		textarea: function(event)
		{
			game.interface.textarea();
			return false;
		},

		click: {
			left: function(event)
			{
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.click.left(event.element);
						break;
					case STATE_RUNNING:
						game.interface.click.left(event.element);
						break;
					case STATE_END:
						break;
					default:
						break;
				}
				return true;
			},
			right: function(event)
			{
				event.preventDefault();
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.click.right(event.element);
						break;
					case STATE_RUNNING:
						game.interface.click.right(event.element);
						break;
					case STATE_END:
						break;
					default:
						break;
				}
				return false;
			}
		},

		mouse: {
			down: function(event)
			{
				if (js(event.element).class('button-small').exists())
				{
					return true;
				}
				if (parseInt(event.button) != 0)
				{
					return true;
				}
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.mouse.down(event.element);
						break;
					case STATE_RUNNING:
						game.interface.mouse.down(event.element);
						break;
					case STATE_END:
						break;
					default:
						break;
				}
				return true;
			},
			up: function(event)
			{
				if (js(event.element).class('button-small').exists())
				{
					return true;
				}
				if (parseInt(event.button) != 0)
				{
					return true;
				}
				switch (game.vars.state)
				{
					case STATE_INIT:
						break;
					case STATE_READY:
						game.vars.state = STATE_RUNNING;
						game.interface.mouse.up(event.element);
						break;
					case STATE_RUNNING:
						game.interface.mouse.up(event.element);
						break;
					case STATE_END:
						break;
					default:
						break;
				}
				return true;
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
			js('#control_solve').event('click', main.controls.solve);
			js('#control_clear').event('click', main.controls.clear);
			js('#control_refresh').event('click', main.controls.refresh);
			js('#control_reset').event('click', main.controls.reset);

			js('#usepencilmarks').event('change', main.controls.usepencilmarks);

			js('#board').event('click', 'button', main.controls.click.left);
			js('#board').event('contextmenu', 'button', main.controls.click.right);

			js('#board').event('mousedown', 'button', main.controls.mouse.down);
			js('#board').event('mouseup', 'button', main.controls.mouse.up);

			js('#textsubmit').event('click', 'button', main.controls.textarea);

			js('form').event('submit', false);

			game.interface.init();
			game.interface.new();

			return true;
		}
	}
};


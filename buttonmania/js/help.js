
var board = function(x, y)
{
	var self = {};
	self.show = function(value)
	{
		if (!board.exists(x, y))
		{
			return false;
		}
		board.a[board.i(x, y)].value = ((parseInt(board.a[board.i(x, y)].value) + parseInt(value)) % 4);
		if (board.a[board.i(x, y)].value)
		{
			js('#board button[data-xy="' + x + ',' + y + '"]').html('<b>' + board.a[board.i(x, y)].value + '</b>');
		}
		else
		{
			js('#board button[data-xy="' + x + ',' + y + '"]').html('<span class="emoji white-circle small"></span>');
		}
		return true;
	};
	self.click = function(value)
	{
		board(x    , y    ).show(value);
		board(x - 1, y    ).show(value);
		board(x + 1, y    ).show(value);
		board(x    , y - 1).show(value);
		board(x    , y + 1).show(value);
		board.a[board.i(x, y)].count = ((parseInt(board.a[board.i(x, y)].count) + parseInt(value)) % 4);
		return true;
	};
	return self;
};

board.exists = function(x, y)
{
	return x >= 0 && x < board.size.x && y >= 0 && y < board.size.y;
};
board.i = function(x, y)
{
	return x + y * board.size.x;
};

board.init = function()
{
	board.a = [];
	board.a.length = 0;
	board.size = {x: 3, y: 4};
	js('#board').clear();
	for (var y = 0; y < board.size.y; y += 1)
	{
		var s = [];
		for (var x = 0; x < board.size.x; x += 1)
		{
			board.a.push({x: x, y: y, value: 0, count: 0});
			s.push('<button data-xy="' + x + ',' + y + '"><span class="emoji white-circle small"></span></button>');
		}
		js('#board').append('<div>' + s.join('') + '</div>');
	}
	return true;
};

board.new = function()
{
	var list = [];
	for (var y = 0; y < board.size.y; y += 1)
	{
		for (var x = 0; x < board.size.x; x += 1)
		{
			board.a[board.i(x, y)].value = 0;
			board.a[board.i(x, y)].count = 0;
			list.push({x: x, y: y});
			list.push({x: x, y: y});
			list.push({x: x, y: y});
		}
	}
	list.sort(function(a, b)
		{
			return Math.random() - Math.random();
		});
	for (var i = 0; i < 5; i += 1)
	{
		var move = list.pop();
		board(move.x, move.y).click(1);
	}
	js('#board button').class('green-border').remove();
	for (var i in board.a)
	{
		board(board.a[i].x, board.a[i].y).show(0);
	}
	return true;
}

var main = {
	vars: {
		setup: false
	},

	interval: function()
	{
		var list = [];
		for (var i in board.a)
		{
			if (board.a[i].count > 0)
			{
				list.push({x: board.a[i].x, y: board.a[i].y});
			}
		}
		if (list.length == 0)
		{
			board.new();
			return true;
		}
		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		var move = list.pop();
		board(move.x, move.y).click(3);
		for (var i in board.a)
		{
			if (board.a[i].count > 0)
			{
				return true;
			}
		}
		js('#board button').class('green-border').add();
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

			board.init();
			board.new();
			main.vars.t = setInterval(function()
				{
					return main.interval();
				}, 2300);
			return true;
		}
	}
};


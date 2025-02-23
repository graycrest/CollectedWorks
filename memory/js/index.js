
const SIZE = 24;

const SCORES = 20;

const EMPTY = String.fromCodePoint(0x26aa);	// White circle

var emoji = [
	String.fromCodePoint(0x23f0),	// Alarm Clock
	String.fromCodePoint(0x2615),	// Coffee
	String.fromCodePoint(0x26c4),	// Snowman

	String.fromCodePoint(0x1f388),	// Balloon
	String.fromCodePoint(0x1f34c),	// Banana
	String.fromCodePoint(0x1f3c0),	// Basketball
	String.fromCodePoint(0x1f41d),	// Bee
	String.fromCodePoint(0x1f4a3),	// Bomb
	String.fromCodePoint(0x1faa3),	// Bucket
	String.fromCodePoint(0x1f68c),	// Bus
	String.fromCodePoint(0x1f370),	// Cake
	String.fromCodePoint(0x1f408),	// Cat
	String.fromCodePoint(0x1f9c0),	// Cheese Wedge
	String.fromCodePoint(0x1f965),	// Coconut
	String.fromCodePoint(0x1f404),	// Cow
	String.fromCodePoint(0x1f950),	// Croissant
	String.fromCodePoint(0x1f436),	// Dog Face
	String.fromCodePoint(0x1f369),	// Donut
	String.fromCodePoint(0x1f3a1),	// Ferris Wheel
	String.fromCodePoint(0x1f34f),	// Green Apple
	String.fromCodePoint(0x1f45c),	// Handbag
	String.fromCodePoint(0x1f383),	// Jack-O-Lantern
	String.fromCodePoint(0x1f42d),	// Mouse Face
	String.fromCodePoint(0x1f344),	// Mushroom
	String.fromCodePoint(0x1f3b5),	// Musical Note
	String.fromCodePoint(0x1f419),	// Octopus
	String.fromCodePoint(0x1f9c5),	// Onion
	String.fromCodePoint(0x1f43e),	// Paw Prints
	String.fromCodePoint(0x1f3a8),	// Palette
	String.fromCodePoint(0x1f9e9),	// Puzzle Piece
	String.fromCodePoint(0x1f9fb),	// Roll of Paper
	String.fromCodePoint(0x1f9f8),	// Teddy Bear
	String.fromCodePoint(0x1f377),	// Wine Glass
	String.fromCodePoint(0x1f381),	// Wrapped Gift

	String.fromCodePoint(0x2708) + String.fromCodePoint(0xfe0f),	// Airplane
	String.fromCodePoint(0x2699) + String.fromCodePoint(0xfe0f),	// Gear
	String.fromCodePoint(0x1f5dd) + String.fromCodePoint(0xfe0f),	// Old Key
	String.fromCodePoint(0x1f6f0) + String.fromCodePoint(0xfe0f)	// Satellite
];


var board = (function()
	{
		var a = [];

		while (a.length < SIZE)
		{
			a.push({emoji: null, found: false, clicked: 0});
		}

		return function(index)
		{
			var self = this;

			self.new = function()
			{
				main.previous = null;
				main.time = null;

				emoji.sort(function(x, y)
					{
						return Math.random() - Math.random();
					});

				let b = [];
				for (let i = 0; b.length < SIZE; i += 1)
				{
					b.push(i);
					b.push(i);
				}
				b.sort(function(x, y)
					{
						return Math.random() - Math.random();
					});

				a.forEach(function(element, index)
					{
						element.emoji = b.pop();
						element.found = false;
						element.clicked = 0;
						board(index).draw();
						return true;
					});
				return self;
			};

			self.data = function(key, value)
			{
				switch (arguments.length)
				{
					case 1:
						return a[index][key];
					case 2:
						a[index][key] = value;
						break;
					default:
						break;
				}
				return self;
			};

			self.draw = function(flag = false)
			{
				js('#board div[data-xy="' + index + '"]').text(flag || a[index].found ? emoji[a[index].emoji] : EMPTY);
				return self;
			};

			self.solved = function()
			{
				return a.every(function(element)
					{
						return element.found;
					});
			};

			self.score = function()
			{
				return Math.max(0, SIZE * 50 - a.reduce(function(total, element, index)
					{
						return total + element.clicked * 6 + 1;
					}, 0));
			};

			return self;
		};
	})();


var main = {
	previous: null,
	time: null,
	scores: [],
	interface: {
		init: function()
		{
			js.storage('memory').init({scores: []});
			main.scores = js.storage('memory').get('scores');
			if (!Array.isArray(main.scores))
			{
				main.scores = [];
			}

			js('form').event('submit', false);

			js('#control_new').event('click', function(event)
				{
					return board().new();
				});

			js('#board').event('click', 'div[data-xy]', function(event)
				{
					let index = parseInt(js(event.element).data('xy'));

					if (board(index).data('found'))
					{
						return false;
					}
					if (index == main.previous)
					{
						return false;
					}

					if (main.time == null)
					{
						main.time = Date.now();
					}

					board(index).data('clicked', board(index).data('clicked') + 1);

					if (main.previous == null)
					{
						main.previous = index;
					}
					else if (board(main.previous).data('emoji') == board(index).data('emoji'))
					{
						board(main.previous).data('found', true);
						board(index).data('found', true);
						main.previous = null;
					}
					else
					{
						board(main.previous).draw();
						main.previous = index;
					}
					board(index).draw(true);

					if (board().solved())
					{
						let score = Math.max(0, 5 * 60 * 10 - parseInt((Date.now() - main.time) / 100)) + board().score();
						if (main.scores.length > SCORES)
						{
							main.scores.length = SCORES;
						}
						main.scores.push(score);
						main.scores.sort(function(a, b)
							{
								return b - a;
							});
						js('#scores').clear().append('<dl><dt>Highscores</dt>' + main.scores.map(function(data)
							{
								return '<dd>' + (data == score ? '<b>' + data + '</b> &#x2728;' : data) + '</dd>';
							}).join('') + '<dl>');
						js.storage('memory').set('scores', main.scores.slice(0, 3));
					}

					return false;
				});

			js('#board').clear();
			for (let i = 0; i < SIZE; i += 1)
			{
				js('#board').append('<div data-xy="' + i + '" />');
			}

			return board().new();
		}
	}
};


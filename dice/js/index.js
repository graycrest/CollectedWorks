
const APP = 'dice';

var memory = {
	sizes: [4, 6, 8, 10, 12, 20],
	dice: [],
	visible: [],
	counters: [0, 0, 0, 0, 0],
	selected: 0
};
memory.sizes.forEach(function(size)
	{
		memory.dice[size] = 0;
		memory.visible[size] = false;
	});


var dice = (function()
	{
		function total()
		{
			let t = 0;
			js('.result').parents('div[data-sides]:not(.hidden)').filter('.result').each(function(element)
				{
					t += parseInt(js(element).text());
					return true;
				});
			js('#total').text(t);
			return true;
		};

		function roll(element, value)
		{
			let sides = parseInt(js(element).data('sides'));
			let result = 0;
			let rolls = [];
			for (let i = 0; i < value; i += 1)
			{
				let t = parseInt(Math.random() * sides) + 1;
				result += t;
				rolls.push(t);
			}
			rolls.sort(function(a, b)
				{
					return a - b;
				});
			js(element).filter('.result').text(result);
			js(element).filter('.rolls').text(rolls.join(' '));
			return total();
		};

		return function(event)
		{
			var self = {};

			var element = event && event.element ? js(event.element).parents('.grid').element() : null;

			self.selector = function()
			{
				let t = parseInt(js(event.element).data('sides'));
				memory.visible[t] = !memory.visible[t];
				js.storage(APP).set(memory);
				js('#t' + t).class('hidden').toggle();
				return total();
			};

			self.reset = function()
			{
				memory.sizes.forEach(function(size)
					{
						memory.dice[size] = 0;
						return true;
					});
				js('.count').text(0).parents('div[data-sides]:not(.hidden)').each(function(element)
					{
						js(element).filter('.count').text(1);
						memory.dice[parseInt(js(element).data('sides'))] = 1;
						return true;
					});
				js('.roll').trigger('click');
				memory.counters.forEach(function(value, index, list)
					{
						list[index] = 0;
					});
				js('.counter').text(0);
				js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').remove();
				memory.selected = 0;
				js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();
				js.storage(APP).set(memory);
				return true;
			}

			self.minus = function()
			{
				let sides = parseInt(js(element).data('sides'));
				if (memory.dice[sides] > 0)
				{
					memory.dice[sides] -= 1;
				}
				js(element).filter('.count').text(memory.dice[sides]);
				js.storage(APP).set(memory);
				return roll(element, memory.dice[sides]);
			};

			self.plus = function()
			{
				let sides = parseInt(js(element).data('sides'));
				if (memory.dice[sides] < 99)
				{
					memory.dice[sides] += 1;
				}
				js(element).filter('.count').text(memory.dice[sides]);
				js.storage(APP).set(memory);
				return roll(element, memory.dice[sides]);
			};

			self.roll = function()
			{
				return roll(element, memory.dice[parseInt(js(element).data('sides'))]);
			};

			self.rollall = function()
			{
				js('div[data-sides]:not(.hidden)').filter('button.roll').trigger('click');
				return true;
			};

			return self;
		}
	})();


var main = {
	interface: {
		init: function()
		{
			js('#selector').event('click', 'button', function(event)
				{
					return dice(event).selector();
				});

			js('#control_reset').event('click', 'button', function(event)
				{
					return dice(event).reset();
				});

			js('button.minus').event('click', 'button', function(event)
				{
					return dice(event).minus();
				});
			js('button.plus').event('click', 'button', function(event)
				{
					return dice(event).plus();
				});

			js('button.roll').event('click', 'button', function(event)
				{
					return dice(event).roll();
				});
			js('#rollall').event('click', 'button', function(event)
				{
					return dice().rollall();
				});

			js('button.less').event('click', 'button', function(event)
				{
					let button = js(event.element).parents('div[data-index]').element();
					let index = parseInt(js(button).data('index'));
					if (memory.counters[index] > 0)
					{
						memory.counters[index] -= 1;
						js.storage(APP).set(memory);
						js(button).filter('.counter').text(memory.counters[index]);
					}
					js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').remove();
					memory.selected = index;
					js.storage(APP).set(memory);
					js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();
					return true;
				});
			js('button.more').event('click', 'button', function(event)
				{
					let button = js(event.element).parents('div[data-index]').element();
					let index = parseInt(js(button).data('index'));
					if (memory.counters[index] < 99)
					{
						memory.counters[index] += 1;
						js.storage(APP).set(memory);
						js(button).filter('.counter').text(memory.counters[index]);
					}
					js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').remove();
					memory.selected = index;
					js.storage(APP).set(memory);
					js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();
					return true;
				});

			js('body').event('keydown', function(event)
				{
					switch (event.key)
					{
						case ' ':
						case 'ArrowLeft':
						case 'ArrowRight':
						case 'ArrowUp':
						case 'ArrowDown':
							break;
						case 'Shift':
						case 'Alt':
							return true;
						default:
							// console.log('event.key', event.key);
							return true;
					}
					event.preventDefault();
					switch (event.key)
					{
						case ' ':
							dice(event).rollall();
							break; 
						case 'ArrowLeft':
							js('#counters').filter('button.less').eq(memory.selected).trigger('click');
							break;
						case 'ArrowRight':
							js('#counters').filter('button.more').eq(memory.selected).trigger('click');
							break;
						case 'ArrowUp':
							js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').remove();
							memory.selected = ((memory.selected + memory.counters.length - 1) % memory.counters.length);
							js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();
							break;
						case 'ArrowDown':
							js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').remove();
							memory.selected = ((memory.selected + memory.counters.length + 1) % memory.counters.length);
							js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();
							break;
						default:
							break;
					}
					return false;
				});

			js.storage(APP).init(memory);
			memory = js.storage(APP).get();
			memory.sizes.forEach(function(size)
				{
					let ref = '#t' + size;
					let count = memory.dice[size];
					js(ref).class('hidden').add();
					js(ref).filter('.count').text(count);
					if (memory.visible[size])
					{
						js(ref).class('hidden').remove();
						js(ref).filter('.roll').trigger('click');
					}
					return true;
				});
			memory.counters.forEach(function(value, index)
				{
					js('#counters').filter('div[data-index="' + index + '"]').filter('.counter').text(value);
					return true;
				});
			js('div[data-index="' + memory.selected + '"]').filter('.counter').class('selected').add();

			return true;
		}
	}
}


const DEBUG = false;

const ERR_TOO_FEW_ARGUMENTS = 0;
const ERR_INCOMPATIBLE_ARGUMENT_TYPES = 1;
const ERR_INVALID_ARGUMENT_TYPES = 2;
const ERR_INVALID_ARGUMENT_TYPE = 3;
const ERR_INVALID_ARGUMENT = 4;
const ERR_NO_SUCH_IDENTIFIER = 5;

const ERR_QUOTES = 6;

const ERR_SCRIPTING = 7;
const ERR_WHILE_REPEAT = 8;
const ERR_WHILE_END = 9;
const ERR_REPEAT_WHILE = 10;
const ERR_REPEAT_END = 11;

const ERR_IF_THEN = 12;
const ERR_IF_END = 13;
const ERR_THEN_IF = 14;
const ERR_THEN_END = 15;
const ERR_ELSE_IF = 16;
const ERR_ELSE_THEN = 17;
const ERR_ELSE_END = 18;
const ERR_DO_UNTIL = 19;
const ERR_DO_END = 20;
const ERR_UNTIL_DO = 21;
const ERR_UNTIL_END = 22;
const ERR_START = 23;
const ERR_FOR = 24;
const ERR_FOR_IDENTIFIER = 25;
const ERR_FOR_IDENTIFIER_MISMATCH = 26;
const ERR_NEXT = 27;
const ERR_STEP = 28;
const ERR_CASE_THEN = 29;
const ERR_CASE_END = 30;


const ANGLE_DEG = 0;
const ANGLE_RAD = 1;
const ANGLE_GRAD = 2;

const PRECISION_MIN = 1;
const PRECISION_MAX = 15;
const PRECISION_DEFAULT = 10;


var options = {
	history: 20,
	angle_mode: ANGLE_DEG,
	precision: PRECISION_DEFAULT
};


var error = function(which)
{
	// this.name = String.fromCodePoint(0x1f4a3); // Bomb
	this.name = String.fromCodePoint(0x2620); // Skull and crossbones
	this.message = 'Something happened';
	switch (which)
	{
		case ERR_TOO_FEW_ARGUMENTS:
			this.message = 'Too few arguments';
			break;
		case ERR_INCOMPATIBLE_ARGUMENT_TYPES:
			this.message = 'Incompatible argument types';
			break;
		case ERR_INVALID_ARGUMENT_TYPES:
			this.message = 'Invalid argument types';
			break;
		case ERR_INVALID_ARGUMENT_TYPE:
			this.message = 'Invalid argument type';
			break;
		case ERR_INVALID_ARGUMENT:
			this.message = 'Invalid argument';
			break;
		case ERR_NO_SUCH_IDENTIFIER:
			this.message = 'Unknown identifier';
			break;
		case ERR_QUOTES:
			this.message = 'Unmatched quotes';
			break;
		case ERR_SCRIPTING:
			this.message = 'Unbalanced scripting structure';
			break;
		case ERR_WHILE_REPEAT:
			this.message = 'WHILE without matching REPEAT';
			break;
		case ERR_WHILE_END:
			this.message = 'WHILE without matching END';
			break;
		case ERR_REPEAT_WHILE:
			this.message = 'REPEAT without matching WHILE';
			break;
		case ERR_REPEAT_END:
			this.message = 'REPEAT without matching END';
			break;
		case ERR_IF_THEN:
			this.message = 'IF without matching THEN';
			break;
		case ERR_IF_END:
			this.message = 'IF without matching END';
			break;
		case ERR_THEN_IF:
			this.message = 'THEN without matching IF or CASE';
			break;
		case ERR_THEN_END:
			this.message = 'THEN without matching END';
			break;
		case ERR_ELSE_IF:
			this.message = 'ELSE without matching IF';
			break;
		case ERR_ELSE_THEN:
			this.message = 'ELSE without matching THEN';
			break;
		case ERR_ELSE_END:
			this.message = 'ELSE without matching END';
			break;
		case ERR_DO_UNTIL:
			this.message = 'DO without matching UNTIL';
			break;
		case ERR_DO_END:
			this.message = 'DO without matching END';
			break;
		case ERR_UNTIL_DO:
			this.message = 'UNTIL without matching DO';
			break;
		case ERR_UNTIL_END:
			this.message = 'UNTIL without matching END';
			break;
		case ERR_START:
			this.message = 'START without matching NEXT or STEP';
			break;
		case ERR_FOR:
			this.message = 'FOR without matching NEXT or STEP';
			break;
		case ERR_FOR_IDENTIFIER:
			this.message = 'FOR without matching identifier';
			break;
		case ERR_FOR_IDENTIFIER_MISMATCH:
			this.message = 'Identifier mismatch on FOR';
			break;
		case ERR_NEXT:
			this.message = 'NEXT without matching START or FOR';
			break;
		case ERR_STEP:
			this.message = 'STEP without matching START or FOR';
			break;
		case ERR_CASE_THEN:
			this.message = 'CASE without matching THEN';
			break;
		case ERR_CASE_END:
			this.message = 'CASE without matching END';
			break;
		default:
			break;
	}
	return this.name;
};
error.render = function(e)
{
	switch (js('#errors').value())
	{
		case 'on':
			var template = '';
			switch (e.name)
			{
				case String.fromCodePoint(0x1f4a3):
				case String.fromCodePoint(0x2620):
					template = '<div class="help-danger"><header>{NAME}</header><div class="small">{MESSAGE}</div></div>';
					break;
				default:
					template = '<div class="help-danger small"><header>{NAME}</header>{MESSAGE}</div>';
					break;
			}
			hint.html(js.template(template).render({
				name: e.name ? e.name : 'Error',
				message: e.message ? e.message : 'Something happened'
			})); // No break
			break;
		case 'subtle':
			js('#subtle').text(e.message);
			if (error.t)
			{
				clearTimeout(error.t);
			}
			error.t = setTimeout(function()
				{
					js('#subtle').text('');
					return true;
				}, 5100);
			break;
		case 'off':
		default:
			console.log(e);
			break;
	}
	return true;
};


var hint = {
	clean: function()
	{
		while (js('#hint > div.entry').element().length > 5)
		{
			js('#hint > div.entry').eq(':last').remove();
		}
		return true;
	},
	text: function(content)
	{
		js('<div class="entry my-0"></div>').text(content).prependTo('#hint');
		return hint.clean();
	},
	html: function(content)
	{
		js('<div class="entry my-0"></div>').html(content).prependTo('#hint');
		return hint.clean();
	}
};


var tokenizer = {
	type: function(item)
	{
		switch (item)
		{
			case 'E':
			case 'LN2':
			case 'LN10':
			case 'LOG2E':
			case 'LOG10E':
			case 'PI':
			case 'SQRT1_2':
			case 'SQRT2':
				return 'constant';
			case 'Q':
				return 'special';
			default:
				break;
		}

		switch (item.toLowerCase())
		{
			case 'while':
			case 'repeat':
			case 'do':
			case 'until':
			case 'if':
			case 'then':
			case 'else':
			case 'end':
			case 'start':
			case 'for':
			case 'next':
			case 'step':
			case 'case':
				return 'script';
			case '<':
			case '<=':
			case '==':
			case '!=':
			case '>=':
			case '>':
				return 'logic';
			case 'sto':
			case 'rcl':
			case 'eval':
			case 'purge':
			case 'rclall':
				return 'storage';
			case 'abs':
			case 'cbrt':
			case 'ceil':
			case 'exp':
			case 'floor':
			case 'ln':
			case 'log':
			case 'round':
			case 'sign':
			case 'sqrt':
				return 'math';
			case 'sin':
			case 'asin':
			case 'sinh':
			case 'asinh':
			case 'cos':
			case 'acos':
			case 'cosh':
			case 'acosh':
			case 'tan':
			case 'atan':
			case 'tanh':
			case 'atanh':
			case 'sec':
			case 'asec':
			case 'sech':
			case 'asech':
			case 'csc':
			case 'acsc':
			case 'csch':
			case 'acsch':
				return 'trigo';
			case 'neg':
			case 'chs':
			case 'inv':
			case 'gcd':
			case 'lcm':
			case 'ip':
			case 'fp':
			case 'pow':
			case 'sq':
			case 'cb':
			case 'factor':
			case 'div':
			case 'rand':
			case 'date':
			case 'time':
			case 'precision':
			case 'deg':
			case 'rad':
			case 'grad':
			case 'fact':
			case 'gamma':
			case 'lambertw':
			case 'comb':
			case 'perm':
			case 'min':
			case 'max':
			case 'plot':
			case 'chr':
			case 'num':
			case 'gxmin':
			case 'gxmax':
			case 'gymin':
			case 'gymax':
			case 'greset':
			case 'timer':
				return 'special';
			case 'clear':
			case 'swap':
			case 'over':
			case 'depth':
			case 'dup':
			case 'dup2':
			case 'dup3':
			case 'dupn':
			case 'ndupn':
			case 'dupdup':
			case 'drop':
			case 'drop2':
			case 'drop3':
			case 'dropn':
			case 'nip':
			case 'rot':
			case 'unrot':
			case 'pick':
			case 'pick2':
			case 'pick3':
			case 'unpick':
			case 'roll':
			case 'rolld':
				return 'stack';
			case '+':
			case '-':
			case '*':
			case '/':
			case 'mod':
				return 'basic';
			default:
				if (item.charAt(0) == '"')
				{
					return 'string';
				}
				if (item.charAt(0) == "'")
				{
					return 'expression';
				}
				if (/[\-+]?\d+\.\d+e[\-+]?\d+/.test(item))
				{
					return 'number';
				}
				if (parseFloat(item).toString() == item.toString())
				{
					return 'number';
				}
				if (/^[a-z][a-z\d_]*$/i.test(item))
				{
					return 'identifier';
				}
				break;
		}
		return 'unknown';
	},

	stringify: function(line, quote)
	{
		var list = [];
		var indexes = [];
		var i = line.indexOf(quote);
		if (i < 0)
		{
			return [line];
		}
		while (i >= 0)
		{
			if (i == 0 || line.charAt(i - 1) != '\\')
			{
				indexes.push(i);
			}
			i = line.indexOf(quote, i + 1);
		}
		if ((indexes.length % 2) == 1 || indexes.length == 0)
		{
			throw new error(ERR_QUOTES);
		}
		var j = 0;
		for (var i = 0; i < indexes.length; i += 2)
		{
			if (indexes[i] - j > 0)
			{
				var s = line.substr(j, indexes[i] - j).trim();
				if (s.length)
				{
					list.push(s);
				}
			}
			list.push(line.substr(indexes[i], indexes[i + 1] - indexes[i] + 1));
			j = indexes[i + 1] + 1;
		}
		if (j < line.length)
		{
			var s = line.substr(j).trim();
			if (s.length)
			{
				list.push(line.substr(j));
			}
		}
		return list;
	},

	run: function(command)
	{
		var tokens = [];

		var list = [];
		var t1 = tokenizer.stringify(command, '"');
		for (var i in t1)
		{
			if (t1[i].charAt(0) == '"')
			{
				list.push(t1[i]);
			}
			else
			{
				var t2 = tokenizer.stringify(t1[i], "'");
				while (t2.length)
				{
					list.push(t2.shift());
				}
			}
		}

		for (var i in list)
		{
			var line = list[i];
			switch (line.charAt(0))
			{
				case '"':
					tokens.push({value: line.substr(1, line.length - 2), type: 'string'});
					break;
				case "'":
					tokens.push({value: line.substr(1, line.length - 2), type: 'expression'});
					break;
				default:
					line += ' ';
					line = line.replaceAll(/([-+*/])([-+*/])/g, "$1 $2");
					line = line.replaceAll(/([-+*/])([-+*/])/g, "$1 $2");
					line = line.replaceAll(/([-+*/])([^\d])/g, " $1 $2");
					line = line.replaceAll(',', ' , ');

					line.trim().split(/\s+/).forEach(function(token)
						{
							var type = tokenizer.type(token);
							switch (type)
							{
								case 'identifier':
									tokens.push({value: token, type: type});
									break;
								case 'constant':
									tokens.push({value: token, type: type});
									break;
								default:
									tokens.push({value: token.toLowerCase(), type: type});
									break;
							}
						});
					break;
			}
		}

		return tokens;
	}
};


var canvas = {
	init: function()
	{
		canvas.canvas = js('canvas').element();
		canvas.context = canvas.canvas.getContext('2d');
		canvas.width = canvas.canvas.width;
		canvas.height = canvas.canvas.height;
		return canvas.rect('White', 0, 0, canvas.width, canvas.height);
	},
	rect: function(style, x, y, w, h)
	{
		canvas.context.fillStyle = style;
		canvas.context.fillRect(x, y, w, h);
		return true;
	},
	line: function(style, x1, y1, x2, y2)
	{
		canvas.context.beginPath();
		canvas.context.moveTo(x1, y1);
		canvas.context.lineTo(x2, y2);
		canvas.context.lineWidth = 1;
		canvas.context.strokeStyle = style;
		canvas.context.stroke();
		return true;
	},
	point: function(style, x, y)
	{
		return canvas.rect(style, x, y, 1, 1);
	},
	text: function(style, x, y, text)
	{
		canvas.context.font = '14px monospace';
		canvas.context.textAlign = 'left';
		canvas.context.textBaseline = 'top';
		canvas.context.fillStyle = style;
		canvas.context.fillText(text, x, y);
		return true;
	},
	left: function(style, x, y, text)
	{
		canvas.context.font = '14px monospace';
		canvas.context.textAlign = 'left';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = style;
		canvas.context.fillText(text, x, y);
		return true;
	},
	right: function(style, x, y, text)
	{
		canvas.context.font = '14px monospace';
		canvas.context.textAlign = 'right';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = style;
		canvas.context.fillText(text, x, y);
		return true;
	},
	top: function(style, x, y, text)
	{
		canvas.context.font = '14px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'top';
		canvas.context.fillStyle = style;
		canvas.context.fillText(text, x, y);
		return true;
	},
	bottom: function(style, x, y, text)
	{
		canvas.context.font = '14px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'bottom';
		canvas.context.fillStyle = style;
		canvas.context.fillText(text, x, y);
		return true;
	},
};


var plot = {
	current: {type: null, expression: null},

	depth: 100, // z-values are scaled within 0-depth (why is it called "depth" if it is the height?

	gp: {x: 0, y: 0, z: 0},
	sp: {x: 0, y: -10, z: 0},
	ep: {x: 0, y: -15, z: 0},

	angle: {
		x: 15 * Math.PI / 180.0,
		y: 0 * Math.PI / 180.0,
		z: 10 * Math.PI / 180.0
	},

	scale: {x: 60, y: 60},
	adjust: {x: 0, y: 0}, // canvas offsets

	ymin: -7.3,
	ymax: 7.3,
	xmin: -7.3,
	xmax: 7.3,

	evaluate: function(expression, x, y)
	{
    	return Function('return (function(x, y, f){with(f){return ' + expression + '}})')()(x, y, 
			{
				sin: function(x) { return Math.sin(x); },
				cos: function(x) { return Math.cos(x); },
				tan: function(x) { return Math.tan(x); },
				sec: function(x) { return 1 / Math.cos(x); },
				csc: function(x) { return 1 / Math.sin(x); },
				cot: function(x) { return 1 / Math.tan(x); },
				asin: function(x) { return Math.asin(x); },
				acos: function(x) { return Math.acos(x); },
				atan: function(x) { return Math.atan(x); },
				asec: function(x) { return Math.acos(1 / x); },
				acsc: function(x) { return Math.asin(1 / x); },
				acot: function(x) { return Math.atan(1 / x); },
				sinh: function(x) { return Math.sinh(x); },
				cosh: function(x) { return Math.cosh(x); },
				tanh: function(x) { return Math.tanh(x); },
				sech: function(x) { return 1 / Math.cosh(x); },
				csch: function(x) { return 1 / Math.sinh(x); },
				coth: function(x) { return 1 / Math.tanh(x); },
				asinh: function(x) { return Math.asinh(x); },
				acosh: function(x) { return Math.acosh(x); },
				atanh: function(x) { return Math.atanh(x); },
				asech: function(x) { return Math.acosh(1 / x); },
				acsch: function(x) { return Math.asinh(1 / x); },
				acoth: function(x) { return Math.atanh(1 / x); },
				exp: function(x) { return Math.exp(x); },
				ln: function(x) { return Math.log(x); },
				log: function(x) { return Math.log10(x); },
				sq: function(x) { return x * x; },
				sqrt: function(x) { return Math.sqrt(x); },
				cb: function(x) { return x * x * x; },
				cbrt: function(x) { return Math.cbrt(x); },
				abs: function(x) { return Math.abs(x); },
				sign: function(x) { return Math.sign(x); },
				floor: function(x) { return Math.floor(x); },
				ceil: function(x) { return Math.ceil(x); },
				ip: function(x) { return parseInt(x); },
				fp: function(x) { return x - parseInt(x); },
				inv: function(x) { return 1 / x; },
				pow: function(x, y) { return Math.pow(x, y); },
				mod: function(x, y) { return x % y; },
				min: function(x, y) { return Math.min(x, y); },
				max: function(x, y) { return Math.max(x, y); },
				gamma: function(x) { return helper.functions.gamma(x); },
			});
	},

	type: function(expression)
	{
		var type = '';

		var i = expression.indexOf('x');
		while (i >= 0)
		{
			if (i >= 1 && expression.indexOf('exp', i - 1) == i - 1)
			{
			}
			else if (i >= 2 && expression.indexOf('max', i - 2) == i - 2)
			{
			}
			else
			{
				type = 'x';
			}
			i = expression.indexOf('x', i + 1);
		}

		if (expression.indexOf('y') >= 0)
		{
			type += 'y';
		}

		return type.length ? type : 'x';
	},

	axes: function()
	{
		var x = null;
		var y = null;
		var f = null;
		var d = null;
		var yt = null;
		var ft = null;

		if (plot.ymin < 0 && plot.ymax > 0)
		{
			y = (0 - plot.ymin) * canvas.height / (plot.ymax - plot.ymin);
			canvas.line('black', 0, canvas.height - y, canvas.width, canvas.height - y);
		}

		y = canvas.height - (0 - plot.ymin) * canvas.height / (plot.ymax - plot.ymin);
		yt = y < canvas.height * 0.5 ? y + 3 : y - 3;
		ft = y < canvas.height * 0.5 ? canvas.top : canvas.bottom;
		if (yt < 0 || yt > canvas.height)
		{
			yt = canvas.height * 0.5;
		}
		f = canvas.width / (plot.xmax - plot.xmin);
		d = 1;
		while (d * f < 20)
		{
			d *= 10;
		}
		for (x = d; x <= plot.xmax; x += d)
		{
			canvas.line('purple', (x - plot.xmin) * f, y - 3, (x - plot.xmin) * f, y + 3);
			ft('black', (x - plot.xmin) * f, yt, x);
		}
		for (x = -d; x >= plot.xmin; x -= d)
		{
			canvas.line('purple', (x - plot.xmin) * f, y - 3, (x - plot.xmin) * f, y + 3);
			ft('black', (x - plot.xmin) * f, yt, x);
		}

		if (plot.xmin < 0 && plot.xmax > 0)
		{
			x = (0 - plot.xmin) * canvas.width / (plot.xmax - plot.xmin);
			canvas.line('black', x, 0, x, canvas.height);
		}

		x = (0 - plot.xmin) * canvas.width / (plot.xmax - plot.xmin);
		xt = x < canvas.width * 0.5 ? x + 7 : x - 7;
		ft = x < canvas.height * 0.5 ? canvas.left : canvas.right;
		if (xt < 0 || xt > canvas.width)
		{
			xt = canvas.width * 0.5;
		}
		f = canvas.height / (plot.ymax - plot.ymin);
		d = 1;
		while (d * f < 20)
		{
			d *= 10;
		}
		for (y = d; y <= plot.ymax; y += d)
		{
			canvas.line('purple', x - 3, canvas.height - (y - plot.ymin) * f, x + 3, canvas.height - (y - plot.ymin) * f);
			ft('black', xt, canvas.height - (y - plot.ymin) * f, y);
		}
		for (y = -d; y >= plot.ymin; y -= d)
		{
			canvas.line('purple', x - 3, canvas.height - (y - plot.ymin) * f, x + 3, canvas.height - (y - plot.ymin) * f);
			ft('black', xt, canvas.height - (y - plot.ymin) * f, y);
		}

		return true;
	},

	x: function(expression)
	{
		var y1 = plot.evaluate(expression, plot.xmin, null);
		var y2 = null;
		var f = canvas.height / (plot.ymax - plot.ymin);

		var slope1 = 0;
		var slope2 = 0;

		var yi = Number.POSITIVE_INFINITY;
		var ya = Number.NEGATIVE_INFINITY;

		var x = plot.xmin;
		var d = 2 * (plot.xmax - plot.xmin) / canvas.width;
		for (var i = 2; i < canvas.width; i += 2)
		{
			x += d;
			y2 = plot.evaluate(expression, x, null);
			slope2 = y1 - y2;
			if ((y1 - plot.ymin) * f < 0 && (y2 - plot.ymin) * f > canvas.height)
			{
				if (Math.sign(slope1) == Math.sign(slope2))
				{
					canvas.line('blue', i - 2, canvas.height - (y1 - plot.ymin) * f, i, canvas.height - (y2 - plot.ymin) * f);
				}
			}
			else if ((y1 - plot.ymin) * f > canvas.height && (y2 - plot.ymin) * f < 0)
			{
				if (Math.sign(slope1) == Math.sign(slope2))
				{
					canvas.line('blue', i - 2, canvas.height - (y1 - plot.ymin) * f, i, canvas.height - (y2 - plot.ymin) * f);
				}
			}
			else
			{
				canvas.line('blue', i - 2, canvas.height - (y1 - plot.ymin) * f, i, canvas.height - (y2 - plot.ymin) * f);
			}

			y1 = y2;
			slope1 = slope2;
			yi = Math.min(yi, y1);
			ya = Math.max(yi, y1);
		}
		// console.log(yi, ya);
		return true;
	},

	y: function(expression)
	{
		var x1 = plot.evaluate(expression, null, plot.ymin);
		var f = canvas.width / (plot.xmax - plot.xmin);

		var slope1 = 0;
		var slope2 = 0;

		var y = plot.ymin;
		var d = 2 * (plot.ymax - plot.ymin) / canvas.height;
		for (var i = 2; i < canvas.height; i += 2)
		{
			y += d;
			var x2 = plot.evaluate(expression, null, y);
			slope2 = x1 - x2;
			if ((x1 - plot.xmin) * f < 0 && (x2 - plot.xmin) * f > canvas.width)
			{
				if (Math.sign(slope1) == Math.sign(slope2))
				{
					canvas.line('blue', (x1 - plot.xmin) * f, canvas.height - (i - 2), (x2 - plot.xmin) * f, canvas.height - (i));
				}
			}
			else if ((x1 - plot.xmin) * f > canvas.width && (x2 - plot.xmin) * f < 0)
			{
				if (Math.sign(slope1) == Math.sign(slope2))
				{
					canvas.line('blue', (x1 - plot.xmin) * f, canvas.height - (i - 2), (x2 - plot.xmin) * f, canvas.height - (i));
				}
			}
			else
			{
				canvas.line('blue', (x1 - plot.xmin) * f, canvas.height - (i - 2), (x2 - plot.xmin) * f, canvas.height - (i));
			}
			x1 = x2;
			slope1 = slope2;
		}
		return true;
	},

	xy: function(expression, quick = false)
	{
		var data = [];
		var size = {x: 30 + 1, y: 20 + 1};
		if (quick)
		{
			size = {x: 8 + 1, y: 6 + 1};
		}

		for (var y = 0; y <= size.y; y += 1)
		{
			for (var x = 0; x <= size.x; x += 1)
			{
				data.push({});
			}
		}

		var zmin = Number.POSITIVE_INFINITY;
		var zmax = Number.NEGATIVE_INFINITY;
		for (var j = 0; j <= size.y; j += 1)
		{
			for (var i = 0; i <= size.x; i += 1)
			{
				var x = plot.xmin + i * (plot.xmax - plot.xmin) / size.x;
				var y = plot.ymin + j * (plot.ymax - plot.ymin) / size.y;
				var z = plot.evaluate(expression, x, y);
				if (isNaN(z))
				{
					z = 0.0;
				}
				data[i + (size.x + 1) * j] = {x: x, y: y, z: z};
				zmin = Math.min(zmin, z);
				zmax = Math.max(zmax, z);
			}
		}

		plot.zmin = zmin;
		plot.zmax = zmax;

		var sx = Math.sin(plot.angle.x);
		var cx = Math.cos(plot.angle.x);
		var sy = Math.sin(plot.angle.y);
		var cy = Math.cos(plot.angle.y);
		var sz = Math.sin(plot.angle.z);
		var cz = Math.cos(plot.angle.z);

		var matrix = [ // https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions
			cy * cz, -cx * sz + sx * sy * cz, sx * sz + cx * sy * cz,
			cy * sz, cx * cz + sx * sy * sz, -sx * cz + cx * sy * sz,
			-sy, sx * cy, cx * cy
		];

		var surfaces = [];

		for (var j = 0; j < size.y; j += 1)
		{
			for (var i = 0; i < size.x; i += 1)
			{
				surfaces.push({
					p1: plot.project3D(data[(i + 0) + (size.x + 1) * (j + 0)], matrix),
					p2: plot.project3D(data[(i + 1) + (size.x + 1) * (j + 0)], matrix),
					p3: plot.project3D(data[(i + 1) + (size.x + 1) * (j + 1)], matrix),
					p4: plot.project3D(data[(i + 0) + (size.x + 1) * (j + 1)], matrix)
				});
			}
		}

		surfaces.sort(function(a, b)
		{
			return (a.p1.sort + a.p2.sort + a.p3.sort + a.p4.sort) - (b.p1.sort + b.p2.sort + b.p3.sort + b.p4.sort);
		});

		canvas.context.strokeStyle = 'rgb(150, 150, 150)';
		canvas.context.setLineDash([1, 1]);
		while (surfaces.length)
		{
			var surface = surfaces.pop();

			var c = parseInt(200.0 * (surface.p1.z + surface.p2.z + surface.p3.z + surface.p4.z) * 0.25 * 0.01);
			canvas.context.fillStyle = 'rgb(' + (c + 0) + ',' + (c + 25) + ',' + (c + 50) + ')';
			// canvas.context.fillStyle = 'rgb(' + (c + 0) + ',' + (c + 50) + ',' + (c + 25) + ')';
			// canvas.context.fillStyle = 'rgb(' + (c + 25) + ',' + (c + 0) + ',' + (c + 50) + ')';
			// canvas.context.fillStyle = 'rgb(' + (c + 25) + ',' + (c + 50) + ',' + (c + 0) + ')';
			// canvas.context.fillStyle = 'rgb(' + (c + 50) + ',' + (c + 0) + ',' + (c + 25) + ')';
			// canvas.context.fillStyle = 'rgb(' + (c + 50) + ',' + (c + 25) + ',' + (c + 0) + ')';

			canvas.context.beginPath();
			canvas.context.moveTo(surface.p1.x, surface.p1.y);
			canvas.context.lineTo(surface.p2.x, surface.p2.y);
			canvas.context.lineTo(surface.p3.x, surface.p3.y);
			canvas.context.lineTo(surface.p4.x, surface.p4.y);
			canvas.context.closePath();

			canvas.context.fill();
			// canvas.context.stroke();
		}

		return true;
	},

	project3D: function(point, matrix)
	{
		var gx = point.x - (plot.xmin + plot.xmax) * 0.5;
		var gy = point.y - (plot.ymin + plot.ymax) * 0.5;
		var gz = point.z + plot.gp.z;
		if (gz == 0.0)
		{
			gz = 0.000001;
		}

		var x = matrix[0] * gx + matrix[1] * gy + matrix[2] * gz;
		var y = matrix[3] * gx + matrix[4] * gy + matrix[5] * gz;
		var z = matrix[6] * gx + matrix[7] * gy + matrix[8] * gz;

		var t = (plot.sp.y - y) / (plot.ep.y - y);
		var sx = t * (plot.ep.x - x) + x;
		var sy = t * (plot.ep.z - z) + z;

		return {
			x: sx * plot.scale.x + canvas.width * 0.5 + plot.adjust.x,
			y: canvas.height - (sy * plot.scale.y + canvas.height * 0.5 + plot.adjust.y),
			z: (point.z - plot.zmin) * plot.depth / (plot.zmax - plot.zmin),
			sort: y
		};
	},

	sanitize: function()
	{
		if (plot.xmin == plot.xmax)
		{
			plot.xmin -= 0.1
			plot.xmax += 0.1
		}
		if (plot.ymin == plot.ymax)
		{
			plot.ymin -= 0.1
			plot.ymax += 0.1
		}

		if (plot.xmin > plot.xmax)
		{
			var t = plot.xmin; plot.xmin = plot.xmax; plot.xmax = t;
		}
		if (plot.ymin > plot.ymax)
		{
			var t = plot.ymin; plot.ymin = plot.ymax; plot.ymax = t;
		}
		return true;
	},

	run: function(expression)
	{
		expression = expression.replaceAll('PI', Math.PI);
		expression = expression.replaceAll('E', Math.E);
		expression = expression.toLowerCase();
		expression = expression.replace(/\s/g, '');
		expression = expression.replace(/([xy])([xy])/g, '$1*$2');
		expression = expression.replace(/([xy])([xy])/g, '$1*$2');
		expression = expression.replace(/(\d)([xy])/g, '$1*$2');
		expression = expression.replace(/([xy])(\d)/g, '$1*$2');
		expression = expression.replace(/\)(\(|\w)/g, ")*$1");
		expression = expression.replace(/(\d)\(/g, "$1*(");

		canvas.init();

		plot.reset(false);
		plot.sanitize();

		var type = plot.type(expression);
		switch (type)
		{
			case 'x':
				hint.text('f(x) = ' + expression);
				plot.guesstimate.x(expression);
				plot.info();
				plot.axes();
				plot.x(expression);
				break;
			case 'y':
				hint.text('f(y) = ' + expression);
				plot.guesstimate.y(expression);
				plot.info();
				plot.axes();
				plot.y(expression);
				break;
			case 'xy':
				hint.text('f(x, y) = ' + expression);
				plot.xy(expression);
				break;
			default:
				break;
		}

		plot.current.type = type;
		plot.current.expression = expression;
		js('#reset').attribute('disabled').remove();
		js('#plotter').class('hidden').remove();

		return true;
	},

	guesstimate: {
		x: function(expression)
		{
			var data = [];

			var x = plot.xmin;
			var d = 10 * (plot.xmax - plot.xmin) / canvas.width;
			for (var i = 10; i < canvas.width; i += 10)
			{
				x += d;
				var t = parseFloat(plot.evaluate(expression, x, null));
				if (!isNaN(t))
				{
					data.push(t);
				}
			}

			data.sort(function(a, b)
				{
					return a - b;
				});

			var n;
			n = parseInt(data.length * 0.25);
			var Q1 = (data[n] + data[n + 1]) * 0.5;
			n = parseInt(data.length * 0.75);
			var Q3 = (data[n] + data[n + 1]) * 0.5;

			var m = (Q1 + Q3) * 0.5;

			var low = Q1 - 1.5 * m;
			var high = Q3 + 1.5 * m;
			if (low > high)
			{
				var t = low; low = high; high = t;
			}

			var min = 0;
			while (data[min] < low)
			{
				min += 1;
			}
			var max = data.length - 1;
			while (data[max]  > high)
			{
				max -= 1;
			}

			plot.ymin = data[min] - 1.5 * (data[max] - data[min]);
			plot.ymax = data[max] + 1.5 * (data[max] - data[min]);

			return true;
		},
		y: function(expression)
		{
			var data = [];

			var y = plot.ymin;
			var d = 10 * (plot.ymax - plot.ymin) / canvas.height;
			for (var i = 10; i < canvas.height; i += 10)
			{
				y += d;
				var t = parseFloat(plot.evaluate(expression, null, y));
				if (!isNaN(t))
				{
					data.push(t);
				}
			}

			data.sort(function(a, b)
				{
					return a - b;
				});

			var n;
			n = parseInt(data.length * 0.25);
			var Q1 = (data[n] + data[n + 1]) * 0.5;
			n = parseInt(data.length * 0.75);
			var Q3 = (data[n] + data[n + 1]) * 0.5;

			var m = (Q1 + Q3) * 0.5;

			var low = Q1 - 1.5 * m;
			var high = Q3 + 1.5 * m;
			if (low > high)
			{
				var t = low; low = high; high = t;
			}

			var min = 0;
			while (data[min] < low)
			{
				min += 1;
			}
			var max = data.length - 1;
			while (data[max]  > high)
			{
				max -= 1;
			}

			plot.xmin = data[min] - 1.5 * (data[max] - data[min]);
			plot.xmax = data[max] + 1.5 * (data[max] - data[min]);

			return true;
		}
	},
	info: function()
	{
		js('#misc').html(
			js.template(''
				+ '<dl class="small">'
				+ '<dt>x-min</dt>'
				+ '<dd>{XMIN}</dd>'
				+ '<dt>x-max</dt>'
				+ '<dd>{XMAX}</dd>'
				+ '<dt>y-min</dt>'
				+ '<dd>{YMIN}</dd>'
				+ '<dt>y-max</dt>'
				+ '<dd>{YMAX}</dd>'
				+ '</dl>'
			).render({
				xmin: plot.xmin,
				xmax: plot.xmax,
				ymin: plot.ymin,
				ymax: plot.ymax
			}));
		return true;
	},

	wheel: function(x, y, direction)
	{
		canvas.init();

		switch (plot.current.type)
		{
			case 'x':
			case 'y':
				x = (plot.xmin + x * (plot.xmax - plot.xmin) / canvas.width) - (plot.xmin + plot.xmax) * 0.5;
				y = (plot.ymin + (canvas.height - y - 1) * (plot.ymax - plot.ymin) / canvas.height) - (plot.ymin + plot.ymax) * 0.5;

				x *= 0.3;
				y *= 0.3;

				plot.xmin += x;
				plot.xmax += x;
				plot.ymin += y;
				plot.ymax += y;

				if (direction < 0)
				{
					plot.xmin *= 0.95;
					plot.xmax *= 0.95;
					plot.ymin *= 0.95;
					plot.ymax *= 0.95;
				}
				else if (direction > 0)
				{
					plot.xmin *= 1.05;
					plot.xmax *= 1.05;
					plot.ymin *= 1.05;
					plot.ymax *= 1.05;
				}
				break;
			case 'xy':
				if (direction < 0)
				{
					plot.scale.x *= 1.05;
					plot.scale.y *= 1.05;
				}
				else if (direction > 0)
				{
					plot.scale.x *= 0.95;
					plot.scale.y *= 0.95;
				}
				break;
			default:
				break;
		}

		plot.sanitize();

		switch (plot.current.type)
		{
			case 'x':
				plot.info();
				plot.axes();
				plot.x(plot.current.expression);
				break;
			case 'y':
				plot.info();
				plot.axes();
				plot.y(plot.current.expression);
				break;
			case 'xy':
				plot.xy(plot.current.expression);
				break;
			default:
				break;
		}

		return true;
	},

	slide: function(x, y, quick)
	{
		x = -x * (plot.xmax - plot.xmin) / canvas.width;
		y = y * (plot.ymax - plot.ymin) / canvas.height;

		canvas.init();
		switch (plot.current.type)
		{
			case 'x':
				plot.xmin += x;
				plot.xmax += x;
				plot.ymin += y;
				plot.ymax += y;

				plot.info();
				plot.axes();
				plot.x(plot.current.expression);
				break;
			case 'y':
				plot.xmin += x;
				plot.xmax += x;
				plot.ymin += y;
				plot.ymax += y;

				plot.info();
				plot.axes();
				plot.y(plot.current.expression);
				break;
			case 'xy':
				plot.angle.z -= (Math.PI / 180.0) * Math.sign(x);
				plot.angle.x += (Math.PI / 180.0) * Math.sign(y);

				plot.xy(plot.current.expression, quick);
				break;
			default:
				break;
		}

		return true;
	},

	glide: function(x, y, quick)
	{
		switch (plot.current.type)
		{
			case 'x':
			case 'y':
				return plot.slide(x, y, quick);
			case 'xy':
				plot.adjust.x += x;
				plot.adjust.y -= y;

				canvas.init();
				plot.xy(plot.current.expression, quick);
				break;
			default:
				break;
		}

		return true;
	},

	reset: function(redraw = true)
	{
		plot.depth = 100;

		plot.gp = {x: 0, y: 0, z: 0};
		plot.sp = {x: 0, y: -10, z: 0};
		plot.ep = {x: 0, y: -15, z: 0};

		plot.angle = {
			x: 15 * Math.PI / 180.0,
			y: 0 * Math.PI / 180.0,
			z: 10 * Math.PI / 180.0
		};

		plot.scale = {x: 60, y: 60};
		plot.adjust = {x: 0, y: 0};

		plot.ymin = -7.3;
		plot.ymax = 7.3;
		plot.xmin = -7.3;
		plot.xmax = 7.3;

		if (!redraw)
		{
			return true;
		}

		canvas.init();
		switch (plot.current.type)
		{
			case 'x':
				plot.guesstimate.x(plot.current.expression);
				plot.info();
				plot.axes();
				plot.x(plot.current.expression);
				break;
			case 'y':
				plot.guesstimate.y(plot.current.expression);
				plot.info();
				plot.axes();
				plot.y(plot.current.expression);
				break;
			case 'xy':
				plot.xy(plot.current.expression);
				break;
			default:
				break;
		}
		return true;
	},

	refresh: function()
	{
		plot.sanitize();
		canvas.init();
		switch (plot.current.type)
		{
			case 'x':
				plot.info();
				plot.axes();
				plot.x(plot.current.expression);
				break;
			case 'y':
				plot.info();
				plot.axes();
				plot.y(plot.current.expression);
				break;
			case 'xy':
				plot.xy(plot.current.expression);
				break;
			default:
				break;
		}
		return true;
	}
};


var script = function(command, index, commands)
{
	switch (command)
	{
		case 'while':
			break;
		case 'repeat':
			if (stack.a.length < 1)
			{
				throw new error(ERR_TOO_FEW_ARGUMENTS)
			}
			var item = stack.a.pop();
			if (!parseInt(item.value))
			{
				return {next: commands[index].end};
			}
			break;
		case 'do':
			break;
		case 'until':
			break;
		case 'if':
			break;
		case 'then':
			if (stack.a.length < 1)
			{
				throw new error(ERR_TOO_FEW_ARGUMENTS)
			}
			var item = stack.a.pop();
			if (!parseInt(item.value))
			{
				if (typeof commands[index].else != 'undefined')
				{
					return {next: commands[index].else};
				}
				if (typeof commands[index].end != 'undefined')
				{
					return {next: commands[index].end};
				}
			}
			break;
		case 'else':
			return {next: commands[index].end};
		case 'end':
			if (typeof commands[index].while != 'undefined')
			{
				return {next: commands[index].while};
			}
			if (typeof commands[index].do != 'undefined')
			{
				if (stack.a.length < 1)
				{
					throw new error(ERR_TOO_FEW_ARGUMENTS)
				}
				var item = stack.a.pop();
				if (!parseInt(item.value))
				{
					return {next: commands[index].do};
				}
			}
			if (typeof commands[index].case != 'undefined')
			{
				return {next: commands[commands[index].case].end};
			}
			break;
		case 'start':
			if (stack.a.length < 2)
			{
				throw new error(ERR_TOO_FEW_ARGUMENTS)
			}
			var item2 = stack.a.pop();
			var item1 = stack.a.pop();
			if (item1.type != 'number' || item2.type != 'number')
			{
				throw new error(ERR_INVALID_ARGUMENT_TYPES);
			}
			if (typeof commands[index].next != 'undefined')
			{
				commands[commands[index].next].count = parseFloat(item1.value);
				commands[commands[index].next].stop = parseFloat(item2.value);
			}
			if (typeof commands[index].step != 'undefined')
			{
				commands[commands[index].step].count = parseFloat(item1.value);
				commands[commands[index].step].stop = parseFloat(item2.value);
			}
			break;
		case 'for':
			if (stack.a.length < 2)
			{
				throw new error(ERR_TOO_FEW_ARGUMENTS)
			}
			var item2 = stack.a.pop();
			var item1 = stack.a.pop();
			if (item1.type != 'number' || item2.type != 'number')
			{
				throw new error(ERR_INVALID_ARGUMENT_TYPES);
			}
			if (typeof commands[index].next != 'undefined')
			{
				commands[commands[index].next].count = parseFloat(item1.value);
				commands[commands[index].next].stop = parseFloat(item2.value);
			}
			if (typeof commands[index].step != 'undefined')
			{
				commands[commands[index].step].count = parseFloat(item1.value);
				commands[commands[index].step].stop = parseFloat(item2.value);
			}
			return {next: index + 1}; // Skip identifier
		case 'next':
			commands[index].count += 1;
			if (commands[index].count <= commands[index].stop)
			{
				if (typeof commands[index].start != 'undefined')
				{
					return {next: commands[index].start};
				}
				if (typeof commands[index].for != 'undefined')
				{
					return {next: commands[index].for + 1};
				}
			}
			break;
		case 'step':
			if (stack.a.length < 1)
			{
				throw new error(ERR_TOO_FEW_ARGUMENTS)
			}
			var item = stack.a.pop();
			if (item.type != 'number')
			{
				throw new error(ERR_INVALID_ARGUMENT_TYPE);
			}
			commands[index].count += parseFloat(item.value);
			if (parseFloat(item.value) <= 0)
			{
				if (commands[index].count >= commands[index].stop)
				{
					if (typeof commands[index].start != 'undefined')
					{
						return {next: commands[index].start};
					}
					if (typeof commands[index].for != 'undefined')
					{
						return {next: commands[index].for + 1};
					}
				}
			}
			else
			{
				if (commands[index].count <= commands[index].stop)
				{
					if (typeof commands[index].start != 'undefined')
					{
						return {next: commands[index].start};
					}
					if (typeof commands[index].for != 'undefined')
					{
						return {next: commands[index].for + 1};
					}
				}
			}
			break;
		case 'case':
			break;
		default:
			break;
	}
	return true;
};


var logic = function(which)
{
	if (stack.a.length < 2)
	{
		throw new error(ERR_TOO_FEW_ARGUMENTS);
	}

	var item2 = stack.a.pop();
	var item1 = stack.a.pop();
	var value1 = item1.type == 'number' ? parseFloat(item1.value) : item1.value;
	var value2 = item2.type == 'number' ? parseFloat(item2.value) : item2.value;

	switch (which)
	{
		case '<':
			stack.a.push({value: value1 < value2 ? 1 : 0, type: 'number'});
			break;
		case '<=':
			stack.a.push({value: value1 <= value2 ? 1 : 0, type: 'number'});
			break;
		case '==':
			stack.a.push({value: value1 == value2 ? 1 : 0, type: 'number'});
			break;
		case '!=':
			stack.a.push({value: value1 != value2 ? 1 : 0, type: 'number'});
			break;
		case '>=':
			stack.a.push({value: value1 >= value2 ? 1 : 0, type: 'number'});
			break;
		case '>':
			stack.a.push({value: value1 > value2 ? 1 : 0, type: 'number'});
			break;
		default:
			break;
	}
	return true;
};


var storage = {
	store: [],
	sto: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		if (item1.type != 'identifier')
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var done = false;
		storage.store.forEach(function(element)
			{
				if (element.identifier == item1.value)
				{
					element.content = item2;
					done = true;
				}
			});
		if (!done)
		{
			storage.store.push({identifier: item1.value, content: item2});
		}
		return true;
	},
	rcl: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'identifier')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var found = false;
		storage.store.forEach(function(element)
			{
				if (element.identifier == item.value)
				{
					stack.a.push({value: element.content.value, type: element.content.type});
					found = true;
				}
			});
		if (!found)
		{
			throw new error(ERR_NO_SUCH_IDENTIFIER);
		}
		return true;
	},
	eval: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		switch (item.type)
		{
			case 'number':
				stack.a.push(item);
				break;
			case 'string':
				stack.a.push(item);
				break;
			case 'expression':
				interpreter.run(tokenizer.run(item.value));
				break;
			case 'identifier':
				var found = false;
				storage.store.forEach(function(element)
					{
						if (element.identifier == item.value)
						{
							stack.a.push(element.content);
							found = true;
						}
					});
				if (!found)
				{
					throw new error(ERR_NO_SUCH_IDENTIFIER);
				}
				return storage.eval();
			default:
				stack.a.push(item);
				throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		return true;
	},
	purge: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'identifier')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var found = false;
		storage.store.forEach(function(element, index)
			{
				if (element.identifier == item.value)
				{
					found = index;
				}
			});
		if (found === false)
		{
			throw new error(ERR_NO_SUCH_IDENTIFIER);
		}
		storage.store.splice(found, 1);
		hint.text("'" + item.value + "'" + ' purged');
		return true;
	},
	rclall: function()
	{
		var list = [];
		storage.store.forEach(function(element)
			{
				list.push(element.identifier);
			});
		if (list.length)
		{
			hint.text(list.join('\n'));
		}
		else
		{
			hint.html('<div class="help-info small"><header>Storage</header>No content stored</div>');
		}
		return true;
	}
};


var special = {
	timer: function()
	{
		stack.a.push({value: Date.now(), type: 'number'});
		// stack.a.push({value: performance.now(), type: 'number'});
		return true;
	},
	gxmin: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: parseFloat(plot.xmin), type: 'number'});
		plot.xmin = parseFloat(item.value);
		plot.refresh();
		return true;
	},
	gxmax: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: parseFloat(plot.xmax), type: 'number'});
		plot.xmax = parseFloat(item.value);
		plot.refresh();
		return true;
	},
	gymin: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: parseFloat(plot.ymin), type: 'number'});
		plot.ymin = parseFloat(item.value);
		plot.refresh();
		return true;
	},
	gymax: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: parseFloat(plot.ymax), type: 'number'});
		plot.ymax = parseFloat(item.value);
		plot.refresh();
		return true;
	},
	greset: function()
	{
		return plot.reset();
	},
	chr: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var c = String.fromCodePoint(parseInt(item.value));
		if (!/[\w\W\s]/.test(c))
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: c, type: 'string'});
		return true;
	},
	num: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'string')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: item.value.codePointAt(0), type: 'number'});
		return true;
	},
	plot: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'expression')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		plot.current.type = null;
		plot.current.expression = null;
		js('#reset').attribute('disabled').add(true);
		plot.run(item.value);
		return true;
	},
	min: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		stack.a.push({value: parseFloat(item1.value) <= parseFloat(item2.value) ? item1.value : item2.value, type: 'number'});
		return true;
	},
	max: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		stack.a.push({value: parseFloat(item1.value) >= parseFloat(item2.value) ? item1.value : item2.value, type: 'number'});
		return true;
	},
	comb: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		stack.a.push({value: helper.functions.comb(parseInt(item1.value), parseInt(item2.value)), type: 'number'});
		return true;
	},
	perm: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		stack.a.push({value: helper.functions.perm(parseInt(item1.value), parseInt(item2.value)), type: 'number'});
		return true;
	},
	fact: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (parseFloat(item.value) == 0)
		{
			stack.a.push({value: 1, type: 'number'});
			return true;
		}
		stack.a.push({value: helper.functions.fact(parseInt(item.value)), type: 'number'});
		return true;
	},
	gamma: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: helper.functions.gamma(parseFloat(item.value)), type: 'number'});
		return true;
	},
	lambertw: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: helper.functions.lambertw(parseFloat(item.value)), type: 'number'});
		return true;
	},
	deg: function()
	{
		options.angle_mode = ANGLE_DEG;
		js('#angle').value('deg');
		return true;
	},
	rad: function()
	{
		options.angle_mode = ANGLE_RAD;
		js('#angle').value('rad');
		return true;
	},
	grad: function()
	{
		options.angle_mode = ANGLE_GRAD;
		js('#angle').value('grad');
		return true;
	},
	precision: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var i = parseInt(item.value);
		if (i < PRECISION_MIN || i > PRECISION_MAX)
		{
			i = PRECISION_DEFAULT;
		}
		stack.a.push({value: options.precision, type: 'number'});
		options.precision = i;
		js('#precision').value(i);
		return true;
	},
	date: function()
	{
		var d = new Date();
		stack.a.push({value: d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0'), type: 'string'});
		return true;
	},
	time: function()
	{
		var d = new Date();
		stack.a.push({value: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'), type: 'string'});
		return true;
	},
	rand: function()
	{
		stack.a.push({value: Math.random(), type: 'number'});
		return true;
	},
	factor: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var list = helper.functions.factor(parseInt(item.value));
		list.forEach(function(element)
			{
				stack.a.push({value: element, type: 'number'});
			});
		// hint.text(list.join(' '));
		var s = [];
		for (var i = 0; i < list.length; i += 1)
		{
			var count = 1;
			var t = list[i];
			while (list[i + 1] && list[i + 1] == list[i])
			{
				i += 1;
				count += 1;
			}
			s.push(count > 1 ? t + '<sup>' + count + '</sup>' : '' + t);
		}
		hint.html(s.join(' * '));
		return true;
	},
	div: function()
	{
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var list = helper.functions.div(parseInt(item.value));
		list.forEach(function(element)
			{
				stack.a.push({value: element, type: 'number'});
			});
		hint.text(list.join(' '));
		return true;
	},
	neg: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = -parseFloat(stack.a[stack.a.length - 1].value);
		return true;
	},
	chs: function()
	{
		return special.neg();
	},
	inv: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = 1.0 / parseFloat(stack.a[stack.a.length - 1].value);
		return true;
	},
	gcd: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		stack.a.push({value: helper.functions.gcd(parseFloat(item1.value), parseFloat(item2.value)), type: 'number'});
		return true;
	},
	lcm: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_INVALID_ARGUMENT_TYPES);
		}
		if (parseFloat(item1.value) >= parseFloat(item2.value))
		{
			stack.a.push({value: parseFloat(item2.value) * (parseFloat(item1.value) / helper.functions.gcd(parseFloat(item1.value), parseFloat(item2.value))), type: 'number'});
		}
		else
		{
			stack.a.push({value: parseFloat(item1.value) * (parseFloat(item2.value) / helper.functions.gcd(parseFloat(item1.value), parseFloat(item2.value))), type: 'number'});
		}
		return true;
	},
	q: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		var result = helper.functions.Q(parseFloat(item.value));
		stack.a.push({value: result.n, type: 'number'});
		stack.a.push({value: result.d, type: 'number'});
		return true;
	},
	ip: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = parseInt(stack.a[stack.a.length - 1].value);
		return true;
	},
	fp: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = stack.a[stack.a.length - 1].value - parseInt(stack.a[stack.a.length - 1].value);
		return true;
	},
	pow: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number' || item2.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a.push({value: Math.pow(item1.value, item2.value), type: 'number'});
		return true;
	},
	sq: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = stack.a[stack.a.length - 1].value * stack.a[stack.a.length - 1].value;
		return true;
	},
	cb: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (stack.a[stack.a.length - 1].type != 'number')
		{
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		stack.a[stack.a.length - 1].value = Math.pow(stack.a[stack.a.length - 1].value, 3);
		return true;
	},
};


var math = function(which)
{
	if (stack.a.length < 1)
	{
		throw new error(ERR_TOO_FEW_ARGUMENTS);
	}
	var item = stack.a.pop();
	if (item.type != 'number')
	{
		stack.a.push(item);
		throw new error(ERR_INVALID_ARGUMENT_TYPE);
	}
	switch (which)
	{
		case 'ln':
			stack.a.push({value: Math.log(parseFloat(item.value)), type: 'number'});
			break;
		case 'log':
			stack.a.push({value: Math.log10(parseFloat(item.value)), type: 'number'});
			break;
		default:
			stack.a.push({value: Math[which](parseFloat(item.value)), type: 'number'});
			break;
	}
	return true;
};


var trigo = function(which)
{
	if (stack.a.length < 1)
	{
		throw new error(ERR_TOO_FEW_ARGUMENTS);
	}
	var item = stack.a[stack.a.length - 1];
	if (item.type != 'number')
	{
		stack.a.push(item);
		throw new error(ERR_INVALID_ARGUMENT_TYPE);
	}
	switch (which)
	{
		case 'sin':
		case 'sinh':
		case 'cos':
		case 'cosh':
		case 'tan':
		case 'tanh':
		case 'sec':
		case 'csc':
		case 'sech':
		case 'csch':
			var value = parseFloat(item.value);
			switch (options.angle_mode)
			{
				case ANGLE_DEG:
					value = Math.PI * value / 180.0;
					break;
				case ANGLE_RAD:
					// value = value;
					break;
				case ANGLE_GRAD:
					value = Math.PI * value / 200.0;
					break;
				default:
					break;
			}
			switch (which)
			{
				case 'sin':
				case 'sinh':
				case 'cos':
				case 'cosh':
				case 'tan':
				case 'tanh':
					item.value = Math[which](value);
					break;
				case 'sec':
					item.value = 1.0 / Math.cos(value);
					break;
				case 'csc':
					item.value = 1.0 / Math.sin(value);
					break;
				case 'sech':
					item.value = 1.0 / Math.cosh(value);
					break;
				case 'csch':
					item.value = 1.0 / Math.sinh(value);
					break;
				default:
					break;
			}
			break;
		case 'asin':
		case 'asinh':
		case 'acos':
		case 'acosh':
		case 'atan':
		case 'atanh':
		case 'asec':
		case 'acsc':
		case 'asech':
		case 'acsch':
			var value = 0.0;
			switch (which)
			{
				case 'asin':
				case 'asinh':
				case 'acos':
				case 'acosh':
				case 'atan':
				case 'atanh':
					value = Math[which](parseFloat(item.value));
					break;
				case 'asec':
					value = Math.acos(1.0 / item.value);
					break;
				case 'acsc':
					value = Math.asin(1.0 / item.value);
					break;
				case 'asech':
					value = Math.log((1 + Math.sqrt(1 - item.value * item.value)) / item.value);
					break;
				case 'acsch':
					value = Math.log(1.0 / item.value + Math.sqrt(1.0 / (item.value * item.value) + 1));
					break;
				default:
					break;
			}
			switch (options.angle_mode)
			{
				case ANGLE_DEG:
					item.value = 180.0 * value / Math.PI;
					break;
				case ANGLE_RAD:
					item.value = value;
					break;
				case ANGLE_GRAD:
					item.value = 200.0 * value / Math.PI;
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
	return true;
};


var constants = function(constant)
{
	switch (constant)
	{
		case 'E':
		case 'LN2':
		case 'LN10':
		case 'LOG2E':
		case 'LOG10E':
		case 'PI':
		case 'SQRT1_2':
		case 'SQRT2':
			stack.a.push({value: Math[constant], type: 'number'});
		default:
			break;
	}
	return true;
};


var stack = {
	roll: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (stack.a.length < parseInt(item.value))
		{
			stack.a.push(item);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (parseInt(item.value) == 0)
		{
			return true;
		}
		var t = stack.a[stack.a.length - parseInt(item.value)];
		for (var i = parseInt(item.value); i > 1; i -= 1)
		{
			stack.a[stack.a.length - i] = stack.a[stack.a.length - i + 1];
		}
		stack.a[stack.a.length - 1] = t;
		return true;
	},
	rolld: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (stack.a.length < parseInt(item.value))
		{
			stack.a.push(item);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (parseInt(item.value) == 0)
		{
			return true;
		}
		var t = stack.a[stack.a.length - 1];
		for (var i = 2; i <= parseInt(item.value); i += 1)
		{
			stack.a[stack.a.length - i + 1 ] = stack.a[stack.a.length - i];
		}
		stack.a[stack.a.length - parseInt(item.value)] = t;
		return true;
	},
	pick: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (parseInt(item.value) < 0)
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT);
		}
		if (stack.a.length < parseInt(item.value))
		{
			stack.a.push(item);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (parseInt(item.value) == 0)
		{
			return true;
		}
		stack.a.push({value: stack.a[stack.a.length - parseInt(item.value)].value, type: stack.a[stack.a.length - parseInt(item.value)].type});
		return true;
	},
	unpick: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		if (item1.type != 'number')
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (parseInt(item1.value) < 0)
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_INVALID_ARGUMENT);
		}
		if (stack.a.length < parseInt(item1.value))
		{
			stack.a.push(item2);
			stack.a.push(item1);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		if (parseInt(item1.value) == 0)
		{
			return true;
		}
		stack.a[stack.a.length - parseInt(item1.value)] = item2;
		return true;
	},
	pick2: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 2].value, type: stack.a[stack.a.length - 2].type});
		return true;
	},
	pick3: function()
	{
		if (stack.a.length < 3)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 3].value, type: stack.a[stack.a.length - 3].type});
		return true;
	},
	rot: function()
	{
		if (stack.a.length < 3)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		var item3 = stack.a.pop();
		stack.a.push(item2);
		stack.a.push(item1);
		stack.a.push(item3);
		return true;
	},
	unrot: function()
	{
		if (stack.a.length < 3)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		var item3 = stack.a.pop();
		stack.a.push(item1);
		stack.a.push(item3);
		stack.a.push(item2);
		return true;
	},
	nip: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		stack.a.pop();
		stack.a.push(item);
		return true;
	},
	depth: function()
	{
		stack.a.push({value: stack.a.length, type: 'number'});
	},
	clear: function()
	{
		canvas.init();
		stack.a.length = 0;
		js('#hint').clear();
		js('#misc').clear();
		js('#subtle').clear();
		js('#reset').attribute('disabled').add(true);
		js('#plotter').class('hidden').add();
		return true;
	},
	drop: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.pop();
		return true;
	},
	drop2: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.pop();
		stack.a.pop();
		return true;
	},
	drop3: function()
	{
		if (stack.a.length < 3)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.pop();
		stack.a.pop();
		stack.a.pop();
		return true;
	},
	dropn: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (stack.a.length < parseInt(item.value))
		{
			stack.a.push(item);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		for (var i = 0; i < parseInt(item.value); i += 1)
		{
			stack.a.pop();
		}
		return true;
	},
	dup: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 1].value, type: stack.a[stack.a.length - 1].type});
		return true;
	},
	dup2: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 2].value, type: stack.a[stack.a.length - 2].type});
		stack.a.push({value: stack.a[stack.a.length - 2].value, type: stack.a[stack.a.length - 2].type});
		return true;
	},
	dup3: function()
	{
		if (stack.a.length < 3)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 3].value, type: stack.a[stack.a.length - 3].type});
		stack.a.push({value: stack.a[stack.a.length - 3].value, type: stack.a[stack.a.length - 3].type});
		stack.a.push({value: stack.a[stack.a.length - 3].value, type: stack.a[stack.a.length - 3].type});
		return true;
	},
	dupn: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item = stack.a.pop();
		if (item.type != 'number')
		{
			stack.a.push(item);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		if (stack.a.length < parseInt(item.value))
		{
			stack.a.push(item);
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var offset = parseInt(item.value);
		for (var i = 0; i < offset; i += 1)
		{
			stack.a.push({value: stack.a[stack.a.length - offset].value, type: stack.a[stack.a.length - offset].type});
		}
		return true;
	},
	ndupn: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type != 'number')
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INVALID_ARGUMENT_TYPE);
		}
		for (var i = 0; i < parseInt(item2.value); i += 1)
		{
			stack.a.push({value: item1.value, type: item1.type});
		}
		stack.a.push({value: parseInt(item2.value), type: 'number'});
		return true;
	},
	dupdup: function()
	{
		if (stack.a.length < 1)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 1].value, type: stack.a[stack.a.length - 1].type});
		stack.a.push({value: stack.a[stack.a.length - 1].value, type: stack.a[stack.a.length - 1].type});
		return true;
	},
	swap: function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item1 = stack.a.pop();
		var item2 = stack.a.pop();
		stack.a.push(item1);
		stack.a.push(item2);
		return true;
	},
	over: function()
	{
		if (stack.a.lenth < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		stack.a.push({value: stack.a[stack.a.length - 2].value, type: stack.a[stack.a.length - 2].type});
		return true;
	}
};

var arithmetic = {
	'+': function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		if (item1.type == 'number' && item2.type == 'number')
		{
			stack.a.push({value: parseFloat(item1.value) + parseFloat(item2.value), type: 'number'});
		}
		else if ((item1.type == 'number' || item1.type == 'string') && (item2.type == 'number' || item2.type == 'string'))
		{
			stack.a.push({value: item1.value + item2.value, type: 'string'});
		}
		else if (item1.type == 'expression' && item2.type == 'expression')
		{
			stack.a.push({value: item1.value + item2.value, type: 'expression'});
		}
		else
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INCOMPATIBLE_ARGUMENT_TYPES);
		}
		return true;
	},
	'-': function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		var result = null;
		if (item1.type == 'number' && item2.type == 'number')
		{
			stack.a.push({value: parseFloat(item1.value) - parseFloat(item2.value), type: 'number'});
		}
		else
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INCOMPATIBLE_ARGUMENT_TYPES);
		}
		return true;
	},
	'*': function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		var result = null;
		if (item1.type == 'number' && item2.type == 'number')
		{
			stack.a.push({value: parseFloat(item1.value) * parseFloat(item2.value), type: 'number'});
		}
		else if (item1.type == 'number' && item2.type == 'string')
		{
			stack.a.push({value: item2.value.repeat(parseInt(item1.value)), type: 'string'});
		}
		else if (item1.type == 'string' && item2.type == 'number')
		{
			stack.a.push({value: item1.value.repeat(parseInt(item2.value)), type: 'string'});
		}
		else
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INCOMPATIBLE_ARGUMENT_TYPES);
		}
		return true;
	},
	'/': function()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		var result = null;
		if (item1.type == 'number' && item2.type == 'number')
		{
			stack.a.push({value: parseFloat(item1.value) / parseFloat(item2.value), type: 'number'});
		}
		else
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INCOMPATIBLE_ARGUMENT_TYPES);
		}
		return true;
	},
	mod: function ()
	{
		if (stack.a.length < 2)
		{
			throw new error(ERR_TOO_FEW_ARGUMENTS);
		}
		var item2 = stack.a.pop();
		var item1 = stack.a.pop();
		var result = null;
		if (item1.type == 'number' && item2.type == 'number')
		{
			stack.a.push({value: parseInt(item1.value) % parseInt(item2.value), type: 'number'});
		}
		else
		{
			stack.a.push(item1);
			stack.a.push(item2);
			throw new error(ERR_INCOMPATIBLE_ARGUMENT_TYPES);
		}
		return true;
	}
};


var interpreter = {
	back: function(index, list, level, commands)
	{
		var result = [];
		for (var i = index - 1; i >= 0; i -= 1)
		{
			if (commands[i].level == level && list.includes(commands[i].value))
			{
				result.push({command: commands[i].value, index: i});
				break;
			}
		}
		return result;
	},
	debug: function(i, commands, current, level)
	{
		commands.forEach(function(command, index)
			{
				if (index == i)
				{
					console.log(index, command);
				}
				return true;
			});
		console.log('current', i, current.reduce(function(previous, value, index, a)
			{
				return previous + '-' + value.command;
			}, ''));
		return true;
	},
	scripting: function(commands)
	{
		var current = [];
		var level = 0;
		for (var i = 0; i < commands.length; i += 1)
		{
			switch (commands[i].value)
			{
				case 'while':
					commands[i].level = level;
					level += 1;
					current.push({index: i, command: commands[i].value});
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'repeat':
					commands[i].level = level - 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'do':
					commands[i].level = level;
					level += 1;
					current.push({index: i, command: commands[i].value});
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'until':
					commands[i].level = level - 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'case':
					commands[i].level = level;
					level += 2;
					current.push({index: i, command: commands[i].value});
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'if':
					commands[i].level = level;
					level += 1;
					current.push({index: i, command: commands[i].value});
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'then':
					commands[i].level = level - 1;
					if (current[current.length - 1].command == 'case')
					{
						commands[i].case = current[current.length - 1].index;
						current.push({index: i, command: commands[i].value});
					}
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'else':
					commands[i].level = level - 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'end':
					commands[i].level = level - 1;
					if (current.length >= 2 && current[current.length - 2].command == 'case')
					{
						if (commands[i].level - commands[current[current.length - 2].index].level <= 1)
						{
							commands[i].case = current[current.length - 2].index;
						}
					}
					var t = current.pop();
					switch (t.command)
					{
						case 'while':
						case 'do':
						case 'if':
							level -= 1;
							break;
						case 'then':
							break;
						case 'case':
							commands[i].level = level - 2;
							level -= 2;
							break;
						default:
							level -= 1;
							break;
					}
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'start':
					commands[i].level = level;
					level += 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'for':
					commands[i].level = level;
					if (i + 1 >= commands.length || commands[i + 1].type != 'identifier')
					{
						throw new error(ERR_FOR_IDENTIFIER);
					}
					commands[i + 1].level = level + 1;
					level += 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					i += 1; // Skip identifier
					break;
				case 'next':
					commands[i].level = level - 1;
					level -= 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				case 'step':
					commands[i].level = level - 1;
					level -= 1;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
				default:
					commands[i].level = level;
					if (DEBUG)
					{
						interpreter.debug(i, commands, current);
					}
					break;
			}
		}

		if (level != 0)
		{
			throw new error(ERR_SCRIPTING);
		}

		var back = [];
		for (var i = 0; i < commands.length; i += 1)
		{
			switch (commands[i].value)
			{
				case 'while':
					break;
				case 'repeat':
					back = interpreter.back(i, ['while'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].repeat = i;
					}
					break;
				case 'do':
					break;
				case 'until':
					back = interpreter.back(i, ['do'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].until = i;
					}
					break;
				case 'case':
					break;
				case 'if':
					break;
				case 'then':
					back = interpreter.back(i, ['if'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].then = i;
					}
					back = interpreter.back(i, ['case'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
					}
					break;
				case 'else':
					back = interpreter.back(i, ['if'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
					}
					back = interpreter.back(i, ['then'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].else = i;
					}
					break;
				case 'end':
					var found = false;
					back = interpreter.back(i, ['while', 'do', 'if', 'case'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].end = i;
						found = back[j].command;
					}
					switch (found)
					{
						case 'while':
							back = interpreter.back(i, ['repeat'], commands[i].level, commands);
							for (var j = 0; j < back.length; j += 1)
							{
								commands[i][back[j].command] = back[j].index;
								commands[back[j].index].end = i;
							}
							break;
						case 'do':
							back = interpreter.back(i, ['until'], commands[i].level, commands);
							for (var j = 0; j < back.length; j += 1)
							{
								commands[i][back[j].command] = back[j].index;
								commands[back[j].index].end = i;
							}
							break;
						case 'case':
							break;
						case 'if':
							back = interpreter.back(i, ['then'], commands[i].level, commands);
							for (var j = 0; j < back.length; j += 1)
							{
								commands[i][back[j].command] = back[j].index;
								commands[back[j].index].end = i;
							}
							back = interpreter.back(i, ['else'], commands[i].level, commands);
							for (var j = 0; j < back.length; j += 1)
							{
								commands[i][back[j].command] = back[j].index;
								commands[back[j].index].end = i;
							}
							break;
						default:
							back = interpreter.back(i, ['then'], commands[i].level, commands);
							for (var j = 0; j < back.length; j += 1)
							{
								commands[i][back[j].command] = back[j].index;
								commands[back[j].index].end = i;
							}
							break;
					}
					break;
				case 'start':
					break;
				case 'for':
					break;
				case 'next':
					back = interpreter.back(i, ['start', 'for'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].next = i;
						if (back[j].command == 'for')
						{
							for (var k = back[j].index + 2; k < i; k += 1)
							{
								if (commands[k].type == 'identifier' && commands[k].value == commands[back[j].index + 1].value)
								{
									commands[k].type = 'for';
									commands[k].index = i;
									if (k == 0 || commands[k - 1].value == 'for')
									{
										throw new error(ERR_FOR_IDENTIFIER_MISMATCH);
									}
								}
							}
						}
					}
					break;
				case 'step':
					back = interpreter.back(i, ['start', 'for'], commands[i].level, commands);
					for (var j = 0; j < back.length; j += 1)
					{
						commands[i][back[j].command] = back[j].index;
						commands[back[j].index].step = i;
						if (back[j].command == 'for')
						{
							for (var k = back[j].index + 2; k < i; k += 1)
							{
								if (commands[k].type == 'identifier' && commands[k].value == commands[back[j].index + 1].value)
								{
									commands[k].type = 'for';
									commands[k].index = i;
									if (k == 0 || commands[k - 1].value == 'for')
									{
										throw new error(ERR_FOR_IDENTIFIER_MISMATCH);
									}
								}
							}
						}
					}
					break;
				default:
					break;
			}
		}

		return commands;
	},
	run: function(commands)
	{
		commands = interpreter.scripting(commands);
		if (DEBUG)
		{
			commands.forEach(function(command, index)
				{
					console.log(index, command);
					return true;
				});
		}

		for (var i = 0; i < commands.length; i += 1)
		{
			switch (commands[i].value)
			{
				case 'while':
					if (typeof commands[i].repeat == 'undefined')
					{
						throw new error(ERR_WHILE_REPEAT);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_WHILE_END);
					}
					break;
				case 'repeat':
					if (typeof commands[i].while == 'undefined')
					{
						throw new error(ERR_REPEAT_WHILE);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_REPEAT_END);
					}
					break;
				case 'do':
					if (typeof commands[i].until == 'undefined')
					{
						throw new error(ERR_DO_UNTIL);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_DO_END);
					}
					break;
				case 'until':
					if (typeof commands[i].do == 'undefined')
					{
						throw new error(ERR_UNTIL_DO);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_UNTIL_END);
					}
					break;
				case 'case':
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_CASE_END);
					}
					break;
				case 'if':
					if (typeof commands[i].then == 'undefined')
					{
						throw new error(ERR_IF_THEN);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_IF_END);
					}
					break;
				case 'then':
					if (typeof commands[i].if == 'undefined' && typeof commands[i].case == 'undefined')
					{
						throw new error(ERR_THEN_IF);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_THEN_END);
					}
					break;
				case 'else':
					if (typeof commands[i].if == 'undefined')
					{
						throw new error(ERR_ELSE_IF);
					}
					if (typeof commands[i].then == 'undefined')
					{
						throw new error(ERR_ELSE_THEN);
					}
					if (typeof commands[i].end == 'undefined')
					{
						throw new error(ERR_ELSE_END);
					}
					break;
				case 'end':
					break;
				case 'start':
					if (typeof commands[i].next == 'undefined' && typeof commands[i].step == 'undefined')
					{
						throw new error(ERR_START);
					}
					break;
				case 'for':
					if (typeof commands[i].next == 'undefined' && typeof commands[i].step == 'undefined')
					{
						throw new error(ERR_FOR);
					}
					break;
				case 'next':
					if (typeof commands[i].start == 'undefined' && typeof commands[i].for == 'undefined')
					{
						throw new error(ERR_NEXT);
					}
					break;
				case 'step':
					if (typeof commands[i].start == 'undefined' && typeof commands[i].for == 'undefined')
					{
						throw new error(ERR_STEP);
					}
					break;
				default:
					break;
			}
		}

		for (var i = 0; i < commands.length; i += 1)
		{
			var item = commands[i];
			switch (item.type)
			{
				case 'constant':
					constants(item.value);
					break;
				case 'basic':
					arithmetic[item.value]();
					break;
				case 'stack':
					stack[item.value]();
					break;
				case 'math':
					math(item.value);
					break;
				case 'trigo':
					trigo(item.value);
					break;
				case 'special':
					special[item.value]();
					break;
				case 'storage':
					storage[item.value]();
					break;
				case 'number':
				case 'string':
				case 'expression':
					stack.a.push(item);
					break;
				case 'script':
					var result = script(item.value, i, commands);
					if (typeof result.next != 'undefined')
					{
						i = result.next;
					}
					break;
				case 'logic':
					logic(item.value);
					break;
				case 'for':
					stack.a.push({value: commands[item.index].count, type: 'number'});
					break;
				case 'identifier':
					stack.a.push(item);
					break;
				case 'unknown':
				default:
					stack.a.push(item);
					break;
			}
		}
		return true;
	}
};


var helper = {
	uniqueID: function()
	{
		if (!helper.uniqueID.id)
		{
			helper.uniqueID.id = 0;
		}
		helper.uniqueID.id += 1;
		return '_ref_' + helper.uniqueID;
	},

	functions: {
		factor: function(n)
		{
			var list = [];
			n = Math.abs(Math.trunc(n));
			while ((n % 2) == 0)
			{
				list.push(2);
				n /= 2;
			}
			while ((n % 3) == 0)
			{
				list.push(3);
				n /= 3;
			}
			var d = 5;
			var dd = 2;
			while (d <= n)
			{
				while ((n % d) == 0)
				{
					n /= d;
					list.push(d);
				}
				d += dd;
				dd = 6 - dd;
			}
			if (n > 1)
			{
				list.push(n);
			}
			return list;
		},
		div: function(n)
		{
			n = Math.abs(Math.trunc(n));
			var list = [];
			var t = [];
			var i = 1;
			var j = n;
			while (i < j)
			{
				if ((n % i) == 0)
				{
					list.push(i);
					j = n / i;
					if (i != j)
					{
						t.push(j);
					}
				}
				i += 1;
			}
			while (t.length)
			{
				list.push(t.pop());
			}
			return list;
		},
		gcd: function(a, b)
		{
			if (a == 0)
			{
				return b;
			}
			if (b == 0)
			{
				return a;
			}
			return helper.functions.gcd(parseInt(b), parseInt(a) % parseInt(b));
		},
		Q: function(n)
		{
			var ip = parseInt(n);
			var fp = n - ip;
			var a = 0, c = 1;
			var b = 1, d = 1;
			var precision = Math.pow(10, Math.max(2, options.precision));
			if (fp == 0.0)
			{
				return {n: ip, d: 1};
			}
			while (b <= precision && d <= precision)
			{
				var t = (a + c) / (b + d);
				if (fp  == t)
				{
					return {n: a + c + ip * (b + d), d: b + d};
				}
				else if (fp <= t)
				{
					c = a + c;
					d = b + d;
				}
				else
				{
					a = a + c;
					b = b + d;
				}
			}
			if (b > precision)
			{
				return {n: c + ip * d, d: d};
			}
			else
			{
				return {n: a + ip * b, d: b};
			}
		},
		fact: function(x)
		{
			if (x > 100 || x < 1.0)
			{
				return helper.functions.gamma(x + 1);
			}
			var result = 1;
			for (var i = 1; i <= x; i += 1)
			{
				result *= i;
			}
			return result;
		},
		gamma: function(x) // https://rosettacode.org/wiki/Gamma_function#JavaScript
		{
    		var constants = [
				0.99999999999980993,
				676.5203681218851,
				-1259.1392167224028,
				771.32342877765313,
				-176.61502916214059,
				12.507343278686905,
				-0.13857109526572012,
				9.9843695780195716e-6,
				1.5056327351493116e-7
			];
 
    		if (x < 0.5)
			{
        		return Math.PI / (Math.sin(Math.PI * x) * helper.functions.gamma(1 - x));
    		}
 
    		var a = constants[0];
    		x -= 1;
    		for (var i = 1; i < constants.length; i += 1)
			{
        		a += constants[i] / (x + i);
    		}
 
    		var t = x + constants.length - 2 + 0.5;
    		return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
		},
		lambertw: function(n)
		{
			/*
			 * https://en.wikipedia.org/wiki/Lambert_W_function
			 *
			 * Newton's approximation:
			 * Xn+1 = Xn - f(Xn) / f'(Xn)
			 *
			 * f(x) = x * e^x - constant
			 * f^-1(x) = W(x) (inverse function)
			 *
			 * f'(x) = x * e^x + e^x
			 *
			 * constant = n = initial guess
			 */

			let precision = Math.pow(10, -Math.max(2, options.precision));

			let x = n;

			while (true)
			{
				let e = Math.exp(x);
				let t = x - (x * e - n) / (x * e + e);
				if (isNaN(t))
				{
					break;
				}
				if (Math.abs(t - x) <= precision)
				{
					break;
				}
				x = t;
			}

			return x;
		},
		comb: function(r, n) // r: selected, n: total
		{
			return helper.functions.fact(n) / (helper.functions.fact(r) * helper.functions.fact(n - r));
		},
		perm: function(r, n) // r: selected, n: total
		{
			return helper.functions.fact(n) / helper.functions.fact(n - r);
		}
	},

	history: {
		lines: [],
		current: 0,
		original: null,
		add: function(line)
		{
			if (helper.history.lines.length == 0 || helper.history.lines[helper.history.lines.length - 1] != line && line != 'history')
			{
				helper.history.lines.push(line);
			}
			while (helper.history.lines.length > options.history)
			{
				helper.history.lines.shift();
			}
			helper.history.current = helper.history.lines.length;
			helper.history.original = null;
			return true;
		},
		up: function(input)
		{
			if (helper.history.original === null)
			{
				helper.history.original = input;
			}
			if (helper.history.lines.length == 0)
			{
				return '';
			}
			if (helper.history.current > 0)
			{
				helper.history.current -= 1;
			}
			return helper.history.lines[helper.history.current];
		},
		down: function(input)
		{
			if (helper.history.lines.length == 0)
			{
				return '';
			}
			if (helper.history.current < helper.history.lines.length)
			{
				helper.history.current += 1;
			}
			if (helper.history.current == helper.history.lines.length)
			{
				if (helper.history.original === null)
				{
					return '';
				}
				var t = helper.history.original; helper.history.original = null; return t;
				return helper.history.original;
			}
			return helper.history.lines[helper.history.current];
		}
	},

	format: function(item)
	{
		switch (item.type)
		{
			case 'number':
				return parseFloat(parseFloat(item.value).toFixed(options.precision)).toLocaleString('fr',
					{
						notation: item.value.toString().indexOf('e') >= 0 ? 'scientific' : 'standard',
						minimumFractionDigits: 0,
						maximumFractionDigits: 10
					});
			case 'string':
				return '<span class="t_red">' + item.value + '</span>';
			case 'expression':
				return '<span class="t_blue">' + item.value + '</span>';
			case 'identifier':
				return '<span class="bold">' + item.value + '</span>';
			case 'unknown':
				return '? <i class="mute">' + item.value + '</i>';
			default:
				break;
		}
		return item.value;
	},

	show: function()
	{
		var index = stack.a.length;
		if (index == 0)
		{
			js('#stack').clear().html('<div class="stack"><div class="index">0</div><div class="ml-0 mute small">-</div><div class="content">&#x1f9f9;</div></div>');
			return true;
		}
		js('#stack').clear();
		stack.a.forEach(function(item)
			{
				js('#stack').append(
					js.template(''
						+ '<div class="stack">'
						+ '<div class="index">{INDEX}</div>'
						+ '<div class="ml-0 mute small">{TYPE}</div>'
						+ '<div class="content">{CONTENT}</div>'
						+ '</div>'
						+ '').render({
							index: index,
							type: item.type,
							content: helper.format(item)
						}));
				index -= 1;
				return true;
			});
		var element = js('#stack').filter('.stack').eq(':last').element();
		// element.scrollIntoView(false);
		element.scrollIntoView({behavior: "auto", block: "nearest", inline: "start"});
		return true;
	}
};


var main = {
	vars: {
		mouse: {x: 0, y: 0, down: false, busy: false}
	},

	controls: {
		command: function(event)
		{
			event.preventDefault();
			var command = js('#command').value();

			js('#command').value('');

			if (command.length == 0)
			{
				if (stack.a.length == 0)
				{
					return false;
				}
				command = 'dup';
			}

			helper.history.add(command);

			try
			{
				interpreter.run(tokenizer.run(command));
			}
			catch (e)
			{
				error.render(e);
			}
			finally
			{
				helper.show();
			}
			return false;
		},

		angle: function(event)
		{
			switch (js('#angle').value())
			{
				case 'deg':
					options.angle_mode = ANGLE_DEG;
					break;
				case 'rad':
					options.angle_mode = ANGLE_RAD;
					break;
				case 'grad':
					options.angle_mode = ANGLE_GRAD;
					break;
				default:
					options.angle_mode = ANGLE_DEG;
					break;
			}
			return true;
		},

		precision: function(event)
		{
			var i = parseInt(js('#precision').value());
			if (i < PRECISION_MIN || i > PRECISION_MAX)
			{
				i = PRECISION_DEFAULT;
			}
			options.precision = i;
			helper.show();
			return true;
		},

		reset: function(event)
		{
			plot.reset();
			return true;
		},

		key: {
			down: function(event)
			{
				switch (event.code)
				{
					case 'ArrowUp':
					case 'ArrowDown':
						break;
					default:
						return true;
				}
				event.preventDefault();
				switch (event.code)
				{
					case 'ArrowUp':
						js('#command').value(helper.history.up(js('#command').value()));
						break;
					case 'ArrowDown':
						if (helper.history.current < helper.history.lines.length)
						{
							js('#command').value(helper.history.down(js('#command').value()));
						}
						break;
					default:
						return true;
				}
				return false;
			}
		},

		mouse: {
			wheel: function(event)
			{
				event.preventDefault();
				if (plot.current.type != null && plot.current.expression != null)
				{
					plot.wheel(event.offsetX, event.offsetY, Math.sign(event.deltaY));
				}
				return false;
			},
			right: function(event)
			{
				event.preventDefault();
				return false;
			},
			down: function(event)
			{
				main.vars.mouse.x = event.offsetX;
				main.vars.mouse.y = event.offsetY;
				main.vars.mouse.down = true;
				main.vars.mouse.button = event.button;
				return true;
			},
			move: function(event)
			{
				if (main.vars.mouse.busy)
				{
					return true;
				}
				if (!main.vars.mouse.down)
				{
					return true;
				}
				if (plot.current.type != null && plot.current.expression != null)
				{
					main.vars.mouse.busy = true;
					if (main.vars.mouse.button == 0)
					{
						plot.slide(event.offsetX - main.vars.mouse.x, event.offsetY - main.vars.mouse.y, true);
					}
					else
					{
						plot.glide(event.offsetX - main.vars.mouse.x, event.offsetY - main.vars.mouse.y, true);
					}
					main.vars.mouse.busy = false;
				}
				main.vars.mouse.x = event.offsetX;
				main.vars.mouse.y = event.offsetY;
				return true;
			},
			up: function(event)
			{
				main.vars.mouse.down = false;
				if (plot.current.type == 'xy' && plot.current.expression != null)
				{
					plot.slide(0, 0, false);
				}
				return true;
			}
		}
	},

	interface: {
		init: function()
		{
			js('#form').event('submit', main.controls.command);
			js('#angle').event('change', main.controls.angle);
			js('#precision').event('change', main.controls.precision);
			js('#reset').event('click', main.controls.reset);
			js('#command').focus();
			js('#command').event('keydown', main.controls.key.down);

			js('canvas').event('wheel', main.controls.mouse.wheel);
			js('canvas').event('mousedown', main.controls.mouse.down);
			js('canvas').event('mousemove', main.controls.mouse.move);
			js('canvas').event('mouseup', main.controls.mouse.up);
			js('canvas').event('contextmenu', main.controls.mouse.right);

			js('.nosubmit').event('submit', false);

			stack.a = [];
			stack.a.length = 0;

			switch (options.angle_mode)
			{
				case ANGLE_DEG:
					js('#angle').value('deg');
					break;
				case ANGLE_RAD:
					js('#angle').value('rad');
					break;
				case ANGLE_GRAD:
					js('#angle').value('grad');
					break;
				default:
					options.angle_mode = ANGLE_DEG;
					js('#angle').value('deg');
					break;
			}

			if (options.precision < PRECISION_MIN || options.precision > PRECISION_MAX)
			{
				options.precision = PRECISION_DEFAULT;
			}
			for (var i = PRECISION_MIN; i <= PRECISION_MAX; i += 1)
			{
				js('#precision').append('<option value="' + i + '">&#x1f4c9; ' + i + '</option>');
			}
			js('#precision').value(options.precision);

			js('#errors').value('subtle');

			js('#hint').clear();
			js('#misc').clear();

			if ('serviceWorker' in navigator)
			{
				navigator.serviceWorker.register('/rpncalc/worker.js').then(function(registration)
					{
						console.log('Worker registered', registration.scope);
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


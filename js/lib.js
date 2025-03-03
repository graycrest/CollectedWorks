
var js = function(reference)
{
	var self = {};
	switch (typeof reference)
	{
		case 'string':
			var result = null;
			try {
				result = document.querySelectorAll(reference);
			}
			catch (error)
			{
				// console.error(error.name);
				// console.error(error.message);
			}
			if (result && result.length)
			{
				reference = result;
			}
			else if (/\<[^<]+\>/.test(reference))
			{
				reference = js.toDOM(reference);
			}
			else
			{
				reference = [];
			}
			break;
		default:
			if (reference.length || reference.length === 0)
			{
				if (reference.nodeType && reference.nodeType == 1)
				{
					reference = [reference];
				}
				break;
			}
			reference = [reference];
			break;
	}

	self.event = function()
	{
		var type = null;
		var filter = null;
		var callback = null;
		switch (arguments.length)
		{
			case 2:
				type = arguments[0];
				callback = arguments[1];
				break;
			case 3:
				type = arguments[0];
				filter = arguments[1];
				callback = arguments[2];
				break;
			default:
				return false;
		}
		reference.forEach(function(element)
		{
			// element.removeEventListener(type, js.callbacks.events.bind(null, filter, callback));
			element.addEventListener(type, js.callbacks.events.bind(null, filter, callback));
		});
		return self;
	};

	self.trigger = function(which)
	{
		var send = null;
		var options = {
			bubbles: true,
   			cancelable: true,
   			view: window
		};
		switch (which)
		{
			case 'click':
				send = new MouseEvent('click', options);
				break;
			default:
				send = new Event(which, options);
				break;
		}
		reference.forEach(function(element)
			{
				element.dispatchEvent(send);
			});
		return true;
	};

	self.each = function(callback)
	{
		reference.forEach(function(element)
			{
				callback(element);
			});
		return self;
	};

	self.eq = function(index)
	{
		var result = [];
		switch (index)
		{
			case ':first':
				result.push(reference[0]);
				break;
			case ':last':
				result.push(reference[reference.length - 1]);
				break;
			default:
				for (var i = 0; i < reference.length; i += 1)
				{
					if (i == index)
					{
						result.push(reference[i]);
					}
				}
				break;
		}
		reference = result;
		return self;
	};

	self.filter = function(selector)
	{
		var result = [];
		reference.forEach(function(element)
			{
				try {
					var q = element.querySelectorAll(selector);
				}
				catch (error)
				{
					return false;
				}
				return q && q.length && typeof q.forEach(function(t)
					{
						result.push(t);
						return true;
					}) == 'undefined';
			});
		reference = result;
		return self;
	};
	self.parents = function(selector)
	{
		var result = [];
		reference.forEach(function(element)
			{
				try {
					var t = element.closest(selector);
				}
				catch (error)
				{
					return false;
				}
				if (t)
				{
					result.push(t);
				}
				return true;
			});
		reference = result;
		return self;
	};

	self.element = function()
	{
		if (reference.length > 1)
		{
			return reference;
		}
		var result = null;
		reference.forEach(function(element)
			{
				result = element;
			});
		return result;
	};

	self.focus = function()
	{
		reference.forEach(function(element)
			{
				element.focus();
			});
		return self;
	};

	self.value = function()
	{
		switch (arguments.length)
		{
			case 0:
				var result = null;
				reference.forEach(function(element)
				{
					switch (element.tagName)
					{
						case 'INPUT':
							switch (element.type)
							{
								case 'checkbox':
								case 'radio':
									result = element.checked;
									break;
								default:
									result = element.value;
									break;
							}
							break;
						default:
							result = element.value;
							break;
					}
				});
				return result;
			case 1:
				var value = arguments[0];
				reference.forEach(function(element)
				{
					switch (element.tagName)
					{
						case 'INPUT':
							switch (element.type)
							{
								case 'checkbox':
								case 'radio':
									element.checked = value;
									break;
								default:
									element.value = value;
									break;
							}
							break;
						default:
							element.value = value;
							break;
					}
				});
				break;
			default:
				break;
		}
		return self;
	};

	self.clear = function()
	{
		switch (arguments.length)
		{
			case 1:
				switch (arguments[0])
				{
					case ':first':
						reference.forEach(function(element)
						{
							element.removeChild(element.firstChild);
						});
						break;
					case ':last':
						reference.forEach(function(element)
						{
							element.removeChild(element.lastChild);
						});
						break;
					default:
						break;
				}
				break;
			default:
				reference.forEach(function(element)
				{
					while (element.firstChild)
					{
						element.removeChild(element.firstChild);
					}
				});
				break;
		}
		return self;
	};

	self.html = function(what)
	{
		switch (arguments.length)
		{
			case 0:
				var result = null;
				reference.forEach(function(element)
				{
					result = element.innerHTML;
				});
				return result;
			case 1:
				reference.forEach(function(element)
				{
					element.innerHTML = what;
				});
				break;
			default:
				break;
		}
		return self;
	};
	self.text = function()
	{
		switch (arguments.length)
		{
			case 0:
				var result = null;
				reference.forEach(function(element)
				{
					result = element.innerText;
				});
				return result;
			case 1:
				var what = arguments[0];
				reference.forEach(function(element)
				{
					element.innerText = what;
				});
				break;
			default:
				break;
		}
		return self;
	};

	self.append = function(what)
	{
		reference.forEach(function(element)
		{
			switch (typeof what)
			{
				case 'string':
					var list = js.toDOM(what);
					for (var i = 0; i < list.length; i += 1)
					{
						element.appendChild(list[i]);
					}
					break;
				default:
					element.appendChild(what);
					break;
			}
		});
		return self;
	};
	self.prepend = function(what)
	{
		reference.forEach(function(element)
		{
			switch (typeof what)
			{
				case 'string':
					var list = js.toDOM(what);
					for (var i = 0; i < list.length; i += 1)
					{
						element.insertBefore(list[i], element.firstChild);
					}
					break;
				default:
					element.insertBefore(what, element.firstChild);
					break;
			}
		});
		return self;
	};

	self.wrap = function(what)
	{
		reference.forEach(function(element)
		{
			switch (typeof what)
			{
				case 'string':
					var list = js.toDOM(what);
					for (var i = 0; i < list.length; i += 1)
					{
						element.parentNode.insertBefore(list[i], element);
						list[i].appendChild(element);
					}
					break;
				default:
					element.parentNode.insertBefore(what, element);
					what.appendChild(element);
					break;
			}
		});
		return self;
	};

	self.before = function(what)
	{
		reference.forEach(function(element)
		{
			switch (typeof what)
			{
				case 'string':
					var list = js.toDOM(what);
					for (var i = 0; i < list.length; i += 1)
					{
						element.before(list[i]);
					}
					break;
				default:
					element.before(what);
					break;
			}
		});
		return self;
	};
	self.after = function(what)
	{
		reference.forEach(function(element)
		{
			switch (typeof what)
			{
				case 'string':
					var list = js.toDOM(what);
					for (var i = 0; i < list.length; i += 1)
					{
						element.after(list[i]);
					}
					break;
				default:
					element.after(what);
					break;
			}
		});
		return self;
	};

	self.appendTo = function(where)
	{
		reference.forEach(function(element)
			{
				return js(where).append(element);
			});
		return self;
	};
	self.prependTo = function(where)
	{
		reference.forEach(function(element)
			{
				return js(where).prepend(element);
			});
		return self;
	};
	self.beforeTo = function(where)
	{
		reference.forEach(function(element)
			{
				return js(where).before(element);
			});
		return self;
	};
	self.afterTo = function(where)
	{
		reference.forEach(function(element)
			{
				return js(where).after(element);
			});
		return self;
	};

	self.remove = function(callback)
	{
		reference.forEach(function(element)
			{
				element.remove();
			});
		return self;
	};

	self.data = function()
	{
		switch (arguments.length)
		{
			case 1:
				var key = 'data-' + arguments[0];
				var result = null;
				reference.forEach(function(element)
				{
					result = element.getAttribute(key);
				});
				return result;
			case 2:
				var key = 'data-' + arguments[0];
				var value = arguments[1];
				reference.forEach(function(element)
				{
					element.setAttribute(key, value);
				});
				break;
			default:
				break;
		}
		return self;
	};

	self.css = function(styles)
	{
		switch (arguments.length)
		{
			case 0:
				var result = null;
				reference.forEach(function(element)
					{
						result = element.style.cssText;
					});
				return result;
			case 1:
				switch (typeof styles)
				{
					case 'string':
						reference.forEach(function(element)
							{
								element.style.cssText = styles;
							});
						break;
					case 'object':
						reference.forEach(function(element)
							{
								for (var i in styles)
								{
									if (styles[i] == null)
									{
										element.style.removeProperty(i);
									}
									else
									{
										element.style.setProperty(i, styles[i]); // element.style[i] = styles[i];
									}
								}
							});
						break;
					default:
						break;
				}
				break;
			case 2:
				var property = arguments[0];
				var value = arguments[1];
				reference.forEach(function(element)
					{
						if (value == null)
						{
							element.style.removeProperty(property);
						}
						else
						{
							element.style.setProperty(property, value);
						}
					});
				break;
			default:
				break;
		}
		return self;
	};

	self.attribute = function(which)
	{
		this.get = function()
		{
			var result = null;
			reference.forEach(function(element)
			{
				result = element.getAttribute(which);
			});
			return result;
		};
		this.set = function(value)
		{
			reference.forEach(function(element)
			{
				switch (which)
				{
					case 'disabled':
						if (value)
						{
							element.setAttribute(which, 'disabled');
						}
						else
						{
							// element.setAttribute(which, false);
							element.removeAttribute(which);
						}
						break;
					default:
						element.setAttribute(which, value);
						break;
				}
			});
			return self;
		};
		this.add = function(value)
		{
			reference.forEach(function(element)
			{
				switch (which)
				{
					case 'disabled':
						if (value)
						{
							element.setAttribute(which, 'disabled');
						}
						else
						{
							element.setAttribute(which, false); // Hm... should probably not happen. Remove instead?
						}
						break;
					default:
						element.setAttribute(which, value);
						break;
				}
			});
			return self;
		};
		this.remove = function()
		{
			reference.forEach(function(element)
			{
				element.removeAttribute(which);
			});
			return self;
		};
		this.toggle = function(value)
		{
			reference.forEach(function(element)
			{
				if (element.hasAttribute(which))
				{
					element.removeAttribute(which);
				}
				else
				{
					switch (which)
					{
						case 'disabled':
							if (value)
							{
								element.setAttribute(which, 'disabled');
							}
							else
							{
								element.removeAttribute(which);
							}
							break;
						default:
							element.setAttribute(which, value);
							break;
					}
				}
			});
			return self;
		};
		this.exists = function()
		{
			var result = false;
			reference.forEach(function(element)
			{
				if (element.hasAttribute(which))
				{
					result = true;
				}
			});
			return result;
		};
		return self;
	};

	self.class = function(which)
	{
		this.add = function()
		{
			reference.forEach(function(element)
			{
				if (typeof which == 'string')
				{
					element.classList.add(which);
				}
				else if (typeof which == 'object')
				{
					element.classList.add(...which);
				}
			});
			return self;
		};
		this.remove = function()
		{
			reference.forEach(function(element)
			{
				if (typeof which == 'string')
				{
					element.classList.remove(which);
				}
				else if (typeof which == 'object')
				{
					element.classList.remove(...which);
				}
			});
			return self;
		};
		this.toggle = function()
		{
			reference.forEach(function(element)
			{
				element.classList.toggle(which);
			});
			return self;
		};
		this.exists = function()
		{
			var result = false;
			reference.forEach(function(element)
			{
				if (element.classList.contains(which))
				{
					result = true;
				}
			});
			return result;
		};
		return self;
	};
	return self;
};

js.callbacks = {
	ajax: function()
	{
		return true;
	},
	events: function(filter, callback, event)
	{
		if (callback === true)
		{
			return true;
		}
		if (callback === false)
		{
			event.preventDefault();
			return false;
		}
		event.element = event.target;
		if (filter)
		{
			event.element = event.target.closest(filter);
			if (event.element === null)
			{
				return true;
			}
		}
		var rect = event.element.getBoundingClientRect();
		event.coords = {x: null, y: null};
		if (rect.left && rect.top)
		{
			event.coords = {x: event.clientX - rect.left, y: event.clientY - rect.top, rect: rect};
		}
		return callback(event);
	}
};

js.toDOM = function(html)
{
	var d = document.createElement('tbody');
	d.innerHTML = html.trim();
	return Array.from(d.childNodes);
};

js.uniqueID = function()
{
	if (!js.uniqueID.id)
	{
		js.uniqueID.id = 0;
	}
	js.uniqueID.id += 1;
	return '_js_ref_' + js.uniqueID.id;
};

js.template = function(html)
{
	var self = [];
	self.render = function(data)
	{
		for (var i in data)
		{
			html = html.replaceAll('{' + i.toUpperCase() + '}', data[i]);
		}
		return html;
	};
	return self;
};

js.humanReadable = function(n)
{
	if (n == 0)
	{
		return '&lt;empty&gt;';
	}
	if (n == 1)
	{
		return '1byte';
	}
	if (n < 1024)
	{
		return n + 'bytes';
	}
	if (n < 1024 * 1024) {
		return (n / (1024)).toFixed(2) + 'K';
	}
	if (n < 1024 * 1024 * 1024)
	{
		return (n / (1024 * 1024)).toFixed(2) + 'M';
	}
	return (n / (1024 * 1024 * 1024)).toFixed(2) + 'G';
};

js.tableSorter = function(reference, options)
{
	js(reference)
		.data('cellIndex', 0)
		.data('asc', true)
		.filter('thead').event('click', 'th', (function click(options, event)
			{
				let cellIndex = event.element.cellIndex;

				if (options[cellIndex] === false)
				{
					return true;
				}

				let table = js(event.element).parents('table').element();
				let tbody = js(event.element).parents('table').filter('tbody').element();

				let asc = js(table).data('asc');
				if (cellIndex == js(table).data('cellIndex'))
				{
					asc = asc == 'true' ? false : true;
				}
				else
				{
					asc = true;
				}

				js(table).data('cellIndex', cellIndex);
				js(table).data('asc', asc);

				Array.from(js(tbody).filter('tr').element()).sort(function(tr1, tr2)
					{
						let a = 0;
						let b = 0;
						if (typeof options[cellIndex] == 'string')
						{
							a = js(tr1).filter('td').eq(cellIndex).data(options[cellIndex]);
							b = js(tr2).filter('td').eq(cellIndex).data(options[cellIndex]);
						}
						else
						{
							a = js(tr1).filter('td').eq(cellIndex).text();
							b = js(tr2).filter('td').eq(cellIndex).text();
						}

						if (!isNaN(parseFloat(a)) && a == parseFloat(a))
						{
							a = parseFloat(a);
						}
						else if (!isNaN(parseInt(a)) && a == parseInt(a))
						{
							a = parseInt(a);
						}
						else
						{
							a = a.toLowerCase();
						}

						if (!isNaN(parseFloat(b)) && b == parseFloat(b))
						{
							b = parseFloat(b);
						}
						else if (!isNaN(parseInt(b)) && b == parseInt(b))
						{
							b = parseInt(b);
						}
						else
						{
							b = b.toLowerCase();
						}

						if (typeof a != typeof b)
						{
							if (typeof a != 'string')
							{
								a = a.toString();
							}
							if (typeof b != 'string')
							{
								b = b.toString();
							}
						}

						if (a < b)
						{
							return asc ? -1 : 1;
						}
						if (a > b)
						{
							return asc ? 1 : -1;
						}
						return 0;
					}).forEach(function(tr)
						{
							return js(tbody).append(tr);
						});

				return true;
			}).bind(null, options));

	return true;
};

js.storage = function(app)
{
	var self = {};

	self.init = function()
	{
		if (!window.localStorage)
		{
			return false;
		}
		var stored = JSON.parse(window.localStorage.getItem(app));
		if (stored == null)
		{
			stored = {};
		}
		switch (arguments.length)
		{
			case 1:
				for (var i in arguments[0])
				{
					if (typeof stored[i] == 'undefined')
					{
						stored[i] = arguments[0][i];
					}
				}
				window.localStorage.setItem(app, JSON.stringify(stored));
				break;
			default:
				break;
		}
		return true;
	};

	self.get = function()
	{
		if (!window.localStorage)
		{
			return false;
		}
		var stored = JSON.parse(window.localStorage.getItem(app));
		switch (arguments.length)
		{
			case 0:
				return stored;
			case 1:
				return stored == null ? null : stored[arguments[0]];
			default:
				break;
		}
		return null;
	};

	self.set = function()
	{
		if (!window.localStorage)
		{
			return false;
		}
		var stored = JSON.parse(window.localStorage.getItem(app));
		if (stored == null)
		{
			stored = {};
		}
		switch (arguments.length)
		{
			case 1:
				for (var i in arguments[0])
				{
					stored[i] = arguments[0][i];
				}
				break;
			case 2:
				stored[arguments[0]] = arguments[1];
				break;
			default:
				return false;
		};
		window.localStorage.setItem(app, JSON.stringify(stored));
		return true;
	};

	self.remove = function()
	{
		if (!window.localStorage)
		{
			return false;
		}
		switch (arguments.length)
		{
			case 0:
				window.localStorage.removeItem(app);
				break;
			case 1:
				var stored = JSON.parse(window.localStorage.getItem(app));
				if (stored && stored[arguments[0]])
				{
					delete stored[arguments[0]];
					window.localStorage.setItem(app, JSON.stringify(stored));
				}
				break;
			default:
				break;
		}
		return true;
	};

	return self;
};

js.autocomplete = (function()
	{
		var initialized = false;

		function callback(data, event)
		{
			js(data.id).parents('[class="autocomplete"]').filter('ul').remove();

			var content = js(data.id).value();
			if (content.length < data.options.minSize)
			{
				js('#hint').html('&nbsp;');
				return true;
			}

			Promise.resolve(data.callback(content)).then(function(items)
				{
					var html = '<ul>';
					items.forEach(function(suggestions, index)
						{
							if (index < data.options.maxSuggestions)
							{
								html += js.template('<li data-suggestion="{SUGGESTION}" data-index="{INDEX}">{SHOW}</li>').render(
									{
										suggestion: suggestions.suggestion,
										index: index,
										show: suggestions.show
									});
							}
							return true;
						});
					html += '</ul>';

					js(data.id).parents('[class="autocomplete"]').append(html).event('click', 'li', function(event)
						{
							var suggestion = js(event.element).data('suggestion');
							if (suggestion && suggestion.length)
							{
								js(data.id).value(suggestion).focus();
								data.selected = parseInt(js(event.element).data('index'));
								js(event.element).parents('ul').filter('li').class('current').remove().eq(data.selected).class('current').add();
							}
							return true;
						});
				});

			return true;
		};

		function keyup(data, event)
		{
			var li = js(data.id).parents('[class="autocomplete"]').filter('ul').filter('li');

			var list = li.element();
			if (!list)
			{
				return true;
			}

			var L = list.length ? list.length - 1 : 0;

			var suggestion = null;
			switch (event.key)
			{
				case 'ArrowUp':
					if (data.selected == null)
					{
						data.selected = L;
					}
					else
					{
						data.selected -= 1;
						if (data.selected < 0)
						{
							data.selected = L;
						}
					}
					suggestion = li.eq(data.selected).data('suggestion');
					break;

				case 'ArrowDown':
					if (data.selected == null)
					{
						data.selected = 0;
					}
					else
					{
						data.selected += 1;
						if (data.selected > L)
						{
							data.selected = 0;
						}
					}
					suggestion = li.eq(data.selected).data('suggestion');
					break;

				default:
					break;
			}

			if (suggestion)
			{
				js(data.id).parents('[class="autocomplete"]').filter('ul').filter('li').class('current').remove().eq(data.selected).class('current').add().element().scrollIntoView({behavior: "auto", block: "nearest", inline: "start"});
				js(data.id).value(suggestion);
				return false;
			}

			return true;
		};

		return function()
		{
			var OK = true;

			var params = {
				id: null,
				callback: null,
				selected: null,
				options: {
					minSize: 1,
					maxSuggestions: 10
				}
			}

			switch (arguments.length)
			{
				case 2:
				case 3:
					for (var i = 0; i < arguments.length; i += 1)
					{
						switch (typeof arguments[i])
						{
							case 'string':
								params.id = arguments[i];
								break;

							case 'object':
								for (var j in arguments[i])
								{
									params.options[j] = arguments[i][j];
								}
								break;

							case 'function':
								params.callback = arguments[i];
								break;

							default:
								console.log('Unrecognized parameter', arguments[i]);
								break;
						}
					}
					break;

				default:
					OK = false;
					break;
			}
			if (params.id == null || params.callback == null)
			{
				OK = false;
			}

			if (!OK)
			{
				console.log('autocomplete(<reference>, [<options>], <callback>)');
				return false;
			}

			js(params.id).event('input', callback.bind(null, params));
			js(params.id).event('keyup', keyup.bind(null, params));

			if (!initialized)
			{
				initialized = true;
				js('html').event('click', function(event)
					{
						js('[class="autocomplete"]').filter('ul').remove();
						return true;
					});
			}

			return true;
		};
	})();

js.main = {
	vars: {
		setup: false,
	},

	features: {
		spoiler: function(element)
		{
			js(element).filter('header').eq(':first').each(function(header)
				{
					js('<div class="spoiler-header"></div>')
						.append(js(header).html())
						.beforeTo(element)
						.event('click', '.spoiler-header', (function(content, event)
							{
								js(content).class('hidden').toggle();
								return true;
							}).bind(null, element)
						);
					js(header).remove();
					return true;
				});
			js(element).class('hidden').add();
			return true;
		},

		tabs: function(element)
		{
			var tabs = [];
			var headers = [];
			js(element).filter('.tab').each(function(tab)
				{
					js(tab).filter('header').eq(':first').each(function(header)
						{
							var id = js.uniqueID();
							headers.push('<span class="tabs-header" id="' + id + '">' + js(header).text() + '</span>');
							tabs.push({tab: tab, header: '#' + id, event: 'tab:' + js(header).text().replace(/\s/, '-').toLowerCase()});
							if (js(header).data('remove'))
							{
								js(header).remove();
							}
							return true;
						});
					return true;
				});
			js(element).prepend('<div>' + headers.join('') + '</div>');
			for (var i in tabs)
			{
				js(tabs[i].header).event('click', (function(tabs, index, event)
					{
						for (var i in tabs)
						{
							if (i == index)
							{
								js(tabs[index].tab).class('hidden').toggle();
								js(tabs[index].header).class('mute').toggle();
								js(tabs[index].tab).trigger(tabs[index].event);
							}
							else
							{
								js(tabs[i].tab).class('hidden').add();
								js(tabs[i].header).class('mute').add();
							}
						}
						return true;
					}).bind(null, tabs, i)
				);
				js(tabs[i].tab).class('hidden').add();
				js(tabs[i].header).class('mute').add();
			}
			js(tabs[0].tab).class('hidden').remove();
			js(tabs[0].header).class('mute').remove();
			return true;
		},

		tabs_vertical: function(element)
		{
			var tabs = [];
			var index = 0;
			js(element).filter('.tab').each(function(tab)
				{
					js(tab).filter('header').eq(':first').each(function(header)
						{
							js('<div class="tabs-header mute">' + js(header).text() + '</div>').beforeTo(tab).event('click', '.tabs-header', (function(tabs, index, event)
									{
										for (var i in tabs)
										{
											if (i == index)
											{
												js(tabs[index].tab).class('hidden').toggle();
												js(tabs[index].header).class('mute').toggle();
											}
											else
											{
												js(tabs[i].tab).class('hidden').add();
												js(tabs[i].header).class('mute').add();
											}
										}
										return true;
									}).bind(null, tabs, index)
								);
							tabs[index] = {tab: tab, header: header};
							index += 1;
							if (js(header).data('remove'))
							{
								js(header).remove();
							}
							return true;
						});
					js(tab).class('hidden').add();
					return true;
				});
			js(tabs[0].tab).class('hidden').remove();
			js(tabs[0].header).class('mute').remove();
			return true;
		},

		code: function(element)
		{
			var t = js(element).text();
			t = t.replace(/([\[\]{}()])/ig, '<b class="t_darkblue">$1</b>');
			t = t.replace(/([+-]?(\d+)?\.\d+(e\d+)?|[+-]?\d+)/ig, '<span class="t_red">$1</span>');
			t = t.replace(/\b(await|break|case|catch|class(?!=)|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|super|switch|static|this|throw|try|true|typeof|var|void|while|with|yield)\b/ig, '<b>$1</b>');
			js(element).html(t);
			return true;
		}
	},

	init: function() // Bonus stuffs and other problems
	{
		js('.spoiler').each(function(element)
			{
				return js.main.features.spoiler(element);
			});
		js('.tabs').each(function(element)
			{
				return js.main.features.tabs(element);
			});
		js('.tabs-vertical').each(function(element)
			{
				return js.main.features.tabs_vertical(element);
			});
		js('code').each(function(element)
			{
				return js.main.features.code(element);
			});
		js('#logout').parents('form').event('submit', function(event)
			{
				event.preventDefault();
				let m = window.location.pathname.match(/\/([^/]+)/);
				m && m[1] && fetch('/' + m[1] + '/ajax/logout.js',
					{
						method: 'POST',
						mode: 'same-origin',
						cache: 'no-cache',
						credentials: 'same-origin',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify('')
					})
					.then(function(response)
						{
							return response.json();
						})
					.then(function(result)
						{
							switch (result.status)
							{
								case 'OK':
									window.location.reload(true);
									break;
								default:
									js('#hint').text(result.description);
									break;
							}
							return true;
						});
				return false;
			});
		return true;
	},

	interface: {
		init: function()
		{
			if (js.main.vars.setup)
			{
				return true;
			}
			js.main.vars.setup = true;

			js.main.init();

			if (typeof main != 'undefined' && main.interface && main.interface.init)
			{
				main.interface.init();
			}
			return true;
		}
	}
};
switch (document.readyState)
{
	case 'loading':
	case 'interactive':
		document.addEventListener('DOMContentLoaded', js.main.interface.init);
		break;
	case 'complete':
	default:
		js.main.interface.init();
		break;
}


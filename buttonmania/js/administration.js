
var main = {
	interface: {
		init: function()
		{
			js('#buttonmania').event('change', function(event)
				{
					js('#hint').clear().html('&nbsp;');
					js('#submit').attribute('disabled').set(!js('#buttonmania').value());
					return true;
				});

			js('form').event('submit', function(event)
				{
					event.preventDefault();
					var done = [];
					if (js('#buttonmania').value())
					{
						js.storage('buttonmania').remove();
						done.push('Highscores cleared');
					}
					js('#hint').html(done.join('<br />'));
					js('#buttonmania').value(false);
					return false;
				});

			return true;
		}
	}
};


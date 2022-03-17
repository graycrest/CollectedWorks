
var main = {
	interface: {
		init: function()
		{
			js('#pipes').event('change', function(event)
				{
					js('#hint').clear().html('&nbsp;');
					js('#submit').attribute('disabled').set(!js('#pipes').value());
					return true;
				});

			js('form').event('submit', function(event)
				{
					event.preventDefault();
					var done = [];
					if (js('#pipes').value())
					{
						js.storage('pipes').remove();
						done.push('Highscores cleared');
					}
					js('#hint').html(done.join('<br />'));
					js('#pipes').value(false);
					return false;
				});

			return true;
		}
	}
};


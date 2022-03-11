
var main = {
	interface: {
		init: function()
		{
			js('#slider').event('change', function(event)
				{
					js('#hint').clear().html('&nbsp;');
					js('#submit').attribute('disabled').set(!js('#slider').value());
					return true;
				});

			js('form').event('submit', function(event)
				{
					event.preventDefault();
					var done = [];
					if (js('#slider').value())
					{
						js.storage('slider').remove();
						done.push('Slider highscores cleared');
					}
					js('#hint').html(done.join('<br />'));
					js('#slider').value(false);
					return false;
				});

			return true;
		}
	}
};


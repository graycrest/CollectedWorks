
const version = 1;
const dev = false;

const cacheName = 'cache-v' + version;
const cacheList = [
	'../css/all.css',
	'../css/colors.css',
	'../css/emoji.css',
	'../css/lib.css',
	'../js/lib.js',
	'./help.html',
	'./index.html',
	'./manifest.json',
	'./worker.js',
	'./css/styles.css',
	'./icons/android-chrome-192x192.png',
	'./icons/android-chrome-512x512.png',
	'./icons/apple-touch-icon.png',
	'./icons/favicon-16x16.png',
	'./icons/favicon-32x32.png',
	'./icons/favicon.ico',
	'./icons/maskable_icon.png',
	'./images/rpncalc.png',
	'./js/index.js'
];


self.addEventListener('install', function(event)
	{
		if (dev)
		{
			console.log('Install - precaching');
		}
		event.waitUntil(caches.open(cacheName).then(function(cache)
			{
				/*
				for (var i = 0; i < cacheList.length; i += 1)
				{
					console.log(cacheList[i], cache.add(cacheList[i]));
				}
				return true;
				*/
				return cache.addAll(cacheList);
			}));
		return true;
	});


self.addEventListener('activate', function(event)
	{
		if (dev)
		{
			console.log('Activate');
		}
		return true;
	});


self.addEventListener('fetch', function(event)
	{
		if (dev)
		{
			console.log('Fetch', event.request.url);
		}
		event.respondWith(caches.match(event.request).then(function(found)
			{
				return found || fetch(event.request);
			}));
		return true;
	});



const STATE_INIT = 0;
const STATE_READY = 1;
const STATE_RUNNING = 2;
const STATE_END = 3;

const SPEED = 60.0 / 1000.0;

const FROM_WALL = 2;

var emoji = {
	angryface: String.fromCodePoint(0x1f621), // Angry face
	alien: String.fromCodePoint(0x1f47d), // Alien
	alienmonster: String.fromCodePoint(0x1f47e), // Alien monster

	bomb: String.fromCodePoint(0x1f4a3), // Bomb
	broccoli: String.fromCodePoint(0x1f966), // Broccoli

	collision: String.fromCodePoint(0x1f4a5), // Collision
	cryingcat: String.fromCodePoint(0x1f63f), // Crying cat

	donut: String.fromCodePoint(0x1f369), // Donut

	emptynest: String.fromCodePoint(0x1fab9), // Empty nest

	facewithhandovermouth: String.fromCodePoint(0x1fae2), // Face with hand over mouth
	fire: String.fromCodePoint(0x1f525), // Fire
	flushedface: String.fromCodePoint(0x1f633), // Flushed face

	ghost: String.fromCodePoint(0x1f47b), // Ghost

	icecube: String.fromCodePoint(0x1f9ca), // Ice cube

	mirror: String.fromCodePoint(0x1fa9e), // Mirror

	nestwitheggs: String.fromCodePoint(0x1faba), // Nest with eggs
	nuke: String.fromCodePoint(0x1f92f), // Exploding head

	octopus: String.fromCodePoint(0x1f419), // Octopus
	ogre: String.fromCodePoint(0x1f479), // Ogre

	peach: String.fromCodePoint(0x1f351), // Peach
	petridish: String.fromCodePoint(0x1f9eb), // Petri dish
	planet: String.fromCodePoint(0x1fa90), // Saturn

	rock: String.fromCodePoint(0x1faa8), // Rock

	safetyvest: String.fromCodePoint(0x1f9ba), // Safety vest
	skull: String.fromCodePoint(0x1f480), // Skull
	sleepingface: String.fromCodePoint(0x1f634), // Sleeping face
	smilingfacewithhorns: String.fromCodePoint(0x1f608), // Smiling face with horns
	soap: String.fromCodePoint(0x1f9fc), // Soap
	sparkles: String.fromCodePoint(0x2728), // Sparkles

	testtube: String.fromCodePoint(0x1f9ea), // Testtube

	ufo: String.fromCodePoint(0x1f6f8), // UFO

	windchime: String.fromCodePoint(0x1f390), // Wind chime

	zzz: String.fromCodePoint(0x1f4a4), // Zzz


	hp10: String.fromCodePoint(0x1f49a), // Green heart
	hp30: String.fromCodePoint(0x1f49d), // Heart with ribbon
	hp50: String.fromCodePoint(0x1f496), // Sparkling heart

	circles: {
		white: String.fromCodePoint(0x26aa),	// 0 White
		black: String.fromCodePoint(0x26ab),	// 1 Black
		red: String.fromCodePoint(0x1f534),		// 2 Red
		blue: String.fromCodePoint(0x1f535),	// 3 Blue
		orange: String.fromCodePoint(0x1f7e0),	// 4 Orange
		yellow: String.fromCodePoint(0x1f7e1),	// 5 Yellow
		green: String.fromCodePoint(0x1f7e2),	// 6 Green
		purple: String.fromCodePoint(0x1f7e3),	// 7 Purple
		brown: String.fromCodePoint(0x1f7e4),	// 8 Brown
	}
};


var stats = {};


var generator = {
	init: function()
	{
		generator.deaths = [];
		generator.deaths.length = 0;
		for (var i in settings.enemies)
		{
			generator.deaths[settings.enemies[i].type] = 0;
		}
		generator.seconds = 0;
		generator.boss = 0;
		generator.count = 0;
		generator.wave = 0;
		generator.accumulator = 0;
		return true;
	},

	new: function()
	{
		return generator.init();
	},

	time: function(seconds)
	{
		generator.seconds += 1;
		if ((generator.seconds % 3) == 0)
		{
			generator.call.enemy(settings.enemies.liner);
		}

		if (objects.bosses.length)
		{
			generator.boss = 0;
		}
		else
		{
			objects.player.forEach(function(player)
				{
					for (var i = 0; i < Math.min(player.level * 0.5, generator.accumulator); i += 1)
					{
						action.enemy(settings.enemies.liner);
					}
				});
			generator.accumulator = 0;
		}
		generator.boss += 1;
		if ((generator.boss % settings.bosses.timer) == 0)
		{
			generator.call.boss();
		}
		return true;
	},

	one: function()
	{
		generator.count += 1;
		if ((generator.count % 4) == 0)
		{
			generator.call.enemy(settings.enemies.liner);
		}
		if ((generator.count % 17) == 0)
		{
			generator.call.enemy(settings.enemies.liner);
		}
		if ((generator.count % 10) == 0)
		{
			generator.call.wave();
		}
		return true;
	},

	escalation: function()
	{
		objects.player.forEach(function(player)
			{
				if (player.level >= settings.escalation.level)
				{
					generator.call.enemy(settings.enemies.liner);
					settings.escalation.level += 3;
				}
				else if (Math.random() < settings.escalation.chance)
				{
					generator.call.enemy(settings.enemies.liner);
				}
				return true;
			});
		return true;
	},

	call: {
		enemy: function(data)
		{
			if (objects.bosses.length)
			{
				generator.accumulator += 1;
			}
			else
			{
				action.enemy(data);
			}
			return true;
		},

		wave: function()
		{
			if (objects.bosses.length)
			{
				generator.accumulator += 1;
			}
			else if (Math.random() < 0.6)
			{
				action.enemy(settings.enemies.liner);
				action.enemy(settings.enemies.liner);
				action.enemy(settings.enemies.liner);
			}
			else
			{
				action.wave();
			}
			return true;
		},

		boss: function()
		{
			if (!objects.bosses.length)
			{
				action.boss();
			}
			return true;
		}
	},

	death: {
		enemy: function(enemy) // death.enemy
		{
			switch (enemy.type)
			{
				case settings.enemies.liner.type:
					stats.liner += 1;
					js('#s_liner').text(stats.liner);
					break;

				case settings.enemies.corner.type:
					stats.corner += 1;
					js('#s_corner').text(stats.corner);
					break;

				case settings.enemies.center.type:
					stats.center += 1;
					js('#s_center').text(stats.center);
					break;

				case settings.enemies.follow.type:
					stats.follow += 1;
					js('#s_follow').text(stats.follow);
					break;

				default:
					break;
			}

			generator.one();

			generator.deaths[enemy.type] += 1;
			if (generator.deaths[enemy.type] < 3)
			{
				return true;
			}
			generator.deaths[enemy.type] = 0;

			if (enemy.type == settings.enemies.max)
			{
				generator.call.enemy(settings.enemies.liner);
				generator.call.enemy(settings.enemies.liner);

				generator.escalation();
				return true;
			}

			generator.call.enemy(settings.enemies.next[enemy.type]);
			return true;
		},

		wave: { // death.wave
			member: function()
			{
				stats.member += 1;
				js('#s_member').text(stats.member);

				generator.wave += 1;
				if (generator.wave >= 10)
				{
					generator.wave = 0;
					generator.one();
				}
				return true;
			},
			all: function()
			{
				stats.wave += 1;
				js('#s_wave').text(stats.wave);

				for (var i = 0; i < 4; i += 1)
				{
					generator.one();
				}
				generator.escalation();
				return true;
			}
		},

		boss: function() // death.boss
		{
			stats.boss += 1;
			js('#s_boss').text(stats.boss);

			objects.player.forEach(function(player)
				{
					for (var i = 0; i < 5 + player.level * 0.5; i += 1)
					{
						generator.one();
					}

					var list = [];

					for (var i = 0; i < settings.special.shield.max - player.special.shield.count; i += 1)
					{
						list.push(1);
					}
					for (var i = 0; i < settings.special.nuke.max - player.special.nuke.count; i += 1)
					{
						list.push(2);
					}

					list.sort(function(a, b)
						{
							return Math.random() - Math.random();
						});

					switch (list[0])
					{
						case 1:
							player.special.shield.count += 1;
							js('#shield').text(player.special.shield.count);
							game.flash.ok('#shield');
							break;

						case 2:
							player.special.nuke.count += 1;
							js('#nuke').text(player.special.nuke.count);
							game.flash.ok('#nuke');
							break;

						default:
							break;
					}
				});

			return true;
		}
	}
};


var help = {
	move: {
		player: function() // help.move.player player.move
		{
			var player = this;

			player.previousDirection = player.direction;
			player.direction = Math.atan2(player.mouse.y - player.y, player.mouse.x - player.x);

			var distance = Math.min(player.speed * player.boost * frameSpeed, help.distance(player, player.mouse))

			var x = player.x + Math.cos(player.direction) * distance;
			var y = player.y + Math.sin(player.direction) * distance;

			var collision = false;
			if (x - player.radius < 0 + FROM_WALL) // Left wall
			{
				player.x = player.radius + FROM_WALL;
				collision = true;
			}
			else if (x + player.radius >= canvas.width - FROM_WALL) // Right wall
			{
				player.x = canvas.width - player.radius - 1 - FROM_WALL;
				collision = true;
			}
			if (y - player.radius < 0 + FROM_WALL) // Top wall
			{
				player.y = player.radius + FROM_WALL;
				collision = true;
			}
			else if (y + player.radius >= canvas.height - FROM_WALL) // Bottom wall
			{
				player.y = canvas.height - player.radius - 1 - FROM_WALL;
				collision = true;
			}

			var moved = false;
			if (collision)
			{
			}
			else if (Math.abs(player.mouse.x - player.x) > 2 || Math.abs(player.mouse.y - player.y) > 2)
			{
				moved = true;
				player.x = x;
				player.y = y;
			}

			if (!moved)
			{
				player.direction = player.previousDirection + 1 * Math.PI / 180.0;
			}

			return true;
		},

		enemy: { // help.move.enemy enemy.move
			liner: function(player)
			{
				var enemy = this;

				enemy.x += Math.cos(enemy.direction) * enemy.speed * enemy.boost * frameSpeed;
				enemy.y += Math.sin(enemy.direction) * enemy.speed * enemy.boost * frameSpeed;

				if (help.collision(enemy, enemy.destination, enemy.radius))
				{
					enemy.active = false;
					stats.escaped += 1;
					js('#s_escaped').text(stats.escaped);
				}
				return true;
			},

			corner: function(player)
			{
				var enemy = this;

				enemy.angle = ((enemy.angle + enemy.rotate) % (Math.PI * 2));

				var x = Math.cos(enemy.angle) * Math.min(50, canvas.width * 0.1) + enemy.destination.x;
				var y = Math.sin(enemy.angle) * Math.min(50, canvas.height * 0.1) + enemy.destination.y;

				enemy.direction = Math.atan2(y - enemy.y, x - enemy.x);

				var distance = Math.min(help.distance(enemy, {x: x, y: y}), enemy.speed * enemy.boost * frameSpeed);

				enemy.x += Math.cos(enemy.direction) * distance;
				enemy.y += Math.sin(enemy.direction) * distance;

				return true;
			},

			center: function(player)
			{
				var enemy = this;

				enemy.angle = ((enemy.angle + enemy.rotate) % (Math.PI * 2));

				var x = Math.cos(enemy.angle) * Math.min(50, canvas.width * 0.1) + enemy.destination.x;
				var y = Math.sin(enemy.angle) * Math.min(50, canvas.height * 0.1) + enemy.destination.y;

				enemy.direction = Math.atan2(y - enemy.y, x - enemy.x);

				var distance = Math.min(help.distance(enemy, {x: x, y: y}), enemy.speed * enemy.boost * frameSpeed);

				enemy.x += Math.cos(enemy.direction) * distance;
				enemy.y += Math.sin(enemy.direction) * distance;

				return true;
			},

			follow: function(player)
			{
				var enemy = this;

				var x = enemy.x - player.x;
				var y = enemy.y - player.y;

				if (x * x + y * y > 100 * 100)
				{
					enemy.direction = Math.atan2(player.y - enemy.y, player.x - enemy.x);

					enemy.x += Math.cos(enemy.direction) * enemy.speed * enemy.boost * frameSpeed;
					enemy.y += Math.sin(enemy.direction) * enemy.speed * enemy.boost * frameSpeed;
				}
				return true;
			}
		},

		boss: { // help.move.boss boss.move
			epitrochoid: function(boss, player)
			{
				var R = 150;
				var r = 60;
				var d = 50;

				boss.a += Math.PI / 180.0;
				if (boss.a > 4 * Math.PI)
				{
					boss.a -= 4 * Math.PI;
				}

				var x = (R + r) * Math.cos(boss.a) - d * Math.cos((R + r) * boss.a / r);
				var y = (R + r) * Math.sin(boss.a) - d * Math.sin((R + r) * boss.a / r);

				boss.direction = Math.atan2(y + boss.center.y - boss.y, x + boss.center.x - boss.x);

				boss.x += Math.cos(boss.direction) * boss.speed * boss.boost * frameSpeed;
				boss.y += Math.sin(boss.direction) * boss.speed * boss.boost * frameSpeed;

				return true;
			},

			spiralthing: function(boss, player)
			{
				var R = 120;
				var r = 50;
				var d = 90;

				boss.a += Math.PI / 180.0;
				if (boss.a > 11 * Math.PI)
				{
					boss.a -= 11 * Math.PI;
				}

				var x = (R + r) * Math.cos(boss.a) - d * Math.cos((R + r) * boss.a / r);
				var y = (R + r) * Math.sin(boss.a) - d * Math.sin((R + r) * boss.a / r);

				boss.direction = Math.atan2(y + boss.center.y - boss.y, x + boss.center.x - boss.x);

				boss.x += Math.cos(boss.direction) * boss.speed * boss.boost * frameSpeed;
				boss.y += Math.sin(boss.direction) * boss.speed * boss.boost * frameSpeed;

				return true;
			},

			hypotrochoid: function(boss, player)
			{
				var R = 350;
				var r = 250;
				var d = 100;

				boss.a += Math.PI / 180.0;
				if (boss.a > 10 * Math.PI)
				{
					boss.a -= 10 * Math.PI;
				}

				var x = (R - r) * Math.cos(boss.a) + d * Math.cos((R - r) * boss.a / r);
				var y = (R - r) * Math.sin(boss.a) - d * Math.sin((R - r) * boss.a / r);

				boss.direction = Math.atan2(y + boss.center.y - boss.y, x + boss.center.x - boss.x);

				boss.x += Math.cos(boss.direction) * boss.speed * 0.5 * boss.boost * frameSpeed;
				boss.y += Math.sin(boss.direction) * boss.speed * 0.5 * boss.boost * frameSpeed;

				return true;
			}
		},

		member: function(wave) // help.move.member member.move
		{
			var member = this;

			member.path = ((member.path + 1) % wave.path.length);

			if (member.index == 0)
			{
				wave.direction = ((wave.direction + wave.rotate) % (Math.PI * 2));

				var x = Math.cos(wave.direction) * wave.distance + wave.destination.x;
				var y = Math.sin(wave.direction) * wave.distance + wave.destination.y;

				var d = Math.atan2(y - member.y, x - member.x);

				wave.path[member.path].x = member.x + Math.cos(d) * wave.speed * wave.boost * frameSpeed;
				wave.path[member.path].y = member.y + Math.sin(d) * wave.speed * wave.boost * frameSpeed;
			}

			member.x = wave.path[member.path].x;
			member.y = wave.path[member.path].y;

			return true;
		}
	},

	shoot: {
		player: { // help.shoot.player gun.shoot
			standard: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: player.direction,
					speed: gun.speed,
					damage: gun.damage
				});

				return true;
			},

			backwards: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: player.direction + (175 + 10 * Math.random()) * Math.PI / 180.0,
					speed: gun.speed,
					damage: gun.damage
				});

				return true;
			},

			leftorright: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = player.direction;
				if (Math.random() < 0.5)
				{
					d += (8 + 4 * Math.random()) * Math.PI / 180.0;
				}
				else
				{
					d -= (8 + 4 * Math.random()) * Math.PI / 180.0;
				}

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: d,
					speed: gun.speed,
					damage: gun.damage
				});

				return true;
			},

			chaos: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = player.direction;

				if (Math.random() < 0.5)
				{
					d += (6 + 3 * Math.random()) * Math.PI / 180.0;
				}
				else
				{
					d -= (6 + 3 * Math.random()) * Math.PI / 180.0;
				}

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: d,
					speed: gun.speed,
					damage: gun.damage
				});

				return true;
			},

			left: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: player.direction - (35 + 4 * Math.random()) * Math.PI / 180.0,
					speed: gun.speed,
					damage: gun.damage
				});

				return true;
			},

			right: function(player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				objects.add.bullet({
					x: player.x,
					y: player.y,
					emoji: gun.emoji,
					radius: gun.radius,
					direction: player.direction += (35 + 4 * Math.random()) * Math.PI / 180.0,
					speed: gun.speed,
					damage: gun.damage
				});
				return true;
			},

			satellite: function(player)
			{
				var gun = this;

				gun.direction += 2 * Math.PI / 180.0;

				var d = (360 / gun.satellite.count) * Math.PI / 180.0;

				var angle = 0;
				for (var i = 0; i < gun.satellite.count; i += 1)
				{
					canvas.emoji({
						x: player.x + gun.satellite.distance * Math.cos(gun.direction + angle),
						y: player.y + gun.satellite.distance * Math.sin(gun.direction + angle),
						emoji: gun.satellite.emoji,
						radius: gun.satellite.radius
					});
					angle += d;
				}

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = (360 / gun.satellite.count) * Math.PI / 180.0;

				var angle = 0;
				for (var i = 0; i < gun.satellite.count; i += 1)
				{
					objects.add.bullet({
						x: player.x + gun.satellite.distance * Math.cos(gun.direction + angle),
						y: player.y + gun.satellite.distance * Math.sin(gun.direction + angle),
						emoji: gun.emoji,
						radius: gun.radius,
						direction: player.direction,
						speed: gun.speed,
						damage: gun.damage
					});
					angle += d;
				}

				return true;
			}
		},

		enemy: { // help.shoot.enemy gun.shoot
			direct: function(enemy, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				action.shot({
					x: enemy.x,
					y: enemy.y,
					boss: false,
					direction: Math.atan2(player.y - enemy.y, player.x - enemy.x)
				}, gun);

				return true;
			},

			leftorright: function(enemy, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = Math.atan2(player.y - enemy.y, player.x - enemy.x);

				if (Math.random() < 0.5)
				{
					d += (8 + 4 * Math.random()) * Math.PI / 180.0;
				}
				else
				{
					d -= (8 + 4 * Math.random()) * Math.PI / 180.0;
				}

				action.shot({
					x: enemy.x,
					y: enemy.y,
					boss: false,
					direction: d
				}, gun);

				return true;
			}
		},

		boss: { // help.shoot.boss gun.shoot
			direct: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				action.shot({
					x: boss.x,
					y: boss.y,
					boss: true,
					direction: Math.atan2(player.y - boss.y, player.x - boss.x) + (4 - 8 * Math.random()) * Math.PI / 180.0,
				}, gun);

				return true;
			},

			frontal: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = Math.atan2(player.y - boss.y, player.x - boss.x);

				var a = 4.0 * Math.PI / 180.0;
				for (var i = 0; i < 3; i += 1)
				{
					action.shot({
						x: boss.x,
						y: boss.y,
						boss: true,
						direction: d + a,
					}, gun);
					action.shot({
						x: boss.x,
						y: boss.y,
						boss: true,
						direction: d - a,
					}, gun);
					a += 8.0 * Math.PI / 180.0;
				}

				return true;
			},

			circularpulse: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var d = Math.atan2(player.y - boss.y, player.x - boss.x);

				var a = 0;
				for (var i = 0; i < 360; i += 20)
				{
					action.shot({
						x: boss.x + boss.radius * Math.cos(d + a) * 0.3,
						y: boss.y + boss.radius * Math.sin(d + a) * 0.3,
						boss: true,
						direction: d + a,
					}, gun);
					a += 20 * Math.PI / 180.0;
				}
			
				return true;
			},

			spiral: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				if (gun.spiral == 0)
				{
					gun.direction = Math.atan2(player.y - boss.y, player.x - boss.x);
					gun.angle = 0;
				}
				gun.spiral = ((gun.spiral + 1) % gun.list.length);

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				action.shot({
					x: boss.x,
					y: boss.y,
					boss: true,
					direction: gun.direction + gun.angle,
				}, gun);
				
				gun.angle += (360.0 / gun.list.length) * Math.PI / 180.0;
			
				return true;
			},
			
			walls: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				var ox = boss.x + Math.cos(gun.angle) * boss.radius;
				var oy = boss.y + Math.sin(gun.angle) * boss.radius;
				var a = 3.5 * Math.PI / 180.0;
				for (var i = 0; i < 4; i += 1)
				{
					action.shot({
						x: ox,
						y: oy,
						boss: true,
						direction: gun.angle + a,
					}, gun);
					action.shot({
						x: ox,
						y: oy,
						boss: true,
						direction: gun.angle - a,
					}, gun);
					a += 7.0 * Math.PI / 180.0;
				}

				gun.angle += 100 * Math.PI / 180.0;
			
				return true;
			},

			mesh: function(boss, player)
			{
				var gun = this;

				gun.count += frameSpeed;
				if (gun.count < gun.frames)
				{
					return true;
				}
				gun.count = 0;

				gun.current = ((gun.current + 1) % gun.list.length);
				gun.frames = gun.list[gun.current];

				switch (gun.phase)
				{
					case 0:
						gun.sides = [];
						gun.sides.length = 0;
						for (var a = 0; a < 360; a += 90)
						{
							var angle = a * Math.PI / 180.0;
							gun.sides.push({
								x: boss.x + boss.radius * Math.cos(angle),
								y: boss.y + boss.radius * Math.sin(angle),
								angle1: angle + 90 * Math.PI / 180.0,
								angle2: angle - 90 * Math.PI / 180.0
							});
						}
						gun.phase += 1;
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
						gun.sides.forEach(function(side, index)
							{
								action.shot({
									x: side.x,
									y: side.y,
									boss: true,
									direction: side.angle1
								}, gun);
								action.shot({
									x: side.x,
									y: side.y,
									boss: true,
									direction: side.angle2
								}, gun);
								return true;
							});
						gun.phase += 1;
						break;
					default:
						gun.phase = 0;
						break;
				}
				
				return true;
			},
			
		},

		member: function(member, player) // help.shoot.member gun.shoot
		{
			var gun = this;

			gun.count += frameSpeed;
			if (gun.count < gun.frames)
			{
				return true;
			}
			gun.count = 0;

			gun.current = ((gun.current + 1) % gun.list.length);
			gun.frames = gun.list[gun.current];

			action.shot({
				x: member.x,
				y: member.y,
				boss: false,
				direction: Math.atan2(player.y - member.y, player.x - member.x)
			}, gun);
			return true;
		}
	},

	collision: function(data1, data2, distance) // help.collision
	{
		return (data1.x - data2.x) * (data1.x - data2.x) + (data1.y - data2.y) * (data1.y - data2.y) < distance * distance;
	},

	distance: function(data1, data2) // help.distance
	{
		return Math.sqrt((data1.x - data2.x) * (data1.x - data2.x) + (data1.y - data2.y) * (data1.y - data2.y));
	},

	player: {
		ui: function() // help.player.ui
		{
			var player = this;

			if (player.score - player.show >= 1000)
			{
				player.show += 1000;
				js('#score').text(emoji.nestwitheggs + ' ' + player.show);
			}
			else if (player.score - player.show >= 100)
			{
				player.show += 100;
				js('#score').text(emoji.nestwitheggs + ' ' + player.show);
			}
			else if (player.score - player.show >= 10)
			{
				player.show += 10;
				js('#score').text(emoji.nestwitheggs + ' ' + player.show);
			}
			else if (player.score - player.show > 0)
			{
				player.show += 1;
				js('#score').text(emoji.nestwitheggs + ' ' + player.show);
			}
			else if (player.score == 0)
			{
				js('#score').text(emoji.emptynest);
			}

			if (player.special.speedboost.active > 0)
			{
				player.special.speedboost.active = Math.max(0, player.special.speedboost.active - frameSpeed);
				if (player.special.speedboost.active <= 0)
				{
					game.flash.ko('#speedboost');
					player.boost = 1.0;
					return true;
				}
			}
			else if (player.special.speedboost.count < settings.special.speedboost.max)
			{
				player.special.speedboost.frames = Math.max(0, player.special.speedboost.frames - frameSpeed);
				if (player.special.speedboost.frames <= 0)
				{
					game.flash.ok('#speedboost');
					player.special.speedboost.count += 1;
					js('#speedboost').text(player.special.speedboost.count);
					player.special.speedboost.frames = settings.special.speedboost.frames;
					return true;
				}
			}

			if (player.special.shield.active > 0)
			{
				player.special.shield.active = Math.max(0, player.special.shield.active - frameSpeed);
				if (player.special.shield.active <= 0)
				{
					game.flash.ko('#shield');
					return true;
				}
			}

			return true;
		},

		hit: function(source) // help.player.hit
		{
			var player = this;

			objects.add.effect({x: (player.x + source.x) * 0.5, y: (player.y + source.y) * 0.5, emoji: emoji.collision});

			if (player.special.shield.active)
			{
				player.hp -= source.damage * 0.5;
			}
			else
			{
				player.hp -= source.damage;
			}
			js('#hp').element().value = Math.max(0, player.hp);

			if (player.hp <= 0)
			{
				player.active = false;
			}

			if (source.boss)
			{
				player.flawless = false;
			}
			return true;
		}
	},

	enemy: {
		hit: function(source) // help.enemy.hit
		{
			var enemy = this;

			enemy.hp -= source.damage;
			if (enemy.hp > 0)
			{
				return true;
			}

			enemy.active = false;

			objects.player.forEach(function(player)
				{
					player.score += enemy.score;
					objects.add.score(enemy);
					return true;
				});

			action.bonus(enemy);
			generator.death.enemy(enemy);
			return true;
		}
	},

	member: {
		hit: function(damage, wave) // help.member.hit
		{
			var member = this;

			member.hp -= damage;
			if (member.hp > 0)
			{
				return true;
			}

			member.active = false;

			if (member.index > 0 && !wave.members[member.index - 1].active)
			{
				wave.score += 3;
			}

			objects.player.forEach(function(player)
				{
					player.score += wave.score;
					objects.add.score({x: member.x, y: member.y, score: wave.score});
					return true;
				});

			action.bonus(member);
			generator.death.wave.member();

			wave.deaths += 1;
			if (wave.deaths >= wave.enemies)
			{
				wave.active = false;
				generator.death.wave.all();
			}

			return true;
		}
	},

	boss: {
		hit: function(damage) // help.boss.hit
		{
			var boss = this;

			boss.hp -= damage;
			js('#boss').element()['value'] = Math.max(0, boss.hp);

			if (boss.hp > 0)
			{
				return true;
			}

			boss.active = false;
			objects.player.forEach(function(player)
				{
					player.score += boss.score;
					objects.add.score(boss);
					if (objects.bosses.length == 0 && player.flawless)
					{
						player.score += 999;
						objects.add.score({x: player.x, y: player.y, score: 999});
					}
					return true;
				});

			for (var i = 0; i < 3; i += 1)
			{
				action.bonus({x: boss.x - 15 + 30 * Math.random(), y: boss.y - 15 + 30 * Math.random()}, true);
			}
			generator.death.boss();
			return true;
		}
	}
};


var frameSpeed = 16.666667;

var interval = function(frame)
{
	frameSpeed = 16.666667;
	if (!interval.frame)
	{
		interval.frame = frame;
	}
	frameSpeed = Math.max(0, Math.min(50, frame - interval.frame));
	interval.frame = frame;

	frameSpeed *= 1.0;

	if (game.vars.state == STATE_RUNNING)
	{
		interval.count += frameSpeed;
		if (interval.count > interval.frames)
		{
			interval.count -= interval.frames;
			generator.time();
		}
	}

	canvas.context.clearRect(0, 0, canvas.width, canvas.height);

	var active = true;
	objects.player.forEach(function(player)
		{
			if (!player.active)
			{
				active = false;
				return true;
			}

			player.ui();

			player.move();

			canvas.emoji(player);
			if (player.special.shield.active)
			{
				canvas.emoji({x: player.x, y: player.y, emoji: emoji.safetyvest, radius: 10});
			}

			player.guns.forEach(function(gun, index)
				{
					return gun.shoot(player);
				});

			var gone = [];
			objects.enemies.forEach(function(enemy, index)
				{
					if (!enemy.active)
					{
						gone.push(index);
						return true;
					}

					enemy.move(player);

					canvas.emoji(enemy);

					enemy.guns.forEach(function(gun)
						{
							return gun.shoot(enemy, player);
						});

					if (help.collision(player, enemy, (player.radius + enemy.radius) * 0.8))
					{
						player.hit(enemy);

						enemy.hit(player);
					}

					return true;
				});
			while (gone.length)
			{
				objects.enemies.splice(gone.pop(), 1);
			}

			var gone = [];
			objects.waves.forEach(function(wave, index)
				{
					if (!wave.active)
					{
						gone.push(index);
						return true;
					}

					wave.members.forEach(function(member, index)
						{
							member.move(wave); // move.member

							if (member.active)
							{
								canvas.emoji(member);

								member.guns.forEach(function(gun)
									{
										return gun.shoot(member, player);
									});
							}
							return true;
						});
					return true;
				});
			while (gone.length)
			{
				objects.waves.splice(gone.pop(), 1);
			}

			var gone = [];
			objects.bosses.forEach(function(boss, index)
				{
					if (!boss.active)
					{
						gone.push(index);
						return true;
					}

					boss.move(boss, player);

					canvas.emoji(boss);

					boss.guns.forEach(function(gun)
						{
							return gun.shoot(boss, player);
						});

					if (help.collision(player, boss, (player.radius + boss.radius) * 0.8))
					{
						player.hit(boss);
					}

					return true;
				});
			while (gone.length)
			{
				objects.bosses.splice(gone.pop(), 1);
				boss.active
			}

			var gone = [];
			objects.bonuses.forEach(function(bonus, index)
				{
					if (!bonus.active)
					{
						gone.push(index);
						return true;
					}

					bonus.frames -= frameSpeed;
					if (bonus.frames < 0)
					{
						bonus.active = false;
						return true;
					}

					canvas.emoji(bonus);

					if (help.collision(player, bonus, (player.radius + bonus.radius) * 0.9))
					{
						switch (bonus.type)
						{
							case settings.bonuses.hp10.type:
								if (player.hp == settings.player.hp)
								{
									player.score += 10;
									objects.add.score(bonus);
								}
								player.hp = Math.min(settings.player.hp, player.hp + bonus.hp);
								stats.hp10 += 1;
								js('#s_hp10').text(stats.hp10);
								break;

							case settings.bonuses.hp30.type:
								if (player.hp == settings.player.hp)
								{
									player.score += 10;
									objects.add.score(bonus);
								}
								player.hp = Math.min(settings.player.hp, player.hp + bonus.hp);
								stats.hp30 += 1;
								js('#s_hp30').text(stats.hp30);
								break;

							case settings.bonuses.hp50.type:
								if (player.hp == settings.player.hp)
								{
									player.score += 10;
									objects.add.score(bonus);
								}
								player.hp = Math.min(settings.player.hp, player.hp + bonus.hp);
								stats.hp50 += 1;
								js('#s_hp50').text(stats.hp50);
								break;

							case settings.bonuses.weapon.type:
								stats.weapon += 1;
								js('#s_weapon').html(stats.weapon == settings.player.maxLevel ? '&#x2714;' + stats.weapon : stats.weapon);

								action.bonus.badluck = -1;
								player.level += 1;
								settings.escalation.chance += 0.0141;
								var gun = null;
								switch (player.level)
								{
									case 1:
									case 2:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.standard)
												{
													gun.list.push(7 / SPEED);
												}
												return true;
											});
										break;
									case 3:
										break;
									case 4:
										gun = {
											type: settings.guns.leftorright,
											shoot: help.shoot.player.leftorright,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 8 * SPEED,
											count: 0,
											damage: 1,
											list: [35]
										};
										break;
									case 6:
									case 8:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.leftorright && gun.list.length < 3)
												{
													gun.list.push(6 / SPEED);
												}
												return true;
											});
										break;
									case 10:
										gun = {
											type: settings.guns.leftorright,
											shoot: help.shoot.player.leftorright,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 8 * SPEED,
											count: 0,
											damage: 1,
											list: [45]
										};
										break;
									case 11:
									case 12:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.leftorright && gun.list.length < 3)
												{
													gun.list.push(6 / SPEED);
												}
												return true;
											});
										break;
									case 15:
										gun = {
											type: settings.guns.backwards,
											shoot: help.shoot.player.backwards,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 6.5 * SPEED,
											count: 0,
											damage: 1,
											list: [70]
										};
										break;
									case 16:
									case 17:
									case 18:
									case 19:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.backwards)
												{
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 20:
										gun = {
											type: settings.guns.left,
											shoot: help.shoot.player.left,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 7 * SPEED,
											count: 0,
											damage: 1,
											list: [30]
										};
										break;
									case 22:
										gun = {
											type: settings.guns.right,
											shoot: help.shoot.player.right,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 7 * SPEED,
											count: 0,
											damage: 1,
											list: [30, 5, 5]
										};
										break;
									case 25:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.left)
												{
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 26:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.right)
												{
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 27:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.left)
												{
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 28:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.right)
												{
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 30:
										gun = {
											type: settings.guns.chaos,
											shoot: help.shoot.player.chaos,
											emoji: emoji.circles.purple,
											radius: 4,
											speed: 7 * SPEED,
											count: 0,
											damage: 1,
											list: [4]
										};
										break;
									case 35:
										gun = {
											type: settings.guns.satellite,
											shoot: help.shoot.player.satellite,
											emoji: emoji.circles.purple,
											satellite: {
												emoji: emoji.skull,
												radius: 12,
												distance: 60,
												count: 1
											},
											direction: 0,
											radius: 5,
											speed: 7 * SPEED,
											count: 0,
											damage: 2,
											list: [30, 5, 5]
										};
										break;
									case 38:
									case 41:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.satellite)
												{
													gun.list.push(5 / SPEED);
													gun.list.push(5 / SPEED);
												}
												return true;
											});
										break;
									case 45:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.satellite)
												{
													gun.satellite.count += 1;
												}
												return true;
											});
										break;
									case 50:
										player.guns.forEach(function(gun)
											{
												if (gun.type == settings.guns.satellite)
												{
													gun.satellite.count += 1;
												}
												return true;
											});
										break;
									default:
										break;
								}
								if (gun)
								{
									gun.list = gun.list.map(function(value)
										{
											return value / SPEED;
										});
									gun.frames = gun.list[0];
									gun.current = 0;
									player.guns.push(gun);
								}
								break;

							default:
								break;
						}
						js('#hp').element().value = player.hp;
						bonus.active = false;

						return true;
					}

					return true;
				});
			while (gone.length)
			{
				objects.bonuses.splice(gone.pop(), 1);
			}

			var gone = [];
			objects.shots.forEach(function(shot, index)
				{
					if (!shot.active)
					{
						gone.push(index);
						return true;
					}

					var x = shot.x + Math.cos(shot.direction) * shot.speed * shot.boost * frameSpeed;
					var y = shot.y + Math.sin(shot.direction) * shot.speed * shot.boost * frameSpeed;

					var collision = false;
					if (x - shot.radius < 0) // Left wall
					{
						collision = true;
					}
					else if (x + shot.radius >= canvas.width) // Right wall
					{
						collision = true;
					}
					if (y - shot.radius < 0) // Top wall
					{
						collision = true;
					}
					else if (y + shot.radius >= canvas.height) // Bottom wall
					{
						collision = true;
					}
					if (collision)
					{
						shot.active = false;
						return true;
					}

					shot.x = x;
					shot.y = y;

					canvas.emoji(shot);

					if (help.collision(player, shot, (player.radius + shot.radius) * 0.8))
					{
						shot.active = false;
						player.hit(shot);
					}

					return true;
				});
			while (gone.length)
			{
				objects.shots.splice(gone.pop(), 1);
			}

			return true;
		});

	var gone = [];
	objects.bullets.forEach(function(bullet, index)
		{
			if (!bullet.active)
			{
				gone.push(index);
				return true;
			}

			var x = bullet.x + Math.cos(bullet.direction) * bullet.speed * bullet.boost * frameSpeed;
			var y = bullet.y + Math.sin(bullet.direction) * bullet.speed * bullet.boost * frameSpeed;

			var collision = false;
			if (x - bullet.radius < 0) // Left wall
			{
				collision = true;
			}
			else if (x + bullet.radius >= canvas.width) // Right wall
			{
				collision = true;
			}
			if (y - bullet.radius < 0) // Top wall
			{
				collision = true;
			}
			else if (y + bullet.radius >= canvas.height) // Bottom wall
			{
				collision = true;
			}
			if (collision)
			{
				bullet.active = false;
				return true;
			}

			bullet.x = x;
			bullet.y = y;

			canvas.emoji(bullet);

			objects.enemies.forEach(function(enemy)
				{
					if (!bullet.active)
					{
						return true;
					}

					if (help.collision(enemy, bullet, (enemy.radius + bullet.radius) * 0.9))
					{
						objects.add.effect({
							x: (enemy.x + bullet.x) * 0.5,
							y: (enemy.y + bullet.y) * 0.5,
							emoji: emoji.sparkles
						});

						bullet.active = false;

						enemy.hit(bullet);
					}
					return true;
				});

			objects.waves.forEach(function(wave)
				{
					if (!wave.active)
					{
						return true;
					}
					wave.members.forEach(function(member)
						{
							if (!member.active)
							{
								return true;
							}

							if (!bullet.active)
							{
								return true;
							}

							if (help.collision(member, bullet, (wave.radius + bullet.radius) * 0.9))
							{
								objects.add.effect({
									x: (member.x + bullet.x) * 0.5,
									y: (member.y + bullet.y) * 0.5,
									emoji: emoji.sparkles
								});

								bullet.active = false;

								member.hit(bullet.damage, wave);
							}
							return true;
						});
					return true;
				});

			objects.bosses.forEach(function(boss)
				{
					if (!bullet.active)
					{
						return true;
					}

					if (help.collision(boss, bullet, (boss.radius + bullet.radius) * 0.9))
					{
						objects.add.effect({
							x: (boss.x + bullet.x) * 0.5,
							y: (boss.y + bullet.y) * 0.5,
							emoji: emoji.sparkles
						});

						bullet.active = false;

						boss.hit(bullet.damage);
					}
					return true;
				});

			return true;
		});
	while (gone.length)
	{
		objects.bullets.splice(gone.pop(), 1);
	}

	var gone = [];
	objects.effects.forEach(function(effect, index)
		{
			effect.frames -= frameSpeed;
			if (effect.frames <= 0)
			{
				gone.push(index);
			}

			effect.radius *= 1.05;

			effect.x += Math.random() * 2 - 1;
			effect.y += Math.random() * 2 - 1;

			effect.x -= 1;
			effect.y += 0.4;

			canvas.emoji(effect);

			return true;
		});
	while (gone.length)
	{
		objects.effects.splice(gone.pop(), 1);
	}

	var gone = [];
	objects.scores.forEach(function(text, index)
		{
			text.frames -= frameSpeed;
			if (text.frames <= 0)
			{
				gone.push(index);
			}
			canvas.text(text);
			text.x -= 0.3;
			text.y -= 1;
			return true;
		});
	while (gone.length)
	{
		objects.scores.splice(gone.pop(), 1);
	}

	if (!action.paused)
	{
		if (active)
		{
			action.t = window.requestAnimationFrame(interval);
		}
		else
		{
			action.stop();
			canvas.gameover();
			game.vars.state = STATE_END;
		}
	}
	return true;
};


var objects = {
	add: {
		player: function(data) // add.player
		{
			data.guns.push({
				type: settings.guns.standard,
				shoot: help.shoot.player.standard,
				emoji: emoji.circles.purple,
				radius: 4,
				speed: 6 * SPEED,
				count: 0,
				damage: 1,
				boss: false,
				list: [40]
			});

			data.guns.forEach(function (gun)
				{
					gun.list = gun.list.map(function(value)
						{
							return value / SPEED;
						});
					gun.frames = gun.list[0];
					gun.current = 0;
					return true;
				});

			objects.player.push(data);
			return true;
		},

		enemy: function(data) // add.enemy
		{
			switch (data.type)
			{
				case settings.enemies.corner.type:
					data.guns.push({
						type: settings.guns.direct,
						shoot: help.shoot.enemy.direct,
						emoji: emoji.circles.black,
						radius: 5,
						speed: 4.5 * SPEED,
						count: 0,
						damage: 2,
						boss: false,
						list: [75]
					});
					break;
				case settings.enemies.center.type:
					data.guns.push({
						type: settings.guns.direct,
						shoot: help.shoot.enemy.direct,
						emoji: emoji.circles.black,
						radius: 5,
						speed: 5 * SPEED,
						count: 0,
						damage: 2,
						boss: false,
						list: [75, 10, 10, 10]
					});
					break;
				case settings.enemies.follow.type:
					data.guns.push({
						type: settings.guns.leftorright,
						shoot: help.shoot.enemy.leftorright,
						emoji: emoji.circles.black,
						radius: 5,
						speed: 4 * SPEED,
						count: 0,
						damage: 3,
						boss: false,
						list: [100, 8, 8, 8, 8, 8, 8]
					});
					break;
				default:
					break;
			}

			data.guns.forEach(function(gun)
				{
					gun.list = gun.list.map(function(value)
						{
							return value / SPEED;
						});
					gun.frames = gun.list[0];
					gun.current = 0;
					return true;
				});

			objects.enemies.push(data);
			return true;
		},

		bullet: function(data) // add.bullet
		{
			data.boost = 1.0;
			data.active = true;

			objects.bullets.push(data);

			stats.bullets += 1;
			js('#s_bullets').text(stats.bullets);
			return true;
		},

		shot: function(data) // add.shot
		{
			objects.shots.push(data);
			return true;
		},

		effect: function(data) // add.effect
		{
			if (!data.emoji)
			{
				data.emoji = emoji.sparkles;
			}
			if (!data.frames)
			{
				data.frames = 35 / SPEED;
			}
			if (!data.radius)
			{
				data.radius = 3;
			}
			objects.effects.push(data);
			return true;
		},

		score: function(data) // add.score
		{
			data.x += 4 - parseInt(9 * Math.random());
			data.y += 4 - parseInt(9 * Math.random());
			data.frames = 100 / SPEED;
			objects.scores.push(data);
			return true;
		},

		bonus: function(data) // add.bonus
		{
			data.x = Math.min(canvas.width - 1, Math.max(0, parseInt(data.x)));
			data.y = Math.min(canvas.height - 1, Math.max(0, parseInt(data.y)));
			data.active = true;
			data.radius = 10;
			data.frames = 10 * 60 / SPEED; // 10 seconds
			objects.bonuses.push(data);
			return true;
		},

		wave: function(data) // add.wave
		{
			objects.waves.push(data);
			return true;
		},

		boss: function(data)
		{
			data.guns.forEach(function(gun)
				{
					gun.list = gun.list.map(function(value)
						{
							return value / SPEED;
						});
					gun.frames = gun.list[0];
					gun.current = 0;
					return true;
				});

			objects.player.forEach(function(player)
				{
					data.hp += 2 * player.level;
				});

			js('#boss').element()['value'] = data.hp;
			js('#boss').element()['min'] = 0;
			js('#boss').element()['max'] = data.hp;
			js('#boss').element()['low'] = parseInt(data.hp * 0.35) + 1;
			js('#boss').element()['high'] = parseInt(data.hp * 0.7) + 1;
			js('#boss').element()['optimum'] = parseInt(data.hp * 0.9) + 1;

			objects.player.forEach(function(player)
				{
					player.flawless = true;
					return true;
				});
			objects.bosses.push(data);
			return true;
		}
	},

	new: function()
	{
		objects.player = [];
		objects.enemies = [];
		objects.bullets = [];
		objects.shots = [];
		objects.effects = [];
		objects.scores = [];
		objects.bonuses = [];
		objects.waves = [];
		objects.bosses = [];

		objects.player.length = 0;
		objects.enemies.length = 0;
		objects.bullets.length = 0;
		objects.shots.length = 0;
		objects.effects.length = 0;
		objects.scores.length = 0;
		objects.bonuses.length = 0;
		objects.waves.length = 0;
		objects.bosses.length = 0;
		return true;
	}
};


var action = {

	start: function() // action.start
	{
		action.stop();
		action.paused = false;
		interval.frames = 60 / SPEED;
		interval.count = 0;
		game.vars.state = STATE_RUNNING;
		action.t = window.requestAnimationFrame(interval);
		return true;
	},

	stop: function() // action.stop
	{
		if (action.t)
		{
			window.cancelAnimationFrame(action.t);
			action.t = null;
		}
		action.paused = true;
		game.vars.state = STATE_READY;
		return true;
	},

	quadrant: function()
	{
		var t = [];
		for (var i = 0; i < arguments.length; i += 1)
		{
			t.push(arguments[i]);
		}
		if (t.length == 0)
		{
			t = [1, 2, 3, 4, 6, 7, 8, 9];
		}
		var r = Math.floor(Math.random() * t.length);
		var which = t[r];
		var x = canvas.width * 0.25 + Math.random() * canvas.width * 0.5;
		var y = canvas.height * 0.25 + Math.random() * canvas.height * 0.5;
		switch (which)
		{
			case 1:
				x -= canvas.width;
				y -= canvas.height;
				break;
			case 2:
				y -= canvas.height;
				break;
			case 3:
				x += canvas.width;
				y -= canvas.height;
				break;
			case 4:
				x -= canvas.width;
				break;
			case 5:
				break;
			case 6:
				x += canvas.width;
				break;
			case 7:
				x -= canvas.width;
				y += canvas.height;
				break;
			case 8:
				y += canvas.height;
				break;
			case 9:
				x += canvas.width;
				y += canvas.height;
				break;
			default:
				break;
		}
		return {x: x, y: y, quadrant: r};
	},

	player: function()
	{
		var data = {};

		for (var i in settings.player.defaults)
		{
			data[i] = settings.player.defaults[i];
		}

		data.guns = [];

		data.x = canvas.width * 0.5;
		data.y = canvas.height * 0.5;
		data.mouse = {x: data.x, y: data.y};

		data.special = {
			speedboost: {
				active: 0,
				count: settings.special.speedboost.count,
				frames: settings.special.speedboost.frames,
			},
			shield: {
				active: 0,
				count: settings.special.shield.count
			},
			nuke: {
				count: settings.special.nuke.count
			},
			panic: {
				count: settings.special.panic.count
			}
		};

		js('#hp').element()['value'] = data.hp;

		objects.add.player(data);
		return true;
	},

	enemy: function(enemy) // action.enemy
	{
		var data = {};
		for (var i in settings.enemies.defaults)
		{
			data[i] = settings.enemies.defaults[i];
		}
		for (var i in enemy)
		{
			data[i] = enemy[i];
		}

		data.guns = [];

		var t = action.quadrant();
		data.x = t.x;
		data.y = t.y;
		switch (enemy.type)
		{
			case settings.enemies.liner.type:
				switch (t.quadrant)
				{
					case 0:
						data.destination = action.quadrant(6, 8, 9);
						break;
					case 1:
						data.destination = action.quadrant(8);
						break;
					case 2:
						data.destination = action.quadrant(4, 7, 8);
						break;
					case 3:
						data.destination = action.quadrant(6);
						break;
					case 4:
						data.destination = action.quadrant(4);
						break;
					case 5:
						data.destination = action.quadrant(2, 3, 6);
						break;
					case 6:
						data.destination = action.quadrant(2);
						break;
					case 7:
						data.destination = action.quadrant(1, 2, 4);
						break;
					default:
						break;
				}
				data.direction =  Math.atan2(data.destination.y - data.y, data.destination.x - data.x);
				break;
			case settings.enemies.corner.type:
				data.destination = {
					x: canvas.width * 0.25,
					y: canvas.height * 0.25
				};
				switch (parseInt(Math.random() * 4))
				{
					case 0:
						break;
					case 1:
						data.destination.x += canvas.width * 0.5;
						break;
					case 2:
						data.destination.y += canvas.height * 0.5;
						break;
					case 3:
						data.destination.x += canvas.width * 0.5;
						data.destination.y += canvas.height * 0.5;
						break;
					default:
						break;
				}
				if (Math.random() < 0.5)
				{
					data.rotate = -2.75 * Math.PI / 180.0;
				}
				else
				{
					data.rotate = 2.75 * Math.PI / 180.0;
				}
				break;
			case settings.enemies.center.type:
				data.destination = {
					x: canvas.width * 0.5,
					y: canvas.height * 0.5
				};
				if (Math.random() < 0.5)
				{
					data.rotate = -3.75 * Math.PI / 180.0;
				}
				else
				{
					data.rotate = 3.75 * Math.PI / 180.0;
				}
				break;
			case settings.enemies.follow.type:
				break;
			default:
				break;
		}
		objects.add.enemy(data);
		return true;
	},

	bonus: function(data, boss = false) // action.bonus
	{
		var t = [];
		action.bonus.badluck = Math.max(-1, action.bonus.badluck - 1);
		objects.player.forEach(function(player)
			{
				if (action.bonus.badluck == 0)
				{
					t.push(settings.bonuses.weapon);
					return true;
				}
				if (boss)
				{
					t.push(settings.bonuses.hp10);
					t.push(settings.bonuses.hp10);
					t.push(settings.bonuses.hp10);
					t.push(settings.bonuses.hp10);
					t.push(settings.bonuses.hp10);
					t.push(settings.bonuses.hp30);
					if (player.level < settings.player.maxLevel)
					{
						t.push(settings.bonuses.weapon);
					}
					return true;
				}
				var j = 0;
				if (player.level < 30)
				{
					j = 5;
				}
				else
				{
					j = 3;
				}
				for (var i = 0; i < j; i += 1)
				{
					t.push(settings.bonuses.hp10);
				}
				t.push(settings.bonuses.hp30);
				t.push(settings.bonuses.hp30);
				t.push(settings.bonuses.hp50);

				j = 0;
				if (player.level < 5)
				{
					j = 15;
				}
				else if (player.level < 20)
				{
					j = 5;
				}
				else if (player.level < settings.player.maxLevel)
				{
					j = 1;
				}
				for (var i = 0; i < j; i += 1)
				{
					t.push(settings.bonuses.weapon);
				}
				while (t.length < 100)
				{
					t.push(null);
				}
			});
		t.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		t = t.pop();
		if (t)
		{
			var bonus = {};
			for (var i in t)
			{
				bonus[i] = t[i];
			}
			bonus.x = data.x + 3 - parseInt(7 * Math.random());
			bonus.y = data.y + 3 - parseInt(7 * Math.random());
			objects.add.bonus(bonus);
		}
		return true;
	},

	wave: function() // action.wave
	{
		var data = {};

		for (var i in settings.waves.defaults)
		{
			data[i] = settings.waves.defaults[i];
		}

		action.wave.current = ((action.wave.current + 1) % settings.waves.looks.length);
		data.emoji = settings.waves.looks[action.wave.current];

		var t = action.quadrant();
		data.x = t.x;
		data.y = t.y;
		switch (parseInt(Math.random() * 4))
		{
			case 0:
				data.destination = {x: canvas.width * 0.5, y: canvas.height * 0.3};
				break;
			case 1:
				data.destination = {x: canvas.width * 0.5, y: canvas.height - canvas.height * 0.3};
				break;
			case 2:
				data.destination = {x: canvas.width * 0.3, y: canvas.height * 0.5};
				break;
			case 3:
				data.destination = {x: canvas.width - canvas.width * 0.3, y: canvas.height * 0.5};
				break;
			default:
				break;
		}

		data.gun = {
			type: settings.guns.direct,
			emoji: emoji.circles.black,
			radius: 5,
			speed: 4.5 * SPEED,
			count: 0,
			damage: 1,
			boss: false,
			shoot: help.shoot.member
		};

		data.radius = 12 + parseInt(Math.random() * 5);

		objects.player.forEach(function(player)
			{
				data.enemies = 5 + Math.ceil(player.level * 15 / settings.player.maxLevel);
				if (player.level < 20)
				{
					data.gun.damage = 1;
				}
				else if (player.level < 40)
				{
					data.gun.damage = 2;
				}
				else
				{
					data.gun.damage = 3;
				}
			});

		data.members = [];
		data.path = [];

		var path = 0;
		var spacing = [5, 5, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 20, 20, 25, 25, 25, 30, 30];
		spacing.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		if (Math.random < 0.3)
		{
			spacing = [20];
		}
		var index = 0;
		for (var i = 0; i < data.enemies; i += 1)
		{
			var member = {
				move: data.move,
				hit: data.hit,
				active: true,
				x: data.x,
				y: data.y,
				hp: data.hp,
				path: path,
				radius: data.radius,
				emoji: data.emoji,
				boss: false
			};

			var gun = {};
			for (var j in data.gun)
			{
				gun[j] = data.gun[j];
			}

			gun.list = [];

			var list = null;

			objects.player.forEach(function(player)
				{
					if (player.level < 10)
					{
						list = [1000, 3000];
					}
					else if (player.level < 30)
					{
						list = [300, 500];
					}
					else if (player.level < 45)
					{
						list = [200, 100, 50];
					}
					else
					{
						list = [200, 20, 20];
					}
					return true;
				});

			list.sort(function(a, b)
				{
					return Math.random() - Math.random();
				});

			while (list.length)
			{
				gun.list.push(list.pop() / SPEED);
			}

			gun.frames = gun.list[0];
			gun.current = 0;

			member.guns = [];
			member.guns.push(gun);

			data.path.push({x: data.x, y: data.y});

			data.members.push(member);

			path += 1;
			
			for (var j = 0; j < spacing[index]; j += 1)
			{
				data.path.push({x: data.x, y: data.y});
				path += 1;
			}
			index = ((index + 1) % spacing.length);
		}

		data.members.forEach(function(member, index)
			{
				member.index = index ? data.enemies - index - 1 : 0;
			});

		objects.add.wave(data);
		return true;
	},

	boss: function() // action.boss
	{
		var data = {};

		for (var i in settings.bosses.defaults)
		{
			data[i] = settings.bosses.defaults[i];
		}
		
		action.boss.current = ((action.boss.current + 1) % settings.bosses.looks.length);
		data.emoji = settings.bosses.looks[action.boss.current];

		var t = action.quadrant();
		data.x = t.x;
		data.y = t.y;

		data.center = {};
		data.center.x = canvas.width * 0.5;
		data.center.y = canvas.height * 0.5;

		data.guns = [];

		var guns = [
			{ // 0
				shoot: help.shoot.boss.direct,
				emoji: emoji.circles.black,
				radius: 6,
				speed: 4 * SPEED,
				count: 0,
				damage: 4,
				boss: true,
				list: [60, 10, 45, 10, 10, 30, 10, 10, 10, 10, 60, 10, 45, 10, 10, 30, 10, 10, 10, 10, 60, 10, 45, 10, 10, 30, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
			},
			{ // 1
				shoot: help.shoot.boss.frontal,
				emoji: emoji.circles.black,
				radius: 6,
				speed: 4 * SPEED,
				count: 0,
				damage: 1,
				boss: true,
				list: [70, 6, 6]
			},
			{ // 2
				shoot: help.shoot.boss.circularpulse,
				emoji: emoji.circles.black,
				radius: 6,
				speed: 3 * SPEED,
				count: 0,
				damage: 2,
				boss: true,
				list: [150, 30, 30]
			},
			{ // 3
				shoot: help.shoot.boss.spiral,
				emoji: emoji.circles.black,
				direction: 0,
				spiral: 0,
				angle: 0,
				radius: 6,
				speed: 3 * SPEED,
				count: 0,
				damage: 3,
				boss: true,
				list: [100, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
			},
			{ // 4
				shoot: help.shoot.boss.walls,
				emoji: emoji.circles.black,
				angle: 0,
				radius: 6,
				speed: 2 * SPEED,
				count: 0,
				damage: 3,
				boss: true,
				list: [25]
			},
			{ // 5
				shoot: help.shoot.boss.mesh,
				emoji: emoji.circles.black,
				radius: 6,
				speed: 3 * SPEED,
				count: 0,
				damage: 3,
				boss: true,
				phase: 0,
				list: [40, 8, 8, 8, 8, 8, 8, 8, 1]
			}
		];

		var moves = [
			help.move.boss.epitrochoid,
			help.move.boss.hypotrochoid,
			help.move.boss.spiralthing
		];

		data.move = moves[parseInt(Math.random() * moves.length)];
		data.a = 0;

		// data.guns.push(guns[0]);
		// data.guns.push(guns[1]);
		// data.guns.push(guns[2]);
		// data.guns.push(guns[3]);
		// data.guns.push(guns[4]);
		// data.guns.push(guns[5]);
		/*
		objects.add.boss(data);
		return true;
		*/

		var list = [guns[1], guns[2], guns[3], guns[4], guns[5]];

		list.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});

		switch (stats.boss)
		{
			case 0:
				list = [];
				list.push(guns[0]);
			case 1:
			case 2:
				data.guns.push(list[0]);
				break;

			default:
				objects.player.forEach(function(player)
					{
						data.guns.push(list[0]);
						data.guns.push(list[1]);
						if (player.level >= 30)
						{
							data.guns.push(list[2]);
						}
						if (player.level >= 40)
						{
							data.guns.push(list[3]);
						}
						if (player.level >= 45)
						{
							data.guns.push(list[4]);
						}
					});
		}

		objects.add.boss(data);
		return true;
	},

	shot: function(shot, gun) // action.shot
	{
		objects.add.shot({
			x: shot.x,
			y: shot.y,
			direction: shot.direction,
			emoji:  gun.emoji,
			radius:  gun.radius,
			speed:  gun.speed,
			damage:  gun.damage,
			boost: 1.0,
			active: true,
			boss: shot.boss ? shot.boss : false
		});
		return true;
	},


};


var canvas = {
	init: function() // canvas.init
	{
		canvas.canvas = js('canvas').element();
		canvas.context = canvas.canvas.getContext('2d');
		canvas.width = canvas.canvas.width;
		canvas.height = canvas.canvas.height;
		canvas.w = canvas.width;
		canvas.context.clearRect(0, 0, canvas.width, canvas.height);
		return true;
	},

	new: function() // canvas.new
	{
		return canvas.init();
	},

	rect: function(style, x, y, w, h) // canvas.rect
	{
		canvas.context.fillStyle = style;
		canvas.context.fillRect(x, y, w, h);
		return true;
	},

	line: function(style, x1, y1, x2, y2) // canvas.line
	{
		canvas.context.beginPath();
		canvas.context.moveTo(x1, y1);
		canvas.context.lineTo(x2, y2);
		canvas.context.lineWidth = 3;
		canvas.context.strokeStyle = style;
		canvas.context.stroke();
		return true;
	},

	point: function(style, x, y) // canvas.point
	{
		return canvas.rect(style, x, y, 1, 1);
	},

	text: function(text) // canvas.text objects.add.score
	{
		canvas.context.font = '22px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = 'DarkOrange';
		canvas.context.fillText(text.score, text.x, text.y);
		return true;
	},

	paused: function() // canvas.paused
	{
		canvas.context.fillStyle = 'lightgray';
		for (var y = 1; y < canvas.height; y += 2)
		{
			for (var x = 1; x < canvas.width; x += 3)
			{
				canvas.context.fillRect(x, y, 1, 1);
			}
		}
		canvas.context.font = '48px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = 'black';
		canvas.context.fillText(emoji.zzz + ' ' + emoji.sleepingface + ' ' + emoji.zzz, canvas.width * 0.5, canvas.height * 0.8);
		return true;
	},

	gameover: function() // canvas.gameover
	{
		canvas.context.fillStyle = 'black';
		for (var y = 1; y < canvas.height; y += 2)
		{
			for (var x = 1; x < canvas.width; x += 3)
			{
				canvas.context.fillRect(x, y, 1, 1);
			}
		}
		canvas.context.font = '48px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = 'black';
		canvas.context.fillText(emoji.facewithhandovermouth + ' ' + emoji.flushedface + ' ' + emoji.facewithhandovermouth, canvas.width * 0.5 - 1, canvas.height * 0.8);
		return true;
	},

	emoji: function(data) // canvas.emoji
	{
		canvas.context.font = (data.radius * 2 + 0) + 'px monospace';
		canvas.context.textAlign = 'center';
		canvas.context.textBaseline = 'middle';
		canvas.context.fillStyle = 'White';
		canvas.context.fillText(data.emoji, data.x, data.y + 2);
		return true;
	}
};


var game = {
	vars: {
		state: STATE_INIT,
		cheat: false
	},

	init: function()
	{
		game.vars.state = STATE_INIT;
		return true;
	},

	new: function()
	{
		game.vars.state = STATE_READY;
		action.stop();

		objects.new();
		canvas.new();
		generator.new();

		settings.waves.looks.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		settings.bosses.looks.sort(function(a, b)
			{
				return Math.random() - Math.random();
			});
		action.wave.current = -1;
		action.boss.current = -1;
		action.bonus.badluck = 5;

		action.player();

		js('#score').text(emoji.emptynest);
		js('#boss').element()['value'] = 0;

		js('#speedboost').text(settings.special.speedboost.count);
		js('#shield').text(settings.special.shield.count);
		js('#nuke').text(settings.special.nuke.count);
		js('#panic').text(settings.special.panic.count);

		for (var i in settings.escalation.defaults)
		{
			settings.escalation[i] = settings.escalation.defaults[i];
		}

		var list = [
			's_liner',
			's_escaped',
			's_corner',
			's_center',
			's_follow',
			's_wave',
			's_member',
			's_boss',
			's_hp10',
			's_hp30',
			's_hp50',
			's_weapon',
			's_bullets'
		];
		while (list.length)
		{
			var i = list.pop();
			js('#' + i).text('/');
			stats[i.substring(2)] = 0;
		}
		js('#e_liner').text(settings.enemies.liner.emoji);
		js('#e_corner').text(settings.enemies.corner.emoji);
		js('#e_center').text(settings.enemies.center.emoji);
		js('#e_follow').text(settings.enemies.follow.emoji);
		js('#e_wave').text(emoji.petridish + emoji.petridish + emoji.petridish);
		js('#e_member').text(emoji.petridish);
		js('#e_boss').text(emoji.windchime);
		js('#e_hp10').text(emoji.hp10);
		js('#e_hp30').text(emoji.hp30);
		js('#e_hp50').text(emoji.hp50);
		js('#e_weapon').text(emoji.testtube);

		action.start();
		return true;
	},

	hint: function()
	{
		var text = [];
		for (var i = 0; i < arguments.length; i += 1)
		{
			text.push(arguments[i]);
		}
		js('#hint').text(text.join(' '));
		if (game.vars.nohint)
		{
			clearTimeout(game.vars.nohint);
		}
		game.vars.nohint = setTimeout(function()
			{
				js('#hint').html('&nbsp;');
				game.vars.nohint = null;
				return true;
			}, 5 * 1000);
		return true;
	},

	hotkey: function()
	{
		var text = [];
		for (var i = 0; i < arguments.length; i += 1)
		{
			text.push(arguments[i]);
		}
		js('#hotkey').html('<b>' + text.join(' ') + '</b>');
		if (game.vars.hotkey)
		{
			clearTimeout(game.vars.hotkey);
		}
		game.vars.hotkey = setTimeout(function()
			{
				js('#hotkey').html('&nbsp;');
				game.vars.hotkey = null;
				return true;
			}, 5 * 1000);
		return true;
	},

	flash: { // game.flash
		color: {
			ok: 'b_gray',
			ko: 'b_red'
		},
		ok: function(which)
		{
			js(which).parents('div').class(game.flash.color.ok).add();
			setTimeout(function()
				{
					js(which).parents('div').class(game.flash.color.ok).remove();
					return true;
				}, 15);
			return true;
		},
		ko: function(which)
		{
			js(which).parents('div').class(game.flash.color.ko).add();
			setTimeout(function()
				{
					js(which).parents('div').class(game.flash.color.ko).remove();
					return true;
				}, 15);
			return true;
		}
	}
};


var main = {
	controls: {
		new: function(event)
		{
			game.new();
			return false;
		}
	},

	key: {
		down: function(event)
		{
			switch (event.key)
			{
				case 'b':
				case 'B':
				case 'c':
				case 'C':
				case 'p':
				case 'P':
				case 's':
				case 'S':
				case 'w':
				case 'W':
				case '1':
				case '2':
				case '3':
				case '4':
					break;
				case 'Shift':
				case 'Alt':
					return true;
				default:
					console.log('event.key', event.key);
					return true;
			}

			switch (game.vars.state)
			{
				case STATE_INIT:
					return true;
				case STATE_READY:
					break;
				case STATE_RUNNING:
					break;
				case STATE_END:
					return true;
				default:
					return true;
			}

			event.preventDefault();

			switch (event.key)
			{
				case 'b':
				case 'B':
					action.boss();
					break;

				case 'c':
				case 'C':
					objects.player.forEach(function(player)
						{
							if (player.level >= settings.player.maxLevel)
							{
								return true;
							}
							var bonus = {};
							for (var i in settings.bonuses.weapon)
							{
								bonus[i] = settings.bonuses.weapon[i];
							}
							bonus.x = player.x;
							bonus.y = player.y;
							objects.add.bonus(bonus);
							return true;
						});
					break;

				case 'p':
				case 'P':
					if (action.paused)
					{
						action.start();
					}
					else
					{
						action.stop();
						canvas.paused();
					}
					break;

				case 's':
				case 'S':
					action.enemy(settings.enemies.liner);
					break;

				case 'w':
				case 'W':
					action.wave();
					break;

				case '1':
					objects.player.forEach(function(player)
						{
							if (player.special.speedboost.active)
							{
								game.flash.ko('#speedboost');
								return game.hotkey('Already active');
							}

							if (player.special.speedboost.count <= 0)
							{
								game.flash.ko('#speedboost');
								return game.hotkey('Unavailable');
							}

							game.flash.ok('#speedboost');

							player.special.speedboost.count -= 1;
							js('#speedboost').text(player.special.speedboost.count);

							player.boost *= 1.75;
							player.special.speedboost.active = settings.special.speedboost.active;
							player.special.speedboost.frames = settings.special.speedboost.frames;
							return true;
						});
					break;

				case '2':
					objects.player.forEach(function(player)
						{
							if (player.special.shield.active)
							{
								game.flash.ko('#shield');
								return game.hotkey('Already active');
							}

							if (player.special.shield.count <= 0)
							{
								game.flash.ko('#shield');
								return game.hotkey('Unavailable');
							}

							game.flash.ok('#shield');

							player.special.shield.count -= 1;
							js('#shield').text(player.special.shield.count);

							player.special.shield.active = settings.special.shield.active;
							return true;
						});
					break;

				case '3':
					objects.player.forEach(function(player)
						{
							if (player.special.nuke.count <= 0)
							{
								game.flash.ko('#nuke');
								return game.hotkey('Unavailable');
							}

							game.flash.ok('#nuke');

							player.special.nuke.count -= 1;
							js('#nuke').text(player.special.nuke.count);

							objects.player.forEach(function(player)
								{
									objects.enemies.forEach(function(enemy)
										{
											if (!enemy.active)
											{
												return true;
											}
											if (help.collision(player, enemy, settings.special.nuke.range))
											{
												enemy.hit({x: player.x, y: player.y, damage: 999});
												objects.add.effect({x: enemy.x, y: enemy.y, emoji: emoji.nuke, radius: 8});
											}
											return true;
										});
									objects.waves.forEach(function(wave)
										{
											wave.members.forEach(function(member)
												{
													if (!member.active)
													{
														return true;
													}
													if (help.collision(player, member, settings.special.nuke.range))
													{
														member.hit(999, wave);
														objects.add.effect({x: member.x, y: member.y, emoji: emoji.nuke, radius: 8});
													}
													return true;
												});
											return true;
										});
									return true;
								});
							return true;
						});
					break;

				case '4':
					objects.player.forEach(function(player)
						{
							if (player.special.panic.count <= 0)
							{
								game.flash.ko('#panic');
								return game.hotkey('Unavailable');
							}

							game.flash.ok('#panic');

							player.special.panic.count -= 1;
							js('#panic').text(player.special.panic.count);

							objects.shots.forEach(function(shot)
								{
									shot.active = false;
									return true;
								});
							return true;
						});
					break;

				default:
					break;
			}

			return false;
		}
	},

	mouse: {
		click: function(event)
		{
			switch (game.vars.state)
			{
				case STATE_INIT:
					break;
				case STATE_READY:
					game.vars.state = STATE_RUNNING;
				case STATE_RUNNING:
					break;
				case STATE_END:
					break;
				default:
					break;
			}
			return true;
		},
		move: function(event)
		{
			objects.player.forEach(function(player)
				{
					player.mouse.x = event.offsetX;
					player.mouse.y = event.offsetY;
				});
			return true;
		}
	},

	interface: {
		init: function()
		{
			js('#control_new').event('click', main.controls.new);

			js('body').event('keydown', main.key.down);

			js('canvas').event('mousemove', main.mouse.move);
			js('canvas').event('click', main.mouse.click);

			js('form').event('submit', false);

			game.init();
			game.new();
			return true;
		}
	}
};


const settings = {
	bosses: {
		timer: 150, // Spawn boss every ... seconds
		defaults: {
			radius: 32,
			speed: 3 * SPEED,
			boost: 1.0,
			score: 100,
			hp: 42,
			active: true,
			hit: help.boss.hit,
			boss: true,
			damage: 1
		},
		looks: [
			emoji.alienmonster,
			emoji.alien,
			emoji.ogre,
			emoji.petridish,
			emoji.ghost,
			emoji.octopus,
			emoji.smilingfacewithhorns,
			emoji.angryface,
			emoji.windchime,
			emoji.mirror,
			emoji.planet,
			emoji.ufo,
			emoji.broccoli,
			emoji.donut,
			emoji.soap
		]
	},

	player: {
		hp: 100,
		maxLevel: 50,
		defaults: {
			emoji: emoji.rock,
			hp: 100,
			score: 0,
			show: 0,
			radius: 15,
			speed: 5 * SPEED,
			boost: 1.0,
			active: true,
			level: 0,
			move: help.move.player,
			ui: help.player.ui,
			hit: help.player.hit,
			damage: 4,
			flawless: false
		}
	},

	enemies: {
		defaults: {
			type: null,
			emoji: emoji.ghost,
			radius: 12,
			speed: 4 * SPEED,
			boost: 1.0,
			score: 5,
			active: true,
			hp: 1,
			boss: false,
			damage: 8
		},
		liner: {
			type: 0,
			emoji: emoji.ghost,
			score: 5,
			speed: 2.5 * SPEED,
			move: help.move.enemy.liner,
			hit: help.enemy.hit
		},
		corner: {
			type: 1,
			emoji: emoji.octopus,
			radius: 15,
			score: 7,
			speed: 1.5 * SPEED,
			angle: 0,
			move: help.move.enemy.corner,
			hit: help.enemy.hit
		},
		center: {
			type: 2,
			emoji: emoji.smilingfacewithhorns,
			radius: 15,
			score: 8,
			speed: 4 * SPEED,
			angle: 0,
			move: help.move.enemy.center,
			hit: help.enemy.hit
		},
		follow: {
			type: 3,
			emoji: emoji.angryface,
			radius: 18,
			score: 15,
			speed: 2.5 * SPEED,
			move: help.move.enemy.follow,
			hit: help.enemy.hit
		},
		max: 3,
		next: []
	},

	waves: {
		defaults: {
			shoot: help.shoot.member,
			radius: 15,
			speed: 5 * SPEED,
			boost: 1.0,
			score: 3,
			enemies: 5,
			hp: 1,
			frames: 25 / SPEED,
			count: 0,
			direction: 0,
			rotate: 2 * Math.PI / 180.0,
			distance: 200,
			active: true,
			deaths: 0,
			boss: false,
			damage: 4,
			move: help.move.member,
			hit: help.member.hit
		},
		looks: [
			emoji.alienmonster,
			emoji.alien,
			emoji.ogre,
			emoji.petridish,
			emoji.broccoli,
			emoji.donut,
			emoji.soap
		]
	},

	guns: {
		direct: 0,
		standard: 1,
		backwards: 2,
		leftorright: 3,
		chaos: 4,
		left: 5,
		right: 6,
		satellite: 7,
	},

	bonuses: {
		hp10: {
			type: 0,
			emoji: emoji.hp10,
			hp: 11,
			score: 10
		},
		hp30: {
			type: 1,
			emoji: emoji.hp30,
			hp: 31,
			score: 10
		},
		hp50: {
			type: 2,
			emoji: emoji.hp50,
			hp: 51,
			score: 15
		},
		weapon: {
			type: 3,
			emoji: emoji.testtube
		}
	},

	special: {
		speedboost: {
			active: 600 / SPEED,
			count: 1,
			max: 3,
			frames: 30 * 60 / SPEED
		},
		shield: {
			active: 600 / SPEED,
			count: 0,
			max: 3
		},
		nuke: {
			count: 0,
			max: 3,
			range: 250
		},
		panic: {
			count: 3
		}
	},

	escalation: {
		defaults: {
			level: 5, // Increase spawn-rate at and above this player-level
			chance: 0.3 // Extra chance [0, 1[ to spawn liner
		}
	}
};

settings.enemies.next[settings.enemies.liner.type] = settings.enemies.corner;
settings.enemies.next[settings.enemies.corner.type] = settings.enemies.center;
settings.enemies.next[settings.enemies.center.type] = settings.enemies.follow;


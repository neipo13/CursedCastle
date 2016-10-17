(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _game = require('states/game');

var _game2 = _interopRequireDefault(_game);

var _menu = require('states/menu');

var _menu2 = _interopRequireDefault(_menu);

var _midLevel = require('states/midLevel');

var _midLevel2 = _interopRequireDefault(_midLevel);

var _Color = require('util/Color');

var _Color2 = _interopRequireDefault(_Color);

var _playerHealth = require('util/playerHealth');

var _playerHealth2 = _interopRequireDefault(_playerHealth);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Game = function (_Phaser$Game) {
	_inherits(Game, _Phaser$Game);

	function Game() {
		_classCallCheck(this, Game);

		var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, 512, 288, Phaser.AUTO, 'content', null));

		_this.antialias = false;
		_this.world = 1;
		_this.level = 1;
		_this.color = new _Color2.default();
		_this.health = new _playerHealth2.default();
		_this.state.add('Game', _game2.default, false);
		_this.state.add('Menu', _menu2.default, false);
		_this.state.add('Mid', _midLevel2.default, false);
		_this.state.start('Menu');
		return _this;
	}

	return Game;
}(Phaser.Game);

new Game();

},{"states/game":2,"states/menu":3,"states/midLevel":4,"util/Color":5,"util/playerHealth":6}],2:[function(require,module,exports){
'use strict';

var Game = {
    preload: preload,
    create: create,
    update: update,
    onExit: onExit
};

var player = null,
    input = null,
    platforms = null,
    level = null,
    door = null,
    spikes = null,
    ghost = null,
    goose = null,
    bg = null,
    roomChangedEvent = null,
    ready = false,
    bullets = null;

function preload() {
    player = new Player();
    player.init(game);
    player.preload();

    input = Input;
}

function create() {
    game.stage.backgroundColor = "#0E0518";
    color.initColors();
    ready = false;
    game.stage.smoothed = false;
    roomChangedEvent = new Phaser.Signal();
    //game.stage.backgroundColor = "#0E0518";

    input.create();
    //  The platforms group contains the ground and the 2 ledges we can jump on
    bg = game.add.group(); //backgound stuff 
    platforms = game.add.group();
    door = game.add.group();
    spikes = game.add.group();
    bullets = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    door.enableBody = true;
    spikes.enableBody = true;

    goose = game.add.group();
    ghost = game.add.group();

    var roomsWide = 6;
    var roomsHigh = 3;
    var startRoom = 1; //0<->roomshigh-1

    //for calculations & roomGen
    game.tileSize = 32; //adjust if needed
    game.roomCols = 16;
    game.roomRows = 9;

    levelGen(roomsHigh, roomsWide, startRoom, 2, 1, 1, platforms, door, spikes, goose, ghost, bg, game, roomChangedEvent);
    game.world.setBounds(0, 0, game.tileSize * game.roomCols * (roomsWide + 1), game.tileSize * game.roomCols * (roomsHigh + 1));

    player.create(48, startRoom * game.roomRows * game.tileSize + game.tileSize * (game.roomRows - 2), true, bullets);
    game.camera.x = 0; //roomCols * tileSize / 2;
    game.camera.y = 0; //288
    //game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_PLATFORMER);


    // var b = {r:45,g:136,b:45};
    // var w = {r:34,g:102,b:102};
    // var r = {r:170,g:108,b:57};
    // var g = {r:170,g:57,b:57};
    // setColors(w, r, b, g);

    var bounce = game.add.tween(game.camera);
    game.physics.arcade.isPaused = true;
    bounce.to({ y: 288 }, 1000, Phaser.Easing.Circular.Out);
    bounce.onComplete.add(function () {
        game.physics.arcade.isPaused = false;
        ready = true;
        roomChangedEvent.dispatch({ x: game.camera.x, y: game.camera.y, width: game.tileSize * game.roomCols, height: game.tileSize * game.roomRows });
    }, this);
    bounce.start();
}

function update() {
    if (ready) {
        var playerLand = onLandClosure(player);
        var gooseHit = enemyHit(goose, player);
        game.physics.arcade.collide(player.sprite, platforms, playerLand, player.preLand);
        game.physics.arcade.overlap(player.sprite, door, player.collideWithDoor);
        game.physics.arcade.collide(player.sprite, spikes, player.collideWithSpike);

        game.physics.arcade.collide(goose, platforms, hitGoose);

        game.physics.arcade.collide(ghost, player.sprite, enemyHit(ghost, player), processEnemyHit(ghost, player));
        game.physics.arcade.collide(goose, player.sprite, gooseHit);

        game.physics.arcade.collide(platforms, bullets, bulletHit(platforms, bullets));
        game.physics.arcade.collide(goose, bullets, bulletHit(goose, bullets));
        game.physics.arcade.collide(ghost, bullets, bulletHit(ghost, bullets));

        goose.callAll('doUpdate', null);
        ghost.callAll('doUpdate', null, player.sprite.x, player.sprite.y, player.sprite.scale.x);
        bullets.callAll('doUpdate', null);

        var commands = input.update();
        player.update(commands);
        var newLoc = player.getCurrentRoomXY();

        if (game.camera.x !== newLoc.x || game.camera.y !== newLoc.y) {
            //broadcast room changed event
            newLoc.width = game.tileSize * game.roomCols;
            newLoc.height = game.tileSize * game.roomRows;
            roomChangedEvent.dispatch(newLoc);

            var bounce = game.add.tween(game.camera);
            game.physics.arcade.isPaused = true;
            ready = false;
            bounce.to({ y: newLoc.y, x: newLoc.x }, 200, Phaser.Easing.Circular.InOut);
            bounce.onComplete.add(function () {
                game.physics.arcade.isPaused = false;
                ready = true;
            }, this);
            bounce.start();
        }

        if (commands.colors) {
            color.setRandomColors();
        }
    }
}

function enemyHit(enemy, player) {
    return function (playerSprite, enemySprite) {
        player.collideWithEnemy(player.sprite, enemySprite);
        //get the specific child somehow
        enemySprite.collide(enemySprite, player.sprite);
    };
}

function processEnemyHit(enemy, player) {
    return function (playerSprite, enemySprite) {
        return enemySprite.processCollide(enemySprite, player.sprite);
    };
}

function bulletHit(obj, bullet) {
    return function (objSprite, bulletSprite) {
        bulletSprite.collide(bulletSprite, objSprite);
        if (typeof objSprite.collide == 'function') {
            objSprite.collide(objSprite, bulletSprite, true);
        }
    };
}

function onLandClosure(p) {
    return function (col1, col2) {
        return p.onLand(col1, col2, p);
    };
}

function onExit() {
    var bounce = game.add.tween(game.camera);
    game.physics.arcade.isPaused = true;
    player.sprite.visible = false;
    ready = false;
    bounce.to({ y: game.camera.y + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(function () {
        game.physics.arcade.isPaused = false;
        game.state.start('Mid');
    }, this);
    bounce.start();
}

function hitGoose(goose, other) {
    goose.collide(goose, other);
}

},{}],3:[function(require,module,exports){
'use strict';

var Menu = {
    preload: preload,
    create: create,
    update: update,
    onExit: onExit
};

var player = null,
    input = null,
    platforms = null,
    level = null,
    door = null,
    spikes = null,
    bullets = null;

function preload() {
    game.load.image('tile', 'assets/img/tile.png');
    game.load.image('door', 'assets/img/door.png');
    game.load.image('tile', 'assets/img/tile.png');
    game.load.image('door', 'assets/img/door.png');
    game.load.image('spike', 'assets/img/spike.png');
    game.load.image('particle', 'assets/img/particle.png');
    game.load.image('hp', 'assets/img/healthBlock.png');
    game.load.image('shelf', 'assets/img/shelf.png');
    game.load.image('window', 'assets/img/window.png');
    game.load.image('bgdoor', 'assets/img/bgdoor.png');

    game.load.spritesheet('goose', 'assets/img/goose.png', 32, 32, 4);
    game.load.spritesheet('ghost', 'assets/img/ghost.png', 32, 32, 2);
    game.load.spritesheet('player', 'assets/img/playersheet.png', 32, 32, 32);
    game.load.spritesheet('bullet', 'assets/img/bulletsheet.png', 32, 32, 18);
    game.load.spritesheet('xplo', 'assets/img/explosion.png', 32, 32, 8);

    game.load.audio('jump', 'assets/sounds/effects/jump.wav');
    game.load.audio('land', 'assets/sounds/effects/land.wav');
    game.load.audio('step', 'assets/sounds/effects/step.wav');
    game.load.audio('ouch', 'assets/sounds/effects/dmg.wav');

    game.load.shader('ColorReplace', 'assets/shaders/ColorReplaceFilter.frag');

    player = new Player();
    player.init();
    player.preload();

    input = Input;

    var date = new Date();
    var seed = date.getDate() + '' + date.getDay() + date.getHours() + date.getMilliseconds();
    game.rnd.sow(seed);
}

function create() {
    health.resetHp();
    game.stage.backgroundColor = "#0E0518";
    color.initColors();
    ready = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    door = game.add.group();
    spikes = game.add.group();
    bullets = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;
    door.enableBody = true;
    spikes.enableBody = true;
    //generate the menu room
    roomGen(platforms, door, spikes, null, null, null, 'ME', 'NU', 0, 0, 32, 16, 9);
    game.world.setBounds(0, 0, 512, 1024);

    player.create(256, 144, false, bullets);
    input.create();

    var titleStyle = { fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    var title = game.add.text(0, 0, "Cursed Castle", titleStyle);
    title.setTextBounds(0, 77, 512, 77);

    var descStyle = { fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", fontSize: "16", wordWrap: true, align: 'center' };

    var doorDesc = game.add.text(0, 0, "Press down or S Here to Enter", descStyle);
    doorDesc.setTextBounds(0, 100, 225, 100);
}

function update() {
    var playerLand = onLandClosure(player);
    game.physics.arcade.collide(player.sprite, platforms, playerLand, player.preLand);
    game.physics.arcade.overlap(player.sprite, door, player.collideWithDoor);
    game.physics.arcade.collide(player.sprite, spikes, player.collideWithSpike);

    game.physics.arcade.collide(platforms, bullets, bulletHit(platforms, bullets));
    var commands = input.update();
    player.update(commands);
    bullets.callAll('doUpdate', null);
}

function onLandClosure(p) {
    return function (col1, col2) {
        return p.onLand(col1, col2, p);
    };
}

function onExit() {
    var bounce = game.add.tween(game.camera);
    player.sprite.visible = false;
    bounce.to({ y: 288 + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(function () {
        game.state.start('Game');
    }, this);
    bounce.start();
}
function bulletHit(obj, bullet) {
    return function (objSprite, bulletSprite) {
        bulletSprite.collide(bulletSprite, objSprite);
    };
}

},{}],4:[function(require,module,exports){
'use strict';

var Mid = {
    preload: preload,
    create: create,
    update: update,
    onExit: onExit
};

var player = null,
    input = null,
    platforms = null,
    level = null,
    door = null,
    spikes = null,
    ready = false,
    bullets = null;

function preload() {
    player = new Player();
    player.init();
    player.preload();

    input = Input;
}

function create() {
    game.stage.backgroundColor = "#0E0518";
    color.initColors();
    ready = false;
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    door = game.add.group();
    spikes = game.add.group();
    bullets = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;
    door.enableBody = true;
    spikes.enableBody = true;
    //generate the menu room
    roomGen(platforms, door, spikes, null, null, null, 'MI', 'D', 0, 288, 32, 16, 9);
    game.world.setBounds(0, 0, 512, 900);

    player.create(80, 224 + 288, true, bullets);
    input.create();

    var lvlStyle = { fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    var prev = game.add.text(0, 0, world + '-' + level, lvlStyle);
    prev.setTextBounds(0, 77 + 288, 256, 77);
    level++;

    var next = game.add.text(256, 0, world + '-' + level, lvlStyle);
    next.setTextBounds(0, 77 + 288, 256, 77);

    var bounce = game.add.tween(game.camera);
    game.physics.arcade.isPaused = true;
    bounce.to({ y: 288 }, 1000, Phaser.Easing.Circular.Out);
    bounce.onComplete.add(function () {
        game.physics.arcade.isPaused = false;
        ready = true;
    }, this);
    bounce.start();
}

function update() {
    if (ready) {
        var playerLand = onLandClosure(player);
        game.physics.arcade.collide(player.sprite, platforms, playerLand, player.preLand);
        game.physics.arcade.overlap(player.sprite, door, player.collideWithDoor);
        game.physics.arcade.collide(player.sprite, spikes, player.collideWithSpike);
        game.physics.arcade.collide(platforms, bullets, bulletHit(platforms, bullets));
        var commands = input.update();
        player.update(commands);
        bullets.callAll('doUpdate', null);
    }
}

function onLandClosure(p) {
    return function (col1, col2) {
        return p.onLand(col1, col2, p);
    };
}

function onExit() {
    var bounce = game.add.tween(game.camera);
    player.sprite.visible = false;
    game.physics.arcade.isPaused = true;
    bounce.to({ y: 288 + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(function () {
        game.physics.arcade.isPaused = false;
        game.state.start('Game');
    }, this);
    bounce.start();
}

function bulletHit(obj, bullet) {
    return function (objSprite, bulletSprite) {
        bulletSprite.collide(bulletSprite, objSprite);
    };
}

},{}],5:[function(require,module,exports){
'use strict';

var Color = function Color() {
    var _this = this;

    _this.filter = null, _this.white = null, _this.red = null, _this.black = null, _this.grey = null;
    _this.initColors = initColors;
    _this.setColors = setColors;
    _this.setRandomColors = setRandomColors;

    function initColors() {
        if (_this.filter === null) {
            return;
        }

        var uniforms = {
            //white
            findColor1: { type: '3f', value: { x: 186 / 255, y: 213 / 255, z: 219 / 255 } },
            replaceWithColor1: { type: '3f', value: { x: _this.white.r / 255, y: _this.white.g / 255, z: _this.white.b / 255 } },
            //red
            findColor2: { type: '3f', value: { x: 194 / 255, y: 14 / 255, z: 14 / 255 } },
            replaceWithColor2: { type: '3f', value: { x: _this.red.r / 255, y: _this.red.g / 255, z: _this.red.b / 255 } },
            //black
            findColor3: { type: '3f', value: { x: 14 / 255, y: 5 / 255, z: 24 / 255 } },
            replaceWithColor3: { type: '3f', value: { x: _this.black.r / 255, y: _this.black.g / 255, z: _this.black.b / 255 } },
            //grey
            findColor4: { type: '3f', value: { x: 80 / 255, y: 80 / 255, z: 80 / 255 } },
            replaceWithColor4: { type: '3f', value: { x: _this.grey.r / 255, y: _this.grey.g / 255, z: _this.grey.b / 255 } }
        };
        _this.filter = new Phaser.Filter(game, uniforms, game.cache.getShader('ColorReplace'));
        //console.log(filter);
        game.world.filters = [_this.filter];
        var color = Phaser.Color.getColor32(1, _this.black.r, _this.black.g, _this.black.b);
        game.stage.backgroundColor = color;
    }

    function setColors(white, red, black, grey) {
        //{ x: 14/255, y: 5/255, z: 24/255 } black
        //{ x: 194/255, y: 14/255, z: 14/255 } red
        //{ x: 80/255, y: 80/255, z: 80/255 } grey
        //{ x: 186/255, y: 213/255, z: 219/255 } white
        _this.white = white;
        _this.red = red;
        _this.black = black;
        _this.grey = grey;
        var uniforms = {
            //white
            findColor1: { type: '3f', value: { x: 186 / 255, y: 213 / 255, z: 219 / 255 } },
            replaceWithColor1: { type: '3f', value: { x: white.r / 255, y: white.g / 255, z: white.b / 255 } },
            //red
            findColor2: { type: '3f', value: { x: 194 / 255, y: 14 / 255, z: 14 / 255 } },
            replaceWithColor2: { type: '3f', value: { x: red.r / 255, y: red.g / 255, z: red.b / 255 } },
            //black
            findColor3: { type: '3f', value: { x: 14 / 255, y: 5 / 255, z: 24 / 255 } },
            replaceWithColor3: { type: '3f', value: { x: black.r / 255, y: black.g / 255, z: black.b / 255 } },
            //grey
            findColor4: { type: '3f', value: { x: 80 / 255, y: 80 / 255, z: 80 / 255 } },
            replaceWithColor4: { type: '3f', value: { x: grey.r / 255, y: grey.g / 255, z: grey.b / 255 } }
        };
        _this.filter = new Phaser.Filter(game, uniforms, game.cache.getShader('ColorReplace'));
        //console.log(filter);
        game.world.filters = [_this.filter];
        var color = Phaser.Color.getColor32(1, black.r, black.g, black.b);
        game.stage.backgroundColor = color;
    }

    function setRandomColors() {
        var b = { r: game.rnd.integerInRange(0, 255), g: game.rnd.integerInRange(0, 255), b: game.rnd.integerInRange(0, 255) };
        var w = { r: game.rnd.integerInRange(0, 255), g: game.rnd.integerInRange(0, 255), b: game.rnd.integerInRange(0, 255) };
        var r = { r: game.rnd.integerInRange(0, 255), g: game.rnd.integerInRange(0, 255), b: game.rnd.integerInRange(0, 255) };
        var g = { r: game.rnd.integerInRange(0, 255), g: game.rnd.integerInRange(0, 255), b: game.rnd.integerInRange(0, 255) };
        setColors(w, r, b, g);
    }
};

},{}],6:[function(require,module,exports){
'use strict';

var Health = function Health() {
    var _this = this;

    _this.startHp = 8;

    _this.maxHp = 8;
    _this.hp = 8;
    _this.healthSprites = null;
    _this.deathEvent = null;

    _this.resetHp = function resetHp() {
        _this.maxHp = _this.startHp;
        _this.hp = _this.startHp;

        _this.deathEvent = new Phaser.Signal();
    };

    _this.newScene = function newScene() {
        //sprites
        _this.healthSprites = game.add.group();
        _this.healthSprites.x = 24;
        _this.healthSprites.y = 96;
        _this.healthSprites.fixedToCamera = true;
        for (var i = 0; i < _this.hp; i++) {
            addToHealthBar();
        }
    };

    function addToHealthBar() {
        var len = _this.healthSprites.length;
        _this.healthSprites.create(_this.healthSprites.x, _this.healthSprites.y - len * 8, 'hp');
        //_this.healthSprites.y += 8;
    }

    function changeHealthBar(index, visible) {
        if (_this.healthSprites.children) {
            _this.healthSprites.children[index].visible = visible;
        }
    }

    _this.setHp = function setHp(newHp) {
        var diff = newHp - _this.hp;
        var positive = diff > 0;
        _this.hp = newHp;
        //change sprites
        if (_this.hp >= _this.maxHp) {
            _this.hp = _this.maxHp;
            for (var i = 0; i < _this.healthSprites.children; i++) {
                changeHealthBar(i, true);
            }
        } else if (_this.hp > 0) {
            for (var i = Math.abs(diff); i > 0; i--) {
                changeHealthBar(_this.hp - i * (positive ? 1 : -1) - 1, positive);
            }
        } else {
            for (var i = 0; i < _this.healthSprites.children; i++) {
                changeHealthBar(i, false);
            }
            returnToMenu();
        }
    };

    _this.takeDmg = function takeDmg(dmg) {
        _this.setHp(_this.hp - dmg);
    };

    _this.gainHp = function gainHp(gain) {
        _this.setHp(_this.hp + gain);
    };

    function returnToMenu() {
        //TODO: trigger event and have player play death anim 
        //(maybe hide everything else and pan camera to track player)
        //wait for input on end of death anim and transition state there
        game.state.start('Menu');
    }
};

},{}]},{},[1])
//# sourceMappingURL=game.js.map

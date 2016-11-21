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
    game.world.setBounds(0, 0, 512 , 900);
    
    
    player.create(80, 224 + 288, true, bullets);
    input.create();
    
    var lvlStyle = {font:'VT323', fontSize:'32px', fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

    var prev = game.add.text(0, 0, world + '-' + level, lvlStyle);
    prev.setTextBounds(0, 77 + 288, 256, 77);
    level++;

    var next = game.add.text(256, 0, world + '-' + level, lvlStyle);
    next.setTextBounds(0, 77 + 288, 256, 77);
    
    var bounce = game.add.tween(game.camera);
    game.physics.arcade.isPaused = true;
    bounce.to({ y: 288 }, 1000, Phaser.Easing.Circular.Out);
    bounce.onComplete.add(
        function(){ 
            game.physics.arcade.isPaused = false; 
            ready = true;
        }, this);
    bounce.start();
    
}

function update(){
    if(ready){
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

function onLandClosure(p){
    return function(col1, col2){
        return p.onLand(col1, col2, p);
    }
}

function onExit(){
    var bounce = game.add.tween(game.camera);
    player.sprite.visible = false;
    game.physics.arcade.isPaused = true;
    bounce.to({ y: 288 + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(
        function(){
            game.physics.arcade.isPaused = false;
            game.state.start('Game');
        }, this);
    bounce.start();
}

function bulletHit (obj, bullet){
    return function(objSprite, bulletSprite){
        bulletSprite.collide(bulletSprite, objSprite);
    }
}
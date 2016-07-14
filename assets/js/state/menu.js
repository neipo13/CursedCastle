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
    bullets= null;

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
    game.rnd.sow(seed)

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
    game.world.setBounds(0, 0, 512 , 1024);
    
    
    player.create(256, 144, false, bullets);
    input.create();
    
    var titleStyle = {fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

    var title = game.add.text(0, 0, "Cursed Castle", titleStyle);
    title.setTextBounds(0, 77, 512, 77);
    
    var descStyle = {fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", fontSize: "16", wordWrap:true, align:'center'};
    
    var doorDesc = game.add.text(0,0, "Press down or S Here to Enter", descStyle);
    doorDesc.setTextBounds(0, 100, 225, 100);
    
}

function update(){
    var playerLand = onLandClosure(player);
    game.physics.arcade.collide(player.sprite, platforms, playerLand, player.preLand);
    game.physics.arcade.overlap(player.sprite, door, player.collideWithDoor);
    game.physics.arcade.collide(player.sprite, spikes, player.collideWithSpike);
        
    game.physics.arcade.collide(platforms, bullets, bulletHit(platforms, bullets));
    var commands = input.update();
    player.update(commands);
    bullets.callAll('doUpdate', null);
}

function onLandClosure(p){
    return function(col1, col2){
        return p.onLand(col1, col2, p);
    }
}

function onExit(){
    var bounce=game.add.tween(game.camera);
    player.sprite.visible = false;
    bounce.to({ y: 288 + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(function(){ game.state.start('Game');}, this);
    bounce.start();
}
function bulletHit (obj, bullet){
    return function(objSprite, bulletSprite){
        bulletSprite.collide(bulletSprite, objSprite);
    }
}
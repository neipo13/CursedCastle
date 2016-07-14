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
    game.world.setBounds(0, 0, game.tileSize * game.roomCols * (roomsWide +1), game.tileSize * game.roomCols * (roomsHigh + 1));
    
    
    player.create(48, (startRoom * game.roomRows * game.tileSize) + (game.tileSize * (game.roomRows-2)), true, bullets);
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
    bounce.onComplete.add(
        function(){ 
            game.physics.arcade.isPaused = false; 
            ready = true;
            roomChangedEvent.dispatch({x:game.camera.x, y:game.camera.y, width: game.tileSize * game.roomCols, height:game.tileSize * game.roomRows});
        }, this);
    bounce.start();
}

function update(){
    if(ready){
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
        
            
        if(game.camera.x !== newLoc.x || game.camera.y !== newLoc.y ){
            //broadcast room changed event
            newLoc.width = game.tileSize * game.roomCols;
            newLoc.height = game.tileSize * game.roomRows;
            roomChangedEvent.dispatch(newLoc);
            
            var bounce = game.add.tween(game.camera);
            game.physics.arcade.isPaused = true;
            ready = false;
            bounce.to({ y: newLoc.y, x:newLoc.x }, 200, Phaser.Easing.Circular.InOut);
            bounce.onComplete.add(
                function(){
                    game.physics.arcade.isPaused = false;
                    ready = true;
                }, this);
            bounce.start();
        }
        
        if(commands.colors){
            color.setRandomColors();
        }
    }
}

function enemyHit (enemy, player){
    return function(playerSprite, enemySprite){
        player.collideWithEnemy(player.sprite, enemySprite);
        //get the specific child somehow
        enemySprite.collide(enemySprite, player.sprite);
    }
}

function processEnemyHit (enemy, player){
    return function(playerSprite, enemySprite){
        return enemySprite.processCollide(enemySprite, player.sprite);
    }
}

function bulletHit (obj, bullet){
    return function(objSprite, bulletSprite){
        bulletSprite.collide(bulletSprite, objSprite);
        if(typeof objSprite.collide == 'function'){
            objSprite.collide(objSprite, bulletSprite, true)
        }
    }
}

function onLandClosure(p){
    return function(col1, col2){
        return p.onLand(col1,col2, p);
    }
}

function onExit(){
    var bounce = game.add.tween(game.camera);
    game.physics.arcade.isPaused = true;
    player.sprite.visible = false;
    ready = false;
    bounce.to({ y: game.camera.y + 288 }, 1000, Phaser.Easing.Circular.In);
    bounce.onComplete.add(
        function(){
            game.physics.arcade.isPaused = false;
            game.state.start('Mid');
        }, this);
    bounce.start();
}

function hitGoose(goose, other){
    goose.collide(goose, other);
}
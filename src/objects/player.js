var Player = function(){
    var _this = this;
    
    _this.sprite = null;
    //input
    _this.wasd = null;
    _this.cursors = null;
    //effects
    _this.leftPuff = null;
    _this.rightPuff = null;
    _this.jumpPuff = null;
    _this.preLandVelocity = 0;
    //game feels
    _this.lastFrameInputX = '';
    _this.lastFrameInputY = '';
    //health
    _this.invincibilityFrames = 120;
    _this.invincibilityTimer = 120;
    _this.invincible = false;
    _this.knockback = {
        'x': 50,
        'y': 150
    }
    _this.controlLoss = false;
    _this.controlLossFrames = 30;
    _this.controlLossTimer = 30;
    //jump
    _this.varJumpTimerMs = 150;
    _this.jump;
    // _this.maxHp = 10;
    // _this.hp = 10;
    // _this.healthSprites = null;
    
    _this.bulletManager = null;
    _this.reloadTime = 10;
    _this.reloadTimer = 0;
        
    _this.init = function(){
        _this.leftPuff = new Dust();
        _this.rightPuff = new Dust();
        _this.jumpPuff = new JumpDust();
    };
    
    _this.preload = function(){
        _this.leftPuff.preload();
        _this.rightPuff.preload();
        _this.jumpPuff.preload();
    };
    
    _this.create = function(startX, startY, showHealth, bulletGroup) {
        if(showHealth){
            health.newScene();
        }
        _this.leftPuff.create(true);
        _this.rightPuff.create(false);
        _this.jumpPuff.create();
        _this.sprite = game.add.sprite(startX, startY, 'player');
        _this.realX = startX;
        _this.realY = startY;
        
        _this.sprite.animations.add('idle', [8,9,10,11], 5, true);
        _this.sprite.animations.add('run', [16,17,18,19,20,21,22,23],15,true);
        _this.sprite.animations.add('jump', [6,7], 15, false);
        _this.sprite.animations.add('fall', [0,1], 15, false);
        _this.sprite.animations.add('hit', [4,5], 15, true);
        _this.sprite.animations.add('shoot', [12,13], 15, true);
        _this.sprite.animations.add('runshoot', [24, 25, 26, 27, 28, 29, 30, 31], 15, true);
        
        game.physics.arcade.enable(_this.sprite);
        _this.sprite.body.bounce.y = 0;
        _this.sprite.body.gravity.y = 350;
        _this.sprite.body.collideWorldBounds = true;
        
        _this.sprite.anchor.setTo(.5, .5);
        _this.sprite.body.setSize(18, 16, 0, 8);
        _this.sprite.scale.setTo(1,1);
    
        _this.animate('idle');
        _this.jump = 175;
        //_this.setupHealth();
        _this.bulletManager = new BulletManager(bulletGroup, 3);
        
    }
    
    _this.setupHealth = function(){
        //sprites
        _this.healthSprites = game.add.group();
        _this.healthSprites.x = 24;
        _this.healthSprites.y = 96;
        _this.healthSprites.fixedToCamera = true;
        for(var i = 0; i < _this.maxHp; i++){
            addToHealthBar();
        }
        //variables
        _this.hp = 10;
        
    }
    
    function addToHealthBar(){
        var len = _this.healthSprites.length;
        _this.healthSprites.create(_this.healthSprites.x, _this.healthSprites.y - (len * 8), 'hp');
        //_this.healthSprites.y += 8;
    }
    
    function changeHealthBar(index, visible){
        _this.healthSprites.children[index].visible = visible;
    }
    
    function setHp (newHp){
        var diff = newHp - _this.hp;
        console.log(diff);
        _this.hp = newHp;
        //change sprites
        if(_this.hp >= 0){
            changeHealthBar(_this.hp - diff - 1, diff > 0);
        }
    }
    
    _this.update = function(input){
        if(!this.controlLoss){
            _this.updateMovement(input);
            _this.updateShooting(input);
        }
        _this.updateInvincibility();
        _this.sprite.isOnDoor = false;
    };
    
    _this.updateMovement = function (input){
        //handle x movement
        if(input.left)
        { 
            if(_this.sprite.body.velocity.x >= 0 && _this.sprite.body.velocity.y === 0 && _this.lastFrameInputX !== 'L'){
                _this.rightPuff.play(_this.sprite.x-15, _this.sprite.y-16);
                game.sound.play('step');
            }
            if(!_this.sprite.body.blocked.left && !_this.sprite.body.touching.left){
                _this.sprite.body.velocity.x = -200;
            }
            _this.sprite.scale.x = -1;
            if(_this.sprite.body.touching.down){
                _this.animate('run');
            }
            _this.lastFrameInputX = 'L';
            
        }
        else if(input.right)
        {
            if(_this.sprite.body.velocity.x <= 0 && _this.sprite.body.velocity.y === 0 && _this.lastFrameInputX !== 'R'){
                _this.leftPuff.play(_this.sprite.x+15, _this.sprite.y-16);
                game.sound.play('step');
            }
            if(!_this.sprite.body.blocked.right && !_this.sprite.body.touching.right){
                _this.sprite.body.velocity.x = 200;
            }
            _this.sprite.scale.x = 1;
            if(_this.sprite.body.touching.down){
                _this.animate('run');
            }
            _this.lastFrameInputX='R';
        }
        else
        {
            _this.sprite.body.velocity.x = 0;
            if(_this.sprite.body.touching.down){
                _this.animate('idle');
            }
            _this.lastFrameInputX = '';
        }
        
        if(input.up && _this.sprite.body.touching.down && !_this.sprite.body.touching.up && _this.lastFrameInputY !== 'U'){
            _this.sprite.body.velocity.y = -_this.jump;
            _this.animate('jump');
            game.sound.play('jump');
            _this.jumpPuff.play(_this.sprite.x - 16, _this.sprite.y - 16);
            _this.leftPuff.play(_this.sprite.x - 5, _this.sprite.y-16);
            _this.rightPuff.play(_this.sprite.x + 5, _this.sprite.y-16);
            _this.varJumpTimerMs = 150;
            _this.lastFrameInputY = 'U'
        }
        else if(input.up && _this.lastFrameInputY ==='U' && _this.varJumpTimerMs > 0){
            _this.lastFrameInputY = 'U';
            _this.varJumpTimerMs -= 10;
            _this.sprite.body.velocity.y = -_this.jump;
        }
        else{
            _this.lastFrameInputY = '';
        }
        
        if(input.down && _this.sprite.isOnDoor){
            game.state.getCurrentState().onExit();
        }
        
        if(!_this.sprite.body.touching.down){
            if(_this.sprite.body.velocity.y >= 0 && _this.sprite.animations.currentAnim.name !== 'fall'){
                _this.animate('fall');
            }
        }
        
    }
    
    _this.updateShooting = function(input){
        if(input.shoot && _this.reloadTimer <= 0){
            _this.bulletManager.fire(_this.sprite.x, _this.sprite.y, (_this.sprite.scale.x > 0 ? 'R' : 'L'));
            _this.reloadTimer = _this.reloadTime;
            _this.animate('shoot');
        }
        if(_this.reloadTimer > 0){
            _this.reloadTimer--;
        }
    }
    
    _this.updateInvincibility = function(){
        if(_this.invincible){
            
            if(_this.invincibilityTimer >= _this.invincibilityFrames){
                _this.invincibilityTimer = 0;
                _this.invincible = false;
            }
            else{
                _this.invincibilityTimer++;
            }
        }
        if(_this.controlLoss){
            if(_this.controlLossTimer >= _this.controlLossFrames){
                _this.controlLossTimer = 0;
                _this.controlLoss = false;
            }
            else{
                _this.controlLossTimer++;
            }
        }
    }
    
    _this.getCurrentRoomXY = function(){
        var roomSizeX = game.tileSize * game.roomCols;
        var roomX = Math.floor(_this.sprite.x / roomSizeX) * roomSizeX;
        var roomSizeY = game.tileSize * game.roomRows;
        var roomY = Math.floor(_this.sprite.y / roomSizeY) * roomSizeY;
        var roomXY = {x: roomX, y:roomY}
        
        return roomXY;
    };
    
    _this.onLand = function(sprite, tile, player){
        if(sprite.body.blocked.down || sprite.body.touching.down || sprite.body.blocked.up || sprite.body.touching.up){
            if(sprite.preLandVelocity > 100){
                sprite.preLandVelocity = 0;
                player.leftPuff.play(_this.sprite.x - 5, _this.sprite.y-16);
                player.rightPuff.play(_this.sprite.x + 5, _this.sprite.y-16);
                game.sound.play('land');
            }
            return true;
        }
    };
    
    _this.preLand = function(sprite, tile){
        sprite.preLandVelocity = sprite.body.velocity.y;
        return true;
    };
    
    _this.collideWithDoor = function(sprite){
        sprite.isOnDoor = true;
        return true;
    };
    _this.collideWithSpike = function(sprite, spike){
        if(!_this.invincible){
            _this.getHit(1, spike.x);
            return true;
        }
        else{
            return false;
        }
    };
    
    _this.collideWithEnemy = function(sprite, enemy){
        if(!_this.invincible){
            _this.getHit(1, enemy.x);
            return true;
        }
        else{
            return false;
        }
    };
    
    _this.getHit = function(dmg, obstacleX){
        console.log('OWWWWWWW');
        game.sound.play('ouch');
        health.takeDmg(dmg);
        _this.animate('hit');
        _this.invincible = true;
        _this.controlLoss = true;
        _this.invincibilityTimer = 0;
        _this.controlLossTimer = 0;
        if(_this.sprite.x < obstacleX){
            //set player velocity up and left
            _this.sprite.body.velocity.x = -_this.knockback.x;
            _this.sprite.body.velocity.y = -_this.knockback.y;
        }
        else if(_this.sprite.x > obstacleX){
            //set player velocity up and right
            _this.sprite.body.velocity.x = +_this.knockback.x;
            _this.sprite.body.velocity.y = -_this.knockback.y;
        }
    }
    
    _this.animate = function(name, overridesShootAnim){
        overridesShootAnim = overridesShootAnim || false;
        if(overridesShootAnim || (_this.sprite.animations.currentFrame.index !== 12 )){
            _this.sprite.animations.play(name);
        }
    }
};
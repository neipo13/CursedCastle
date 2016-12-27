Bat = function(){
    this.moveSpeed = 50;
    this.slideSpeed = 15;
    this.moveAccel = 60;
    this.verticalAccel = 50;
    this.particleMax = 10;
    this.onscreen = false;
    this.active = false;
    this.maxHealth = 2;
    this.health = this.maxHealth;
}
Bat.prototype = Object.create(Phaser.Sprite.prototype);
Bat.prototype.constructor = Bat;
Bat.prototype.create = function(x, y, roomChangedEvent) {
    Phaser.Sprite.call(this, game, x, y, 'bat');
    var idle = this.animations.add('idle', [0,1], 5, true);
    var release = this.animations.add('release', [0,1,2,6,7,8,12], 15, false);
    release.onComplete.add(function(){this.animations.play('fly')}, this);
    var fly = this.animations.add('fly', [3,4,5,9,10,11,15,16,17,21], 15, true);

    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity = this.moveSpeed;

    this.anchor.setTo(.5, .5);
    this.scale.setTo(1,1);
    this.body.setSize(16, 16, 8, 8);
    this.body.allowGravity = false;

    this.animations.play('idle');
    roomChangedEvent.add(this.setActive, this);
    this.events.onKilled.add(this.explode, this);
}

Bat.prototype.doUpdate = function(playerX, playerY, playerScale){
    if(this.onscreen){
        var isLeft = playerX < this.x;
        var isBelow = playerY > this.y;
        //activate
        if(!this.active && isBelow && Math.abs(playerX - this.x) < 100){
            this.active = true;
            this.animations.play('release');
        }
        if(isLeft && this.scale.x < 0){
            this.scale.x = 1;
        }
        else if(!isLeft && this.scale.x > 0){
            this.scale.x = -1;
        }

        if(isLeft && this.active){
            this.body.velocity.x = -this.moveAccel;
        }
        else if(this.active){
            this.body.velocity.x = this.moveAccel;
        }

        if(isBelow && this.active){
            this.body.velocity.y = this.verticalAccel;
        }
        else if(this.active){
            this.body.velocity.y = -this.verticalAccel;
        }
    }
}

Bat.prototype.processCollide = function(){
    console.log('bat collide', this.active);
    return this.active;
}

Bat.prototype.collide = function(sprite, collider, dmg){
    dmg = dmg || false;
    if(dmg){
        // sprite.visible = false;
        // sprite.body.enable = false;
        // sprite.onscreen = false;
        sprite.damage(1);
    }
    return true;
}

Bat.prototype.setActive = function(roomXY){
    if(roomXY){
        var roomX = Math.floor(this.x / roomXY.width) * roomXY.width;
        var roomY = Math.floor(this.y / roomXY.height) * roomXY.height;

        if(roomX === roomXY.x && roomY === roomXY.y){
            this.onscreen = true
        }
        else if(this.onscreen){
            this.onscreen = false;
            this.body.reset(this.x, this.y);
        }
    }
}

Bat.prototype.explode = function(){
    var x = new Xplo();
    x.create(this.x, this.y);
    this.emitter=null;

    //random number to determine drops
    var rand = game.rnd.integerInRange(0, 99);
    if(rand < 10){
      var y = new HealthDrop();
      y.create(this.x, this.y);
    }
}

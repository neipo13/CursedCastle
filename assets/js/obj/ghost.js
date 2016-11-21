Ghost = function(){
    this.moveSpeed = 50;
    this.slideSpeed = 15;
    this.moveAccel = 25;
    this.verticalAccel = 15;
    this.emitter = null;
    this.particleMax = 10;
    this.onscreen = false;
    this.active = false;
    this.maxHealth = 2;
    this.health = this.maxHealth;
}
Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;
Ghost.prototype.create = function(x, y, roomChangedEvent) {
    Phaser.Sprite.call(this, game, x, y, 'ghost');

    this.emitter = game.add.emitter(x, y, 50);
    this.emitter.makeParticles('particle');
    this.emitter.gravity = 50;
    this.emitter.setSize(5, 16);
    this.emitter.setScale(1, 7, 1, 7);

    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.anchor.setTo(.5, .5);
    this.scale.setTo(1,1);
    this.body.setSize(16, 16, 8, 8);
    this.body.allowGravity = false;

    this.frame = 0;
    roomChangedEvent.add(this.setActive, this);
    this.events.onKilled.add(this.explode, this);
}

Ghost.prototype.doUpdate = function(playerX, playerY, playerScale){
    if(this.onscreen){
        var isLeft = playerX < this.x;
        var isBelow = playerY > this.y;
        this.active = null;

        if((playerScale > 0 && !isLeft) || (playerScale < 0 && isLeft)){
            this.frame = 0;
            this.active = true;
            this.body.maxVelocity = this.moveSpeed;
            if(this.emitter !== null){
                this.emitter.x = this.x + 10 * this.scale.x;
                this.emitter.y = this.y;
                //  The first parameter sets the effect to "explode" which means all particles are emitted at once
                //  The second gives each particle a 2000ms lifespan
                //  The third is ignored when using burst/explode mode
                //  The final parameter (10) is how many particles will be emitted in this single burst
                if(!this.emitter.on){
                    this.emitter.setXSpeed(0, this.particleMax);
                    this.emitter.setYSpeed(0, 2);
                    this.emitter.start(false, 500, 100, 1);
                }
            }
        }
        else {
            this.frame = 1;
            this.active = false;
            if(Math.abs(this.body.velocity.x) > 0 || Math.abs(this.body.velocity.y) > 0){
                if(Math.abs(this.body.velocity.x) <= 2.5
                || Math.abs(this.body.velocity.y) <= 2.5){
                    this.body.reset(this.x, this.y);
                }
                else{
                    this.body.maxVelocity = this.slideSpeed;
                    this.body.velocity.x /= 1.2;
                    this.body.velocity.y /= 1.2;
                }
                //console.log(this.body.velocity);
            }
        }
        if(isLeft && this.scale.x < 0){
            this.scale.x = 1;
        }
        else if(!isLeft && this.scale.x > 0){
            this.scale.x = -1;
        }

        if(isLeft && this.active){
            this.body.acceleration.x = -this.moveAccel;
        }
        else if(this.active){
            this.body.acceleration.x = this.moveAccel;
        }

        if(isBelow && this.active){
            this.body.acceleration.y = this.verticalAccel;
        }
        else if(this.active){
            this.body.acceleration.y = -this.verticalAccel;
        }
    }
}

Ghost.prototype.processCollide = function(){
    console.log('ghost collide', this.active);
    return this.active;
}

Ghost.prototype.collide = function(sprite, collider, dmg){
    dmg = dmg || false;
    if(dmg){
        // sprite.visible = false;
        // sprite.body.enable = false;
        // sprite.onscreen = false;
        sprite.damage(1);
    }
    return true;
}

Ghost.prototype.setActive = function(roomXY){
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

Ghost.prototype.explode = function(){
    console.log('IN');
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

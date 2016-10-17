Goose = function(){
    this.flipTime = 60; //so he does not constantly flip in place
    this.walkSpeed = 100;
    this.maxHealth = 3;
    this.health = this.maxHealth;
}
Goose.prototype = Object.create(Phaser.Sprite.prototype);
Goose.prototype.constructor = Goose;
Goose.prototype.actuallyMove = function(){
    this.body.velocity.x = this.walkSpeed * this.scale.x;
}
    
Goose.prototype.create = function(x, y, roomChangedEvent) {
    Phaser.Sprite.call(this, game, x, y, 'goose');
    var walk = this.animations.add('wobble', [1,0,1,2], 5, true);
    
    game.physics.arcade.enable(this);
    this.body.gravity.y = 350;
    this.body.collideWorldBounds = true;
    this.body.drag.x = 125;
    
    this.anchor.setTo(.5, .5);
    this.scale.setTo(1,1);
    this.body.setSize(16, 28, 0, 2);
    this.scale.x = -1;
    this.flipTimer = this.flipTime;
    
    walk.onLoop.add(this.actuallyMove, this);
    this.animations.play('wobble');
    roomChangedEvent.add(this.setActive, this);
    this.events.onKilled.add(this.explode, this);
    this.alive = true;
}

Goose.prototype.doUpdate = function(){
    this.flipTimer = this.flipTimer >= 0 ? this.flipTimer - 1 : this.flipTimer;
}

Goose.prototype.collide = function(sprite, ground, dmg){
    dmg = dmg || false;
    if(sprite.flipTimer <= 0 && (sprite.body.touching.left || sprite.body.blocked.left)){
        //this.body.velocity.x = walkSpeed;
        sprite.scale.x = 1;
        sprite.flipTimer = sprite.flipTime;
    }
    else if(sprite.flipTimer <= 0 && (sprite.body.touching.right || sprite.body.blocked.right)){
        //this.body.velocity.x = -walkSpeed;
        sprite.scale.x = -1;
        sprite.flipTimer = sprite.flipTime;
    }
    if(dmg){
        // sprite.visible = false;
        // sprite.body.enable = false;
        // sprite.onscreen = false;
        sprite.damage(1);
    }
}

Goose.prototype.setActive = function(roomXY){
    //console.log(roomXY);
    if(roomXY){
        var roomX = Math.floor(this.x / roomXY.width) * roomXY.width;
        var roomY = Math.floor(this.y / roomXY.height) * roomXY.height;
        
        if(roomX === roomXY.x && roomY === roomXY.y){
            this.animations.play('wobble');
        }
        else{
            this.animations.stop('wobble');
        }
    }
}

Goose.prototype.explode = function(){
    console.log('IN');
    var x = new Xplo();
    x.create(this.x, this.y, 1.25);
}


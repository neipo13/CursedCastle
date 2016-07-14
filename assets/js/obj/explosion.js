Xplo = function(){};
Xplo.prototype = Object.create(Phaser.Sprite.prototype);
Xplo.prototype.constructor = Xplo;
Xplo.prototype.create = function(x, y, scale) {
    Phaser.Sprite.call(this, game, x, y, 'xplo'); 
    var xplode = this.animations.add('go', [0,1,2,3,4,5,6,7], 60, false);
    xplode.onComplete.add(function(){
        this.destroy();
    }, this);
    
    this.anchor.setTo(.5, .5);
    scale = scale || 1;
    this.scale.setTo(scale, scale);
    
    // this.emitter = game.add.emitter(x, y, 15);
    // this.emitter.minParticles = 5;
    // this.emitter.maxParticles = 15;
    // this.emitter.makeParticles('xplo', [0,1,5]);
    // this.emitter.gravity = 50;
    // this.emitter.setSize(5, 16);
    // this.emitter.setScale(0.2, 0.5, 0.2, 0.5);
    // var lifespan = game.rnd.integerInRange(200,350);
    // var quantity = game.rnd.integerInRange(this.emitter.minParticles,this.emitter.maxParticles);
    // this.emitter.explode(lifespan, quantity);
    
    this.animations.play('go');
    game.add.existing(this);
}
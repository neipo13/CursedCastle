HealthDrop = function(){
  this.hp = 1;
};
HealthDrop.prototype = Object.create(Phaser.Sprite.prototype);

HealthDrop.prototype.constructor = HealthDrop;

HealthDrop.prototype.create = function(x, y){
  Phaser.Sprite.call(this, game, x, y, 'xplo');//TODO:REPLACE WITH HEALTH ART

  this.animations.add('go', [0,5], 15, true);
  this.anchor.setTo(.5, .5);
  this.scale.setTo(.5, .5);
  this.animations.play('go');

  game.physics.arcade.enable(this);
  this.body.gravity.y = 150;
  this.body.collideWorldBounds = true;

  game.add.existing(this);
}

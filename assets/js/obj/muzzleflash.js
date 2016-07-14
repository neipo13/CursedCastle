Flash = function(){
}
Flash.prototype = Object.create(Phaser.Sprite.prototype);
Flash.prototype.constructor = Flash;
Flash.prototype.create = function(x, y) {
    //create in location
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    var anim = this.animations.add('start', [7,8], 30, false);
    //start animation
    this.animations.play('start');
    this.visible = false;
    this.anchor.setTo(.5, .5);
    //turn visibility off on animation end 
    anim.onComplete.add(function(){
        this.visible = false;
    }, this);
}
Flash.prototype.activate = function(x, y) {
    //move to location
    this.x = x;
    this.y = y;
    this.visible = true;
    //start animation
    this.animations.currentAnim.restart();
}
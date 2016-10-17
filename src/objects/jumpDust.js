var JumpDust = function(){
    

    this.sprite = null;
    
    this.preload = function(){
        game.load.spritesheet('jumpDust', 'assets/img/jumpEffect.png', 32, 32, 5);
    }
    
    this.create = function() {
        this.sprite = game.add.sprite(999, 999, 'jumpDust');
        
        var puff = this.sprite.animations.add('jumpPuff', [0,1,2,3,4], 30, false);
        
        puff.onComplete.add(this.hide, this);
    }
    
    this.hide = function(){
        this.sprite.visible = false;
    }
    
    this.play = function(x, y){
        this.sprite.visible = true;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.animations.stop(null,true);
        this.sprite.animations.play('jumpPuff');
    }
};
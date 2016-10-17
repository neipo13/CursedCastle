var Dust = function(){
    

    this.sprite = null;
    
    this.preload = function(){
        game.load.spritesheet('dust', 'assets/img/dust.png', 32, 32, 5);
    }
    
    this.create = function(spriteFlip) {
        spriteFlip = spriteFlip || false;
        this.sprite = game.add.sprite(999, 999, 'dust');
        
        var puff = this.sprite.animations.add('puff', [0,1,2,3,4], 15, false);
        
        if(spriteFlip){
            this.sprite.scale.x = -1;
        }
        
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
        this.sprite.animations.play('puff');
    }
};
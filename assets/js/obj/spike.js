var Spike = function(){
    this.sprite = null;
    
    this.create = function(startX, startY){
        this.sprite = game.add.sprite(startX, startY, 'spike');
    };
}
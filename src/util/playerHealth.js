var Health = function(){
    var _this = this;
    
    _this.startHp = 8;
    
    _this.maxHp = 8;
    _this.hp = 8;
    _this.healthSprites = null;
    _this.deathEvent = null;
    
    
    _this.resetHp = function resetHp(){
        _this.maxHp = _this.startHp;
        _this.hp = _this.startHp;
        
        _this.deathEvent = new Phaser.Signal();
        
    }
    
    _this.newScene = function newScene(){
        //sprites
        _this.healthSprites = game.add.group();
        _this.healthSprites.x = 24;
        _this.healthSprites.y = 96;
        _this.healthSprites.fixedToCamera = true;
        for(var i = 0; i < _this.hp; i++){
            addToHealthBar();
        }
    }
    
    function addToHealthBar(){
        var len = _this.healthSprites.length;
        _this.healthSprites.create(_this.healthSprites.x, _this.healthSprites.y - (len * 8), 'hp');
        //_this.healthSprites.y += 8;
    }
    
    function changeHealthBar(index, visible){
        if(_this.healthSprites.children){
            _this.healthSprites.children[index].visible = visible;
        }
    }
    
    _this.setHp = function setHp (newHp){
        var diff = newHp - _this.hp;
        var positive = diff > 0;
        _this.hp = newHp;
        //change sprites
        if(_this.hp >= _this.maxHp){
            _this.hp = _this.maxHp;
            for(var i = 0 ; i < _this.healthSprites.children; i++){
                changeHealthBar(i, true);
            }
        }
        else if(_this.hp > 0){
            for(var i = Math.abs(diff); i > 0; i--){
                changeHealthBar(_this.hp - (i * (positive ? 1 : -1)) - 1, positive);
            }
        }
        else{
            for(var i = 0 ; i < _this.healthSprites.children; i++){
                changeHealthBar(i, false);
            }
            returnToMenu();
        }
    }
    
    _this.takeDmg = function takeDmg(dmg){
        _this.setHp(_this.hp - dmg);
    }
    
    _this.gainHp = function gainHp(gain){
        _this.setHp(_this.hp + gain);
    }
    
    function returnToMenu(){
        //TODO: trigger event and have player play death anim 
        //(maybe hide everything else and pan camera to track player)
        //wait for input on end of death anim and transition state there
        game.state.start('Menu');
    }
}
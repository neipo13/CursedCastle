var Color = function(){
    var _this = this;
    
    _this.filter = null,
    _this.white = null,
    _this.red = null,
    _this.black = null,
    _this.grey = null;
    _this.initColors = initColors;
    _this.setColors = setColors;
    _this.setRandomColors = setRandomColors;
    
    
    
    function initColors(){
        if(_this.filter === null){
            return;
        }
        
        var uniforms = {
            //white
            findColor1: {type: '3f', value: { x: 186/255, y: 213/255, z: 219/255 }},
            replaceWithColor1: {type: '3f', value: { x: _this.white.r/255, y: _this.white.g/255, z: _this.white.b/255 }},
            //red
            findColor2: {type: '3f', value: { x: 194/255, y: 14/255, z: 14/255 }},
            replaceWithColor2: {type: '3f', value: { x: _this.red.r/255, y: _this.red.g/255, z: _this.red.b/255 }},
            //black
            findColor3: {type: '3f', value: { x: 14/255, y: 5/255, z: 24/255 }},
            replaceWithColor3: {type: '3f', value: { x: _this.black.r/255, y: _this.black.g/255, z: _this.black.b/255 }},
            //grey
            findColor4: {type: '3f', value: { x: 80/255, y: 80/255, z: 80/255 }},
            replaceWithColor4: {type: '3f', value: { x: _this.grey.r/255, y: _this.grey.g/255, z: _this.grey.b/255 }},
        };
        _this.filter = new Phaser.Filter(game, uniforms, game.cache.getShader('ColorReplace'));
        //console.log(filter);
        game.world.filters = [_this.filter];
        var color = Phaser.Color.getColor32(1, _this.black.r, _this.black.g, _this.black.b)
        game.stage.backgroundColor = color;
    }
    
    
    function setColors(white, red, black, grey){
        //{ x: 14/255, y: 5/255, z: 24/255 } black
        //{ x: 194/255, y: 14/255, z: 14/255 } red
        //{ x: 80/255, y: 80/255, z: 80/255 } grey
        //{ x: 186/255, y: 213/255, z: 219/255 } white
        _this.white = white;
        _this.red = red;
        _this.black = black;
        _this.grey = grey;
        var uniforms = {
            //white
            findColor1: {type: '3f', value: { x: 186/255, y: 213/255, z: 219/255 }},
            replaceWithColor1: {type: '3f', value: { x: white.r/255, y: white.g/255, z: white.b/255 }},
            //red
            findColor2: {type: '3f', value: { x: 194/255, y: 14/255, z: 14/255 }},
            replaceWithColor2: {type: '3f', value: { x: red.r/255, y: red.g/255, z: red.b/255 }},
            //black
            findColor3: {type: '3f', value: { x: 14/255, y: 5/255, z: 24/255 }},
            replaceWithColor3: {type: '3f', value: { x: black.r/255, y: black.g/255, z: black.b/255 }},
            //grey
            findColor4: {type: '3f', value: { x: 80/255, y: 80/255, z: 80/255 }},
            replaceWithColor4: {type: '3f', value: { x: grey.r/255, y: grey.g/255, z: grey.b/255 }},
        };
        _this.filter = new Phaser.Filter(game, uniforms, game.cache.getShader('ColorReplace'));
        //console.log(filter);
        game.world.filters = [_this.filter];
        var color = Phaser.Color.getColor32(1, black.r, black.g, black.b)
        game.stage.backgroundColor = color;
    }
    
    
    function setRandomColors(){
        var b = {r:game.rnd.integerInRange(0,255),g:game.rnd.integerInRange(0,255),b:game.rnd.integerInRange(0,255)};
        var w = {r:game.rnd.integerInRange(0,255),g:game.rnd.integerInRange(0,255),b:game.rnd.integerInRange(0,255)};
        var r = {r:game.rnd.integerInRange(0,255),g:game.rnd.integerInRange(0,255),b:game.rnd.integerInRange(0,255)};
        var g = {r:game.rnd.integerInRange(0,255),g:game.rnd.integerInRange(0,255),b:game.rnd.integerInRange(0,255)};
        setColors(w, r, b, g);
    }
};

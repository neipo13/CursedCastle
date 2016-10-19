export class Color {
    constructor(){
        this.filter = null,
        this.white = null,
        this.red = null,
        this.black = null,
        this.grey = null;
    }

    initColors(){
        if(this.filter === null){
            return;
        }

        var uniforms = {
            //white
            findColor1: {type: '3f', value: { x: 186/255, y: 213/255, z: 219/255 }},
            replaceWithColor1: {type: '3f', value: { x: this.white.r/255, y: this.white.g/255, z: this.white.b/255 }},
            //red
            findColor2: {type: '3f', value: { x: 194/255, y: 14/255, z: 14/255 }},
            replaceWithColor2: {type: '3f', value: { x: this.red.r/255, y: this.red.g/255, z: this.red.b/255 }},
            //black
            findColor3: {type: '3f', value: { x: 14/255, y: 5/255, z: 24/255 }},
            replaceWithColor3: {type: '3f', value: { x: this.black.r/255, y: this.black.g/255, z: this.black.b/255 }},
            //grey
            findColor4: {type: '3f', value: { x: 80/255, y: 80/255, z: 80/255 }},
            replaceWithColor4: {type: '3f', value: { x: this.grey.r/255, y: this.grey.g/255, z: this.grey.b/255 }},
        };
        this.filter = new Phaser.Filter(this.game, uniforms, this.game.cache.getShader('ColorReplace'));
        //console.log(filter);
        this.game.world.filters = [this.filter];
        var color = Phaser.Color.getColor32(1, this.black.r, this.black.g, this.black.b)
        this.game.stage.backgroundColor = color;
    }


    setColors(white, red, black, grey){
        //{ x: 14/255, y: 5/255, z: 24/255 } black
        //{ x: 194/255, y: 14/255, z: 14/255 } red
        //{ x: 80/255, y: 80/255, z: 80/255 } grey
        //{ x: 186/255, y: 213/255, z: 219/255 } white
        this.white = white;
        this.red = red;
        this.black = black;
        this.grey = grey;
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
        this.filter = new Phaser.Filter(this.game, uniforms, this.game.cache.getShader('ColorReplace'));
        //console.log(filter);
        this.game.world.filters = [this.filter];
        var color = Phaser.Color.getColor32(1, black.r, black.g, black.b)
        this.game.stage.backgroundColor = color;
    }


    setRandomColors(){
        var b = {r:this.game.rnd.integerInRange(0,255),g:this.game.rnd.integerInRange(0,255),b:this.game.rnd.integerInRange(0,255)};
        var w = {r:this.game.rnd.integerInRange(0,255),g:this.game.rnd.integerInRange(0,255),b:this.game.rnd.integerInRange(0,255)};
        var r = {r:this.game.rnd.integerInRange(0,255),g:this.game.rnd.integerInRange(0,255),b:this.game.rnd.integerInRange(0,255)};
        var g = {r:this.game.rnd.integerInRange(0,255),g:this.game.rnd.integerInRange(0,255),b:this.game.rnd.integerInRange(0,255)};
        this.setColors(w, r, b, g);
    }
}

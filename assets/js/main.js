var game = new Phaser.Game(512 , 288, Phaser.AUTO);

var world = 1;
var level = 1;
var color = new Color();
var health = new Health();

game.antialias = false;

    
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Mid', Mid);

game.state.start('Menu');

WebFontConfig = {
    //After this is loaded initially, we should be able to set any text to a font in the google families below
    
    //  'active' means all requested fonts have finished loading
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.QUARTER, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }

};

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
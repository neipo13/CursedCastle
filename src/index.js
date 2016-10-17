import GameState from 'states/game';
import MenuState from 'states/menu';
import MidLevelState from 'states/midLevel';
import Color from 'util/Color';
import Health from 'util/playerHealth';

class Game extends Phaser.Game {

	constructor() {
		super(512, 288, Phaser.AUTO, 'content', null);
		this.antialias = false;
		this.world = 1;
		this.level = 1;
		this.color = new Color();
		this.health = new Health();
		this.state.add('Game', GameState, false);
		this.state.add('Menu', MenuState, false);
		this.state.add('Mid', MidLevelState, false);
		this.state.start('Menu');
	}

}

new Game();

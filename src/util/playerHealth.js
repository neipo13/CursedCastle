export class Health {
  constructor(){
    this.startHp = 8;
    this.maxHp = 8;
    this.hp = 8;
    this.healthSprites = null;
    this.deathEvent = null;
  }

  resetHp(){
      this.maxHp = this.startHp;
      this.hp = this.startHp;

      this.deathEvent = new Phaser.Signal();
  }

  newScene(){
      //sprites
      this.healthSprites = game.add.group();
      this.healthSprites.x = 24;
      this.healthSprites.y = 96;
      this.healthSprites.fixedToCamera = true;
      for(var i = 0; i < this.hp; i++){
          addToHealthBar();
      }
  }
  addToHealthBar(){
      var len = this.healthSprites.length;
      this.healthSprites.create(this.healthSprites.x, this.healthSprites.y - (len * 8), 'hp');
      //this.healthSprites.y += 8;
  }

  changeHealthBar(index, visible){
      if(this.healthSprites.children){
          this.healthSprites.children[index].visible = visible;
      }
  }

  setHp (newHp){
      var diff = newHp - this.hp;
      var positive = diff > 0;
      this.hp = newHp;
      //change sprites
      if(this.hp >= this.maxHp){
          this.hp = this.maxHp;
          for(var i = 0 ; i < this.healthSprites.children; i++){
              changeHealthBar(i, true);
          }
      }
      else if(this.hp > 0){
          for(var i = Math.abs(diff); i > 0; i--){
              changeHealthBar(this.hp - (i * (positive ? 1 : -1)) - 1, positive);
          }
      }
      else{
          for(var i = 0 ; i < this.healthSprites.children; i++){
              changeHealthBar(i, false);
          }
          returnToMenu();
      }
  }
  takeDmg(dmg){
      this.setHp(this.hp - dmg);
  }

  gainHp(gain){
      this.setHp(this.hp + gain);
  }

  returnToMenu(){
      //TODO: trigger event and have player play death anim
      //(maybe hide everything else and pan camera to track player)
      //wait for input on end of death anim and transition state there
      game.state.start('Menu');
  }
}

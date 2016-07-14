var roomGen = function(tileGroup, doorGroup, spikeGroup,
                       gooseGroup, ghostGroup, bg,
                       fromDir, toDir, 
                       xRoom, yRoom,
                       tileSize, roomCols, roomRows,
                       roomChanged){
                           
    
              
              
    var roomStr = fromDir.toUpperCase() + toDir.toUpperCase();
    var lvl = rooms[roomStr][game.rnd.integerInRange(0, rooms[roomStr].length - 1)];
    var ignoreNextFour = false;
    

    this.checkSurrounding = function(tile){
        var above = tileGroup.children.findIndex(function(t){
            return (t.y === tile.y - 32) && (t.x === tile.x);
        });
        if(above > -1){
            tile.body.setSize(32, tileGroup.children[above].body.height+32, 0, -(tileGroup.children[above].body.height));
            tileGroup.children[above].body.enable = false;
        }
    };
    String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index+character.length);
    };
    //once for tiles
    for (var i = 0; i < lvl.length; i++) {
        var ground;
        //variable blocks
        if(lvl[i] === '2'){//50% chance of a block
            var roll = game.rnd.integerInRange(0,1);
            lvl = lvl.replaceAt(i, roll.toString());
        }
        else if(lvl[i] === '3'){ //random chance of two one or 0 blocks in a two stack
            var roll = game.rnd.integerInRange(0,99);
            if(roll < 50){
                lvl = lvl.replaceAt(i, '1');
                lvl = lvl.replaceAt(i + roomCols, '1');
            }
            else if (roll < 75){
                lvl = lvl.replaceAt(i + roomCols, '1');
            }
            else if (roll < 90){
                lvl = lvl.replaceAt(i, '1');
            }
        }
        else if(lvl[i] === '4'){//50% chance of a platform building until other 4
            if(!ignoreNextFour){
                var roll = game.rnd.integerInRange(0,1);
                lvl = lvl.replaceAt(i, roll.toString());
                if(roll === 1){
                    var j = 1;
                    while(lvl[i + j] !== '4' && j < roomCols){
                        lvl = lvl.replaceAt(i + j, '1');
                        j++;
                    }
                    lvl = lvl.replaceAt(i + j, '1');
                }
                else{
                    ignoreNextFour = true;
                }
            }
            else{
                ignoreNextFour = false;
            }
        }
        else if(lvl[i] === '5'){//obstacle block straight from spelunky
            //no roll needed here, just replace blocks
            //assumes 5 has 0s in places where there are no replaces
            //00000
            //00102
            //71177
            lvl = lvl.replaceAt(i + 2 + roomCols, '1');
            lvl = lvl.replaceAt(i + 4 + roomCols, '1');
            lvl = lvl.replaceAt(i + 0 + (2* roomCols), '7');
            lvl = lvl.replaceAt(i + 1 + (2* roomCols), '1');
            lvl = lvl.replaceAt(i + 2 + (2* roomCols), '1');
            lvl = lvl.replaceAt(i + 3 + (2* roomCols), '7');
            lvl = lvl.replaceAt(i + 4 + (2* roomCols), '7');
        }
        else if(lvl[i] === '7'){ //33% chance of a spike
            var roll = game.rnd.integerInRange(0,2);
            if(roll === 2){
                lvl = lvl.replaceAt(i, '!');
            }
        }
        
        //placing physical blocks
        if(lvl[i] === '1'){
            var x = ((i % roomCols) * tileSize) + xRoom;
            var y = (Math.floor(i / 16) * tileSize) + yRoom;
            ground = tileGroup.create(x, y, 'tile');
            //  This stops it from falling away when you jump on it
            this.checkSurrounding(ground);
            ground.body.immovable = true;
        }
        else if(lvl[i] === '!'){
            var x = ((i % roomCols) * tileSize) + xRoom;
            var y = (Math.floor(i / 16) * tileSize) + yRoom;
            var spike = spikeGroup.create(x,y,'spike');
            spike.body.immovable = true;
            spike.body.setSize(32,16,0,16);
        }
        else if(lvl[i] === 'E'){
            var x = ((i % roomCols) * tileSize) + xRoom;
            var y = (Math.floor(i / 16) * tileSize) + yRoom;
            doorGroup.create(x,y,'door');
        }
    }
    //again for objects once tiles are finalized
    //if not in special rooms
    if(roomStr != 'MENU'
    && roomStr != 'MID'){
        for (var i = 0; i < lvl.length; i++) {
            if(lvl[i] === '0'){
                if(i > roomCols - 1
                && i < lvl.length - roomCols
                && i % roomCols !== 0
                && i % roomCols !== roomCols-1){
                    var above = checkAbove(i);
                    var below = checkBelow(i);
                    var right = checkLeft(i);
                    var left = checkRight(i);
                    
                    if(!above && !below && !right && !left){
                        //ghost
                        var roll = game.rnd.integerInRange(0,49);
                        if(roll === 0){
                            var x = ((i % roomCols) * tileSize) + xRoom;
                            var y = (Math.floor(i / 16) * tileSize) + yRoom;
                            var g = new Ghost();
                            g.create(x, y, roomChanged);
                            ghostGroup.add(g);
                        }
                        else if((roll >= 1 && roll <= 10) && (Math.floor(i / roomCols) == 3 || Math.floor(i / roomCols) == 5)){
                            var x = ((i % roomCols) * tileSize) + xRoom;
                            var y = (Math.floor(i / 16) * tileSize) + yRoom;
                            bg.create(x,y,'window');
                        }
                    }
                    else if(below){
                        var roll = game.rnd.integerInRange(0,20);
                        if(roll === 0){
                            var x = ((i % roomCols) * tileSize) + xRoom;
                            var y = (Math.floor(i / 16) * tileSize) + yRoom;
                            var goose = new Goose();
                            goose.create(x + 16, y + 16, roomChanged);
                            gooseGroup.add(goose);
                        }
                        else if(roll === 1){
                            roll = game.rnd.integerInRange(1,2)
                            if(roll === 1){
                                var x = ((i % roomCols) * tileSize) + xRoom;
                                var y = (Math.floor(i / 16) * tileSize) + yRoom;
                                bg.create(x,y,'shelf');
                            }
                            else if(roll === 2){
                                var x = ((i % roomCols) * tileSize) + xRoom;
                                var y = ((Math.floor(i / 16) - 1) * tileSize) + yRoom;
                                bg.create(x,y,'bgdoor');
                            }
                        }
                        
                    }
                }
            }
        }
    }
    
    //returns true if there is a tile that exists above this tile
    function checkAbove(index){
        if(index > roomCols){
            if(lvl[index - roomCols] !== '0'){
                return true;
            }
        }
        return false;
    }
    
    //returns true if there is a tile that exists below this tile
    function checkBelow(index){
        if(index > roomCols){
            if(lvl[index + roomCols] !== '0'){
                return true;
            }
        }
        return false;
    }
    
    //returns true if there is a tile that exists left of this tile
    function checkLeft(index){
        if(index % roomCols !== 0){
            if(lvl[index - 1] !== '0'){
                return true;
            }
        }
        return false;
    }
    
    //returns true if there is a tile that exists right of this tile
    function checkRight(index){
        if(index % roomCols !== roomCols-1){
            if(lvl[index + 1] !== '0'){
                return true;
            }
        }
        return false;
    }
};
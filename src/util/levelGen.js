var levelGen = function(height, width, startHeight, 
                        rightChance, upChance, downChance, 
                        tileGroup, doorGroup,  spikeGroup,
                        gooseGroup, ghostGroup, bg,
                        game, roomChanged){
    
    var totalChance = rightChance + upChance + downChance;
    
    //rolls the new direction, not allowing it to loop back on itself
    function selectNewDir(fromDir){
        var rand = game.rnd.integerInRange(0, totalChance);
        //0-x 0-rightchance = r, rightchance-upchance = u, > upchance = d
        var newDir;
        if(rand < rightChance){
            newDir ='R';
        }
        else if(rand < rightChance + upChance){
            newDir='U';
        }
        else{
            newDir='D';
        }
        
        //going down/up can't go back in on yourself
        if(fromDir === newDir){
            newDir = 'R';
        }
        
        
        return newDir;
    }
    
    //takes dir to in last set path and gets dir from for new path
    function setOldDir(dir){
        if(dir === 'R'){
            return 'L';
        }
        else if (dir === 'U'){
            return 'D';
        }
        else if (dir === 'D'){
            return 'U';
        }
    }
    
    //keeping track of where we came from
    var prevX;          //room x
    var prevY;          //room y
    var prevFrom;       //from direction - string
    var prevTo;         //to direction - string
    
    //used to recalculate if new breaks some validation
    //initialized to create starting room
    var currX = 0;
    var currY = startHeight;
    var currFrom = 'S';
    var currTo = 'R';
    
    //build all rooms minus the final room (boss?)
    while(currX < width - 1){
        //if going to high, change to right
        if(currY <= 0 && currTo === 'U'){
            currY = 0;
            currTo = 'R';
        }
        //if going to low, change to right
        else if (currY >= height - 1 && currTo === 'D'){
            currY = height-1;
            currTo = 'R';
        }
        //create the new room
        console.log(currFrom, currTo);
        roomGen(tileGroup, doorGroup, spikeGroup, gooseGroup, ghostGroup, bg, currFrom, currTo, currX * game.tileSize * game.roomCols, currY * game.tileSize * game.roomRows, game.tileSize, game.roomCols, game.roomRows, roomChanged);
        //set previous
        prevX = currX;
        prevY = currY;
        prevTo = currTo;
        prevFrom = currFrom;
        
        //gen next room
        currFrom = setOldDir(prevTo);
        currTo = selectNewDir(currFrom);
        if(currFrom === 'L'){
            currX++;
        }
        else if(currFrom === 'U'){
            currY++;
        }
        else if(currFrom === 'D'){
            currY--;
        }
        //restart the loop to set the new room
    }
    //set final room
    roomGen(tileGroup, doorGroup, spikeGroup,gooseGroup, ghostGroup, bg, 'L', 'E', currX * game.tileSize * game.roomCols, currY * game.tileSize * game.roomRows, game.tileSize, game.roomCols, game.roomRows, roomChanged);
};
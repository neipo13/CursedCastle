BulletManager = function(group, max, muzzleFlash, offsetX, offsetY, swapXamt){
    this.bulletList = [];
    this.maxBullets = max || 3;
    this.muzzleFlash = muzzleFlash || new Flash();
    this.offsetX = offsetX || 8;
    this.offsetY = offsetY || 3;
    this.swapXamt = swapXamt || 8;
    for(var i = 0; i < this.maxBullets; i++){
        var bullet = new Bullet();
        bullet.create(0,0);
        this.bulletList.push(bullet);
        group.add(bullet);
    }
    this.muzzleFlash.create(0,0)
    group.add(this.muzzleFlash);
}
BulletManager.prototype.constructor = BulletManager;

BulletManager.prototype.fire = function(x, y, dir){
    //check if any bullets are inactive
    var readyToFire = null;
    for(var i = 0; i < this.bulletList.length; i++){
        if(readyToFire === null && this.bulletList[i].active === false){
            readyToFire = this.bulletList[i];
        }
    }
    console.log(readyToFire);
    //if so 
    if(readyToFire !== null){
        var swapAmt = dir === 'L' ? -this.swapXamt : 0;
        var offsetXMulti = (dir === 'L' ? -1 : 1);
        //positiion it accordingly
        readyToFire.activate(x + swapAmt + (this.offsetX  * offsetXMulti ), y + this.offsetY, dir);
        //position muzzle flash and make that active
        this.muzzleFlash.activate(x + swapAmt + (this.offsetX * offsetXMulti), y + this.offsetY)
    }
}
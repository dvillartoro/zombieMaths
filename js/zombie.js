function zombie(context, skinNumber, operation, result, x){

    var x = x || null;  // X position parameter. Null if not defined

    // Array of sprite images
    const skins_background= ['img/zombie1.png', 'img/zombie2.png', 'img/zombie3.png', 'img/zombie4.png', 'img/zombie5.png'];
    // Row number for each status   -->   0: spawn; 1: walk; 2: die
    const status_skin_rows= [3, 1, 4];  // (depends on the row in the sprite)
    // Number of columns for each status   -->   0: spawn; 1: walk; 2: die
    const status_skin_steps= [8, 8, 9]; // (depends on the row in the sprite)

    this.skin= new Image();         // Zombie sprite
    this.fps = 8;                  // Number of frame between sprite movement
    this.spriteCounter = 0;         // Current frame conter for sprites
    this.spriteFrame = 0;           // Current sprite column
    this.spriteStatus = 0;          // Current sprite row   -->   0: spawn; 1: walk; 2: die
    this.skinWidth= 189;            // Sprite width
    this.skinHeight= 189;           // Sprite height
    this.skinNumber= skinNumber;    // Sprite type

    // Current row in the sprite for current status
    this.status_skin_row= status_skin_rows[this.spriteStatus];
    // Number of columns in the sprite for current status
    this.status_skin_steps= status_skin_steps[this.spriteStatus];
    // Sprite file
    this.skin.src= skins_background[this.skinNumber % skins_background.length];

    this.operation= operation2text(operation);  // Text with operation to be solved
    this.result= result;                        // Correct answer to operation
    this.xPosition= (x == null)? 1000 : x;      // Current x position
    this.yPosition= 260;                        // Current Y position
    this.delete= false;                         // Marks zombie to be deleted
    this.points= 5;                             // Points increased to total score if answer is correct

    /**
     * Updates x position and sprite column
     */
    this.update= function(speed){
        if (this.spriteStatus == 1){
            // Updates x position if zombie is walking
            this.xPosition -= speed;
        }
        this.spriteCounter++;
		if(this.spriteCounter % this.fps == 0){
            // Updates sprite image
            if ((this.spriteStatus == 2) && (this.spriteFrame == (this.status_skin_steps - 1))){
                // Marks zombie to be deleted after completing dead animation
                this.delete= true;
            } else {
                this.spriteFrame=  (this.spriteFrame + 1) % this.status_skin_steps;
            }
		}
        if(this.spriteCounter == (this.fps * status_skin_steps[0])){
            // Updates zombie status to 'walking' after spawn animation
            this.spriteStatus= 1;
            this.status_skin_row= status_skin_rows[this.spriteStatus];
            this.status_skin_steps= status_skin_steps[this.spriteStatus];
            this.spriteFrame = 0;
        }
    }

    /**
     * Draws zombie
     */
    this.draw= function(){
        context.drawImage(this.skin, this.skinWidth * this.spriteFrame, this.skinHeight * this.status_skin_row, this.skinWidth, this.skinHeight, this.xPosition, this.yPosition, this.skinWidth, this.skinHeight);
        if (this.spriteStatus > 0){
            // Draws a box with the question over zombie's head if zombie is not spawning
            context.fillStyle = (this.spriteStatus == 1)? "#d8a655" : "#75cb48";
            context.fillRect(this.xPosition + 70, this.yPosition - 40, 90, 35);
            context.strokeStyle = "#000000";
            context.lineWidth   = 3;
            context.strokeRect(this.xPosition + 70, this.yPosition - 40, 90, 35);
            context.fillStyle = "#000000";
            context.font="bold 16px Arial";
            context.textAlign = "center";
            context.fillText(this.operation, this.xPosition + 115, this.yPosition - 18, 90);
        }
    }

    /**
     * Changes zombie status to play dead animation
     */
    this.die= function(){
        this.spriteStatus= 2;
        this.status_skin_row= status_skin_rows[this.spriteStatus];
        this.status_skin_steps= status_skin_steps[this.spriteStatus];
        this.spriteFrame = 0;
    }
}
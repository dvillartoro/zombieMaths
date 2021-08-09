function scene(canvas, context){

    this.frameCounter= 0; // Holds current frame count
    this.zombieFrecuency= 1200; // Number of frames between zombies

    this.zombieFrameGeneration= 10; 

    this.zombieSpeed = .4;      // Pixels covered by a zombie per frame
    this.maxLives= 3;           // Number of lives in a game
    this.lives= this.maxLives;  // Current number of lives
    this.score= 0;              // Current total score
    this.zombies= [];           // Zombies in game
    this.value= '0';            // Current main text box value
    this.errorDuration= 15;     // Number of frames with main text box recolored after an error
    this.errorFrames= 0;        // Current number of frame until main text box reset
    this.screen= 'gamestart';   // Current screen

    /**
     * Resets properties to their default values
     */
    this.reset= function(){
        this.lives= this.maxLives;
        this.score= 0;
        this.zombies= [];
        this.zombieFrecuency= 400;//1200;
        this.zombieSpeed = .8;//.4;
        this.zombieFrameGeneration= 10;
        this.screen= 'gamestart'
    }

    /**
     * Starts a game
     */
    this.init= function(){
        this.reset();
        this.drawScreen();
    }

    /**
     * Draw current canvas depending on current scene
     */
    this.update= function(){
        switch(this.screen){
            case 'gamestart':
                // Intro screen
                this.gameStart();
                break;

            case 'gameplay':
                this.frameCounter++;
                if (this.errorFrames){
                    this.errorFrames--;
                }
                // Zombie birth control
                this.zombieGenerator();
                // Draws current screen
                this.drawScreen();
                break;

            case 'gameover':
                // Game over screen
                this.gameOver();
                break;
        }
    }

    /**
     * Draws initial screen with basic instructions
     */
    this.gameStart= function(){
        // Background color
        context.fillStyle = "#5b8627";
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Start image
        var gamestart = new Image();
        gamestart.src = 'img/gamestart.png';
        context.drawImage(gamestart,150,50,gamestart.width,gamestart.height);
    }

    /**
     * Draws final screen with total score
     */
    this.gameOver= function(){
        // Background color
        context.fillStyle = "#5b8627";
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Final image
        var gameover = new Image();
        gameover.src = 'img/gameover.png';
        context.drawImage(gameover,150,50,gameover.width,gameover.height);
        // Score shadow (Dark text with a 2 pixels tanslation)
        context.fillStyle = "#000000";
		context.font="bold 32px Arial";
		context.textAlign = "center";
		context.fillText(this.score, 612, 382, 150);
        // Score value
        context.fillStyle = "#ffd95a";
        context.fillText(this.score, 610, 380, 150);
    }

    /**
     * Draws main screen
     */
    this.drawScreen= function(){
        //Blue background
        context.fillStyle = "#03d7da";
        context.fillRect(0,0,canvas.width,canvas.height);
        //Backgroung stage
        var background = new Image();
        background.src = 'img/background.jpg';
        context.drawImage(background,0,0,canvas.width,canvas.height);
        //Draws lives
        this.drawLife(this.lives);
        //Draws score
        this.drawScore(this.score);
        //Draws controls
        this.drawControls(this.value)
        //Draws zombies
        this.drawZombies(this.zombies);
    }

    /**
     * Draws the lives indicator on top left
     */
    this.drawLife= function(lives){
        // Draws full hearts
        var full = new Image();
        full.src = 'img/life_full.png';
        pos_x= 20;
        pos_y= 70;
        for(i=0; i < lives; i++){
            var current_x= pos_x + ((full.width + 5) * i);
            context.drawImage(full,current_x,pos_y,full.width,full.height);
        }
        // Draws empty hearts
        var empty = new Image();
        empty.src = 'img/life_empty.png';
        for(i=lives; i < this.maxLives; i++){
            var current_x= pos_x + ((empty.width + 5) * i);
            context.drawImage(empty,current_x,pos_y,empty.width,empty.height);
        }
    }

    /**
     * Draws the score indicator on top right
     */
    this.drawScore= function(score){
        // score shadow
        context.fillStyle = "#000000";
		context.font="bold 32px Arial";
		context.textAlign = "right";
		context.fillText(score, 1172, 98, 150);
        // score
        context.fillStyle = "#ffd95a";
        context.fillText(score, 1170, 96, 150);
    }

    /**
     * Draws main text box and user controls
     */
    this.drawControls= function(value){
        // Main text box
        context.fillStyle = (this.errorFrames)? "#e2081d" : "#ff9910";
        context.fillRect(parseInt(canvas.width/2) - 85, canvas.height - 110, 170, 45);
        context.strokeStyle = "#000000";
        context.lineWidth   = 3;
        context.strokeRect(parseInt(canvas.width/2) - 85, canvas.height - 110, 170, 45);
        context.fillStyle = "#000000";
        context.font="bold 26px Arial";
        context.textAlign = "center";
        // Current value of main text box
        context.fillText(value, parseInt(canvas.width/2), canvas.height - 78, 150);
        // User controls image
        var controls = new Image();
        controls.src = 'img/controls.png';
        context.drawImage(controls,0,canvas.height - controls.height,controls.width,controls.height);
    }

    /**
     * Draws each zombie in this->zombies array
     */
    this.drawZombies= function(zombies){
        for(i=0; i<zombies.length; i++){
			zombies[i].draw();
		}
    }

    /**
     * Remove dead zombies and creates a new one when needed
     */
    this.zombieGenerator= function(){
        var zombie_count= 0;
        for(i=0; i < this.zombies.length; i++){
            if (this.zombies[i].delete){
                // Removes dead zombies
                this.zombies.splice(i, 1);
            } else {
                if(this.zombies[i].xPosition < -100){
                    // Removes succesing zombies
                    this.zombies.splice(i, 1);
                    // Player loses a life
                    this.loseLife();
                } else {
                    // Updates zombie positions and sprite
                    zombie_count++;
                    this.zombies[i].update(this.zombieSpeed);
                }
            }
        }
        // Updates zombie generation time to creates a new zombie if there is none
        if ((zombie_count == 0) && (this.frameCounter >  10)){
            if (((this.frameCounter + this.zombieFrameGeneration) % this.zombieFrecuency) > 100){
                this.zombieFrameGeneration= (this.frameCounter % this.zombieFrecuency);
            }
        }
        // Creates a new zombie if frame count matches with generation frequency
        if ((this.frameCounter % this.zombieFrecuency) == this.zombieFrameGeneration){
                this.zombieFrameGeneration= (this.zombieFrameGeneration + this.zombieFrecuency - 1) % this.zombieFrecuency;
                var skinNumber= rnd(0,500);
                var operation= rnd(1,10)+' * '+rnd(1,10);
                var result= eval(operation);
                this.zombies.push(new zombie(context, skinNumber, operation, result))
        }
    }

    /**
     * Triggers final scene when user loses all lives
     */
    this.loseLife= function(){
        this.lives--;
        if (this.lives <= 0){
            this.screen= 'gameover';
        }
    }

    /**
     * Submits current main text box value and compares it with each zombies' correct answer
     */
    this.shoot= function(zombies){
        var shooted=0;
        for(i=0; i<zombies.length; i++){
            if (zombies[i].result == this.value){
                // If answer matches zombie dies
                this.score+= zombies[i].points;
                zombies[i].die();
                shooted++;
            }
		}
        // Changes main text box color for a while if no zombie was shooted
        if (shooted == 0){
            this.errorFrames= this.errorDuration;
        }
        // Resets main text box value
        this.value= '0';
    }

    // Triggers appropriate action depending on key pressed
    this.key= function(digit){
        switch(digit){
            case 'del':
                // Removes last digit
                this.value= this.value.substr(0, this.value.length - 1);
                this.value= (this.value.length == 0)? '0' : this.value;
                break;

            case 'enter':
                // Submits current value
                this.shoot(this.zombies);
                break;

            default:
                // Appends new digit and updates value
                this.value = (this.value == '0')? digit : this.value + digit;
                break;
        }
    }

    /**
     * Manages keyboard events
     */
    document.onkeyup =  (e) => {
		e = e || window.event;
        if ((e.keyCode >= 96) && (e.keyCode <= 105)){ // numpad
            var digit= (e.keyCode - 96).toString();
            this.key(digit);
        } else {
            if ((e.keyCode >= 48) && (e.keyCode <= 57)){ // numbers
                var digit= (e.keyCode - 48).toString();
                this.key(digit);
            } else {
                if (e.keyCode <= 8){ // backspace
                    this.key('del');
                } else {
                    if (e.keyCode <= 13){ // enter
                        this.key('enter');
                    }
                }
            }
        }
	};

    /**
     * Simulates click events over canvas elements
     * Original canvas size is used to match click positions
     */
    this.handleClick= function(x, y){
        switch(this.screen){
            case 'gamestart':
                // Accepts a click anywhere
                this.screen= 'gameplay';
                break;

            case 'gameover':
                // Accepts a click anywhere
                this.reset();
                this.screen= 'gamestart';
                break;

            case 'gameplay':
                // Accepts any click over user controls
                if ((x >= 13) && (x <= 97) && (y >= 482) && (y <= 565)){
                    this.key('enter');
                }
                if ((x >= 109) && (x <= 192) && (y >= 482) && (y <= 565)){
                    this.key('del');
                }
                if ((x >= 854) && (x <= 913) && (y >= 461) && (y <= 520)){
                    this.key('1');
                }
                if ((x >= 923) && (x <= 982) && (y >= 461) && (y <= 520)){
                    this.key('2');
                }
                if ((x >= 992) && (x <= 1051) && (y >= 461) && (y <= 520)){
                    this.key('3');
                }
                if ((x >= 1061) && (x <= 1120) && (y >= 461) && (y <= 520)){
                    this.key('4');
                }
                if ((x >= 1130) && (x <= 1189) && (y >= 461) && (y <= 520)){
                    this.key('5');
                }
                if ((x >= 854) && (x <= 913) && (y >= 530) && (y <= 589)){
                    this.key('6');
                }
                if ((x >= 923) && (x <= 982) && (y >= 530) && (y <= 589)){
                    this.key('7');
                }
                if ((x >= 992) && (x <= 1051) && (y >= 530) && (y <= 589)){
                    this.key('8');
                }
                if ((x >= 1061) && (x <= 1120) && (y >= 530) && (y <= 589)){
                    this.key('9');
                }
                if ((x >= 1130) && (x <= 1189) && (y >= 530) && (y <= 589)){
                    this.key('0');
                }
                break;
        }
    }

}
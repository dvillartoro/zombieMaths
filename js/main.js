/**
 * Generates a random number betwwen from and to
 */
function rnd(from, to){
    return Math.floor(Math.random() * to) + from;
}

/**
 * Replaces some characters in an operation to make it more readable
 */
function operation2text(operation){
    var result= operation.replace(/\*/g, '✖');
    result= result.replace(/\//g, '÷');
    return result;
}


$(function(){
    //init
	const canvas = document.getElementById("zombieMaths");
	const context = canvas.getContext('2d');
    canvas.width= 1200;
    canvas.height= 600;
    var requestId;

    var game= new scene(canvas, context);

    /**
     * Requests browser to update game animations on repaint
     */
    function update(){
        game.update();
        requestId = requestAnimationFrame(update);
    };

    /**
     * Manages click events
     * 
     * (x, y) coordinates are adapted from current canvas size
     */
    canvas.addEventListener('click', function(e){
        var x = e.clientX;
        var y = e.clientY;
        var pos= this.getBoundingClientRect();
        var new_x= parseInt((x - pos.left) *1200 /  pos.width);
        var new_y= parseInt((y - pos.top) * 600 / pos.height);
        game.handleClick( new_x, new_y);
    });

    /**
     * Manages touch events for mobile devices
     * 
     * (x, y) coordinates are adapted from current canvas size
     */
    canvas.addEventListener('touchend', function(e){
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
        var pos= this.getBoundingClientRect();
        var new_x= parseInt((x - pos.left) *1200 /  pos.width);
        var new_y= parseInt((y - pos.top) * 600 / pos.height);
        game.handleClick( new_x, new_y);
    });
    
    game.init();
    update();
})
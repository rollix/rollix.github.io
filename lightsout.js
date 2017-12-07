
$(document).ready(function() {
    
    const HEIGHT = 5; // #lights down
    const WIDTH = 5; // #lights across
    const NUM_LIGHTS = HEIGHT*WIDTH;
    
    const COL_BG = '#2f2f2f' // background
    const COL_OFF = '#828282'; // color light off
    const COL_ON = '#f3f000'; // color light on
    const COL_SHADOW = '#faff69';
    const L_HEIGHT = 50; // light height
    const L_WIDTH = 50; // light width
    const BORDER = 10; // space around light board
    const SPACE = 5; // space between lights
    const RADIUS = 20;
    
    var board = []; // light board, 0 = off, 1 = on
    var gameWon;
    
    var canvas; // main canvas
    var G_board = []; // light objects
    
    function init() {
        gameWon = false;
        
        // fill board with 0s
        board[NUM_LIGHTS - 1] = 0;
        board.fill(0);
        
        // load level into board
        initBoard(0);
        
        // create canvas wrapper
        canvas = new fabric.Canvas('mainCanvas', {
            backgroundColor: COL_BG,
            hoverCursor: 'pointer',
            selection: false
        });
        
        // draw board
        G_drawBoard();
    }
    
    function initBoard(levelID) {
        // initialize board from board file (0s and 1s)
        var bString = levels[levelID];
        try {
            for(var i = 0; i < bString.length; i++) {
                board[i] = bString[i];
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    
    function checkWon() {
        for(var i = 0; i < board.length; i++) {
            if(board[i] == 1) return false;
        }
        return true;
    }
    
    function updateBoard(id) {
        togLight(id); // toggle light
        togLight(id + WIDTH); // toggle bottom
        togLight(id - WIDTH); // toggle top
        // toggle left and right if not on the edges
        if(id % WIDTH > 0) {togLight(id - 1);}
        if(id % WIDTH < WIDTH - 1) {togLight(id + 1)}
                
        if(checkWon()) {
            // do stuff
        }
    }
    
    function togLight(id) {
        if(0 <= id && id < NUM_LIGHTS) {
            board[id] = board[id] ^ 1; // toggle light
            
            // toggle color
            var col  = (board[id] == 0) ? COL_OFF : COL_ON;
            canvas.item(id).set({
                fill: col
            });
            // toggle shadow
            canvas.item(id).setShadow("0px 0px 50px rgba(250,255,105," + board[id] + ")");
            
            // fix rendering
            canvas.renderAll();
        }
    }
    
    function G_drawBoard() {
        for(var i = 0; i < board.length; i++) {
            var x = i % WIDTH;
            var y = Math.floor(i / HEIGHT);
            var xC = BORDER + x * (L_WIDTH + SPACE);
            var yC = BORDER + y * (L_HEIGHT + SPACE);
            var col = (board[i] == 0) ? COL_OFF : COL_ON;
            
            // create light object
            var rect = new fabric.Rect({
                id: i,
                left: xC,
                top: yC,
                width: L_WIDTH,
                height: L_HEIGHT,
                fill: col,
                hasControls: false,
                hasBorders: false,
                lockMovementX: true,
                lockMovementY: true
            });
            // add blur
            if(board[i] == 1) {rect.setShadow("0px 0px 50px " + COL_SHADOW);};
            
            
            // add mouse listener
            rect.on('mousedown',function(e) {
                updateBoard(e.target.id);
            });
            
            // draw light
            canvas.add(rect);
        }
    }
    
    init();
    
    // Debugging
    function printBoard() {
        var b;
        for(var i = 0; i < HEIGHT; i++) {
            b = "";
            for(var j = 0; j < WIDTH; j++) {
                b = b + board[i * WIDTH + j] + " ";
            }
            console.log(i + " : " + b);
        }
    }
    
    function click(id) {
        updateBoard(id);
    }
    
});

let size = 40;
let exRow = 65;
let exCol = 40;
let isRunning = false;
let isRunningEx = false;
let mouseIsDown = false;
let interval;
let intervalEx;
let speed = 10;
let zoom = 5;
let gen = 0;

//Changes the number by the range input as it is updated
$("#grid-size").on("input", function(){
    size = $(this).val();
    $("#size-display").text(size);
    createGrid(false, size, size);
    changeCellZoom();
});

//Adjusts how zoomed in/out the grid is based of range val
$("#zoom-size").on("input", function(){
    zoom = $(this).val();
    $("#zoom-display").text(zoom);
    changeCellZoom();
});

function changeCellZoom(){
    $(".main .cell").css({
        "width": (zoom * 2) +"px",
        "height": (zoom * 2) +"px"
    });
}

//Changes the interval speed input as range is updated
$("#speed-size").on("input", function(){
    speed = $(this).val();
    $("#speed-display").text(speed);
    if(isRunning){
        clearInterval(interval);
        interval = setInterval(() => aliveOrDead("main", size, size), 700 / speed);
    }
});

//Button logic section 
$("#clear").click(function(){
    $(".main .cell").removeClass("alive");
    isRunning = false;
    $("#play-pause").text("►");
    clearInterval(interval);
    gen = 0;
    updateGen(gen);
});

$("#play-pause").click(function(){
    isRunning = !isRunning;

    if(isRunning){
        $(this).text("||");
        $("#play-pause-ex").text("►");
        isRunningEx = false;
        clearInterval(interval);
        clearInterval(intervalEx);
        interval = setInterval(() => aliveOrDead("main", size, size), 700 / speed);
    }
    else{
        $(this).text("►");
        clearInterval(interval);
    }
});

$("#play-pause-ex").click(function(){
    if(isRunning){
        isRunning = false;
        $("#play-pause").text("►");
        clearInterval(interval);
    }

    isRunningEx = !isRunningEx;
    clearInterval(intervalEx);

    if(isRunningEx){
        $(this).text("||");
        clearInterval(interval);
        intervalEx = setInterval(() => aliveOrDead("ex", exRow, exCol), 70);
    } 
    else{
        $(this).text("►");
    }
});

$("#resetEx").click(function(){
    $(".ex .cell").removeClass("alive");
    isRunningEx = false;
    $("#play-pause-ex").text("►");
    clearInterval(intervalEx);
    createGrid(true, exRow, exCol);
});

function createGrid(isExample = false, rows, cols){
    let id;
    isExample ? id = "ex" : id = "main";
    let gridHtml = "";
    for(i = 0; i < rows; i++){
        for(j = 0; j < cols; j++){
            let wasAlive = $("#" + id + "-" + i + "-" + j).hasClass("alive");
            let cellClass = wasAlive ? "cell alive" : "cell";
            gridHtml += "<div class='" + cellClass + "' id='" + id + "-" + i + '-' + j + "'></div>";
        }
        gridHtml += "<br>";
    }
    if(!isExample){
        $("#grid").html(gridHtml);
        
    }
    else{
        $("#spaceships").html(gridHtml);
        patterns.bigGlider.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
        patterns.hammerHead.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
        patterns.smallShip.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
        patterns.mediumShip.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
        patterns.pulsar.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
        patterns.star.forEach(([r,c]) => {$("#ex" + "-" + r + "-" + c).addClass("alive");});
    }
}

//The next section of code handles drawing on the grid
$("#grid").on("mouseover", ".cell", function(){
    if(mouseIsDown){
        $(this).toggleClass("alive");
    }
});

$("#grid").on("mousedown", ".cell", function(){
    mouseIsDown = true;
    $(this).toggleClass("alive");
});

$("body").on("mouseup", function(){
    mouseIsDown = false;
});

//Game logic section
const dirs = [[1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1]];
//Counts the neighboring cells to see how many are alive
function countDirs(prefix, row, col){
    let count = 0;
    let rowSize; let colSize;
    if(prefix == "main"){
        rowSize = size; colSize = size;
    }
    else{
        rowSize = exRow; colSize = exCol;
    }
    for([dRow, dCol] of dirs){
        let [newRow, newCol] = getNeighbor(row, col, dRow, dCol, rowSize, colSize);
        if($("#" + prefix + "-" + newRow + "-" + newCol).hasClass("alive")){
            count++;
        }
    }
    return count;
}

function toggleCell(cell){
    $(cell).toggleClass("alive");
}

//Determines if cells should be alive or dead based on rules for Conway's Game of Life
//https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
// 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// 2. Any live cell with two or three live neighbours lives on to the next generation.
// 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
// 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function aliveOrDead(prefix, row, col){
    let cellsToChange = [];
    let cellsToCheck = new Set();
    let rowSize = prefix === "main" ? size : exRow;
    let colSize = prefix === "main" ? size : exCol;

    $("." + prefix + " .alive").each(function() {
        let [_, r, c] = $(this).attr('id').split('-').map(Number);
        cellsToCheck.add(`${r}-${c}`);
        for(let [dRow, dCol] of dirs){
            let [newRow, newCol] = getNeighbor(r, c, dRow, dCol, rowSize, colSize);
            cellsToCheck.add(newRow + "-" + newCol);
        }
    });

    cellsToCheck.forEach(coords => {
        let [r, c] = coords.split('-').map(Number);
        let numAliveAdj = countDirs(prefix, r, c);
        let isAlive = $("#" + prefix + "-" + r + "-" + c).hasClass("alive");
        if(((numAliveAdj < 2 || numAliveAdj > 3) && isAlive) || 
            (numAliveAdj == 3 && !isAlive)){
            cellsToChange.push("#" + prefix + "-" + r + "-" + c);
        }
    });
    if(prefix == "main"){
        updateGen(gen += 1);
    }
    cellsToChange.forEach(toggleCell);
} 

function getNeighbor(r, c, dRow, dCol, rowSize, colSize){
    let newRow = r + dRow;
    let newCol = c + dCol;
    if(newRow < 0) newRow = rowSize - 1;   
    else if(newRow >= rowSize) newRow = 0;
    if(newCol < 0) newCol = colSize - 1;
    else if(newCol >= colSize) newCol = 0;

    return [newRow, newCol];
}

function updateGen(gen){
    $("#gen-display").text(gen);
}

const patterns = {
    bigGlider: [[1,5], [1,7], [1,8], [2,4], [2,11], [3,3], [3,4], [3,8], [3,11], [4,0], [4,1],
    [4,3], [4,9], [4,10], [5,0], [5,1], [5,3], [5,9], [5,10], [6,3], [6,4], [6,8], [6,11],
    [7,4], [7,11], [8,5], [8,7], [8,8]],
    hammerHead: [[14,0], [14,1], [14,2], [14,3], [14,4],
    [15,0], [15,5], [15,13], [15,14], [16,0], [16,12], [16, 13], [16,15], [16,16], [16,17],
    [17,1], [17,11], [17,12], [17,14], [17,15], [17, 16], [17,17], [18,3], [18,4], [18,8], 
    [18,9], [18,11], [18,12], [18,15], [18,16], [19,5], [19,10], [19,13], [20,6], [20,8], 
    [20,10], [20,12], [21,7], [22,7], [23,6], [23,8], [23,10], [23,12], [24,5], [24,10], [24,13],
    [25,3], [25,4], [25,8], [25,9], [25,11], [25,12], [25,15], [25,16], [26,1], [26,11], [26,12], 
    [26,14], [26,15], [26, 16], [26,17], [27,0], [27,12], [27, 13], [27,15], [27,16], [27,17],
    [28,0], [28,5], [28,13], [28,14], [29,0], [29,1], [29,2], [29,3], [29,4]],
    smallShip: [[35,2], [35,3], [36,0], [36,1], [36,3], [36,4], [37,0], [37,1], [37,2], [37,3],
    [38,1], [38,2]],
    mediumShip: [[42,3], [42,4], [43,1], [43,6], [44,0], [45, 0], [45,6], [46,0], [46,1], [46,2],
    [46,3], [46,4], [46,5]],
    pulsar: [[56,7], [56,14], [57,6], [57,7], [57,14], [57,15], [58,5], [58,6], [58,7], [58,14],
    [58,15], [58,16], [59,6], [59,7], [59,14], [59,15], [60,7], [60,14]],
    star: [[55,29], [56, 27], [56, 29], [57,31], [58,25], [58,26], [59,31], [59,32], [60,26], 
    [61,28], [61,30], [62,28]]
};

createGrid(false, size, size);
createGrid(true, exRow, exCol);

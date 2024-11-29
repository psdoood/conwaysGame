let size = 40;
let isRunning = false;
let mouseIsDown = false;
let interval;
let speed = 10;

//Changes the number by the range input as it is updated
$("#grid-size").on("input", function(){
    size = $(this).val();
    $("#size-display").text(size);
    createGrid();
});
//Changes the interval speed input as range is updated
$("#speed-size").on("input", function(){
    speed = $(this).val();
    $("#speed-display").text(speed);
    if(isRunning){
        clearInterval(interval);
        interval = setInterval(aliveOrDead, 700 / speed);
    }
});

//Button logic
$("#clear").click(function(){
    $(".cell").removeClass("alive");
    isRunning = false;
    clearInterval(interval);
});

$("#start").click(function(){
    isRunning = true;
    clearInterval(interval);
    interval = setInterval(aliveOrDead, 700 / speed);
});

$("#pause").click(function(){
    isRunning = false;
    clearInterval(interval);
});

function createGrid(){
    let gridHtml = "";
    for(i = 0; i < size; i++){
        for(j = 0; j < size; j++){
            gridHtml += "<div class='cell' id='" + i + '-' + j + "'></div>";
        }
        gridHtml += "<br>";
    }
    $("#grid").html(gridHtml);
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

$("#grid").on("mouseup", function(){
    mouseIsDown = false;
});

//Game logic section
const dirs = [[1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1]];
//Counts the neighboring cells to see how many are alive
function countDirs(row, col){
    let count = 0;
    for([dRow, dCol] of dirs){
        let newRow = row + dRow;
        let newCol = col + dCol;
        //Next 4 stmts handles grid wrap around
        if(newRow < 0) newRow = size - 1;   
        else if(newRow >= size) newRow = 0;
        if(newCol < 0) newCol = size - 1;
        else if(newCol >= size) newCol = 0;
        
        if($("#" + newRow + "-" + newCol).hasClass("alive")){
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
function aliveOrDead(){
    let cellsToChange = [];
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            let numAliveAdj = countDirs(i, j);
            let isAlive = $("#" + i + "-" + j).hasClass("alive");
            if(((numAliveAdj < 2 || numAliveAdj > 3) && isAlive)||(numAliveAdj == 3 && !isAlive)){
                cellsToChange.push("#" + i + "-" + j);
            }     
        }
    }
    cellsToChange.forEach(toggleCell);
}   

createGrid();

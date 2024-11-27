let size = 20;
let isRunning = false;
let mouseIsDown = false;

//Changes the number by the range input as it is updated
$("#grid-size").on("input", function(){
    size = $(this).val();
    $("#size-display").text(size);
    createGrid();
})

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
$("#clear").click(function(){
    $(".cell").removeClass("alive");
})

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
        if(newRow < 0 || newRow >= size || newCol < 0 || newCol >= size){
            continue;
        }
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

setInterval(aliveOrDead, 100);

createGrid();

size = 20;
isRunning = false;
mouseIsDown = false;

//Changes the number by the range input as it is updated
$("#grid-size").on("input", function(){
    size = $(this).val();
    $("#size-display").text(size);
    createGrid();
})

function createGrid(){
    gridHtml = "";
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
function countDirs(row, col){
    count = 0;
    for([dRow, dCol] of dirs){
        newRow = row + dRow;
        newCol = col + dCol;
        if(newRow < 0 || newRow >= size || newCol < 0 || newCol >= size){
            continue;
        }
        if($("#" + newRow + "-" + newCol).hasClass("alive")){
            count++;
        }
    }
    return count;
}

createGrid();
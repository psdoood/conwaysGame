size = 20;
isRunning = false;
mouseIsDown = false;

$("#grid-size").on("input", function(){
    size = $(this).val();
    $("#size-display").text(size);
    createGrid();
})

function createGrid(){
    gridHtml = "";
    for(i = 0; i < size; i++){
        for(j = 0; j < size; j++){
            gridHtml += "<div class='cell'></div>";
        }
        gridHtml += "<br>";
    }
    $("#grid").html(gridHtml);
}

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

createGrid();
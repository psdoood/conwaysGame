size = 20;

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

createGrid();
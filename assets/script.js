


// My functions to "saving" user city search
var index = 0;

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var searchResult = $("#searchInput").val().trim();
    localStorage.getItem("index");
    localStorage.setItem("userInput" + index, searchResult);
    index = index + 1;
    localStorage.setItem("index", index);
})

function generateList() {
    var x = localStorage.getItem("index");
    for (var i = 0; i < x; i++) {
        var getListItem = localStorage.getItem("userInput" + i);
        var newListItem = $("<li class='list-group-item'>").text(getListItem);
        $("#cityList").append(newListItem);
    }
}

generateList();
// Function for current weather
function getWeather() {  
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $("#searchInput").val() + ",us&appid=ef5a1aac4687a7fff928e96832672dc8";
    var queryUVURL = "api.openweathermap.org/data/2.5/uvi?q=" + $("#searchInput").val() + ",us&appid=ef5a1aac4687a7fff928e96832672dc8";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#cityText").text(response.name);
        var tempKelvin = response.main.temp;
        var tempFahr = (((tempKelvin - 273.15) * 1.8) + 32);
        $("#tempText").text("Temperature: " + tempFahr.toFixed() + "\xB0" + "F");
        $("#humidityText").text("Humidity: " + response.main.humidity + "%");
        $("#windText").text("Wind speed: " + response.wind.speed + "mph");
    })

    $.ajax({   // I keep getting the error that access is "blocked"
        url: queryUVURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })
}




// My functions to "save" user city search
var index = 0;

function getIndex() {
    if (localStorage.getItem("index") === null) {
        index = 0;
    }
    else {
        index = parseInt(localStorage.getItem("index"));
    }
}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var searchResult = $("#searchInput").val().trim();
    getIndex();
    localStorage.setItem("userInput" + index, searchResult);
    index = index + 1;
    localStorage.setItem("index", index);
    var newListItem = $("<li class='list-group-item'>").text(searchResult); // This is to create the result without having to refresh
    $("#cityList").append(newListItem);
    getWeather();
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

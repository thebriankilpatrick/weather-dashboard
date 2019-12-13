// Function for current weather
function getWeather() {  
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $("#searchInput").val() + ",us&appid=ef5a1aac4687a7fff928e96832672dc8";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#cityText").text(response.name);
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $("#iconContainer").append("<img id='iconImage'>");
        $("#iconImage").attr("src", iconURL);
        var tempKelvin = response.main.temp;
        var tempFahr = (((tempKelvin - 273.15) * 1.8) + 32);
        $("#tempText").text("Temperature: " + tempFahr.toFixed() + "\xB0" + "F");
        $("#humidityText").text("Humidity: " + response.main.humidity + "%");
        $("#windText").text("Wind speed: " + response.wind.speed + "mph");
        $(".weatherContainer").css("border", "solid 1px lightgray");

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        var queryUVURL = "http://api.openweathermap.org/data/2.5/uvi?appid=942ae6ca747eb423646036b5684169fa&lat=" + lat + "&lon=" + lon;

        $.ajax({   // I keep getting the error that access is "blocked"
        url: queryUVURL,
        method: "GET"
        }).then(function(response) {
            $("#uVText").text("UV Index: " + response.value);
        })
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

// This is to create a click handler on the saved city list
// Clicked on a city in the list, will display that city's weather
$(document).on("click", ".list-group-item", function() {
    $("#searchInput").val($(this).text());
    getWeather();
});

generateList();

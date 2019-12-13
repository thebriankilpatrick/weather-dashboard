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

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + $("#searchInput").val() + ",us&appid=942ae6ca747eb423646036b5684169fa";

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response) {  
            // FIND A WAY TO REMOVE OLD CARDS BEFORE APPLYING NEW ONES
            // ALSO, THE LOCATION IS NOT PULLING CORRECTLY
            // AS WELL AS THE FORECAST IMAGE
            $("<div class='card text-white bg-info mb-3 float-left'>").remove();
            console.log(response);
            var arrayLength = response.list.length;
            for (var i = 0; i < arrayLength; i += 8) {
                // Create bootstrap cards
                // create content
                // append to row
                var forecastCard = $("<div class='card text-white bg-info mb-3 float-left'>");
                $(".forecastContainer").append(forecastCard); // See if float left works
                var dt = response.list[i].dt_txt  // Grabbing date from forecast
                var dateFixed = moment(dt, "YYYY.MM.DD").format("MM/DD/YYYY");  // Changing format of date, using moment.js
                forecastCard.append($("<div class='card-header'>").text(dateFixed));
    
                var iconCode = response.list[i].weather[0].icon;
                console.log(iconCode);
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                forecastCard.append("<img class='forecastImage'>");
                $(".forecastImage").attr("src", iconURL);
                
                var tempKelvin = response.list[i].main.temp;
                var tempFahr = (((tempKelvin - 273.15) * 1.8) + 32);
                forecastCard.append($("<p>").text("Temperature: " + tempFahr.toFixed() + "\xB0" + "F"));
                forecastCard.append($("<p>").text("Humidity: " + response.list[i].main.humidity + "%"));
            }
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
// Clicking on a city in the list, will display that city's weather
$(document).on("click", ".list-group-item", function() {
    $("#searchInput").val($(this).text());
    getWeather();
});

generateList();

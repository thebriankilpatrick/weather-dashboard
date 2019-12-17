// Function for current weather
function getWeather() {  
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $("#searchInput").val() + ",us&appid=ef5a1aac4687a7fff928e96832672dc8";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // This displays the city name, based on the call's response
        $("#cityText").text(response.name);

        // This displays the current weather icon image
        var iconCode = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        $("#iconContainer").append("<img id='iconImage'>");
        $("#iconImage").attr("src", iconURL);

        // Converting temperature to fahrenheit, and then displaying it
        var tempKelvin = response.main.temp;
        var tempFahr = (((tempKelvin - 273.15) * 1.8) + 32);
        $("#tempText").text("Temperature: " + tempFahr.toFixed() + "\xB0" + "F");

        // Displaying the humidity and wind speed
        $("#humidityText").text("Humidity: " + response.main.humidity + "%");
        $("#windText").text("Wind speed: " + response.wind.speed + "mph");
        $(".weatherContainer").css("border", "solid 1px lightgray");

        // Pulling the longitute and latitude from the call's response.
        // This is necessary for the UV Index call
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        var queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?appid=942ae6ca747eb423646036b5684169fa&lat=" + lat + "&lon=" + lon;

        // Calling this API to get the UV Index of the city, and displaying it
        $.ajax({ 
        url: queryUVURL,
        method: "GET"
        }).then(function(response) {
            $("#uVText").text("UV Index: " + response.value);
        })

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + $("#searchInput").val() + ",us&appid=942ae6ca747eb423646036b5684169fa";

        // Calling the 5 day forecast, dynamically creating the elements and storing the response
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response) {  
           
            var arrayLength = response.list.length;
            // For loop to get the forecast for the next 5 days
            // i += 8, to loop exactly every 24 hours in the forecast response
            for (var i = 0; i < arrayLength; i += 8) {
                
                var forecastCard = $("<div class='card text-white bg-info mb-3 float-left forecastCard'>"); // Dynamically creating bootstrap element
                $(".forecastContainer").append(forecastCard); 
                var dt = response.list[i].dt_txt  // Grabbing date from forecast
                var dateFixed = moment(dt, "YYYY.MM.DD").format("MM/DD/YYYY");  // Changing format of date, using moment.js
                forecastCard.append($("<div class='card-header'>").text(dateFixed));
 
                // Pulling the image, for each day, and displays them in each card created
                var iconCode = response.list[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                var forecastImage = $("<img>").attr("src", iconURL).css("width", "50%");
                forecastCard.append(forecastImage);
                
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
    $(".forecastContainer").empty(); // Removing forecast cards before new ones are created and appended
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

// This function is to pull the list of searched cities from localStorage, and display them
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
    $(".forecastContainer").empty(); // This is removing the forecast cards before new ones are created and appended
    $("#searchInput").val($(this).text());
    getWeather();
});

generateList();

// Displays the last searched city's forecast on page load
function lastForecasted() {
    var last = parseInt(localStorage.getItem("index"));
    console.log(last);
    if (localStorage.getItem("index") === null) { // If no cities have been searched, the default city will be Richmond
        var cityDefault = $("#cityDefault").text();
        $("#searchInput").val(cityDefault).text();
        getWeather();
    }
    else {
        last -= 1;
        var result = localStorage.getItem("userInput" + last);
        $("#searchInput").val(result).text();
        getWeather();
    }
}

lastForecasted();



// API OpenWeather
var APIkey = "b106dd3e31f5323025e4abc94a1aa344";


// called weather object
var currentWeather = {
    name: "",
    date: "",
    temperature: "",
    humidity: "",
    wind: "",
    uv: "",
    uvAlert: "",
    icon: "",

}
// forcast data array
var forecast = [];

// page elements required for the script
var cityName = document.querySelector("#name");
var currentDate = document.querySelector("#date");
var currentIcon = document.querySelector("#icon");
var currentTemperature = document.querySelector("#temperature");
var currentHumidity = document.querySelector("#humidity");
var currentWind = document.querySelector("#wind");
var currentUV = document.querySelector("#uv");
var inputSearch = document.querySelector("#inputCity");
var Form = document.querySelector("#searchForm");
var searchHistoryEl = document.querySelector("#history");
var clearBtn = document.querySelector("#clearHistoryBtn");
var forecastEl = document.querySelector("#forecast-body");
var forecastContEl = document.querySelector("#forecast-container");
var resultsCont = document.querySelector("#results-container");
var currentStatusEl = document.querySelector("#currentStatus");



// FUNCTIONS //

// get weather
var getWeather =  function (city){

    var APIurl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    var lon = "";
    var lat = "";
    
    fetch(APIurl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                currentWeather.date = moment().format("dddd, MMMM Do YYYY");
                currentWeather.name = data.name;
                currentWeather.temp = data.main.temp + " &#176F";
                currentWeather.humidity = data.main.humidity + "%";
                currentWeather.wind = data.wind.speed + " MPH";
                currentWeather.icon = data.weather[0].icon;
                lon = data.coord.lon;
                lat = data.coord.lat;

                var UVurl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
                fetch(UVurl)
                .then (function(uvResponse) {
                    if (uvResponse.ok) {
                        uvResponse.json().then(function(uvData) {
                            currentWeather.uv = uvData.value;

                            console.log("Current Weather data", currentWeather);
                            

                            cityName.innerHTML = currentWeather.name;
                            currentDate.innerHTML = currentWeather.date;
                            currentTemperature.innerHTML = currentWeather.temp;
                            currentDate.innerHTML = currentWeather.date;
                            currentHumidity.innerHTML = currentWeather.humidity;
                            currentWind.innerHTML = currentWeather.wind;
                            currentUV.innerHTML = currentWeather.uv;
                            currentIcon.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";
                            uvCheck();
                            getForecast(city);
                            
                        });
                    }
                    else {
                        currentWeather.uv = "error";
                        currentUV.innerHTML = "error";
                    }
                });                
            });
        } else {
            clearData();
            
        }
    })
    
    .catch (function(error) {
        forecastEl.innerHTML = error.message;
    })
}

// get forecast array
var getForecast = function (city) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(forecastUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                var today = moment().format("YYYY-MM-DD");
                for (var i=0; i<data.list.length; i++){
                    var dateTime = data.list[i].dt_txt.split(' ');
                    if (dateTime[0] !== today && dateTime[1] === "12:00:00") {
                        var futureDate = {
                            date: moment(dateTime[0]).format("MM/DD/YYYY"),
                            time: dateTime[1],
                            icon: data.list[i].weather[0].icon,
                            temp: data.list[i].main.temp,
                            humidity: data.list[i].main.humidity
                        };
                        forecast.push(futureDate);
                    }
                }
                displayForecast();
            })
        }

        else {
            forecastEl.innerHTML = "error: " + response.status + " " + response.statusText;
        }
    })

    .catch (function(error) {
        forecastEl.innerHTML = error.message;
    })

}

var clearData = function() {
    currentStatusEl.style.display = "none";
    forecastContEl.style.display = "none";
    currentDate.innerHTML = "";
    currentIcon.innerHTML = "";
}

// display 5-day forecast
var displayForecast = function() {
    for (var i=0; i<forecast.length; i++) {

        var cardContainerEl = document.createElement("div");
        cardContainerEl.classList.add("col");
        cardContainerEl.classList.add("col-md-4");"<img src='https://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png'></img>";

        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.classList.add("forecast-card");

        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");

        var dateEl = document.createElement("h3");
        dateEl.classList.add("card-title");
        dateEl.innerHTML = forecast[i].date;
        cardBodyEl.appendChild(dateEl);

        var temperatureEl = document.createElement("p");
        temperatureEl.classList.add("card-text");
        temperatureEl.innerHTML = "Temp: " + forecast[i].temp;
        cardBodyEl.appendChild(temperatureEl);

        var humidityEl = document.createElement("p");
        humidityEl.classList.add("card-text");
        humidityEl.innerHTML = "Humidity: " + forecast[i].humidity;
        cardBodyEl.appendChild(cardContainerEl);

        var iconEl = document.createElement("p");
        iconEl.classList.add("card-text");
        iconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png'></img>";

        cardEl.appendChild(cardBodyEl);
        cardContainerEl.appendChild(cardBodyEl);
        forecastEl.appendChild(cardBodyEl);
        
    }

}

// display data collected from APi through getWeather
var displayWeather = function() {
    cityName.innerHTML = currentWeather.name;
    currentDate.innerHTML = currentWeather.date;
    currentTemperature.innerHTML = currentWeather.temperature;
    currentHumidity.innerHTML = currentWeather.humidity;
    currentWind.innerHTML = currentWeather.wind;
    currentUV.innerHTML = currentWeather.uv;
    currentIcon.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";

    uvCheck();
}

var clearForecast = function() {
    forecast = [];
    forecastEl.innerHTML = "";
}


// submit form
var formSubmitCity = function(event) {

    event.preventDefault();
    var searchCity = inputSearch.value.trim();
    if (searchCity) {
        getWeather(searchCity);
        if(searchHistory.indexOf(searchCity) == -1){
            searchHistory.push(searchCity);
            localStorage.removeItem("history");
            localStorage.setItem("history", JSON.stringify(searchHistory));
        }

        displayHistory();
        inputCity.value = "";
    }
    else {
        return;
    }

}

// load history
var loadHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    if(!searchHistory) {
        searchHistory = [];
    }
    displayHistory();
}

var uvCheck = function() {
    if (currentWeather.uv === "error") {
        return;
    }
}

// display history
var displayHistory = function() {
    searchHistoryEl.innerHTML = "";
    for (var i = 0; i<searchHistory.length; i++) {
        var historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerHTML = "<h3>" + searchHistory[i] + "</h3>";
        searchHistoryEl.appendChild(historyItem);
    }
}

// delete history
var deleteHistory = function(event) {
    var historyCity = event.target.textContext;
    if (historyCity) {
        clearForecast();
        getWeather(historyCity);
    }
}


// console.log

Form.addEventListener("submit", formSubmitCity);
searchHistoryEl.addEventListener("click", deleteHistory);




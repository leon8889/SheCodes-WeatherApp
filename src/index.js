// **************
// Functions
// **************

function getWeather4CityXY(event) {
	event.preventDefault();

	// get city name
	let cityInputElement = document.querySelector("#citySearch");

	if (cityInputElement.value) {
		let city = cityInputElement.value.trim();
		getWeatherFromAPIByCity(city);
	}
}

function getWeather4PositionXY(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(getWeatherFromAPIByLocation);
}

function getWeatherFromAPIByCity(city) {
	let apiUrl =
		"https://api.shecodes.io/weather/v1/current?query=" +
		city +
		"&units=metric" +
		"&key=" +
		apiKey;

	axios.get(apiUrl).then(changeWeatherData);
}

function getWeatherFromAPIByLocation(position) {
	let apiUrl =
		"https://api.shecodes.io/weather/v1/current?lat=" +
		position.coords.latitude +
		"&lon=" +
		position.coords.longitude +
		"&units=metric" +
		"&key=" +
		apiKey;

	axios.get(apiUrl).then(changeWeatherData);
}

function changeWeatherData(response) {
	if (response.status == 200) {
		// change city name
		let cityNameElement = document.querySelector("#currentCityName");
		cityNameElement.innerHTML = response.data.city;

		// change temperature
		celsiusTemperature = Math.round(response.data.temperature.current);
		let currentTempElement = document.querySelector("#temperatureValue");
		if (fahrenheitLink.classList.contains("active")) {
			currentTempElement.innerHTML = convertCtoF(celsiusTemperature);
		} else {
			currentTempElement.innerHTML = celsiusTemperature;
		}

		// change icon
		let currentIconElement = document.querySelector("#emoji");
		currentIconElement.setAttribute("src", response.data.condition.icon_url);
		currentIconElement.setAttribute("alt", response.data.condition.icon);

		// change description
		let descriptionElement = document.querySelector("#description");
		descriptionElement.innerHTML = response.data.condition.description;

		// change humidity
		let humidityElement = document.querySelector("#humidity");
		humidityElement.innerHTML = response.data.temperature.humidity;

		// change wind speed
		let windElement = document.querySelector("#wind");
		windElement.innerHTML = Math.round(response.data.wind.speed);
	} else {
		console.log(`${response.status}: Response Error`);
	}
}

function displayFahrenheitTemperature(event) {
	event.preventDefault();
	let fahrenheitTemperature = convertCtoF(celsiusTemperature);
	let currentTempElement = document.querySelector("#temperatureValue");
	currentTempElement.innerHTML = fahrenheitTemperature;
	celsiusLink.classList.remove("active");
	fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
	event.preventDefault();
	let currentTempElement = document.querySelector("#temperatureValue");
	currentTempElement.innerHTML = celsiusTemperature;
	celsiusLink.classList.add("active");
	fahrenheitLink.classList.remove("active");
}

function convertCtoF(temp) {
	return Math.round(temp * 1.8 + 32);
}

// **************
// Globals
// **************

// SheCodesWeatherAPI
// https://www.shecodes.io/learn/workshops/1021/apis/weather
let apiKey = "tb533a02o404f422da6058f58bb72fcc";

let celsiusTemperature = null;
let city = "Munich";

let days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

// **************
// Main
// **************

// get current date
let now = new Date();
let day = days[now.getDay()];
let hours = now.getHours();
let minutes = now.getMinutes();
if (hours < 10) {
	hours = "0" + hours;
}
if (minutes < 10) {
	minutes = "0" + minutes;
}

let currentDate = document.querySelector("#currentDate");
currentDate.innerHTML = day + " " + hours + ":" + minutes;

// Default weather search for Munich
getWeatherFromAPIByCity(city);

// react to search button
let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", getWeather4CityXY);

// react to "get current location" button
let currentLocation = document.querySelector("#CurrentLocation");
currentLocation.addEventListener("click", getWeather4PositionXY);

// react to fahrenheit link
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

// react to celsius link
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

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

		// change date
		let currentDate = getDate(response.data.time * 1000);
		let currentDateElement = document.querySelector("#currentDate");
		currentDateElement.innerHTML =
			currentDate["weekDay"] +
			", " +
			currentDate["month"] +
			". " +
			currentDate["day"] +
			" " +
			currentDate["hours"] +
			":" +
			currentDate["minutes"];

		// change temperature
		let currentTempElement = document.querySelector("#temperatureValue");
		currentTempElement.innerHTML = Math.round(
			response.data.temperature.current
		);

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

		// forcast
		getWeatherForcastFromAPIByCity(response.data.city);
	} else {
		console.log(`${response.status}: Response Error`);
	}
}

function getWeatherForcastFromAPIByCity(city) {
	let apiUrl =
		"https://api.shecodes.io/weather/v1/forecast?query=" +
		city +
		"&units=metric" +
		"&key=" +
		apiKey;

	axios.get(apiUrl).then(changeWeatherForcastData);
}

function changeWeatherForcastData(response) {
	if (response.status == 200) {
		let forecast = response.data.daily;

		forecast.forEach(function (forecastDay, index) {
			if (index < 5) {
				let forcastDate = getDate(forecastDay.time * 1000);

				// change date
				let forcastDateElement = document.querySelector(
					"#forcast-date-" + index
				);
				forcastDateElement.innerHTML =
					forcastDate["month"] + ". " + forcastDate["day"];

				// change week day
				if (index > 0) {
					let forcastDayElement = document.querySelector(
						"#forcast-day-" + index
					);
					forcastDayElement.innerHTML = forcastDate["weekDay"];
				}

				// change temperature
				let forcastTempMaxElement = document.querySelector(
					"#forcast-temp-max-" + index
				);
				forcastTempMaxElement.innerHTML = Math.round(
					forecastDay.temperature.maximum
				);
				let forcastTempMinElement = document.querySelector(
					"#forcast-temp-min-" + index
				);
				forcastTempMinElement.innerHTML = Math.round(
					forecastDay.temperature.minimum
				);

				// change icon
				let forcastIconElement = document.querySelector(
					"#forcast-emoji-" + index
				);
				forcastIconElement.setAttribute("src", forecastDay.condition.icon_url);
				forcastIconElement.setAttribute("alt", forecastDay.condition.icon);
			}
		});
	} else {
		console.log(`${response.status}: Response Error`);
	}
}

function getDate(timestamp) {
	let date = new Date(timestamp);
	let dateArray = new Object();
	dateArray["hours"] =
		date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	dateArray["minutes"] =
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getHours();
	dateArray["day"] = date.getDate();
	dateArray["month"] = months[date.getMonth()];
	dateArray["weekDay"] = days[date.getDay()];
	return dateArray;
}

// **************
// Globals
// **************

// SheCodesWeatherAPI
// https://www.shecodes.io/learn/workshops/1021/apis/weather
let apiKey = "tb533a02o404f422da6058f58bb72fcc";

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
let months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

// **************
// Main
// **************

let forcastTemp = new Object();

// Default weather search for Munich
getWeatherFromAPIByCity(city);

// react to search button
let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", getWeather4CityXY);

// react to "get current location" button
let currentLocation = document.querySelector("#CurrentLocation");
currentLocation.addEventListener("click", getWeather4PositionXY);

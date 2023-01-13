let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";

function getWeather4CityXY(event) {
	event.preventDefault();

	// get city name
	let cityField = document.querySelector("#citySearch");

	if (cityField.value) {
		let city = capitalize(cityField.value.trim());
		getWeatherFromAPIByCity(city);

		// let forcast = document.querySelectorAll("#forcast .col");
		// forcast.forEach(function (item) {
		// 	let randomWeather = getRandomWeather(scale);
		// 	let forcastTemp = item.querySelector(".temperatureValue");
		// 	forcastTemp.innerHTML = randomWeather[0];
		// 	let forcastEmoji = item.querySelector(".emoji");
		// 	forcastEmoji.innerHTML = randomWeather[1];
		// });
	}
}

function getWeather4PositionXY(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(getWeatherFromAPIByLocation);
}

function getWeatherFromAPIByCity(city) {
	let apiUrl =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&units=metric" +
		"&appid=" +
		apiKey;

	axios.get(apiUrl).then(changeWeatherData);
}

function getWeatherFromAPIByLocation(position) {
	let apiUrl =
		"https://api.openweathermap.org/data/2.5/weather?lat=" +
		position.coords.latitude +
		"&lon=" +
		position.coords.longitude +
		"&units=metric" +
		"&appid=" +
		apiKey;

	axios.get(apiUrl).then(changeWeatherData);
}

function changeWeatherData(response) {
	if (response.status == 200) {
		let temp = Math.round(response.data.main.temp);
		let icon = response.data.weather[0].icon;

		// change city name
		let cityName = document.querySelector("#currentCityName");
		cityName.innerHTML = response.data.name;

		// change temperature
		let currentTemp = document.querySelector("#temperatureValue");
		currentTemp.innerHTML = temp;

		// change icon
		let currentEmoji = document.querySelector("#emoji");
		currentEmoji.innerHTML =
			'<img id="wicon" src="' + getEmoji(icon) + '" alt="Weather icon">';
	} else {
		console.log(`${response.status}: Response Error`);
	}
}

function getEmoji(icon) {
	let iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
	return iconUrl;
}

function capitalize(string) {
	let array = string.split(/[-\s]/);
	let returnValue = "";
	array.forEach(concat);
	function concat(item) {
		returnValue +=
			item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() + " ";
	}
	return returnValue.trim();
}

// get current date
let days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
let now = new Date();

let currentDate = document.querySelector("#currentDate");
currentDate.innerHTML =
	days[now.getDay()] + " " + now.getHours() + ":" + now.getMinutes();

// react to search button
let searchButton = document.querySelector("#citySearchButton");
searchButton.addEventListener("click", getWeather4CityXY);

let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", getWeather4CityXY);

// react to "get current location" button
let currentLocation = document.querySelector("#CurrentLocation");
currentLocation.addEventListener("click", getWeather4PositionXY);

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
		let forcastTemp = { Max: [], Min: [] };
		let weekDays = [];

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
				let forcastTempMax = Math.round(forecastDay.temperature.maximum);
				let forcastTempMin = Math.round(forecastDay.temperature.minimum);
				let forcastTempMaxElement = document.querySelector(
					"#forcast-temp-max-" + index
				);
				let forcastTempMinElement = document.querySelector(
					"#forcast-temp-min-" + index
				);
				forcastTempMaxElement.innerHTML = forcastTempMax;
				forcastTempMinElement.innerHTML = forcastTempMin;
				forcastTemp["Max"][index] = forcastTempMax;
				forcastTemp["Min"][index] = forcastTempMin;
				weekDays[index] = forcastDate["weekDayShort"];

				// change icon
				let forcastIconElement = document.querySelector(
					"#forcast-emoji-" + index
				);
				forcastIconElement.setAttribute("src", forecastDay.condition.icon_url);
				forcastIconElement.setAttribute("alt", forecastDay.condition.icon);
			}
		});
		// create Graphic
		plotForcastGraphic(weekDays, forcastTemp);
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
		date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	dateArray["day"] = date.getDate();
	dateArray["month"] = months[date.getMonth()];
	dateArray["weekDay"] = days[date.getDay()];
	dateArray["weekDayShort"] = daysShort[date.getDay()];
	return dateArray;
}

function plotForcastGraphic(xAxis, forcastTemp) {
	var trace1 = {
		x: xAxis,
		y: forcastTemp.Max,
		type: "scatter",
		name: "max.",
		line: {
			color: "#2B7EBA",
			width: 1,
		},
		mode: "lines+text",
		text: forcastTemp.Max,
		textposition: "top center",
		textfont: {
			family: "Raleway, sans-serif",
			size: "16",
			color: "#10658e",
		},
	};

	var trace2 = {
		x: xAxis,
		y: forcastTemp.Min,
		type: "scatter",
		name: "min.",
		line: {
			color: "#DB4052",
			width: 1,
		},
		mode: "lines+text",
		text: forcastTemp.Min,
		textposition: "top center",
		textfont: {
			family: "Raleway, sans-serif",
			size: "16",
			color: "#bc3a47",
		},
	};

	var layout = {
		width: 750,
		height: 350,
		plot_bgcolor: "#c0deea",
		paper_bgcolor: "#c0deea",
		xaxis: {
			title: "Week Days",
			showgrid: false,
			zeroline: false,
		},
		yaxis: {
			title: "Temperature [°C]",
			showline: false,
			showticklabels: false,
			range: [
				Math.min.apply(Math, forcastTemp.Min) - 5,
				Math.max.apply(Math, forcastTemp.Max) + 5,
			],
		},
	};

	var data = [trace1, trace2];
	Plotly.newPlot("graphic", data, layout);
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
let daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Default weather search for Munich
getWeatherFromAPIByCity(city);

// react to search button
let searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", getWeather4CityXY);

// react to "get current location" button
let currentLocation = document.querySelector("#CurrentLocation");
currentLocation.addEventListener("click", getWeather4PositionXY);

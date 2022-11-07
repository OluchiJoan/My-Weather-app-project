function formattedDate(real) {
  let now = new Date();
  let day = now.getDay();
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${days[day]} ${hour}:${minute}`;
}
function formatForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let weatherForecastElement = document.querySelector("#weather-forecast");
  let weatherForecastHTML = `<div class ="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      weatherForecastHTML =
        weatherForecastHTML +
        `<div class="col-3">
      <div class="weather-forecast-date"> ${formatForecast(
        forecastDay.dt
      )}</div>
      <img src=" http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" width="40" />
      <div class="weather-forecast-temp">
        <span class="weather-forecast-temp-max">
          <strong>${Math.round(forecastDay.temp.max)}°</strong>
        </span>
        <span class="weather-forecast-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
  </div>`;
    }
  });
  weatherForecastHTML = weatherForecastHTML + `</div>`;
  weatherForecastElement.innerHTML = weatherForecastHTML;
}

let currentTime = document.querySelector("#real-time");
currentTime.innerHTML = formattedDate();

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "b40b135798f82a05aed08769f9275f50";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  console.log(response.data.weather[0].icon);
  document.querySelector("#country").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "b40b135798f82a05aed08769f9275f50";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function findCity(event) {
  event.preventDefault();
  let apiKey = "b40b135798f82a05aed08769f9275f50";
  let city = document.querySelector("#city-input").value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", findCity);

function searchLocation(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Minnesota");

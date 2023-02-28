const citySearch = document.querySelector(".citySearch");
const searchBtn = document.querySelector(".search");
const weather = document.querySelector(".weather");

const defaultCity = "cairo";
const apiKey = "ad20ccd6ec864f68aa6161947232502";
const baseURL = "http://api.weatherapi.com/v1/forecast.json?key=";
const city = "&q=";
const days = "&days=3";

let currentWeatherDetails = {};
let forecastWeather = [];

var weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

var months = new Array(12);
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

let d = new Date();

citySearch.addEventListener("keyup", performAction);
citySearch.addEventListener("keyup", performAction);

function performAction() {
  if (this.value.length >= 3) {
    addData(citySearch.value);
  }
}

function addData(cityName) {
  getWeatherData(cityName).then((data) => {
    currentWeatherDetails = {
      name: data.location.name,
      temp: data.current.temp_c,
      tempIcon: data.current.condition.icon,
      description: data.current.condition.text,
      rain: data.current.precip_in,
      wind: data.current.wind_kph,
      direction: data.current.wind_dir,
    };
    let array = data.forecast.forecastday;
    for (let i = 1; i < array.length; i++) {
      forecastWeather[i - 1] = {
        tempIcon: array[i].day.condition.icon,
        description: array[i].day.condition.text,
        maxTemp: array[i].day.maxtemp_c,
        minTemp: array[i].day.mintemp_c,
      };
    }
    // console.log(currentWeatherDetails, forecastWeather);
    displayWeather(currentWeatherDetails, forecastWeather);
  });
}

const getWeatherData = async (citySearched) => {
  let URL = baseURL + apiKey + city + citySearched + days;
  const res = await fetch(URL);
  // console.log(res);
  if (res.status != 400 && res.ok) {
    const data = await res.json();
    // console.log(data);
    return data;
  }
};

function displayWeather(currentWeatherDetails, forecastWeather) {
  forecastedWeather = "";
  currentWeather = `<div class="col-md-4 box today p-0">
  <div class="header d-flex justify-content-between p-2">
      <div class="day">${weekdays[d.getDay()]}</div>
      <div class="date">${d.getDate() + months[d.getMonth()]}</div>
  </div>
  <div class="content p-3">
      <div class="location">${currentWeatherDetails.name}</div>
      <div class="temperature mb-3">
          <div class="number text-white">${currentWeatherDetails.temp}°C</div>
          <div class="icon"><img src="https:${
            currentWeatherDetails.tempIcon
          }" alt="weather Logo">
          </div>
      </div>
      <div class="description mb-3">${currentWeatherDetails.description}</div>
      <div class="extraInfo d-flex mb-2">
          <div class="rain me-4"><img src="./img/icon-umberella.png" alt="umbrella icon" class="me-2">${
            currentWeatherDetails.rain
          }%</div>
          <div class="wind me-4"><img src="./img/icon-wind.png" alt="wind logo" class="me-2">${
            currentWeatherDetails.wind
          } km/h</div>
          <div class="direction"><img src="./img/icon-compass.png" alt="wind logo" class="me-2">${
            currentWeatherDetails.direction
          }</div>
      </div>
  </div>
</div>`;
  for (let i = 0; i < forecastWeather.length; i++) {
    let nextDay = d.getDay() + 1;
    if (nextDay == 7) {
      nextDay = 0;
    }
    if (i == 1) {
      nextDay++;
    }
    forecastedWeather += `<div class="col-md-4 box p-0">
    <div class="header d-flex justify-content-center p-2">
        <div class="day">${weekdays[nextDay]}</div>
    </div>
    <div class="content text-center my-5">
        <div class="temperature mb-3">
            <div class="icon mb-2"><img src="https:${forecastWeather[i].tempIcon}" alt="weather Logo"> 
            <div class="maxTemp text-white">${forecastWeather[i].maxTemp}°C</div>
            <div class="minTemp">${forecastWeather[i].minTemp}°C</div>
            </div>
        </div>
        <div class="description">${forecastWeather[i].description}</div>
    </div>
</div>`;
  }
  weather.innerHTML = currentWeather + forecastedWeather;
}
addData(defaultCity);

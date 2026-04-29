const input = document.getElementById("cityInput");
const historyBox = document.getElementById("history");

let currentCity = "Novosibirsk";
let chart;

window.addEventListener("load", () => {
  loadWeather();
  renderHistory();
});

function searchCity() {
  const value = input.value.trim();
  if (!value) return;

  currentCity = value;

  saveHistory(value);
  loadWeather();
}


function loadWeather() {
  getCurrentWeather();
  getForecast();
}

async function getCurrentWeather() {
  const res = await fetch(`http://localhost:3000/weather?city=${currentCity}`);
  const data = await res.json();

  if (!data || data.cod !== 200) return;

  document.getElementById("city").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
  document.getElementById("desc").textContent = data.weather[0].description;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("feels").textContent =
    "Ощущается: " + Math.round(data.main.feels_like) + "°C";

  document.getElementById("wind").textContent =
    "Ветер: " + data.wind.speed + " м/с";

  document.getElementById("humidity").textContent =
    "Влажность: " + data.main.humidity + "%";

  document.getElementById("pressure").textContent =
    "Давление: " + data.main.pressure + " hPa";

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("ru-RU");
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("ru-RU");

  document.getElementById("sun").textContent =
    `🌅 ${sunrise} | 🌇 ${sunset}`;

  changeBackground(data.weather[0].main, data.weather[0].description);
}

async function getForecast() {
  const res = await fetch(`http://localhost:3000/forecast?city=${currentCity}`);
  const data = await res.json();

  if (!data || !data.list) return;

  renderHourly(data);
  renderWeekly(data);
  drawChart(data);
}

function renderHourly(data) {
  const el = document.getElementById("hourly");
  el.innerHTML = "";

  data.list.slice(0, 8).forEach(item => {
    const hour = new Date(item.dt * 1000).getHours();

    el.innerHTML += `
      <div class="hour-card">
        <div>${hour}:00</div>
        <div>${Math.round(item.main.temp)}°C</div>
      </div>
    `;
  });
}

function renderWeekly(data) {
  const el = document.getElementById("weekly");
  el.innerHTML = "";

  const days = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();

    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  Object.keys(days).slice(0, 7).forEach(date => {
    const items = days[date];

    const avgTemp =
      items.reduce((sum, i) => sum + i.main.temp, 0) / items.length;

    el.innerHTML += `
      <div class="day-card">
        <div>${new Date(date).toLocaleDateString("ru-RU", { weekday: "short" })}</div>
        <div>${Math.round(avgTemp)}°C</div>
      </div>
    `;
  });
}

function drawChart(data) {
  const temps = data.list.slice(0, 8).map(i => i.main.temp);
  const labels = data.list.slice(0, 8).map(i =>
    new Date(i.dt * 1000).getHours() + ":00"
  );

  if (chart) chart.destroy();

  const ctx = document.getElementById("chart");

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        data: temps,
        borderColor: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 3
      }]
      },

    options: {

      plugins: {

        legend: { display: false }

      },

      scales: {

        x: { display: false },

        y: { display: false }

      }

    }

  });

}
function changeBackground(main, desc) {
  let bg = "32454203077_02ba1a4699_b.jpg";

  if (!main) {
    document.body.style.backgroundImage = `url("${bg}")`;
    return;
  }

  const weather = main.toLowerCase();
  const description = (desc || "").toLowerCase();

  if (weather.includes("clear")) {
    bg = "tmb_359728_782082.jpg";
  }

  else if (weather.includes("clouds")) {
    if (description.includes("overcast")) {
      bg = "32454203077_02ba1a4699_b.jpg";
    } else {
      bg = "stormy-sky-with-dark-white-large-clouds.jpg";
    }
  }

  else if (
    weather.includes("mist") ||
    weather.includes("fog") ||
    weather.includes("haze")
  ) {
    bg = "742902.jpg";
  }

  else if (weather.includes("rain")) {
    bg = "32454203077_02ba1a4699_b.jpg";
  }

  else if (weather.includes("snow")) {
    bg = "742902.jpg";
  }

  document.body.style.backgroundImage = `url("${bg}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

function saveHistory(city) {

  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

  cities.unshift(city);

  if (cities.length > 5) cities = cities.slice(0, 5);

  localStorage.setItem("cities", JSON.stringify(cities));

  renderHistory();

}

function renderHistory() {

  const cities = JSON.parse(localStorage.getItem("cities")) || [];

  historyBox.innerHTML = "";

  cities.forEach(city => {

    const btn = document.createElement("button");

    btn.textContent = city;

    btn.onclick = () => {

      currentCity = city;

      loadWeather();

    };

    historyBox.appendChild(btn);

  });

}

document.addEventListener("keydown", e => {

  if (e.key === "Enter") searchCity();

});

















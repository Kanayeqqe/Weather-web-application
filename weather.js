const apiKey = "1c7a60170f055536bc50916794b484dc";
let currentCity = "Novosibirsk";
let chart;
const input = document.getElementById("cityInput");
const historyBox = document.getElementById("history");
function getLocationWeather() {

  navigator.geolocation.getCurrentPosition(pos => {

    const { latitude, longitude } = pos.coords;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`)

      .then(res => res.json())
      .then(data => {
        currentCity = data.name;
        loadWeather();
      });
  });
}

function loadWeather() {
  getCurrentWeather();
  getForecast();
}


function searchCity() {
  const val = input.value.trim();
  if (!val) return;
  currentCity = val;
  saveCity(val);
  loadWeather();
  historyBox.classList.remove("active");
}

function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  localStorage.setItem("cities", JSON.stringify(cities.slice(0,5)));
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
      historyBox.classList.remove("active");
    };
    historyBox.appendChild(btn);
  });
}

input.addEventListener("focus", () => {
  renderHistory();
  historyBox.classList.add("active");
});

document.addEventListener("click", e => {
  if (!input.contains(e.target) && !historyBox.contains(e.target)) {
    historyBox.classList.remove("active");
  }
});

async function getCurrentWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&units=metric&lang=ru&appid=${apiKey}`);
  const data = await res.json();
  if (data.cod !== 200) return;
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
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("ru");
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("ru");
  document.getElementById("sun").textContent =
    "🌅 " + sunrise + " | 🌇 " + sunset;
  changeTheme(data.weather[0].main, data.weather[0].description);
}


async function getForecast() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&units=metric&lang=ru&appid=${apiKey}`);
  const data = await res.json();


renderHourly(data);

  renderWeekly(data);

  drawChart(data);

  setMinMax(data); // 🔥 ВАЖНО

}

function setMinMax(data) {

  const today = new Date().toDateString();

  const temps = data.list

    .filter(i => new Date(i.dt * 1000).toDateString() === today)

    .map(i => i.main.temp);

  if (!temps.length) return;

  const min = Math.min(...temps);

  const max = Math.max(...temps);

  document.getElementById("minmax").textContent =

    "↓ " + Math.round(min) + "° / ↑ " + Math.round(max) + "°";

}

function drawChart(data) {

  const ctx = document.getElementById("chart").getContext("2d");

  const temps = data.list.slice(0,8).map(i => Math.round(i.main.temp));

  const labels = data.list.slice(0,8).map(i =>

    new Date(i.dt * 1000).getHours() + ":00"

  );

  const gradient = ctx.createLinearGradient(0, 0, 0, 200);

  gradient.addColorStop(0, "rgba(255,255,255,0.4)");

  gradient.addColorStop(1, "rgba(255,255,255,0)");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {

    type: "line",

    data: {

      labels,

      datasets: [{

        label: "Температура (°C)",

        data: temps,

        tension: 0.4,

        fill: true,

        backgroundColor: gradient,

        borderColor: "#fff",

        borderWidth: 2,

        pointRadius: 4,

        pointBackgroundColor: "#fff"

      }]

    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: "#fff" }
        },
        tooltip: {
          callbacks: {
            label: ctx => ctx.raw + "°C"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: "#fff",
            callback: v => v + "°"
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          }
        }
      }
    }
  });
}

function renderHourly(data) {

  const el = document.getElementById("hourly");

  el.innerHTML = "";

  data.list.slice(0,8).forEach(i => {

    el.innerHTML += `

      <div class="hour-card">

        <div>${new Date(i.dt*1000).getHours()}:00</div>

        <div>${Math.round(i.main.temp)}°</div>

      </div>

    `;

  });

}

function renderWeekly(data) {

  const el = document.getElementById("weekly");

  el.innerHTML = "";

  const days = {};

  data.list.forEach(i => {

    const d = new Date(i.dt*1000).toDateString();

    if (!days[d]) days[d] = [];

    days[d].push(i);

  });

  Object.keys(days).slice(0,7).forEach(d => {

    const temps = days[d].map(i => i.main.temp);

    const min = Math.min(...temps);

    const max = Math.max(...temps);

    el.innerHTML += `

      <div class="day-card">

        <div>${new Date(d).toLocaleDateString("ru",{weekday:"short"})}</div>

        <div>↓ ${Math.round(min)}° / ↑ ${Math.round(max)}°</div>

      </div>

    `;

  });

}

function changeTheme(main, desc) {

  if (main.includes("Clear"))
    document.body.style.backgroundImage = 'url("image/tmb_359728_782082.jpg")';

  else if (main.includes("Clouds") && desc.includes("overcast"))
    document.body.style.backgroundImage = 'url("image/32454203077_02ba1a4699_b.jpg")';

  else if (main.includes("Clouds"))
    document.body.style.backgroundImage = 'url("image/stormy-sky-with-dark-white-large-clouds.jpg")';

  else if (main.match(/Mist|Fog|Haze/))
    document.body.style.backgroundImage = 'url("image/742902.jpg")';

  else
    document.body.style.backgroundImage = 'url("image/32454203077_02ba1a4699_b.jpg")';

}

getLocationWeather();

document.addEventListener("keydown", e => {

  if (e.key === "Enter") searchCity();

});







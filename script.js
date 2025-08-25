const searchButton = document.getElementById("searchButton");
const locationInput = document.getElementById("locationInput");
const locationElement = document.getElementById("location");
const tempElement = document.getElementById("temperature");
const descElement = document.getElementById("description");
const iconElement = document.getElementById("icon");
const weatherInfo = document.querySelector(".weather-info");
const errorMessage = document.getElementById("error-message");

// Geocoding API (Open-Meteo provides it for free)
async function getCoordinates(city) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results[0]; // first matching city
  } else {
    throw new Error("City not found");
  }
}

async function getWeather(city) {
  try {
    errorMessage.textContent = "";

    const locationData = await getCoordinates(city);
    const { latitude, longitude, name, country } = locationData;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const data = await response.json();

    const weather = data.current_weather;

    locationElement.textContent = `${name}, ${country}`;
    tempElement.textContent = `🌡️ ${weather.temperature}°C`;
    descElement.textContent = `💨 Windspeed: ${weather.windspeed} km/h`;

    // Weather icon (simple: sun/cloud)
    iconElement.src = weather.weathercode < 3
      ? "https://img.icons8.com/emoji/96/sun-emoji.png"
      : "https://img.icons8.com/emoji/96/cloud-emoji.png";

    weatherInfo.classList.remove("hidden");
  } catch (error) {
    weatherInfo.classList.add("hidden");
    errorMessage.textContent = error.message;
  }
}

searchButton.addEventListener("click", () => {
  const city = locationInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

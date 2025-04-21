const { sendNotificationToUser } = require("../functions/socketManager");
const { OPENWEATHERMAP_API_FETCH_WEATHER } = require("../utils/api");

const Farmer = require("../model/farmerSchema");

function getFarmCenter(geoFenceData) {
    const latSum = geoFenceData.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = geoFenceData.reduce((sum, point) => sum + point.lng, 0);
    return {
        lat: latSum / geoFenceData.length,
        lng: lngSum / geoFenceData.length
    };
}

function checkCustomAlerts(weatherData) {
    const tempCelsius = (weatherData.main.temp - 273.15).toFixed(2);
    const weatherConditions = weatherData.weather.map(w => w.main.toLowerCase());

    const alert = {
        temperature: tempCelsius,
        weather: weatherConditions[0],
        wind: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
    };

    return alert;
}

async function fetchWeather(lat, lon) {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url = `${OPENWEATHERMAP_API_FETCH_WEATHER}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Failed to fetch weather data:', err.message);
        return null;
    }
}


const runWeatherAlertJob = async () => {
    try {
        const farms = await Farmer.find({});

        const userNotifiedBlocks = {};

        for (const farm of farms) {
            const { userUniqueId, address } = farm;
            const block = address.block;

            if (!block || !userUniqueId) continue;

            if (!userNotifiedBlocks[userUniqueId]) {
                userNotifiedBlocks[userUniqueId] = new Set();
            }

            if (userNotifiedBlocks[userUniqueId].has(block)) {
                continue;
            }

            const center = getFarmCenter(farm.geoFenceData);

            const weatherData = await fetchWeather(center.lat, center.lng);

            userNotifiedBlocks[userUniqueId].add(block);

            const alerts = checkCustomAlerts(weatherData, farm.farm, farm.uniqueID);

            sendNotificationToUser(farm.userUniqueId.toString(), farm.farm, alerts, global.appInstance);
        }
    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
}

module.exports = { runWeatherAlertJob };
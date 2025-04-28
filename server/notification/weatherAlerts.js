const { sendWeatherNotificationToUser } = require("../functions/socketManager");
const { OPENWEATHERMAP_API_FETCH_CURRENT_WEATHER, OPENWEATHERMAP_API_FETCH_FORECAST_WEATHER } = require("../utils/api");

const Farmer = require("../model/farmerSchema");

function getFarmCenter(geoFenceData) {
    const latSum = geoFenceData.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = geoFenceData.reduce((sum, point) => sum + point.lng, 0);
    return {
        lat: latSum / geoFenceData.length,
        lng: lngSum / geoFenceData.length
    };
};

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
};

function format_forecast_weather(forecastList) {
    const dailyForecast = {};

    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];

        const utcDate = new Date(item.dt * 1000);
        const localDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

        const localTime = localDate.toISOString().split('T')[1].split('.')[0];

        if (localTime === '11:30:00') {
            dailyForecast[date] = localTime;
        }
    });

    return dailyForecast;
};

async function fetchWeather(lat, lon) {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url_current = `${OPENWEATHERMAP_API_FETCH_CURRENT_WEATHER}?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const url_forecast = `${OPENWEATHERMAP_API_FETCH_FORECAST_WEATHER}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response_current = await fetch(url_current);
        const response_forecast = await fetch(url_forecast);

        if (!response_current.ok) {
            throw new Error(`Current Weather API error: ${response_current.status}`);
        }

        if (!response_forecast.ok) {
            throw new Error(`Forecast Weather API error: ${response_forecast.status}`);
        }

        const data_current = await response_current.json();
        const data_forecast = await response_forecast.json();

        const d = format_forecast_weather(data_forecast.list);

        return data_current;
    } catch (err) {
        console.error('Failed to fetch weather data:', err.message);
        return null;
    }
};


const runWeatherAlertJob = async () => {
    try {
        const connectedUsers = global.appInstance.get('connectedUsers');

        const connectedUserIds = Array.from(connectedUsers.keys());

        if (connectedUserIds.length === 0) {
            console.log('🛑 No users connected. Skipping weather alert job.');
            return;
        }

        const farms = await Farmer.find({ userUniqueId: { $in: connectedUserIds } });

        const userNotifiedBlocks = {};
        const userAlertsMap = {};

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

            const alert = checkCustomAlerts(weatherData);

            if (!userAlertsMap[userUniqueId]) {
                userAlertsMap[userUniqueId] = [];
            }

            userAlertsMap[userUniqueId].push({
                farm: farm.farm,
                alerts: alert
            });

            userNotifiedBlocks[userUniqueId].add(block);
        }

        for (const [userId, farmAlerts] of Object.entries(userAlertsMap)) {
            sendNotificationToUser(userId, farmAlerts, global.appInstance);
        }

    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
};

const sendInstantWeatherAlertToUser = async (userId) => {
    try {
        const farms = await Farmer.find({ userUniqueId: userId });

        const notifiedBlocks = new Set();

        const userAlertsMap = {};

        userAlertsMap[userId] = [];

        for (const farm of farms) {
            const block = farm.address.block;
            if (!block || notifiedBlocks.has(block)) continue;

            const center = getFarmCenter(farm.geoFenceData);
            const weatherData = await fetchWeather(center.lat, center.lng);

            const alert = checkCustomAlerts(weatherData, farm);

            userAlertsMap[userId].push({
                block: block,
                alerts: alert
            });

            notifiedBlocks.add(block);
        }

        for (const [userId, farmAlerts] of Object.entries(userAlertsMap)) {
            sendWeatherNotificationToUser(userId, farmAlerts, global.appInstance);
        }
    } catch (err) {
        console.error(`⚠️ Error sending instant alert to user ${userId}:`, err.message);
    }
};

module.exports = { runWeatherAlertJob, sendInstantWeatherAlertToUser };
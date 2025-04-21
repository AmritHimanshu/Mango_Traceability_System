const { sendNotificationToUser } = require("../functions/socketManager");

const Farmer = require("../model/farmerSchema");
const Notification = require("../model/notificationSchema");
const User = require("../model/userSchema");
const { OPENWEATHERMAP_API_FETCH_WEATHER } = require("../utils/api");

function getFarmCenter(geoFenceData) {
    const latSum = geoFenceData.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = geoFenceData.reduce((sum, point) => sum + point.lng, 0);
    return {
        lat: latSum / geoFenceData.length,
        lng: lngSum / geoFenceData.length
    };
}

function checkCustomAlerts(forecastData, farm, id) {
    const alerts = [];

    const tempCelsius = forecastData.main.temp - 273.15;
    const weatherConditions = forecastData.weather.map(w => w.main.toLowerCase());

    if (tempCelsius > 35) {
        // alerts.push(`🌡️ It's expected to be hot (~${tempCelsius.toFixed(1)}°C) on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
        
    }

    if (weatherConditions.includes("rain")) {
        // alerts.push(`🌧️ Rain is expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
    }

    if (forecastData.wind.speed > 10) {
        // alerts.push(`💨 Strong winds (~${forecastData.wind.speed} m/s) are expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
    }

    if (forecastData.main.humidity > 90) {
        // alerts.push(`💧 High humidity (${forecastData.main.humidity}%) is expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
    }

    return [...new Set(alerts)];
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

            // console.log("Block: ", address.block);
            // console.log(weatherData);

            userNotifiedBlocks[userUniqueId].add(block);

            const alerts = checkCustomAlerts(weatherData, farm.farm, farm.uniqueID);
        }

        // for (const farm of farms) {
        //     const center = getFarmCenter(farm.geoFenceData);
        //     const forecastWeatherData = await fetchWeather(center.lat, center.lng);

        //     const alerts = checkCustomAlerts(forecastWeatherData, farm.farm, farm.uniqueID);

        //     if (alerts.length > 0) {
        //         const user = await User.findOne({ uniqueID: farm.userUniqueId });
        //         if (!user) continue;

        //         const notification = new Notification({ userUniqueId: user.uniqueID, farmUniqueId: farm.uniqueID, message: alerts });

        //         await notification.save();

        //         sendNotificationToUser(user.uniqueID.toString(), alerts, global.appInstance);
        //     }
        // }
    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
}

module.exports = { runWeatherAlertJob };
const { sendNotificationToUser } = require("../functions/socketManager");

const Farmer = require("../model/farmerSchema");
const Notification = require("../model/notificationSchema");
const User = require("../model/userSchema");

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

    const currentTime = Math.floor(Date.now() / 1000);
    const next24Hours = forecastData.list.filter(entry => entry.dt > currentTime).slice(0, 8);

    next24Hours.forEach(entry => {
        const tempCelsius = entry.main.temp - 273.15;
        const weatherConditions = entry.weather.map(w => w.main.toLowerCase());
        const dateTime = new Date(entry.dt_txt);
        const timeString = dateTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        const dateString = dateTime.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        if (tempCelsius > 35) {
            alerts.push(`🌡️ It's expected to be hot (~${tempCelsius.toFixed(1)}°C) on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
        }

        if (weatherConditions.includes("rain")) {
            alerts.push(`🌧️ Rain is expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
        }

        if (entry.wind.speed > 10) {
            alerts.push(`💨 Strong winds (~${entry.wind.speed} m/s) are expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
        }

        if (entry.main.humidity > 90) {
            alerts.push(`💧 High humidity (${entry.main.humidity}%) is expected on ${dateString} at ${timeString} at your farm "${farm}" (ID: ${id}).`);
        }
    });

    return [...new Set(alerts)];
}

async function fetchWeather(lat, lon) {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}`;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

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

        for (const farm of farms) {
            const center = getFarmCenter(farm.geoFenceData);
            const forecastWeatherData = await fetchWeather(center.lat, center.lng);

            const alerts = checkCustomAlerts(forecastWeatherData, farm.farm, farm.uniqueID);

            if (alerts.length > 0) {
                const user = await User.findOne({ uniqueID: farm.userUniqueId });
                if (!user) continue;

                const notification = new Notification({ userUniqueId: user.uniqueID, farmUniqueId: farm.uniqueID, message: alerts });

                await notification.save();

                sendNotificationToUser(user.uniqueID.toString(), alerts, global.appInstance);
            }
        }
    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
}

module.exports = { runWeatherAlertJob };
const Farmer = require("../model/farmerSchema");
const User = require("../model/userSchema");

function getFarmCenter(geoFenceData) {
    const latSum = geoFenceData.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = geoFenceData.reduce((sum, point) => sum + point.lng, 0);
    return {
        lat: latSum / geoFenceData.length,
        lng: lngSum / geoFenceData.length
    };
}

function checkCustomAlerts(data) {
    const alerts = [];

    // High temperature
    const tempCelsius = data.main.temp - 273.15;
    if (tempCelsius > 35) {
        alerts.push("🔥 High temperature warning!");
    }

    // Rain alert
    if (data.weather.some(w => w.main.toLowerCase() === "rain")) {
        alerts.push("🌧️ Rain expected. Consider covering your crops.");
    }

    // High wind speed
    if (data.wind.speed > 10) {
        alerts.push("💨 Strong winds detected.");
    }

    // Humidity alert
    if (data.main.humidity > 90) {
        alerts.push("💧 High humidity levels.");
    }

    return alerts;
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
            const weatherData = await fetchWeather(center.lat, center.lng);

            console.log("WeatherData: ", weatherData);

            const alerts = checkCustomAlerts(weatherData);

            if (alerts.length > 0) {
                const user = await User.findOne({ uniqueID: farm.userUniqueId });
                if (!user) continue;

                const weatherMessage = alerts.join('\n');

                const message = `⚠️ Weather Alert: ${weatherMessage} "${farm.farm}".`;

                console.log(`Alert sent to ${user.email} for farm "${farm.farm}"`);
            }
        }
    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
}

module.exports = { runWeatherAlertJob };
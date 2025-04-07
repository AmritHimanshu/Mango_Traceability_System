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

function checkForAlerts(weatherData) {
    return weatherData.alerts && weatherData.alerts.length > 0;
}

async function fetchWeather(lat, lon) {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${API_KEY}`;

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

            if (checkForAlerts(weatherData)) {
                const user = await User.findOne({ uniqueID: farm.userUniqueId });
                if (!user) continue;

                const alert = weatherData.alerts[0];
                const message = `⚠️ Weather Alert: ${alert.event} near your farm "${farm.farm}".`;

                // await Notification.create({
                //     user: user._id,
                //     farmId: farm._id,
                //     type: 'Weather',
                //     message,
                // });

                await sendEmail(user.email, 'Weather Alert', message);

                console.log(`Alert sent to ${user.email} for farm "${farm.farm}"`);
            }
        }
    } catch (err) {
        console.error('Error in weather alert job:', err.message);
    }
}

module.exports = { runWeatherAlertJob };
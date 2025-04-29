const mongoose = require('mongoose');
const { randomInt } = require("crypto");

const farmerSchema = new mongoose.Schema(
    {
        userUniqueId: {
            type: String,
            required: true
        },
        farm: {
            type: String,
            required: true
        },
        geoFenceData: [
            {
                lat: {
                    type: Number,
                    required: true,
                    min: -90,
                    max: 90
                },
                lng: {
                    type: Number,
                    required: true,
                    min: -180,
                    max: 180
                }
            }
        ],
        area: {
            type: Number,
            required: true
        },
        crop: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
            required: true
        },
        ploughingDate: {
            type: Date
        },
        weedingDate: [
            {
                type: Date
            },
        ],
        plantingDate: {
            type: Date
        },
        floweringDate: {
            type: Date
        },
        pheromoneTrapDate: {
            type: Date
        },
        lureChangeDate: {
            type: Date
        },
        irrigationDates: {
            artificial: [Date],
            natural: [Date],
        },
        fertilizerApplications: [
            {
                date: Date,
                volume: Number
            },
        ],
        pesticideApplications: [
            {
                date: Date,
                volume: Number
            },
        ],
        bagging: [
            {
                date: Date,
                quantity: Number
            },
        ],
        specialCare: [
            {
                date: Date,
                name: String
            },
        ],
        harvest: {
            date: Date,
            yield: Number,
        },
        uniqueID:
        {
            type: String,
        },
        address: {
            city_district: String,
            state: String,
            block: String,
            country: String,
        },
        qrCode: String,
    },
    {
        timestamps: true
    }
);

farmerSchema.methods.generateUniqueID = async function (cropName) {
    const firstPart = cropName.slice(0, 1);
    const secondPart = new Date().toISOString().split("T")[0].split("-").join("");
    const thirdPart = randomInt(1000, 9999).toString();

    const uniqueID = "FARM" + firstPart + secondPart + thirdPart;

    return uniqueID;
}


const Farmer = mongoose.model('FARMER', farmerSchema);

module.exports = Farmer;
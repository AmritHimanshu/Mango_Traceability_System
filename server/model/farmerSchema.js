const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const farmerSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: "USER",
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
        crop: {
            name: {
                type: String,
                required: true
            },
            ploughingDate: {
                type: Date
            },
            weedingDate: {
                type: Date
            },
            sowingDate: {
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
            qrCode: String,
        },
    },
    {
        timestamps: true
    }
);

const Farmer = mongoose.model('FARMER', farmerSchema);

module.exports = Farmer;
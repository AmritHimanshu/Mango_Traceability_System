const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const farmerSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: "USER",
            required: true
        },
        geoFenceData: [
            {
                lat: {
                    type: Number
                },
                lng: {
                    type: Number
                }
            }
        ],
        crops: [
            {
                name: {
                    type: String,
                    required: true

                },
                ploughingDate: Date,
                weedingDate: Date,
                sowingDate: Date,
                floweringDate: Date,
                pheromoneTrapDate: Date,
                lureChangeDate: Date,
                irrigationDates: {
                    artificial: [Date],
                    natural: [Date],
                },
                fertilizerApplications: [
                    { date: Date, volume: Number },
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
        ],
    },
    {
        timestamps: true

    }
);

const Farmer = mongoose.model('FARMER', farmerSchema);

module.exports = Farmer;
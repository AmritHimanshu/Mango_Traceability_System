const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userUniqueId: {
            type: String,
            required: true
        },
        farmUniqueId: {
            type: String,
            required: true
        },
        message: [
            {
                type: String,
                required: true
            }
        ],
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }
);

const Notification = mongoose.model('NOTIFICATION', notificationSchema);

module.exports = Notification;
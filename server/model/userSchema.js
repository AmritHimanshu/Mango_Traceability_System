const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true

        },
        email:
        {
            type: String,
            required: true,
            unique: true

        },
        password:
        {
            type: String,
            required: true

        },
        role:
        {
            type: String,
            enum: ["Admin", "Manager", "Farmer"],
            required: true

        },
        isAuthenticated:
        {
            type: Boolean,
            default: false

        },
    },
    {
        timestamps: true

    }
);

const User = mongoose.model('USER', userSchema);

module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomInt } = require("crypto");

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
        phone: {
            type: Number,
            required: true
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
            // required: true

        },
        isAuthenticated:
        {
            type: Boolean,
            default: false

        },
        isRejected:
        {
            type: Boolean,
            default: false
        },
        uniqueID:
        {
            type: String,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true
    }
);


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        let Token = jwt.sign({ uniqueID: this.uniqueID }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: Token });
        await this.save();
        return Token;
    } catch (error) {
        console.log(error);
    }
}

userSchema.methods.generateUniqueID = async function (role, date, lengthOfUsers) {
    const firstPart = role.slice(0, 1);
    const secondPart = new Date(date).toISOString().split("T")[0].split("-").join("");
    const thirdPart = String(lengthOfUsers + 1).padStart(4, '0');

    const uniqueID = firstPart + secondPart + thirdPart;

    return uniqueID;
}


const User = mongoose.model('USER', userSchema);

module.exports = User;
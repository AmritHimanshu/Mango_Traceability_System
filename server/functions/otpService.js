const { randomInt } = require("crypto");
const { sendEmail } = require("./sendOTP");

const otpStore = new Map();

const sendOtpToEmail = async (email) => {
    const otp = randomInt(100000, 999999).toString();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiry });

    await sendEmail(email, otp);
};

const verifyOtpForEmail = (email, inputOtp) => {
    const record = otpStore.get(email);
    if (!record) return false;

    const { otp, expiry } = record;
    if (Date.now() > expiry) {
        otpStore.delete(email);
        return false;
    }

    if (otp === inputOtp) {
        otpStore.delete(email);
        return true;
    }

    return false;
};

module.exports = { sendOtpToEmail, verifyOtpForEmail };
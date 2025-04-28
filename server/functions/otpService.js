const { randomInt } = require("crypto");
const { sendEmail, sendPhone } = require("./sendOTP");

const otpEmailStore = new Map();
const otpPhoneStore = new Map();

const sendOtpToEmail = async (email) => {
    const otp = randomInt(100000, 999999).toString();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpEmailStore.set(email, { otp, expiry });
    console.log(otp)
    await sendEmail(email, otp);
};

const verifyOtpForEmail = (email, inputOtp) => {
    const record = otpEmailStore.get(email);
    if (!record) return false;

    const { otp, expiry } = record;
    if (Date.now() > expiry) {
        otpEmailStore.delete(email);
        return false;
    }

    if (otp === inputOtp) {
        otpEmailStore.delete(email);
        return true;
    }

    return false;
};

const sendOtpToPhone = async (phone) => {
    const otp = randomInt(100000, 999999).toString();
    const expiry = Date.now() + 5 * 60 * 1000;
    otpPhoneStore.set(phone, { otp, expiry });

    await sendPhone(phone, otp);
};

const verifyOtpForPhone = (phone, inputOtp) => {
    const record = otpPhoneStore.get(phone);
    if (!record) return false;

    const { otp, expiry } = record;

    if (Date.now() > expiry) {
        otpPhoneStore.delete(phone);
        return false;
    }

    if (otp === inputOtp) {
        otpPhoneStore.delete(phone);
        return true;
    }

    return false;
};

module.exports = { sendOtpToEmail, verifyOtpForEmail, sendOtpToPhone, verifyOtpForPhone };
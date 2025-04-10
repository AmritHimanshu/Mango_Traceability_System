module.exports = {
    // Common APIs
    REGISTER_USER: "/api/register-user",
    SIGNIN_USER: "/api/signin-user",
    LOGOUT_USER: "/api/logout",
    SEND_OTP_EMAIL: "/api/send-otp-email",
    SEND_OTP_EMAIL_WITHOUTCAPTCHA: "/api/send-otp-email-withoutCaptcha",
    SEND_OTP_PHONE: "/api/send-otp-phone",
    SEND_OTP_PHONE_WITHOUTCAPTCHA: "/api/send-otp-phone-withoutCaptcha",
    VERIFY_OTP_EMAIL: "/api/verify-otp-email",
    VERIFY_OTP_PHONE: "/api/verify-otp-phone",
    FORGOT_SEND_OTP_EMAIL: "/api/forgot-password/send-otp-email",
    UPDATE_PASSWORD: "/api/update-password",
    CERTIFICATE_FARM_DETAIL: "/api/certificate-farm-detail",
    GENERATE_PDF: "/api/generate-pdf",
    CONTACT_US_MAIL: "/api/contact-us-mail",
    GET_NOTIFICATION: "/api/get-notification",

    // Admin GET APIs
    ADMIN_FEW_PENDING_REQUESTS: "/api/few-pending-requests",
    ADMIN_PENDING_REQUESTS: "/api/pending-requests",
    ADMIN_FETCH_NO_OF_USERS: "/api/fetch-no-of-users",
    ADMIN_USER_MANAGEMENT: "/api/user-management",
    ADMIN_SEARCH_USER_MANAGEMENT: "/api/search-user-management",
    ADMIN_SEARCH_PENDING_REQUESTS: "/api/search-pending-requests",
    ADMIN_FARMER_MANAGEMENT: "/api/farmer-management",
    ADMIN_FETCH_FARMER_FARM_LIST: "/api/fetch-farmer-farms-list",
    ADMIN_FETCH_SEARCH_FARMER_FARM_LIST: "/api/fetch-search-farmer-farms-list",
    ADMIN_FETCH_FARMER_FARM_DATA: "/api/fetch-farmer-farm-data",

    // Admin PUT APIs
    ADMIN_AUTHENTICATE_USER: "/api/authenticate-user",
    ADMIN_EDIT_FARM_DATA: "/api/edit-farm-data",
    ADMIN_ADD_FARM_DATA: "/api/add-farm-data",

    // ADMIN DELETE APIs
    ADMIN_DELETE_FARM_DATA: "/api/delete-farm-data",

    // Farmer GET APIs
    FARMER_FETCH_FARMS_LIST: "/api/fetch-farms-list",
    FARMER_FETCH_SEARCH_FARMS_LIST: "/api/fetch-search-farms-list",
    FARMER_FETCH_FEW_FARMS_LIST: "/api/fetch-few-farms-list",
    FARMER_FETCH_FARM_DATA: "/api/fetch-farm-data",

    // Farmer POST APIs
    FARMER_NEW_FARM: "/api/new-farm",

    // Farmer PUT APIs
    FARMER_SAVE_FARM_DATA: "/api/save-farm-data",

    // Farmer DELETE APIs
    FARMER_DELETE_FARM: "/api/delete-farm",

}
// Common APIs
export const REGISTER_USER = "api/register-user";
export const SIGNIN_USER = "api/signin-user";
export const LOGOUT_USER = "api/logout";
export const SEND_OTP_EMAIL = "api/send-otp-email";
export const SEND_OTP_EMAIL_WITHOUTCAPTCHA = "api/send-otp-email-withoutCaptcha";
export const SEND_OTP_PHONE = "api/send-otp-phone";
export const SEND_OTP_PHONE_WITHOUTCAPTCHA = "api/send-otp-phone-withoutCaptcha";
export const VERIFY_OTP_EMAIL = "api/verify-otp-email";
export const VERIFY_OTP_PHONE = "api/verify-otp-phone";
export const FORGOT_SEND_OTP_EMAIL = "api/forgot-password/send-otp-email";
export const UPDATE_PASSWORD = "api/update-password";
export const CERTIFICATE_FARM_DETAIL = "api/certificate-farm-detail";
export const GENERATE_PDF = "api/generate-pdf";
export const CONTACT_US_MAIL = "api/contact-us-mail";
export const NOTIFICATION_STREAM = "api/notifications/stream";

// Admin GET APIs
export const ADMIN_FEW_PENDING_REQUESTS = "admin/api/few-pending-requests";
export const ADMIN_PENDING_REQUESTS = "admin/api/pending-requests";
export const ADMIN_FETCH_NO_OF_USERS = "admin/api/fetch-no-of-users";
export const ADMIN_USER_MANAGEMENT = "admin/api/user-management";
export const ADMIN_SEARCH_USER_MANAGEMENT = "admin/api/search-user-management";
export const ADMIN_SEARCH_PENDING_REQUESTS = "admin/api/search-pending-requests";
export const ADMIN_FARMER_MANAGEMENT = "admin/api/farmer-management";
export const ADMIN_FETCH_FARMER_FARM_LIST = "admin/api/fetch-farmer-farms-list";
export const ADMIN_FETCH_SEARCH_FARMER_FARM_LIST = "admin/api/fetch-search-farmer-farms-list";
export const ADMIN_FETCH_FARMER_FARM_DATA = "admin/api/fetch-farmer-farm-data";

// Admin PUT APIs
export const ADMIN_AUTHENTICATE_USER = "admin/api/authenticate-user";
export const ADMIN_EDIT_FARM_DATA = "admin/api/edit-farm-data";
export const ADMIN_ADD_FARM_DATA = "admin/api/add-farm-data";

// Admin DELETE APIs
export const ADMIN_DELETE_FARM_DATA = "admin/api/delete-farm-data";

// Farmer GET APIs
export const FARMER_FETCH_FARMS_LIST = "farmer/api/fetch-farms-list";
export const FARMER_FETCH_SEARCH_FARMS_LIST = "farmer/api/fetch-search-farms-list";
export const FARMER_FETCH_FEW_FARMS_LIST = "farmer/api/fetch-few-farms-list";
export const FARMER_FETCH_FARM_DATA = "farmer/api/fetch-farm-data";

// Farmer POST APIs
export const FARMER_NEW_FARM = "farmer/api/new-farm";

// Farmer PUT APIs
export const FARMER_SAVE_FARM_DATA = "farmer/api/save-farm-data";

// Farmer DELETE APIs
export const FARMER_DELETE_FARM_DATA = "farmer/api/delete-farm";

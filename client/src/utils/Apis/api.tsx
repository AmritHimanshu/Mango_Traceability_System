// Common APIs
export const REGISTER_USER = "api/register-user";
export const SIGNIN_USER = "api/signin-user";
export const LOGOUT_USER = "api/logout";
export const SEND_OTP_EMAIL = "api/send-otp-email";
export const SEND_OTP_PHONE = "api/send-otp-phone";
export const VERIFY_OTP_EMAIL = "api/verify-otp-email";
export const VERIFY_OTP_PHONE = "api/verify-otp-phone";
export const FORGOT_SEND_OTP_EMAIL = "api/forgot-password/send-otp-email";
export const UPDATE_PASSWORD = "api/update-password";
export const CERTIFICATE_FARM_DETAIL = "api/certificate-farm-detail";

// Admin GET APIs
export const ADMIN_FEW_PENDING_REQUESTS = "admin/api/few-pending-requests";
export const ADMIN_PENDING_REQUESTS = "admin/api/pending-requests";
export const ADMIN_FETCH_NO_OF_USERS = "admin/api/fetch-no-of-users";
export const ADMIN_MANAGER_MANAGEMENT = "admin/api/manager-management";
export const ADMIN_FARMER_MANAGEMENT = "admin/api/farmer-management";
export const ADMIN_FETCH_FARMER_FARM_LIST = "admin/api/fetch-farmer-farms-list";
export const ADMIN_FETCH_FARMER_FARM_DATA = "admin/api/fetch-farmer-farm-data";

// Admin PUT APIs
export const ADMIN_AUTHENTICATE_USER = "admin/api/authenticate-user";

// Farmer GET APIs
export const FARMER_FETCH_FARMS_LIST = "farmer/api/fetch-farms-list";
export const FARMER_FETCH_FEW_FARMS_LIST = "farmer/api/fetch-few-farms-list";
export const FARMER_FETCH_FARM_DATA = "farmer/api/fetch-farm-data";

// Farmer POST APIs
export const FARMER_NEW_FARM = "farmer/api/new-farm";

// Farmer PUT APIs
export const FARMER_SAVE_FARM_DATA = "farmer/api/save-farm-data";

// Farmer DELETE APIs
export const FARMER_DELETE_FARM_DATA = "farmer/api/delete-farm";

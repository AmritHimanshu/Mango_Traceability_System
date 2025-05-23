import {
  LOGIN,
  USER_MANAGEMENT,
  ADMIN_OVERVIEW,
  PENDING_REQUESTS,
  FARMER_OVERVIEW,
  FARMS,
  NOTIFICATIONS,
  ADMIN_PROFILE,
  FARMER_PROFILE,
  WEATHER_REPORT,
} from "@/utils/Paths/paths";

export const admin = [
  {
    name: "Overview",
    path: ADMIN_OVERVIEW,
    base_path: "",
  },
  {
    name: "User Management",
    path: USER_MANAGEMENT,
    base_path: "user",
  },
  {
    name: "Pending requests",
    path: PENDING_REQUESTS,
    base_path: "",
  },
  {
    name: "Profile",
    path: ADMIN_PROFILE,
    base_path: "",
  },
  {
    name: "Logout",
    path: LOGIN,
    base_path: "",
  },
];

export const farmer = [
  {
    name: "Overview",
    path: FARMER_OVERVIEW,
    base_path: "",
  },
  {
    name: "Farms",
    path: FARMS,
    base_path: "farms",
  },
  {
    name: "Weather Report",
    path: WEATHER_REPORT,
    base_path: "",
  },
  {
    name: "Notifications",
    path: NOTIFICATIONS,
    base_path: "",
  },
  {
    name: "Profile",
    path: FARMER_PROFILE,
    base_path: "",
  },
  {
    name: "Logout",
    path: LOGIN,
    base_path: "",
  },
];

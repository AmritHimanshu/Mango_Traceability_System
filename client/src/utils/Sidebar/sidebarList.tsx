import {
  FARMER_MANAGEMENT,
  LOGIN,
  MANAGER_MANAGEMENT,
  ADMIN_OVERVIEW,
  PENDING_REQUESTS,
  PROFILE,
  FARMER_OVERVIEW,
  FARMS,
  NOTIFICATIONS,
} from "../Paths/paths";

export const admin = [
  {
    name: "Overview",
    path: ADMIN_OVERVIEW,
  },
  {
    name: "Manager Management",
    path: MANAGER_MANAGEMENT,
  },
  {
    name: "Farmer Management",
    path: FARMER_MANAGEMENT,
  },
  {
    name: "Pending requests",
    path: PENDING_REQUESTS,
  },
  {
    name: "Profile",
    path: PROFILE,
  },
  {
    name: "Logout",
    path: LOGIN,
  },
];

export const farmer = [
  {
    name: "Overview",
    path: FARMER_OVERVIEW,
  },
  {
    name: "Farms",
    path: FARMS,
  },
  {
    name: "Notifications",
    path: NOTIFICATIONS,
  },
  {
    name: "Profile",
    path: PROFILE,
  },
  {
    name: "Logout",
    path: LOGIN,
  },
];

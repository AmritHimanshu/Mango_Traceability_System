import {
  FARMER_MANAGEMENT,
  LOGIN,
  MANAGER_MANAGEMENT,
  ADMIN_OVERVIEW,
  PENDING_REQUESTS,
  FARMER_OVERVIEW,
  FARMS,
  NOTIFICATIONS,
  ADMIN_PROFILE,
  FARMER_PROFILE,
} from "../Paths/paths";

export const admin = [
  {
    name: "Overview",
    path: ADMIN_OVERVIEW,
    base_path: "",
  },
  {
    name: "Manager Management",
    path: MANAGER_MANAGEMENT,
    base_path: "manager",
  },
  {
    name: "Farmer Management",
    path: FARMER_MANAGEMENT,
    base_path: "farmer",
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
    base_path: '',
  },
  {
    name: "Farms",
    path: FARMS,
    base_path: 'farms',
  },
  {
    name: "Notifications",
    path: NOTIFICATIONS,
    base_path: '',
  },
  {
    name: "Profile",
    path: FARMER_PROFILE,
    base_path: '',
  },
  {
    name: "Logout",
    path: LOGIN,
    base_path: '',
  },
];

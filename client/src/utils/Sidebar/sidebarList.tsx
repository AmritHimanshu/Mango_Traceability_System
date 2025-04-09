import {
  LOGIN,
  USER_MANAGEMENT,
  ADMIN_OVERVIEW,
  PENDING_REQUESTS,
  FARMER_OVERVIEW,
  FARMS,
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
    base_path: '',
  },
  {
    name: "Farms",
    path: FARMS,
    base_path: 'farms',
  },
];

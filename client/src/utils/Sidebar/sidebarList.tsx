import { FARMER_MANAGEMENT, LOGIN, MANAGER_MANAGEMENT, ADMIN_OVERVIEW, PENDING_REQUESTS, PROFILE } from "../Paths/paths";

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
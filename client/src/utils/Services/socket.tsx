import { io } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;

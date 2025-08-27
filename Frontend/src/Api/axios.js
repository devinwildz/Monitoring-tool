import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1/users", // backend proxy se match hona chahiye
    withCredentials: true, // agar cookies ka use ho raha ho
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

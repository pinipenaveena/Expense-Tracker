import axios from "axios";

const API = axios.create({
    baseURL: "https://expense-tracker-elmg.onrender.com/api" || import.meta.env.VITE_API_URL
});

// Automatically add JWT token to every request
API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;

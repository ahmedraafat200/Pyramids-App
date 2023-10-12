import axios from 'axios'
import {BASE_URL} from "./config";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Replace with your API base URL
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Modify the response data here (e.g., parse, transform)
        return response;
    }, (error) => {
        if (error && error.response == undefined) {
            return Promise.reject(error)
        } else if (error && error.response && error.response.status === 401) {
            return Promise.reject(error);
        }
    });

export default axiosInstance;
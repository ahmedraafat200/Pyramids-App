import axios from 'axios'
import {BASE_URL} from "./config";
import Toast from "react-native-toast-message";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Replace with your API base URL
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data.info){
            Toast.show({
                type: response.data.status === 'ERROR' ? 'error' : 'success',
                text1: response.data.info
            });
        }
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
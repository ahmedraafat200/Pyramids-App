import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../config";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "../axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({children, navigation}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = (username, password) => {
        setIsLoading(true);

        let formData = new FormData();
        formData.append('email', username);
        formData.append('password', password);
        axiosInstance.post(`login.php`, formData).then(res => {
            if (res.data.status === 'OK'){
                let user = res.data;
                setUser(user);
                SecureStore.setItemAsync('user', JSON.stringify(user));
            }
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(false)
        })
    };

    const logout = () => {
        setIsLoading(true);
        SecureStore.deleteItemAsync('user');
        setUser(null);
        setIsLoading(false);

        // axios.post(`${BASE_URL}/student/auth/logout`,
        //     {},
        //     {
        //         headers: {Authorization: `Bearer ${user.access_token}`}
        //     }).then(res => {
        //     setIsLoading(false);
        // }).catch(e => {
        //     setIsLoading(false);
        // }).finally(() => {
        //     SecureStore.deleteItemAsync('user');
        //     setUser(null);
        // })
    };

    const isLoggedIn = () => {
        setSplashLoading(true);
        SecureStore.getItemAsync('user')
            .then(user => {
                if (user){
                    setUser(JSON.parse(user));
                }
                setSplashLoading(false);
            })
            .catch(err => {
                setSplashLoading(false);
            })
     }

    useEffect(() => {
        isLoggedIn()
    }, [])

    const value = {
        isLoading,
        splashLoading,
        user,
        login,
        logout,
    }

    return (
        <AuthContext.Provider
            value={value}>
            {children}
        </AuthContext.Provider>
    )
}
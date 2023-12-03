import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../config";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "../axiosInstance";
import { v4 as uuidv4 } from 'uuid';


export const AuthContext = createContext();

export const AuthProvider = ({children, navigation}) => {
    const [user, setUser] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [exponentPushToken, setExponentPushToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = (username, password) => {
        setSplashLoading(true);

        let formData = new FormData();
        formData.append('email', username);
        formData.append('password', password);
        formData.append('deviceId', deviceId);
        axiosInstance.post(`login.php`, formData).then(res => {
            if (res.data.status === 'OK'){
                let user = res.data;
                setUser(user);
                SecureStore.setItemAsync('user', JSON.stringify(user));

                if (user.token !== exponentPushToken){
                    updateExpoToken(user);
                    console.log(exponentPushToken, 'token updated')
                }
            }
            setSplashLoading(false);
        }).catch(e => {
            setSplashLoading(false)
        })
    };

    const updateExpoToken = (user) => {
        setSplashLoading(true);

        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('token', exponentPushToken);
        axiosInstance.post(`add_user_token.php`, formData).then(res => {
            setSplashLoading(false);
        }).catch(e => {
            setSplashLoading(false)
        })
    };

    const logout = () => {
        setSplashLoading(true);
        SecureStore.deleteItemAsync('user');
        setUser(null);
        setSplashLoading(false);

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
            });
     }

    const getDeviceId = () => {
        setSplashLoading(true);
        SecureStore.getItemAsync('deviceId')
            .then(deviceId => {
                if (deviceId){
                    setDeviceId(deviceId);
                } else {
                    let deviceId = uuidv4();
                    setDeviceId(deviceId);
                    SecureStore.setItemAsync('deviceId', deviceId);
                }
                setSplashLoading(false);
            })
            .catch(err => {
                setSplashLoading(false);
            });
    }

    const setExpoToken = () => {
        setSplashLoading(true);
        SecureStore.getItemAsync('exponentPushToken')
            .then(exponentPushToken => {
                if (exponentPushToken){
                    setExponentPushToken(exponentPushToken);
                    console.log(exponentPushToken, 'auth context')
                }
                setSplashLoading(false);
            })
            .catch(err => {
                setSplashLoading(false);
            });
    }

    useEffect(() => {
        isLoggedIn();
        getDeviceId();
        setExpoToken()
    }, [])

    const value = {
        isLoading,
        splashLoading,
        user,
        deviceId,
        exponentPushToken,
        setUser,
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
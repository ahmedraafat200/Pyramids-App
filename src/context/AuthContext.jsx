import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "../config";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({children, navigation}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = (username, password) => {
        setIsLoading(true);

        axios.post(`${BASE_URL}/student/auth/login`, {
            username, password
        }).then(res => {
            let user = res.data;
            setUser(user);
            SecureStore.setItemAsync('user', JSON.stringify(user));
            setIsLoading(false);
        }).catch(e => {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: e.response.data.error
            });
            setIsLoading(false)
        })
    };

    const logout = () => {
        setIsLoading(true);

        axios.post(`${BASE_URL}/student/auth/logout`,
            {},
            {
                headers: {Authorization: `Bearer ${user.access_token}`}
            }).then(res => {
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(false);
        }).finally(() => {
            SecureStore.deleteItemAsync('user');
            setUser(null);
        })

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
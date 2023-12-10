import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Pressable, ImageBackground} from 'react-native';
import axiosInstance from "../axiosInstance";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
import {useNavigation} from "@react-navigation/native";
import i18next from "../../services/i18next";
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const MyAccessScreen = () => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false)
    const [accessData, setAccessData] = useState({})
    const { toggleDrawer,closeDrawer,openDrawer, goBack} = useNavigation();

    function userAccess() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);

        axiosInstance.post(`/user_identity.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                setIsLoading(false);
                setAccessData(response.data.data);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        userAccess();
    }, [])

    // renders
    return (
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../assets/login-bg.png')}>
            <View className={"flex-row items-center mb-1 px-4"} style={{paddingTop: insets.top}}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../assets/app_bar.jpg') : require('../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={goBack} className="absolute left-6" style={{paddingTop: insets.top}}>
                    {i18next.language === 'ar' ? <Ionicons name="chevron-forward" size={30} color="#cbc19e"/> :
                        <Ionicons name="chevron-back" size={30} color="#cbc19e"/>
                    }
                </Pressable>
            </View>
        <View className="flex-1 p-4 items-center">
            <Spinner visible={isLoading}/>
                <View className="flex-1 w-full items-center space-y-1">
                    {accessData.first_name ?
                        <>
                            <Text style={{
                                fontFamily: 'LightFont',
                            }}
                                  className="capitalize text-xl font-medium">{accessData.first_name + ' ' + accessData.last_name}</Text>
                            <Text style={{
                                fontFamily: 'LightFont',
                            }}
                                  className="text-base font-medium">{accessData.project + ' - ' + accessData.unit}</Text>
                            <Image className="flex-1 w-full"
                                   resizeMode={"contain"}
                                   source={{uri: 'data:image/png;base64,' + accessData.qrcode}}/>
                        </> : null
                    }
                </View>
        </View>
        </ImageBackground>
    );
};

export default MyAccessScreen;
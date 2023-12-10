import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    FlatList,
    Image, ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable, RefreshControl,
    ScrollView, Share, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import axiosInstance from "../axiosInstance";
import {useNavigation} from "@react-navigation/native";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import ViewShot from "react-native-view-shot";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import i18next from "../../services/i18next";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const NotificationsScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const {toggleDrawer, closeDrawer, openDrawer, goBack} = useNavigation();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([])

    function getNotifications() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);

        axiosInstance.post(`/get_notifications.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    setNotifications(response.data.data);
                }
                console.log(notifications, 'notifications')
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getNotifications();
    }, [])

    const renderNotifications = ({item}) => (
        <View className='bg-gray-50 space-y-1 rounded-xl max-w-full p-3 m-2'
              style={[
                  styles.cardShadow
              ]}
        >
            <View className={"flex-row justify-between items-center"}>
                <Text style={{fontFamily: 'BoldFont'}}
                      className="text-lg text-black">{item.notificationTitle}</Text>
                <Text style={{fontFamily: 'LightFont'}}
                      className="text-sm text-black">{item.notificationDateTime}</Text>
            </View>
            <Text style={{color: '#7a6f81', fontFamily: 'LightFont'}}
                  className="text-base">{item.notificationBody.trim()}</Text>
        </View>
    );


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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                className="flex-1">
                <Spinner visible={isLoading}/>
                <FlatList
                    data={notifications}
                    renderItem={renderNotifications}
                    keyExtractor={item => item.notifId}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={() => getNotifications()}/>
                    }/>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
});

export default NotificationsScreen;
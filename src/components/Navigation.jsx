import React, {useCallback, useContext, useMemo, useRef, useState} from "react";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {AuthContext} from "../context/AuthContext";
import {FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from "@expo/vector-icons";
import {useSafeAreaInsets} from 'react-native-safe-area-context';



import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import RegisterValidationScreen from "../screens/Auth/RegisterValidationScreen";
import CodeLoginScreen from "../screens/Auth/CodeLoginScreen";
import {Dimensions, I18nManager, Image, Pressable, Share, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import OtpVerificationScreen from "../screens/Auth/OtpVerificationScreen";
import ChangePasswordScreen from "../screens/Auth/ChangePasswordScreen";
import OneTimePassScreen from "../screens/OneTimePassScreen";
import TimedPassScreen from "../screens/TimedPassScreen";
import InvitationsScreen from "../screens/InvitationsScreen";
import userImage from "../../assets/user.png";
import i18next from "../../services/i18next";
import * as Updates from "expo-updates";
import {useTranslation} from "react-i18next";
import Spinner from "react-native-loading-spinner-overlay/src";
import GatePermissionScreen from "../screens/GatePermissionScreen";
import axiosInstance from "../axiosInstance";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {navigationRef} from "../RootNavigation";
import MyAccessScreen from "../screens/MyAccessScreen";
import NewsScreen from "../screens/NewsScreen";
import ComingSoonScreen from "../screens/ComingSoonScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ContactScreen from "../screens/ContactScreen";

const ScreenWidth = Dimensions.get("window").width;

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const CustomDrawer = props => {
    const {t} = useTranslation();
    const {user, logout} = useContext(AuthContext);
    const profile = Image.resolveAssetSource(userImage).uri;

    const [isLoading, setIsLoading] = useState(false)

    function generateFamilyCode() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('invitaion_type', 'family');
        axiosInstance.post(`/create_invitation_family_renter.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    Share.share({
                        message: t('youCanUseThisCodeToLoginAndCreateYourAccountCode', {code: response.data.code})
                    })
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    const inviteModalRef = useRef(null);

    const handleInviteModalPress = useCallback(() => {
        inviteModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ),
        []
    );

    return (
        <View className={"flex-1"}>
            <DrawerContentScrollView {...props}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 20,
                        backgroundColor: '#f6f6f6',
                        marginBottom: 20,
                    }}
                >
                    <View>
                        <Text style={{
                            fontFamily: 'LightFont',
                        }}
                            className="capitalize text-base font-medium">{user.first_name + ' ' + user.last_name}</Text>
                        <Text style={{
                            fontFamily: 'LightFont',
                        }} className="capitalize text-xs">{user.email}</Text>
                    </View>
                    <Image
                        source={{
                            uri: user.userPhoto !== "" ? user.userPhoto : profile,
                        }}
                        resizeMode="contain"
                        style={{width: 60, height: 60, borderRadius: 30}}
                    />
                </View>
                <DrawerItemList {...props} />
                <View className='flex-row justify-center items-center space-x-4'>
                    <TouchableOpacity
                        onPress={() => navigationRef.navigate("MyAccess")}>
                        <View
                            className='bg-gray-50 rounded-xl py-2 my-2'
                            style={[
                                styles.cardShadow, styles.item
                            ]}
                        >
                            <View className='py-1 items-center space-y-2'>
                                <View className=''>
                                    <MaterialCommunityIcons name="cellphone-key" size={35} color="black"/>
                                </View>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className='text-base font-medium '>
                                    {t('myAccess')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleInviteModalPress}>
                        <View
                            className='bg-gray-50 rounded-xl py-2 my-2'
                            style={[
                                styles.cardShadow, styles.item
                            ]}
                        >
                            <View className='py-1 items-center space-y-2'>
                                <View className=''>
                                    <SimpleLineIcons name="envelope-letter" size={34} color="black"/>
                                </View>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className='text-base font-medium '>
                                    {t('invite')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 0,
                    left: 0,
                    bottom: 0,
                    backgroundColor: '#f6f6f6',
                    padding: 20,
                    alignItems: 'center'
                }}
                onPress={() => logout()}
            >
                <Text style={{
                    fontFamily: 'LightFont',
                }} className="text-base font-medium">{t('logOut')}</Text>
            </TouchableOpacity>

            <BottomSheetModalProvider>
                <View className="justify-center">
                    <BottomSheetModal
                        ref={inviteModalRef}
                        index={1}
                        snapPoints={useMemo(() => ['25%', '60%'], [])}
                        backdropComponent={renderBackdrop}
                        onChange={handleSheetChanges}
                    >
                        <View className="flex-1 justify-center px-6 space-y-3">
                            {user.role === "owner" &&
                                <View className="space-y-3">
                                    <TouchableOpacity
                                        onPress={() => navigationRef.navigate('TimedPass')}
                                    >
                                        <View
                                            className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                        >
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='self-center text-base font-medium '>
                                                {t('tenant')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => generateFamilyCode()}
                                    >
                                        <View
                                            className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                        >
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='self-center text-base font-medium '>
                                                {t('family')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            <TouchableOpacity
                                onPress={() => navigationRef.navigate('OneTimePass')}
                            >
                                <View
                                    className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                >
                                    <Text style={{
                                        fontFamily: 'LightFont',
                                    }} className='self-center text-base font-medium '>
                                        {t('oneTimePass')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigationRef.navigate('GatePermission')}
                            >
                                <View
                                    className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                >
                                    <Text style={{
                                        fontFamily: 'LightFont',
                                    }} className='self-center text-base font-medium '>
                                        {t('gatePermission')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </View>
    );
};

const DrawerNavigator = () => {
    const {t} = useTranslation();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'BoldFont'
                },
                drawerStyle: {
                    width: ScreenWidth * .85,
                },
                headerShown: false
            }}
            initialRouteName={'Tabs'}
        >
            <Drawer.Screen
                name={'Tabs'}
                component={TabNavigator}
                options={{
                    swipeEnabled: false,
                    title: t('home'),
                    drawerLabelStyle: {
                        fontFamily: 'LightFont'
                    },
                    drawerStyle: i18next.language === 'ar' ? {marginRight : "auto"} : {},
                    drawerIcon: ({focused, color, size}) => (
                        <Ionicons
                            name="md-home" size={size} color={color}
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name={'Invitations'}
                component={InvitationsScreen}
                options={{
                    title: t('invitations'),
                    drawerLabelStyle: {
                        fontFamily: 'LightFont'
                    },
                    drawerStyle: i18next.language === 'ar' ? {marginRight : "auto"} : {},
                    drawerIcon: ({focused, color, size}) => (
                        <SimpleLineIcons name="envelope-letter" size={size} color={color}/>
                    ),
                }}
            />
            <Drawer.Screen
                name={'Profile'}
                component={ProfileScreen}
                options={{
                    title: t('profile'),
                    drawerLabelStyle: {
                        fontFamily: 'LightFont'
                    },
                    drawerStyle: i18next.language === 'ar' ? {marginRight : "auto"} : {},
                    drawerIcon: ({focused, color, size}) => (
                        <Ionicons name="ios-person-circle-outline" size={size} color={color}/>

                    ),
                }}
            />
            <Drawer.Screen
                name={'News'}
                component={NewsScreen}
                options={{
                    title: t('news'),
                    drawerLabelStyle: {
                        fontFamily: 'LightFont'
                    },
                    drawerStyle: i18next.language === 'ar' ? {marginRight : "auto"} : {},
                    drawerIcon: ({focused, color, size}) => (
                        <FontAwesome name="newspaper-o"  size={size} color={color}/>
                    ),
                }}
            />
            <Drawer.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={
                    {
                        // headerShown: false,
                        title: t('changePassword'),
                        drawerLabelStyle: {
                            fontFamily: 'LightFont'
                        },
                        drawerStyle: i18next.language === 'ar' ? {marginRight : "auto"} : {},
                        drawerIcon: ({focused, color, size}) => (
                            <MaterialCommunityIcons name="lock-reset" size={size} color={color} />
                        ),
                    }}
            />
        </Drawer.Navigator>
    )
}

const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            // screenOptions={{
            //     tabBarLabelStyle: {paddingBottom: 6, fontSize: 10},
            //     tabBarStyle: {padding: 10, height: 60 + insets.bottom}
            // }}
            screenOptions={{
                tabBarShowLabel: false,
                tabBarBackground: () => (
                        <Image className={"flex-1 w-full"} source={i18next.language === 'ar' ? require('../../assets/footer-bg-rtl.png') : require('../../assets/footer-bg.png')} resizeMode="cover"/>
                ),
                tabBarStyle: {
                    height: 60,
                    borderTopWidth: 0,
                    paddingBottom: 0
                }
            }}
        >
            <Tab.Screen
                name={"Home"}
                component={HomeScreen}
                options={
                {
                    headerShown: false,
                    tabBarShowLabel:false,
                    tabBarIcon: ({focused}) => (
                        <View className={"justify-center items-center"}>
                            <Image style={focused ? {tintColor:  "#ffffff"} : {}} className={"h-16 w-16"} source={require("../../assets/home-icon.png")} resizeMode={"contain"}/>
                            {/*<Text>{t('home')}</Text>*/}
                        </View>
                    )
                }}
                initialParams={{screen: "Home"}}
            />
            <Tab.Screen
                name={"Notifications"}
                component={NotificationsScreen}
                options={
                    {
                        headerShown: false,
                        tabBarShowLabel:false,
                        tabBarIcon: ({focused}) => (
                            <View className={"justify-center items-center"}>
                                <Image style={focused ? {tintColor:  "#ffffff"} : {}} className={"h-20 w-20"} source={require("../../assets/not-icon.png")} resizeMode={"contain"}/>
                                {/*<Text>{t('notifications')}</Text>*/}
                            </View>
                        )
                    }}
            />
            <Tab.Screen
                name={"Projects"}
                component={ComingSoonScreen}
                options={
                    {
                        headerShown: false,
                        tabBarShowLabel:false,
                        tabBarIcon: ({focused}) => (
                            <View className={"justify-center items-center"}>
                                <Image style={focused ? {tintColor:  "#ffffff"} : {}} className={"h-16 w-16"} source={require("../../assets/proj-icon.png")} resizeMode={"contain"}/>
                                {/*<Text>{t('projects')}</Text>*/}
                            </View>
                        )
                    }}
            />
            <Tab.Screen
                name={"Contact"}
                component={ContactScreen}
                options={
                    {
                        headerShown: false,
                        tabBarShowLabel:false,
                        tabBarIcon: ({focused}) => (
                            <View className={"justify-center items-center"}>
                                <Image style={focused ? {tintColor:  "#ffffff"} : {}} className={"h-16 w-16"} source={require("../../assets/contact-icon.png")} resizeMode={"contain"}/>
                                {/*<Text>{t('contact')}</Text>*/}
                            </View>
                        )
                    }}
            />
        </Tab.Navigator>
    )
}

const Navigation = () => {
    const {user, splashLoading} = useContext(AuthContext);

    return (
        <Stack.Navigator>
            {splashLoading ? (
                <Stack.Screen
                    name="Splash Screen"
                    component={SplashScreen}
                    options={{headerShown: false}}
                />
            ) : user ? (
                <>
                    <Stack.Screen
                        name={"Drawer"}
                        component={DrawerNavigator}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name={"OneTimePass"}
                        component={OneTimePassScreen}
                        options={{title: 'One Time Pass',
                            headerShown: false}}
                    />
                    <Stack.Screen
                        name={"TimedPass"}
                        component={TimedPassScreen}
                        options={{title: 'Tenant Pass',
                            headerShown: false}}
                    />
                    <Stack.Screen
                        name={"GatePermission"}
                        component={GatePermissionScreen}
                        options={{title: 'Gate Permission',
                            headerShown: false}}
                    />
                    <Stack.Screen
                        name={"MyAccess"}
                        component={MyAccessScreen}
                        options={{headerShown: false}}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="LoginByCode"
                        component={CodeLoginScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="RegisterValidation"
                        component={RegisterValidationScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="ResetPassword"
                        component={ResetPasswordScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="OtpVerification"
                        component={OtpVerificationScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="ChangePassword"
                        component={ChangePasswordScreen}
                        options={{headerShown: false}}
                    />
                </>
            )}
        </Stack.Navigator>
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
    item: {
        width: (ScreenWidth - 32) / 3 - 6,
    }
});

export default Navigation;
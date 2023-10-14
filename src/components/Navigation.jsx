import React, {useContext} from "react";

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {AuthContext} from "../context/AuthContext";
import {Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";
import {useSafeAreaInsets} from 'react-native-safe-area-context';



import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import RegisterValidationScreen from "../screens/Auth/RegisterValidationScreen";
import CodeLoginScreen from "../screens/Auth/CodeLoginScreen";
import {Dimensions, I18nManager, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
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

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const CustomDrawer = props => {
    const {t} = useTranslation();
    const {user, logout} = useContext(AuthContext);
    const profile = Image.resolveAssetSource(userImage).uri;

    return (
        <View style={{flex: 1}}>
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
                        <Text
                            className="capitalize text-base font-medium">{user.first_name + ' ' + user.last_name}</Text>
                        <Text className="capitalize text-xs">{user.email}</Text>
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
                <Text className="text-base font-medium">{t('logOut')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const DrawerNavigator = () => {
    // const insets = useSafeAreaInsets();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                drawerStyle: {
                    width: Dimensions.get('window').width / 1.6,
                },
            }}
            initialRouteName={'Home'}
        >
            <Drawer.Screen
                name={'Home'}
                component={HomeScreen}
                options={{
                    title: 'Home',
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
                    title: 'Invitations',
                    drawerIcon: ({focused, color, size}) => (
                        <SimpleLineIcons name="envelope-letter" size={size} color={color}/>
                    ),
                }}
            />
            <Drawer.Screen
                name={'Profile'}
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    drawerIcon: ({focused, color, size}) => (
                        <Ionicons name="ios-person-circle-outline" size={size} color={color}/>

                    ),
                }}
            />
            <Drawer.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={
                    {
                        headerShown: false,
                        title: 'Change Password',
                        drawerIcon: ({focused, color, size}) => (
                            <MaterialCommunityIcons name="lock-reset" size={size} color={color} />
                        ),
                    }}
            />
        </Drawer.Navigator>
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
                        options={{title: 'One Time Pass'}}
                    />
                    <Stack.Screen
                        name={"TimedPass"}
                        component={TimedPassScreen}
                        options={{title: 'Tenant Pass'}}
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

export default Navigation;
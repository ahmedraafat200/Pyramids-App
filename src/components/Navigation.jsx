import React, {useContext} from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext} from "../context/AuthContext";
import {Ionicons} from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import RegisterValidationScreen from "../screens/Auth/RegisterValidationScreen";


// Screen Names
const homeName = 'Home';
const profileName = 'Profile';

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <></>
        // <Tab.Navigator
        //     initialRouteName={homeName}
        //     screenOptions={{
        //         tabBarLabelStyle: {paddingBottom: 6, fontSize: 10},
        //         tabBarStyle: {padding: 10, height: 60 + insets.bottom}
        //     }}
        // >
        //     <Tab.Screen
        //         name={homeName}
        //         component={HomeScreen}
        //         options={{
        //             tabBarIcon: ({focused, color, size}) => {
        //                 let iconName = focused ? 'home' : 'home-outline';
        //                 return <Ionicons name={iconName} size={size} color={color}/>
        //             }
        //         }}
        //     />
        //     <Tab.Screen
        //         name={profileName}
        //         component={ProfileScreen}
        //         options={{
        //             tabBarIcon: ({focused, color, size}) => {
        //                 let iconName = focused ? 'person' : 'person-outline';
        //                 return <Ionicons name={iconName} size={size} color={color}/>
        //             }
        //         }}
        //     />
        // </Tab.Navigator>
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
                    <Stack.Screen
                        name={"Tabs"}
                        component={TabNavigator}
                        options={{headerShown: false}}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{headerShown: false}}
                        />
                        <Stack.Screen
                            name="RegisterValidation"
                            component={RegisterValidationScreen}
                            options={{headerShown: false}}
                        />

                    </>
                )}
            </Stack.Navigator>
    );
};

export default Navigation;
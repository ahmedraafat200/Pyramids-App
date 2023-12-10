import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {AuthContext, AuthProvider} from "./src/context/AuthContext";
import Navigation from "./src/components/Navigation";
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/RootNavigation';
import Toast from "react-native-toast-message";
import 'react-native-get-random-values';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback, useEffect, useRef, useState} from "react";
import i18next from "./services/i18next";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from 'expo-constants';
import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import {v4 as uuidv4} from "uuid";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });

        SecureStore.getItemAsync('exponentPushToken')
            .then(exponentPushToken => {
                if (exponentPushToken){
                    console.log(token, 'exist');
                } else {
                    SecureStore.setItemAsync('exponentPushToken', token.data);
                    console.log(token, 'added');
                }
            })
            .catch(err => {
            });
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token.data;
}

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const [fontsLoaded] = useFonts({
        'LightFont': i18next.language === 'ar' ? require('./assets/fonts/Hacen-Eltaroute.ttf') : require('./assets/fonts/Nexa-Light.otf'),
        'BoldFont': i18next.language === 'ar' ? require('./assets/fonts/Hacen-Eltaroute.ttf') : require('./assets/fonts/Nexa-Bold.otf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Navigation/>
          <Toast/>
        </NavigationContainer>
      </AuthProvider>
      </GestureHandlerRootView>
  );
}

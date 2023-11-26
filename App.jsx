import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {AuthContext, AuthProvider} from "./src/context/AuthContext";
import Navigation from "./src/components/Navigation";
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/RootNavigation';
import Toast from "react-native-toast-message";
import 'react-native-get-random-values';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback} from "react";
import i18next from "./services/i18next";

export default function App() {
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

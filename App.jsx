import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {AuthContext, AuthProvider} from "./src/context/AuthContext";
import Navigation from "./src/components/Navigation";
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/RootNavigation';
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay/src";
import {useContext} from "react";

export default function App() {
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

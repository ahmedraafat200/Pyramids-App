import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {AuthProvider} from "./src/context/AuthContext";
import Navigation from "./src/components/Navigation";
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/RootNavigation';
import Toast from "react-native-toast-message";

export default function App() {
  return (
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Navigation/>
          <Toast/>
        </NavigationContainer>
      </AuthProvider>
  );
}

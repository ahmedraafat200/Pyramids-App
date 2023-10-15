import React from 'react';
import {ActivityIndicator, ImageBackground, View} from 'react-native';
import image from '../../assets/splash.png';

const SplashScreen = () => {
    return (
        <View className="flex-1">
            <ImageBackground source={image} resizeMode={'cover'} className="flex-1 w-full items-center justify-center">
            <ActivityIndicator size="large" color="#ffffff" />
            </ImageBackground>
        </View>
    );
};

export default SplashScreen;
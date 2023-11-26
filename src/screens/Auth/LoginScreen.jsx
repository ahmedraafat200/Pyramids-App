import React, {useContext, useState} from "react";
import {
    Button,
    I18nManager,
    Pressable,
    Text,
    TextInput,
    View,
    SafeAreaView,
    ImageBackground,
    StyleSheet
} from "react-native";
// import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import {useTranslation} from "react-i18next";
import * as Updates from "expo-updates";
import * as yup from 'yup';
import {Formik} from "formik";
import Spinner from "react-native-loading-spinner-overlay/src";
import {StatusBar} from "expo-status-bar";
import i18next from "../../../services/i18next";


const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .matches(/^01[0125][0-9]{8}$/, 'Phone number must be valid')
        .required('Phone number is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must contain at least 8 characters'),
});


const LoginScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {login, isLoading} = useContext(AuthContext)

    return (
        <ImageBackground style={ styles.imgBackground }
                         resizeMode='cover'
                         source={require('../../../assets/login-bg.png')}>
        <SafeAreaView className='flex-1 items-center'>
            <Spinner visible={isLoading} />
            <View className='p-10 w-full'>
                <View className='items-center h-52 py-8'>
                    <Image className={'flex-1 w-full'}
                           source={require('../../../assets/login-icon.png')}
                           resizeMode="contain"/>
                </View>

                <Text style={{
                    fontFamily: 'BoldFont',
                    color: '#6e2476'
                }} className='text-3xl font-bold mb-4 text-slate-900 self-center'>{t('login')}</Text>

                <Formik
                    validationSchema={loginValidationSchema}
                    initialValues={{ email: '', password: '' }}
                    onSubmit={values => login(values.email, values.password)}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          isValid,
                      }) => (
                        <>
                            <View className='mb-4'>
                                <TextInput
                                    style={{
                                        fontFamily: 'LightFont',
                                    }}
                                    className='w-full bg-white border border-black rounded-xl h-12 px-4'
                                    name="email"
                                    placeholder={t('enterYourPhoneNumber')}
                                    placeholderTextColor="#7d7b7b"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {errors.email &&
                                    <Text className='px-4' style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                                }
                            </View>
                            <View>
                            <TextInput
                                style={{
                                    fontFamily: 'LightFont',
                                }}
                                className='w-full bg-white border border-black rounded-xl h-12 px-4'
                                name="password"
                                placeholder={t('enterPassword')}
                                placeholderTextColor="#7d7b7b"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                            />
                            {errors.password &&
                                <Text className='px-4' style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                            }
                            </View>
                            <View className='flex flex-row justify-between items-center my-6'>
                                <Pressable
                                onPress={() => {navigation.navigate('LoginByCode')}}>
                                    <View className={'flex-row space-x-1'}>
                                    <Text style={{
                                        fontFamily: 'BoldFont',
                                    }} className='text-black font-bold'>{t('login')}</Text>
                                        <Text style={{
                                            fontFamily: 'BoldFont',
                                            color: '#892678'
                                        }} className='text-black font-bold'>{t('loginByCode')}</Text>
                                    </View>
                                </Pressable>
                                <Pressable
                                onPress={() => {navigation.navigate('ResetPassword')}}
                                >
                                    <Text style={{
                                        fontFamily: 'BoldFont',
                                    }} className='text-black font-bold'>{t('resetPassword')}</Text>
                                </Pressable>
                            </View>


                            <ImageBackground
                                source={require('../../../assets/button-bg.png')}
                                resizeMode={'cover'}>
                            <Pressable
                                className='h-14 rounded-xl flex flex-row justify-center items-center px-6'
                                onPress={() => {
                                    handleSubmit()
                                }}
                                disabled={!isValid}
                            >

                                <View className='flex-1 flex items-center'>
                                    <Text style={{
                                        fontFamily: 'LightFont',
                                    }} className='text-white text-base font-medium'>{t('login')}</Text>
                                </View>
                            </Pressable>
                            </ImageBackground>
                        </>
                    )}
                </Formik>

                <View className='flex flex-row justify-center my-6 space-x-1'>
                        <Text style={{
                            fontFamily: 'LightFont',
                        }} className='text-gray-600'>{t('dontHaveAnAccount')} </Text>
                    <Pressable
                        onPress={() => navigation.navigate('RegisterValidation')}>
                        <Text style={{
                            fontFamily: 'BoldFont',
                            color: '#892678'
                        }} className='text-black font-bold'>{t('signup')}</Text>
                    </Pressable>
                </View>

                <View className='self-center items-center justify-center rounded-xl w-fit py-1 px-2 space-y-4'>
                    <Pressable
                        onPress={() => {
                            i18next.changeLanguage(i18next.language === 'ar' ? 'en' : 'ar')
                                .then(() => {
                                    I18nManager.allowRTL(i18next.language === 'ar');
                                    I18nManager.forceRTL(i18next.language === 'ar');
                                    Updates.reloadAsync();
                                })
                        }}>

                        <Image className={'h-10'}
                               source={i18next.language === 'ar' ? require('../../../assets/en.png') : require('../../../assets/ar.png')}
                               resizeMode={"contain"}
                               />
                        {/*<Text style={{*/}
                        {/*    fontFamily: 'LightFont',*/}
                        {/*}} className='text-white text-base font-medium'>{t('language')}</Text>*/}
                    </Pressable>

                    <Image className={'h-14'}
                           source={require('../../../assets/sky-login-logo.png')}
                           resizeMode={"contain"}
                    />

                </View>
            </View>
        </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    }
});

export default LoginScreen;


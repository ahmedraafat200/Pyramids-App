import React, {useContext, useState} from "react";
import {Button, I18nManager, Pressable, Text, TextInput, View, SafeAreaView} from "react-native";
// import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import i18next from "../../../services/i18next";
import {useTranslation} from "react-i18next";
import * as Updates from "expo-updates";
import * as yup from 'yup';
import {Formik} from "formik";
import Spinner from "react-native-loading-spinner-overlay/src";

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must contain at least 8 characters'),
});


const LoginScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {isLoading, login} = useContext(AuthContext)

    return (
        <SafeAreaView className='flex-1 items-center bg-white'>
            <Spinner visible={isLoading} />
            <View className='p-10 w-full'>
                <View className='items-center h-52  py-10'>
                    <Image className={'flex-1 w-full'}
                           source={require('../../../assets/logo.png')}
                           resizeMode="contain"/>
                </View>

                <Text className='text-3xl font-bold mb-4 text-slate-900'>{t('login')}</Text>

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
                                    className='w-full bg-white border border-black rounded-xl h-12 px-4'
                                    name="email"
                                    placeholder={t('enterEmail')}
                                    placeholderTextColor="#000"
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
                                className='w-full bg-white border border-black rounded-xl h-12 px-4'
                                name="password"
                                placeholder={t('enterPassword')}
                                placeholderTextColor="#000"
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
                                <Pressable>
                                    <Text className='text-black font-bold'>{t('loginByCode')}</Text>
                                </Pressable>
                                <Pressable>
                                    <Text className='text-black font-bold'>{t('resetPassword')}</Text>
                                </Pressable>
                            </View>


                            <Pressable
                                className='h-12 bg-black rounded-xl flex flex-row justify-center items-center px-6'
                                onPress={() => {
                                    handleSubmit()
                                }}
                                disabled={!isValid}
                            >
                                <View className='flex-1 flex items-center'>
                                    <Text className='text-white text-base font-medium'>{t('login')}</Text>
                                </View>
                            </Pressable>
                        </>
                    )}
                </Formik>

                <View className='flex flex-row justify-center my-6'>
                        <Text className='text-gray-600'>{t('dontHaveAnAccount')} </Text>
                    <Pressable
                        onPress={() => navigation.navigate('RegisterValidation')}>
                        <Text className='text-black font-bold'>{t('signup')}</Text>
                    </Pressable>
                </View>

                <View className='flex flex-row self-center justify-center bg-black rounded-xl w-fit py-1 px-2'>
                    <Pressable
                        onPress={() => {
                            i18next.changeLanguage(i18next.language === 'ar' ? 'en' : 'ar')
                                .then(() => {
                                    I18nManager.allowRTL(i18next.language === 'ar');
                                    I18nManager.forceRTL(i18next.language === 'ar');
                                    Updates.reloadAsync();
                                })
                        }}>
                        <Text className='text-white text-base font-medium'>{t('language')}</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
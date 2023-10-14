import React, {useContext, useState} from "react";
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import {useTranslation} from "react-i18next";
import axiosInstance from "../../axiosInstance";
import Spinner from "react-native-loading-spinner-overlay";
import Steps from "../../components/Steps";
import {Formik} from "formik";
import DropDownFormik from "../../components/DropDownFormik";
import * as yup from "yup";
import {EvilIcons, MaterialCommunityIcons} from "@expo/vector-icons";

const codeValidationSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email'),
});

const ResetPasswordScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)

    function getOtp(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        axiosInstance.post(`/forgot_password_mail_check_code_send.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                setIsLoading(false);
                if (response.data.status === 'OK') {
                    console.log(response.data);
                    navigation.navigate('OtpVerification', {
                        'userId': response.data.userId,
                        'role': response.data.role,
                        'otp': response.data.v_code,
                    });
                }
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10 bg-white" step={1} totalSteps={3}/>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Formik
                    validationSchema={codeValidationSchema}
                    initialValues={{email: ''}}
                    onSubmit={values => getOtp(values)}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          isValid,
                      }) => (
                        <View className="flex-1 justify-between px-10 items-center bg-white">
                            <View className="items-center w-full mt-8">
                                <View className="rounded-full border-blue-500 border bg-blue-600 p-4">
                                    <MaterialCommunityIcons name="lock-outline" size={80} color="white"/>
                                </View>
                                <Text className='text-2xl font-bold m-4 text-slate-900'>{t('emailVerification')}</Text>
                                <Text className='text-base m-2 text-slate-900 text-center'>{t('aVerificationCodeWillBeSentYourEmail')}</Text>
                                <View className="flex-1 w-full mt-4">
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="email"
                                        placeholder={t('email')}
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {errors.email &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
                                    }
                                </View>
                            </View>

                            <Pressable
                                className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'
                                onPress={() => {
                                    handleSubmit()
                                }}
                            >
                                <View className='flex-1 flex items-center'>
                                    <Text className='text-white text-base font-medium'>{t('proceed')}</Text>
                                </View>
                            </Pressable>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;
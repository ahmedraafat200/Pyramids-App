import React, {useContext, useRef, useState} from "react";
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
import {MaterialCommunityIcons} from "@expo/vector-icons";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-toast-message";
import * as Clipboard from 'expo-clipboard';



const OtpVerification = ({route, navigation}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const [otpInput, setOtpInput] = useState("");

    const input = useRef(null);
    const handleCellTextChange = async (text, i) => {
        if (i === 0) {
            const clippedText = await Clipboard.getStringAsync();
            if (clippedText.slice(0, 1) === text) {
                input.current?.setValue(clippedText, true);
            }
            validateOtp(clippedText);
        }
        if (i === 5) {
            validateOtp(otpInput);
        }
    };

    function validateOtp(otpInput) {
        setIsLoading(true);
        if (route.params.otp === otpInput){
            Toast.show({
                type: 'success',
                text1: t('otpVerifiedSuccessfully')
            });
            navigation.navigate('ChangePassword', {
                userData: {
                    'userId' : route.params.userId,
                    'role' : route.params.role,
                }
            });
        } else {
            Toast.show({
                type: 'error',
                text1: t('otpVerificationFailed')
            });
        }
        setIsLoading(false);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10 bg-white" step={2} totalSteps={3}/>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View className="flex-1 justify-between px-10 items-center bg-white">
                    <View className="items-center w-full mt-8">
                        <View className="rounded-full border-blue-500 border bg-blue-600 p-4">
                            <MaterialCommunityIcons name="lock-open-variant-outline" size={80} color="white"/>
                        </View>
                        <Text className='text-2xl font-bold m-4 text-slate-900'>{t('otpVerification')}</Text>
                        <Text className='text-base m-2 text-slate-900 text-center'>{t('enterTheCodeThatYouHaveReceivedOnYourEmail')}</Text>
                        <View className="flex-1 w-full mt-4">
                            <OTPTextView
                                ref={input}
                                handleTextChange={setOtpInput}
                                handleCellTextChange={handleCellTextChange}
                                inputCount={6}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/*<Pressable*/}
                    {/*    className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'*/}
                    {/*    onPress={() => {*/}
                    {/*        // handleSubmit()*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <View className='flex-1 flex items-center'>*/}
                    {/*        <Text className='text-white text-base font-medium'>Proceed</Text>*/}
                    {/*    </View>*/}
                    {/*</Pressable>*/}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default OtpVerification;
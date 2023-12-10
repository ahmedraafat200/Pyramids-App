import React, {useContext, useState} from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import {useTranslation} from "react-i18next";
import axiosInstance from "../../axiosInstance";
import Spinner from "react-native-loading-spinner-overlay";
import Steps from "../../components/Steps";
import {Formik} from "formik";
import DropDownFormik from "../../components/DropDownFormik";
import * as yup from "yup";
import {EvilIcons, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import i18next from "../../../services/i18next";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const codeValidationSchema = yup.object().shape({
    email: yup
        .string()
        .matches(/^01[0125][0-9]{8}$/, 'Phone number must be valid')
        .required('Phone number is required'),
});

const ResetPasswordScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const { toggleDrawer,closeDrawer,openDrawer, goBack} = useNavigation();

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
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../../assets/login-bg.png')}>
            <View className={"flex-row items-center mb-1 px-4"} style={{paddingTop: insets.top}}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../../assets/app_bar.jpg') : require('../../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={goBack} className="absolute left-6" style={{paddingTop: insets.top}}>
                    {i18next.language === 'ar' ? <Ionicons name="chevron-forward" size={30} color="#cbc19e"/> :
                        <Ionicons name="chevron-back" size={30} color="#cbc19e"/>
                    }
                </Pressable>
            </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10" step={1} totalSteps={3}/>
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
                        <View className="flex-1 justify-between px-10 items-center">
                            <View className="items-center w-full mt-8">
                                <View className="rounded-full border-blue-500 border bg-blue-600 p-4">
                                    <MaterialCommunityIcons name="lock-outline" size={80} color="white"/>
                                </View>
                                <Text style={{
                                    fontFamily: 'BoldFont',
                                }} className='text-2xl font-bold m-4 text-slate-900'>{t('phoneVerification')}</Text>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className='text-base m-2 text-slate-900 text-center'>{t('aVerificationCodeWillBeSentYourEmail')}</Text>
                                <View className="flex-1 w-full mt-4">
                                    <TextInput
                                        style={{
                                            fontFamily: 'LightFont',
                                        }}
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="email"
                                        placeholder={t('enterYourPhoneNumber')}
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    {errors.email &&
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
                                    }
                                </View>
                            </View>

                            {/*<Pressable*/}
                            {/*    className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'*/}
                            {/*    onPress={() => {*/}
                            {/*        handleSubmit()*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <View className='flex-1 flex items-center'>*/}
                            {/*        <Text style={{*/}
                            {/*            fontFamily: 'LightFont',*/}
                            {/*        }} className='text-white text-base font-medium'>{t('proceed')}</Text>*/}
                            {/*    </View>*/}
                            {/*</Pressable>*/}
                            <ImageBackground
                                className={"w-full rounded-xl h-16 mb-1"}
                                source={require('../../../assets/button-bg.png')}
                                resizeMode={'contain'}>
                                <Pressable
                                    className='h-16 rounded-xl flex flex-row justify-center items-center px-6'
                                    onPress={() => {
                                        handleSubmit()
                                    }}
                                >
                                    <View className='flex-1 flex items-center'>
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='text-white text-base font-medium'>{t('proceed')}</Text>
                                    </View>
                                </Pressable>
                            </ImageBackground>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ResetPasswordScreen;
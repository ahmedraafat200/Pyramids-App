import React, {useContext, useState} from "react";
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView, Linking,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import axiosInstance from "../axiosInstance";
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import i18next from "../../services/i18next";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const registerValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required'),
    phoneNumber: yup
        .string()
        .required('Phone number is required'),
    email: yup
        .string()
        .required('Email is required'),
    message: yup
        .string()
        .required('Message is required'),
});

const ContactScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const {toggleDrawer, closeDrawer, openDrawer, goBack} = useNavigation();

    function sendContact(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        axiosInstance.post(`/contact_form.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    this.formik.resetForm();
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    return (
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../assets/login-bg.png')}>
            <View className={"flex-row items-center mb-1 px-4"} style={{paddingTop: insets.top}}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../assets/app_bar.jpg') : require('../../assets/right-ban-withlogo.jpg')}/>
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
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <View className={"px-10 pt-4 items-center"}>
                        <Text className={"text-7xl"} style={{color: '#cbc19e', fontFamily: 'BoldFont'}}>{t('getInTouch')}</Text>
                        <Text className={"text-black text-center"} style={{fontFamily: 'LightFont'}}>{t('doYouHaveAnyQuestions')}</Text>
                        <Text className={"text-black text-center"} style={{fontFamily: 'LightFont'}}>{t('pleaseDontHesitateToContactUsDirectly')}</Text>
                        <Text className={"text-black text-center"} style={{fontFamily: 'LightFont'}}>{t('ourTeamWillComeBackToYouInAMatterOfHoursToHelpYou')}</Text>
                    </View>
                    <Formik
                        innerRef={(p) => (this.formik = p)}
                        enableReinitialize
                        validationSchema={registerValidationSchema}
                        initialValues={{
                            name: user.first_name + '' + user.last_name,
                            phoneNumber: user.phoneNumber,
                            email: user.email,
                            message: ''
                        }}
                        onSubmit={values => sendContact(values)}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              errors,
                              isValid,
                          }) => (
                            <View className="flex-1 space-y-4 px-10 items-center">
                                <View className="flex flex-col space-y-4 mt-10 w-full">
                                    <View>
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="name"
                                            placeholder={t('name')}
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                        />
                                        {errors.name &&
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.name}</Text>
                                        }
                                    </View>
                                    <View>
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="phoneNumber"
                                            placeholder={t('enterYourPhoneNumber')}
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('phoneNumber')}
                                            onBlur={handleBlur('phoneNumber')}
                                            value={values.phoneNumber}
                                        />
                                        {errors.phoneNumber &&
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.phoneNumber}</Text>
                                        }
                                    </View>
                                    <View>
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="email"
                                            placeholder={t('enterYourEmail')}
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
                                    <View>
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='bg-white border border-black rounded-lg h-24 px-4'
                                            name="message"
                                            placeholder={t('enterYourMessage')}
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('message')}
                                            onBlur={handleBlur('message')}
                                            value={values.message}
                                            multiline={true}
                                        />
                                        {errors.message &&
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.message}</Text>
                                        }
                                    </View>
                                </View>
                                <ImageBackground
                                    className={"rounded-xl h-16 mb-1  w-full"}
                                    source={require('../../assets/button-bg.png')}
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
                                            }} className='text-white text-base font-medium'>{t('send')}</Text>
                                        </View>
                                    </Pressable>
                                </ImageBackground>
                            </View>
                        )}
                    </Formik>
                    <View className={"flex-row justify-between px-16 pb-10"}>
                        <TouchableOpacity
                        onPress={() => {
                            Linking.openURL("https://www.facebook.com/PyramidsDevelopments")
                        }}>
                            <AntDesign name="facebook-square" size={30} color="#cbc19e" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL("https://instagram.com/pyramids.developments")
                            }}>
                        <AntDesign name="instagram" size={30} color="#cbc19e" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL("https://youtube.com/@pyramidsdevelopments")
                            }}>
                        <AntDesign name="youtube" size={30} color="#cbc19e" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL("https://maps.app.goo.gl/9yCNV5o3MXiPACgd9")
                            }}>
                        <MaterialCommunityIcons name="google-maps" size={30} color="#cbc19e" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ContactScreen;
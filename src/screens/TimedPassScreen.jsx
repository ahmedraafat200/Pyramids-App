import React, {useContext, useState} from "react";
import {
    Image, ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView, Share,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import {Formik, useFormik} from "formik";
import * as yup from "yup";
import axiosInstance from "../axiosInstance";
import {AntDesign} from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import i18next from "../../services/i18next";
import {useNavigation} from "@react-navigation/native";


const registerValidationSchema = yup.object().shape({
    rent_from: yup
        .string()
        .required('From date is required'),
    rent_to: yup
        .string()
        .required('To Date is required'),
});

const TimedPassScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState({});
    const {toggleDrawer, closeDrawer, openDrawer, goBack} = useNavigation();

    const shareInvitation = () => {
        Share.share({
            message: t('youCanUseThisCodeToLoginAndCreateYourAccountCode', {code: code.code})
        })
    };

    const initialValues = {
        rent_from: '',
        rent_to: ''
    };

    const {
        setFieldError,
        setFieldValue,
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
    } = useFormik({
            initialValues,
            registerValidationSchema,
            onSubmit: values => {
                if (!values.rent_from){
                    setFieldError('rent_from', 'Start date is required')
                }
                if (!values.rent_to){
                    setFieldError('rent_to', 'End Date is required')
                }
                if (values.rent_from && values.rent_to){
                    generateCode(values)}
                }
        }
    )

    const [date, setDate] = useState(new Date());
    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);

    const onChangeFromDate = (date) => {
        const currentDate = date.toLocaleDateString("fr-CA");
        setShowFromDate(false);
        setDate(currentDate);
        setFieldValue("rent_from", currentDate)
    };

    const showDatepickerFromDate = () => {
        setShowFromDate(true);
    };

    const onChangeToDate = (date) => {
        const currentDate = date.toLocaleDateString("fr-CA");
        setShowToDate(false);
        setDate(currentDate);
        setFieldValue("rent_to", currentDate)
    };

    const showDatepickerToDate = () => {
        setShowToDate(true);
    };


    function generateCode(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('invitaion_type', 'renter');
        axiosInstance.post(`/create_invitation_family_renter.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    setCode(response.data);
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
            <View className={"flex-row items-center mt-8 px-4"}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../assets/app_bar.jpg') : require('../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={goBack} className="absolute left-6">
                    <Image source={require('../../assets/menu-button.png')}/>
                </Pressable>
            </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {code.code ?
                    <View className="flex-1 justify-center px-10 items-center bg-white">
                        <Pressable
                            className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'
                            onPress={shareInvitation}
                        >
                            <View className='flex-row items-center w-full justify-center space-x-2'>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className='text-white text-base font-medium'>{t('share')}</Text>
                                <AntDesign name="sharealt" size={20} color="white" />
                            </View>
                        </Pressable>
                    </View> :
                            <View className="flex-1 justify-between px-10 items-center bg-white">
                                <View className="flex flex-col space-y-4 mt-10 w-full">
                                    <View>
                                        <TouchableOpacity
                                            onPress={showDatepickerFromDate}>
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            pointerEvents="none"
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="rent_from"
                                            placeholder={t('enterStartDate')}
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('rent_from')}
                                            onBlur={handleBlur('rent_from')}
                                            value={values.rent_from}
                                            editable={false}
                                        />
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={showFromDate}
                                            mode="date"
                                            onConfirm={onChangeFromDate}
                                            onCancel={() => {setShowFromDate(false)}}
                                        />
                                        {errors.rent_from &&
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.rent_from}</Text>
                                        }
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            onPress={showDatepickerToDate}>
                                            <TextInput
                                                style={{
                                                    fontFamily: 'LightFont',
                                                }}
                                                pointerEvents="none"
                                                className='bg-white border border-black rounded-lg h-12 px-4'
                                                name="rent_to"
                                                placeholder={t('enterEndDate')}
                                                placeholderTextColor="#000"
                                                onChangeText={handleChange('rent_to')}
                                                onBlur={handleBlur('rent_to')}
                                                value={values.rent_to}
                                                editable={false}
                                            />
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={showToDate}
                                            mode="date"
                                            onConfirm={onChangeToDate}
                                            onCancel={() => {setShowToDate(false)}}
                                        />
                                        {errors.rent_to &&
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.rent_to}</Text>
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
                                {/*        }} className='text-white text-base font-medium'>{t('invite')}</Text>*/}
                                {/*    </View>*/}
                                {/*</Pressable>*/}
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
                                            }} className='text-white text-base font-medium'>{t('invite')}</Text>
                                        </View>
                                    </Pressable>
                                </ImageBackground>
                            </View>
                }
            </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default TimedPassScreen;
import React, {useContext, useState} from "react";
import {
    Image,
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
import DateTimePicker from '@react-native-community/datetimepicker';


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

    const onChangeFromDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowFromDate(false);
        setDate(currentDate);
        setFieldValue("rent_from", currentDate.toLocaleDateString("fr-CA"))
    };

    const showDatepickerFromDate = () => {
        setShowFromDate(true);
    };

    const onChangeToDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowToDate(false);
        setDate(currentDate);
        setFieldValue("rent_to", currentDate.toLocaleDateString("fr-CA"))
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
                                <Text className='text-white text-base font-medium'>{t('share')}</Text>
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
                                        {showFromDate && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={'date'}
                                                is24Hour={true}
                                                onChange={onChangeFromDate}
                                            />)
                                        }
                                        {errors.rent_from &&
                                            <Text className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.rent_from}</Text>
                                        }
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            onPress={showDatepickerToDate}>
                                            <TextInput
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
                                        {showToDate && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={'date'}
                                                is24Hour={true}
                                                onChange={onChangeToDate}
                                            />)
                                        }
                                        {errors.rent_to &&
                                            <Text className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.rent_to}</Text>
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
                                        <Text className='text-white text-base font-medium'>{t('invite')}</Text>
                                    </View>
                                </Pressable>
                            </View>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default TimedPassScreen;
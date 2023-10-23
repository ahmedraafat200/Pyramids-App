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
import DateTimePickerModal from "react-native-modal-datetime-picker";


const registerValidationSchema = yup.object().shape({
    date_from: yup
        .string()
        .required('From date is required'),
    date_to: yup
        .string()
        .required('To Date is required'),
    guest_name: yup
        .string()
        .required('Guest name is required'),
    description: yup
        .string()
        .required('Description is required'),
});

const GatePermissionScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        guest_name: '',
        description: '',
        date_from: '',
        date_to: '',
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
                if (!values.date_from) {
                    setFieldError('date_from', 'Start date is required')
                }
                if (!values.date_to) {
                    setFieldError('date_to', 'End Date is required')
                }
                if (!values.guest_name) {
                    setFieldError('guest_name', 'Guest name is required')
                }
                if (!values.description) {
                    setFieldError('description', 'Description is required')
                }
                if (values.date_from && values.date_to && values.description && values.guest_name) {
                    addGatePermission(values)
                }
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
        setFieldValue("date_from", currentDate)
        console.log(currentDate)
    };

    const showDatepickerFromDate = () => {
        setShowFromDate(true);
    };

    const onChangeToDate = (date) => {
        const currentDate = date.toLocaleDateString("fr-CA");
        setShowToDate(false);
        setDate(currentDate);
        setFieldValue("date_to", currentDate)
    };

    const showDatepickerToDate = () => {
        setShowToDate(true);
    };


    function addGatePermission(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        axiosInstance.post(`/create_gate_permission.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    navigation.navigate("Home");
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
                <View className="flex-1 justify-between px-10 items-center bg-white">
                    <View className="flex flex-col space-y-4 mt-10 w-full">
                        <View>
                            <TextInput
                                className='bg-white border border-black rounded-lg h-12 px-4'
                                name="guest_name"
                                placeholder={t('enterGuestName')}
                                placeholderTextColor="#000"
                                onChangeText={handleChange('guest_name')}
                                onBlur={handleBlur('guest_name')}
                                value={values.guest_name}
                            />
                            {errors.guest_name &&
                                <Text className='px-4'
                                      style={{fontSize: 10, color: 'red'}}>{errors.guest_name}</Text>
                            }
                        </View>
                        <View>
                            <TextInput
                                className='bg-white border border-black rounded-lg h-12 px-4'
                                name="description"
                                placeholder={t('enterGuestRide')}
                                placeholderTextColor="#000"
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                            />
                            {errors.description &&
                                <Text className='px-4'
                                      style={{fontSize: 10, color: 'red'}}>{errors.description}</Text>
                            }
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={showDatepickerFromDate}>
                                <TextInput
                                    pointerEvents="none"
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="date_from"
                                    placeholder={t('enterStartDate')}
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('date_from')}
                                    onBlur={handleBlur('date_from')}
                                    value={values.date_from}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showFromDate}
                                mode="date"
                                onConfirm={onChangeFromDate}
                                onCancel={() => {setShowFromDate(false)}}
                            />
                            {errors.date_from &&
                                <Text className='px-4'
                                      style={{fontSize: 10, color: 'red'}}>{errors.date_from}</Text>
                            }
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={showDatepickerToDate}>
                                <TextInput
                                    pointerEvents="none"
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="date_to"
                                    placeholder={t('enterEndDate')}
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('date_to')}
                                    onBlur={handleBlur('date_to')}
                                    value={values.date_to}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showToDate}
                                mode="date"
                                onConfirm={onChangeToDate}
                                onCancel={() => {setShowToDate(false)}}
                            />
                            {errors.date_to &&
                                <Text className='px-4'
                                      style={{fontSize: 10, color: 'red'}}>{errors.date_to}</Text>
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default GatePermissionScreen;
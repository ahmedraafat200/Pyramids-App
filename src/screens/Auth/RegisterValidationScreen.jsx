import React, {useEffect, useState} from "react";
import {Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import DropDownFormik from "../../components/DropDownFormik";
import Steps from "../../components/Steps";
import axiosInstance from "../../axiosInstance";
import userImage from "../../../assets/user.png";

const registerValidationSchema = yup.object().shape({
    project: yup
        .string()
        .required('Project is required'),
    unit: yup
        .string()
        .required('Unit is required'),
    national_id: yup
        .string()
        .required('National ID is required')
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(14, 'Must be exactly 14 digits')
        .max(14, 'Must be exactly 14 digits')
});

const RegisterValidationScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const profile = Image.resolveAssetSource(userImage).uri;
    const ownerData = route.params ? route.params.ownerData : {};
    const [isLoading, setIsLoading] = useState(false)
    const [projectItems, setProjectItems] = useState([
        {label: 'Sky City', value: 'Sky City'}
    ]);
    const [unitItems, setUnitItems] = useState([]);

    function getUnits() {
        setIsLoading(true);
        axiosInstance.get(`/get_units.php`, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                setIsLoading(false);
                let units = response.data.units.map(item => {
                    return {label: item.unit, value: item.unit}
                })
                setUnitItems(units);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    function validateOwner(inputData) {
        setIsLoading(true);
        if (ownerData.ownerId) {
            inputData = {
                ...inputData,
                ownerId: ownerData.ownerId,
                usedCode: ownerData.usedCode
            }
            setIsLoading(false);
            navigation.navigate('Register', {
                validationData: inputData,
                role: ownerData.role
            })
        } else {
            let formData = new FormData();
            Object.keys(inputData).forEach(fieldName => {
                formData.append(fieldName, inputData[fieldName]);
            })

            axiosInstance.post(`/validate_new_owner.php`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })
                .then(response => {
                    setIsLoading(false);
                    if (response.data.status === 'OK') {
                        navigation.navigate('Register', {
                            validationData: inputData,
                        })
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                })
        }
    }

    useEffect(() => {
        getUnits();
    }, [])
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10 bg-white" step={ownerData.ownerId ? 2 : 1} totalSteps={ownerData.ownerId ? 3 : 2}/>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Formik
                    validationSchema={registerValidationSchema}
                    initialValues={{project: ownerData.project ?? '', unit: ownerData.unit ?? '', national_id: ''}}
                    onSubmit={values => validateOwner(values)}
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
                            <View className="flex flex-col space-y-4 w-full">
                                <Text className='self-center text-2xl font-bold mt-4 mb-8 text-slate-900'>{t('ownerValidation')}</Text>
                                {ownerData.name ?
                                    <View className="">
                                        <Image className="self-center"
                                               source={{uri: ownerData.userPhoto !== "" ? ownerData.userPhoto : profile}}
                                               style={{
                                                   height: 100,
                                                   width: 100,
                                                   borderRadius: 85,
                                                   borderWidth: 2,
                                                   borderColor: 'black',
                                                   marginBottom: 10
                                               }}
                                        />
                                        <TextInput
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="owner_name"
                                            value={ownerData.name}
                                            editable={!ownerData}
                                        />
                                    </View> : null
                                }
                                <View>
                                    {ownerData.project ?
                                        <TextInput
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="project"
                                            onChangeText={handleChange('project')}
                                            onBlur={handleBlur('project')}
                                            value={values.project}
                                            editable={!ownerData}
                                        /> :
                                        <DropDownFormik
                                            name="project"
                                            placeholder={t('selectYourProject')}
                                            items={projectItems}
                                        />}
                                    {errors.project &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.project}</Text>
                                    }
                                </View>

                                <View>
                                    {ownerData.unit ?
                                        <TextInput
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="unit"
                                            onChangeText={handleChange('unit')}
                                            onBlur={handleBlur('unit')}
                                            value={values.unit}
                                            editable={!ownerData}
                                        /> :
                                        <DropDownFormik
                                            name="unit"
                                            placeholder={t('selectYourUnit')}
                                            items={unitItems}
                                            zIndex={50}
                                        />}
                                    {errors.unit &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.unit}</Text>
                                    }
                                </View>
                                <View>
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="national_id"
                                        placeholder={t('enterYourNationalId')}
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('national_id')}
                                        onBlur={handleBlur('national_id')}
                                        value={values.national_id}
                                        keyboardType="numeric"
                                    />
                                    {errors.national_id &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.national_id}</Text>
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

export default RegisterValidationScreen;
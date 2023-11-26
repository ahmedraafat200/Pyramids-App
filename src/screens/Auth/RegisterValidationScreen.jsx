import React, {useEffect, useState} from "react";
import {
    Image,
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
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import DropDownFormik from "../../components/DropDownFormik";
import Steps from "../../components/Steps";
import axiosInstance from "../../axiosInstance";
import userImage from "../../../assets/user.png";
import {useNavigation} from "@react-navigation/native";
import i18next from "../../../services/i18next";


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
    const { toggleDrawer,closeDrawer,openDrawer, goBack} = useNavigation();

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
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../../assets/login-bg.png')}>
            <View className={"flex-row items-center mt-8 px-4"}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain" source={i18next.language === 'ar' ? require('../../../assets/app_bar.jpg') : require('../../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={goBack} className="absolute left-6">
                    <Image source={require('../../../assets/menu-button.png')}/>
                </Pressable>
            </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10" step={ownerData.ownerId ? 2 : 1} totalSteps={ownerData.ownerId ? 3 : 2}/>
            <View className="flex-1" contentContainerStyle={{flexGrow: 1}}>
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
                        <View className="flex-1 justify-between px-10 items-center">
                            <View className="flex flex-col space-y-4 w-full">
                                <Text style={{
                                    fontFamily: 'BoldFont',
                                }} className='self-center text-2xl font-bold mt-4 mb-8 text-slate-900'>{t('ownerValidation')}</Text>
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
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="owner_name"
                                            value={ownerData.name}
                                            editable={!ownerData}
                                        />
                                    </View> : null
                                }
                                <View style={{zIndex: 2000}}>
                                    {ownerData.project ?
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
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
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.project}</Text>
                                    }
                                </View>

                                <View style={{zIndex: 1000}}>
                                    {ownerData.unit ?
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
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
                                        />}
                                    {errors.unit &&
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.unit}</Text>
                                    }
                                </View>
                                <View>
                                    <TextInput
                                        style={{
                                            fontFamily: 'LightFont',
                                        }}
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
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.national_id}</Text>
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
            </View>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default RegisterValidationScreen;
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

const codeValidationSchema = yup.object().shape({
    code: yup
        .number()
        .required('Code is required'),
});

const CodeLoginScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)

    function validateCode(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        axiosInstance.post(`/login_with_code.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => {
                setIsLoading(false);
                if (response.data.status === 'OK'){
                    navigation.navigate('RegisterValidation', {
                        ownerData: {
                            'name' : response.data.first_name + ' ' + response.data.last_name,
                            'unit' : response.data.unit,
                            'project' : response.data.project,
                            'role': response.data.codeType,
                            'userPhoto': response.data.userPhoto,
                            'ownerId': response.data.ownerId,
                            'usedCode': response.data.usedCode
                        }
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
                    initialValues={{code: ''}}
                    onSubmit={values => validateCode(values)}
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
                            <Text className='text-2xl font-bold m-4 text-slate-900'>{t('codeValidation')}</Text>
                            <View className="flex flex-col space-y-4 w-full">
                                <View>
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="code"
                                        placeholder={t('code')}
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('code')}
                                        onBlur={handleBlur('code')}
                                        value={values.code}
                                        keyboardType="numeric"
                                    />
                                    {errors.code &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.code}</Text>
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

export default CodeLoginScreen;
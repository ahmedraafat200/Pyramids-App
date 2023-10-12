import React, {useContext, useState} from "react";
import {Pressable, SafeAreaView, Text, TextInput, View} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import DropDownPicker from 'react-native-dropdown-picker';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import DropDownFormik from "../../components/DropDownFormik";

const registerValidationSchema = yup.object().shape({
    project: yup
        .string()
        .required('Project is required'),
    unit: yup
        .string()
        .required('Unit is required'),
    phone: yup
        .number()
        .required('Phone number is required'),
});

const RegisterValidationScreen = () => {
    const {t} = useTranslation();
    const [projectItems, setProjectItems] = useState([
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'}
    ]);
    const [unitItems, setUnitItems] = useState([
        {label: 'Test', value: 'Test'},
        {label: 'Banana', value: 'banana'}
    ]);

    return (
        <SafeAreaView className='flex-1 justify-between w-full max-w-md p-10 items-center bg-white'>
            {/*<Spinner visible={isLoading} />*/}
            {/*<View className='p-10 w-full max-w-sm items-center'>*/}
                {/*<View className='items-center h-52 mt-10 py-10'>*/}
                {/*    <Image className={'flex-1 w-full'}*/}
                {/*           source={require('../../../assets/logo.png')}*/}
                {/*           resizeMode="contain"/>*/}
                {/*</View>*/}
                <Text className='text-2xl font-bold m-6 text-slate-900'>Owner Validation</Text>

                <Formik
                    validationSchema={registerValidationSchema}
                    initialValues={{project: '', unit: '', phone: ''}}
                    onSubmit={values => console.log(values)}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          isValid,
                      }) => (
                        <>
                            <View className="flex flex-col space-y-4 w-full">

                                <View>
                                    <DropDownFormik
                                        name="project"
                                        placeholder="Select your project"
                                        items={projectItems}
                                    />
                                    {errors.project &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.project}</Text>
                                    }
                                </View>

                                <View>
                                    <DropDownFormik
                                        name="unit"
                                        placeholder="Select your unit"
                                        items={unitItems}
                                    />
                                    {errors.unit &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.unit}</Text>
                                    }
                                </View>

                                <View>
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone}
                                        keyboardType="numeric"
                                    />
                                    {errors.phone &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.phone}</Text>
                                    }
                                </View>
                            </View>

                            <Pressable
                                className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'
                                onPress={() => {
                                    handleSubmit()
                                    // login(username, password)
                                }}
                            >
                                <View className='flex-1 flex items-center'>
                                    <Text className='text-white text-base font-medium'>Proceed</Text>
                                </View>
                            </Pressable>
                        </>
                    )}
                </Formik>
            {/*</View>*/}
        </SafeAreaView>
    );
};

export default RegisterValidationScreen;
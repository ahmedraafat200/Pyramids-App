import React, {useContext, useState} from "react";
import {Pressable, SafeAreaView, Text, TextInput, View} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";
import DropDownPicker from 'react-native-dropdown-picker';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import DropDownFormik from "../../components/DropDownFormik";
import {FontAwesome5} from "@expo/vector-icons";

const registerValidationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required('Project is required'),
    last_name: yup
        .string()
        .required('Unit is required'),
    email: yup
        .string()
        .required('Mobile is required')
        .email('Invalid email'),
    confirm_email: yup.string()
        .oneOf([yup.ref('email'), null], 'Emails must match'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must contain at least 8 characters'),
    confirm_password: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    national_id: yup
        .string()
        .required('National ID is required')
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(14, 'Must be exactly 14 digits')
        .max(14, 'Must be exactly 14 digits')
});

const RegisterScreen = () => {
    const {t} = useTranslation();
    const [hidePass, setHidePass] = useState(true);

    return (
        <SafeAreaView className='flex-1 justify-between w-full max-w-md p-10 items-center bg-white'>
            <Text className='text-2xl font-bold m-6 text-slate-900'>Personal Information</Text>

            <Formik
                validationSchema={registerValidationSchema}
                initialValues={{first_name: '', last_name: '', email: '', national_id : '', password : ''}}
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
                            <View className="flex flex-row space-x-2">
                                <View className="flex-1">
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="first_name"
                                        placeholder="First Name"
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('first_name')}
                                        onBlur={handleBlur('first_name')}
                                        value={values.first_name}
                                    />
                                    {errors.first_name &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.first_name}</Text>
                                    }
                                </View>
                                <View className="flex-1">
                                    <TextInput
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="last_name"
                                        placeholder="Last name"
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('last_name')}
                                        onBlur={handleBlur('last_name')}
                                        value={values.last_name}
                                    />
                                    {errors.last_name &&
                                        <Text className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.last_name}</Text>
                                    }
                                </View>
                            </View>
                            <View>
                                <TextInput
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="email"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {errors.email &&
                                    <Text className='px-4'
                                          style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
                                }
                            </View>
                            <View>
                                <TextInput
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="confirm_email"
                                    placeholder="Confirm email"
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('confirm_email')}
                                    onBlur={handleBlur('confirm_email')}
                                    value={values.confirm_email}
                                />
                                {errors.confirm_email &&
                                    <Text className='px-4'
                                          style={{fontSize: 10, color: 'red'}}>{errors.confirm_email}</Text>
                                }
                            </View>
                            <View>
                                <TextInput
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="password"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePass ? true : false}>
                                    <FontAwesome5 name={hidePass ? 'eye-slash' : 'eye'} size={24} color="black"
                                                  onPress={() => setHidePass(!hidePass)}/>
                                </TextInput>
                                {errors.password &&
                                    <Text className='px-4'
                                          style={{fontSize: 10, color: 'red'}}>{errors.password}</Text>
                                }
                            </View>
                            <View>
                                <TextInput
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="confirm_password"
                                    placeholder="Confirm password"
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('confirm_password')}
                                    onBlur={handleBlur('confirm_password')}
                                    value={values.confirm_password}
                                    secureTextEntry
                                />
                                {errors.confirm_password &&
                                    <Text className='px-4'
                                          style={{fontSize: 10, color: 'red'}}>{errors.confirm_password}</Text>
                                }
                            </View>
                            <View>
                                <TextInput
                                    className='bg-white border border-black rounded-lg h-12 px-4'
                                    name="national_id"
                                    placeholder="Enter your national id"
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

export default RegisterScreen;
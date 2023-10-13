import React, {useContext, useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
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
import {FontAwesome5} from "@expo/vector-icons";

const codeValidationSchema = yup.object().shape({
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must contain at least 8 characters'),
    confirm_password: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const ChangePasswordScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [hidePass, setHidePass] = useState(true);
    const {user} = useContext(AuthContext);
    const userData = route.params ? route.params.userData : null;

    function resetPassword(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', userData.userId);
        formData.append('role', userData.role);
        formData.append('new_password', inputData.password);

        axiosInstance.post(`/forgot_password_update_new_pass.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => {
                console.log(response.data)
                setIsLoading(false);
                if (response.data.status === 'OK'){
                    navigation.navigate('Login');
                }
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false);
            })
    }

    function userChangePassword(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('password', inputData.password);

        axiosInstance.post(`/user_change_password.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => {
                console.log(response.data)
                setIsLoading(false);
                if (response.data.status === 'OK'){
                    navigation.navigate('Home');
                }
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false);
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            {userData ?
                <Steps classNames="pt-10 bg-white" step={3} totalSteps={3}/> :
                <View classNames="pt-10"><Text></Text></View>}
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <Formik
                    validationSchema={codeValidationSchema}
                    initialValues={{password: '', confirm_password: ''}}
                    onSubmit={values => userData ? resetPassword(values) : userChangePassword(values)}
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
                            <Text className='text-2xl font-bold m-4 text-slate-900'>Change Password</Text>
                            <View className="flex flex-col space-y-4 w-full">
                                <View>
                                    <View className="flex-row justify-center items-center">
                                        <TextInput
                                            className='flex-1 bg-white border border-black rounded-lg h-12 px-4'
                                            name="password"
                                            placeholder="Enter your password"
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            secureTextEntry={hidePass ? true : false}/>
                                        <TouchableOpacity
                                            className="absolute right-2"
                                            activeOpacity={0.8}
                                            onPress={() => setHidePass(!hidePass)}>
                                            <FontAwesome5 name={hidePass ? 'eye-slash' : 'eye'} size={24}
                                                          color="black"/>
                                        </TouchableOpacity>
                                    </View>
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
                            </View>

                            <Pressable
                                className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'
                                onPress={() => {
                                    handleSubmit()
                                }}
                            >
                                <View className='flex-1 flex items-center'>
                                    <Text className='text-white text-base font-medium'>Submit</Text>
                                </View>
                            </Pressable>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangePasswordScreen;
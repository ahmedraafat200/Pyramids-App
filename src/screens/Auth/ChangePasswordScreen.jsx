import React, {useContext, useState} from "react";
import {
    Alert,
    ImageBackground,
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
import {useNavigation} from "@react-navigation/native";
import i18next from "../../../services/i18next";

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
    const { toggleDrawer,closeDrawer,openDrawer } = useNavigation();

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
                setIsLoading(false);
                if (response.data.status === 'OK'){
                    navigation.navigate('Login');
                }
            })
            .catch(error => {
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
                setIsLoading(false);
                if (response.data.status === 'OK'){
                    navigation.navigate('Home');
                }
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    return (
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../../assets/login-bg.png')}>
            <View className={"flex-row items-center mt-8 px-4"}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain" source={i18next.language === 'ar' ? require('../../../assets/app_bar.jpg') : require('../../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={toggleDrawer} className="absolute left-6">
                    <Image source={require('../../../assets/menu-button.png')}/>
                </Pressable>
            </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1">
            <Spinner visible={isLoading}/>
            {userData ?
                <Steps classNames="pt-10" step={3} totalSteps={3}/> :
                <View></View>}
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
                        <View className="flex-1 justify-between px-10 items-center">
                            <Text style={{
                                fontFamily: 'BoldFont',
                            }} className='text-2xl font-bold m-4 text-slate-900'></Text>
                            <View className="flex flex-col space-y-4 w-full">
                                <View>
                                    <View className="flex-row justify-center items-center">
                                        <TextInput
                                            style={{
                                                fontFamily: 'LightFont',
                                            }}
                                            className='flex-1 bg-white border border-black rounded-lg h-12 px-4'
                                            name="password"
                                            placeholder={t('enterYourPassword')}
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
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.password}</Text>
                                    }
                                </View>
                                <View>
                                    <TextInput
                                        style={{
                                            fontFamily: 'LightFont',
                                        }}
                                        className='bg-white border border-black rounded-lg h-12 px-4'
                                        name="confirm_password"
                                        placeholder={t('confirmPassword')}
                                        placeholderTextColor="#000"
                                        onChangeText={handleChange('confirm_password')}
                                        onBlur={handleBlur('confirm_password')}
                                        value={values.confirm_password}
                                        secureTextEntry
                                    />
                                    {errors.confirm_password &&
                                        <Text style={{
                                            fontFamily: 'LightFont',
                                        }} className='px-4'
                                              style={{fontSize: 10, color: 'red'}}>{errors.confirm_password}</Text>
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
                            {/*        }} className='text-white text-base font-medium'>{t('submit')}</Text>*/}
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
                                        }} className='text-white text-base font-medium'>{t('submit')}</Text>
                                    </View>
                                </Pressable>
                            </ImageBackground>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ChangePasswordScreen;
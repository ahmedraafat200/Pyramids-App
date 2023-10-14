import React, {useContext, useState} from "react";
import {Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {AuthContext} from "../context/AuthContext";
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import axiosInstance from "../axiosInstance";
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import {AntDesign} from "@expo/vector-icons";


const registerValidationSchema = yup.object().shape({
    guest_name: yup
        .string()
        .required('Guest name is required'),
    guest_ride: yup
        .string()
        .required('Guest ride is required'),
});

const OneTimePassScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState({});
    const viewShot = React.useRef();

    const captureAndShareScreenshot = () => {
        viewShot.current.capture().then((uri) => {
            Sharing.shareAsync("file://" + uri);
        }),
            (error) => console.error("Oops, snapshot failed", error);
    };


    function generateCode(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        axiosInstance.post(`/create_one_time_pass.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                console.log(response.data)
                if (response.data.status === 'OK') {
                    setCode(response.data);
                }
                setIsLoading(false);
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
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {code.qrcode ?
                    <View className="flex-1 justify-between px-10 items-center bg-white">
                        <ViewShot className="flex-1 w-full"
                            ref = {viewShot}
                            options={{format: "jpg", quality: 0.9}}
                        >
                            <Image className="flex-1 w-full"
                                   resizeMode={"contain"}
                                   source={{uri: 'data:image/png;base64,' + code.qrcode}}/>
                        </ViewShot>

                        <Pressable
                            className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-4 px-6'
                            onPress={captureAndShareScreenshot}
                        >
                            <View className='flex-row items-center w-full justify-center space-x-2'>
                                <Text className='text-white text-base font-medium'>Share</Text>
                                <AntDesign name="sharealt" size={20} color="white" />
                            </View>
                        </Pressable>
                    </View> :
                    <Formik
                        validationSchema={registerValidationSchema}
                        initialValues={{guest_name: '', guest_ride: ''}}
                        onSubmit={values => generateCode(values)}
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
                                <View className="flex flex-col space-y-4 mt-10 w-full">
                                    <View>
                                        <TextInput
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="guest_name"
                                            placeholder="Enter guest name"
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
                                            name="guest_ride"
                                            placeholder="Enter guest ride"
                                            placeholderTextColor="#000"
                                            onChangeText={handleChange('guest_ride')}
                                            onBlur={handleBlur('guest_ride')}
                                            value={values.guest_ride}
                                        />
                                        {errors.guest_ride &&
                                            <Text className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.guest_ride}</Text>
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
                                        <Text className='text-white text-base font-medium'>Invite</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    </Formik>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default OneTimePassScreen;
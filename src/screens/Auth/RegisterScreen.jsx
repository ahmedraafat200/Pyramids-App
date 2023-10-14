import React, {useContext, useEffect, useState} from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView, ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {useTranslation} from "react-i18next";
import {Formik} from "formik";
import * as yup from "yup";
import {FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import Steps from "../../components/Steps";
import userImage from "../../../assets/user.png";
import axiosInstance from "../../axiosInstance";
import Spinner from "react-native-loading-spinner-overlay";

const registerValidationSchema = yup.object().shape({
    first_name: yup
        .string()
        .required('First name is required'),
    last_name: yup
        .string()
        .required('Last name is required'),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email'),
    confirm_email: yup.string()
        .oneOf([yup.ref('email'), null], 'Emails must match'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must contain at least 8 characters'),
    confirm_password: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    phone: yup
        .string()
        .matches(/^01[0125][0-9]{8}$/, 'Phone number must be valid')
        .required('Phone number is required'),
});

const RegisterScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false)
    const [hidePass, setHidePass] = useState(true);
    const profile = Image.resolveAssetSource(userImage).uri;
    const [selectedImage, setSelectedImage] = useState(profile);
    const role = route.params.role;

    function registerOwner(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        inputData = {
            ...inputData,
            ...route.params.validationData
        }
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('role', role ?? 'owner');
        formData.append('token', '');

        if (selectedImage !== profile){
            const fileName = selectedImage.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('userPhoto', {
                uri: selectedImage,
                name: fileName,
                type: `image/${fileType}`
            });
        }

        const url = role ? '/register_with_code.php'  : '/register_owner.php';
        axiosInstance.post(url, formData, {
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

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, Camera roll permissions are required to make this work!');
                }
            }
        })();
    }, []);

    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.2,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
        className="flex-1">
            <Spinner visible={isLoading}/>
            <Steps classNames="pt-10 bg-white" step={role ? 3 : 2} totalSteps={role ? 3 : 2}/>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    <Formik
                        validationSchema={registerValidationSchema}
                        initialValues={{first_name: '', last_name: '', email: '', phone: '', password: ''}}
                        onSubmit={values => registerOwner(values)}
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
                                <Text className='text-2xl font-bold m-4 text-slate-900'>{t('personalInformation')}</Text>

                                <View className="flex flex-col space-y-4 w-full">
                                    <View
                                        style={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <TouchableOpacity onPress={handleImageSelection}>
                                            <Image
                                                source={{ uri: selectedImage }}
                                                style={{
                                                    height: 100,
                                                    width: 100,
                                                    borderRadius: 85,
                                                    borderWidth: 2,
                                                    borderColor: 'black',
                                                }}
                                            />

                                            <View
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 5,
                                                    zIndex: 9999,
                                                }}
                                            >
                                                <MaterialIcons
                                                    name="photo-camera"
                                                    size={24}
                                                    color={"gray"}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex flex-row space-x-2">
                                        <View className="flex-1">
                                            <TextInput
                                                className='bg-white border border-black rounded-lg h-12 px-4'
                                                name="first_name"
                                                placeholder={t('firstName')}
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
                                                placeholder={t('lastName')}
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
                                            name="phone"
                                            placeholder={t('enterYourPhoneNumber')}
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
                                    <View>
                                        <TextInput
                                            className='bg-white border border-black rounded-lg h-12 px-4'
                                            name="email"
                                            placeholder={t('enterYourEmail')}
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
                                            placeholder={t('confirmEmail')}
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
                                        <View className="flex-row justify-center items-center">
                                            <TextInput
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
                                            <Text className='px-4'
                                                  style={{fontSize: 10, color: 'red'}}>{errors.password}</Text>
                                        }
                                    </View>
                                    <View>
                                        <TextInput
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
                                        <Text className='text-white text-base font-medium'>{t('submit')}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
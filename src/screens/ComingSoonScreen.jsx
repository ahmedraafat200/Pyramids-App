import React, {useContext, useState} from "react";
import {
    Image, ImageBackground,
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
import i18next from "../../services/i18next";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const registerValidationSchema = yup.object().shape({
    rent_from: yup
        .string()
        .required('From date is required'),
    rent_to: yup
        .string()
        .required('To Date is required'),
});

const ComingSoonScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState({});
    const {toggleDrawer, closeDrawer, openDrawer, goBack} = useNavigation();

    const shareInvitation = () => {
        Share.share({
            message: t('youCanUseThisCodeToLoginAndCreateYourAccountCode', {code: code.code})
        })
    };

    const initialValues = {
        rent_from: '',
        rent_to: ''
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
                if (!values.rent_from){
                    setFieldError('rent_from', 'Start date is required')
                }
                if (!values.rent_to){
                    setFieldError('rent_to', 'End Date is required')
                }
                if (values.rent_from && values.rent_to){
                    generateCode(values)}
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
        setFieldValue("rent_from", currentDate)
    };

    const showDatepickerFromDate = () => {
        setShowFromDate(true);
    };

    const onChangeToDate = (date) => {
        const currentDate = date.toLocaleDateString("fr-CA");
        setShowToDate(false);
        setDate(currentDate);
        setFieldValue("rent_to", currentDate)
    };

    const showDatepickerToDate = () => {
        setShowToDate(true);
    };


    function generateCode(inputData) {
        setIsLoading(true);
        let formData = new FormData();
        Object.keys(inputData).forEach(fieldName => {
            formData.append(fieldName, inputData[fieldName]);
        })
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('invitaion_type', 'renter');
        axiosInstance.post(`/create_invitation_family_renter.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    setCode(response.data);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    return (
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../assets/login-bg.png')}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            className="flex-1 justify-center items-center">
            <Spinner visible={isLoading}/>
            <View>
                <Text style={{
                    fontFamily: 'BoldFont',
                }} className={"text-lg"}>Coming Soon</Text>
            </View>
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ComingSoonScreen;
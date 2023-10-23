import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Button, Dimensions, Image, Share, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {AntDesign, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import axiosInstance from "../axiosInstance";
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {use} from "i18next";
import {useTranslation} from "react-i18next";

const ScreenWidth = Dimensions.get("window").width;

const HomeScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const [accessData, setAccessData] = useState({})

    function generateFamilyCode() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('invitaion_type', 'family');
        axiosInstance.post(`/create_invitation_family_renter.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    Share.share({
                        message: t('youCanUseThisCodeToLoginAndCreateYourAccountCode', {code: response.data.code})
                    })
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    function userAccess() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);

        axiosInstance.post(`/user_identity.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                setIsLoading(false);
                setAccessData(response.data.data);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    const userAccessModalRef = useRef(null);
    const inviteModalRef = useRef(null);

    // callbacks
    const handleUserAccessModalPress = useCallback(() => {
        userAccess();
        userAccessModalRef.current?.present();
    }, []);

    const handleInviteModalPress = useCallback(() => {
        inviteModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index) => {
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={1}
            />
        ),
        []
    );

    useEffect(() => {
        // getRemainingPayment();
        // getNextSession();
    }, [])

    return (
        <View className='flex-1 bg-white space-y-2'>
            <Spinner visible={isLoading}/>
            <View className='bg-gray-50 rounded-xl max-w-full px-4 py-6 mx-2 mt-3 mb-1'
                  style={[
                      styles.cardShadow
                  ]}
            >
                <View className='flex-row py-1 px-2 items-center'>
                    <Text className='text-base'>
                        {t('welcome')}
                    </Text>
                    <Text className='text-lg text-black font-bold capitalize'>
                        {user.first_name}
                    </Text>
                    <View className='ml-auto'>
                        <MaterialCommunityIcons name="hand-wave-outline" size={30} color="black"/>
                    </View>
                </View>
            </View>
            <View className='flex-row justify-center items-center space-x-4'>
                <TouchableOpacity
                    onPress={handleUserAccessModalPress}>
                    <View
                        className='bg-gray-50 rounded-xl py-2 my-2'
                        style={[
                            styles.cardShadow, styles.item
                        ]}
                    >
                        <View className='py-1 items-center space-y-2'>
                            <View className=''>
                                <MaterialCommunityIcons name="cellphone-key" size={35} color="black"/>
                            </View>
                            <Text className='text-base font-medium '>
                                {t('myAccess')}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleInviteModalPress}>
                    <View
                        className='bg-gray-50 rounded-xl py-2 my-2'
                        style={[
                            styles.cardShadow, styles.item
                        ]}
                    >
                        <View className='py-1 items-center space-y-2'>
                            <View className=''>
                                <SimpleLineIcons name="envelope-letter" size={34} color="black"/>
                            </View>
                            <Text className='text-base font-medium '>
                                {t('invite')}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Invitations')}
                >
                    <View
                        className='bg-gray-50 rounded-xl py-2 my-2'
                        style={[
                            styles.cardShadow, styles.item
                        ]}
                    >
                        <View className='py-1 items-center space-y-2'>
                            <View className=''>
                                <MaterialIcons name="insert-invitation" size={35} color="black"/>
                            </View>
                            <Text className='text-base font-medium '>
                                {t('invitations')}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


            <BottomSheetModalProvider>
                <View className="flex-1 p-24 justify-center">
                    <BottomSheetModal
                        ref={userAccessModalRef}
                        index={1}
                        snapPoints={useMemo(() => ['25%', '75%'], [])}
                        backdropComponent={renderBackdrop}
                        onChange={handleSheetChanges}
                    >
                        <View className="flex-1 items-center space-y-1">
                            {accessData.first_name ?
                                <>
                                    <Text
                                        className="capitalize text-xl font-medium">{accessData.first_name + ' ' + accessData.last_name}</Text>
                                    <Text
                                        className="text-base font-medium">{accessData.project + ' - ' + accessData.unit}</Text>
                                    <Image className="flex-1 w-full"
                                           resizeMode={"contain"}
                                           source={{uri: 'data:image/png;base64,' + accessData.qrcode}}/>
                                </> : null
                            }
                        </View>
                    </BottomSheetModal>
                </View>

                <View className="flex-1 p-6 justify-center">
                    <BottomSheetModal
                        ref={inviteModalRef}
                        index={1}
                        snapPoints={useMemo(() => ['25%', '60%'], [])}
                        backdropComponent={renderBackdrop}
                        onChange={handleSheetChanges}
                    >
                        <View className="flex-1 justify-center px-6 space-y-3">
                            {user.role === "owner" &&
                                <View className="space-y-3">
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('TimedPass')}
                                    >
                                        <View
                                            className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                        >
                                            <Text className='self-center text-base font-medium '>
                                                {t('tenant')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => generateFamilyCode()}
                                    >
                                        <View
                                            className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                        >
                                            <Text className='self-center text-base font-medium '>
                                                {t('family')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            <TouchableOpacity
                                onPress={() => navigation.navigate('OneTimePass')}
                            >
                                <View
                                    className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                >
                                    <Text className='self-center text-base font-medium '>
                                        {t('oneTimePass')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('GatePermission')}
                            >
                                <View
                                    className='w-full justify-center rounded-xl px-3 h-16 border-gray-300 border'
                                >
                                    <Text className='self-center text-base font-medium '>
                                        {t('gatePermission')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    item: {
        width: (ScreenWidth - 32) / 3 - 6,
    }
});

export default HomeScreen;
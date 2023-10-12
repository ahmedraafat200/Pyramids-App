import React, {useContext, useEffect, useState} from "react";
import {Button, Dimensions, StyleSheet, Text, View} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {AntDesign, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import axiosInstance from "../axiosInstance";

const ScreenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
    const {user, isLoading} = useContext(AuthContext);
    const [remaining, setRemaining] = useState(0);
    const [nextSession, setNextSession] = useState({});

    function getRemainingPayment() {
        axiosInstance.get(`/student/remaining`,
            {
                headers: {Authorization: `Bearer ${user.access_token}`}
            })
            .then(response => {
                setRemaining(response.data.data);
                console.log(remaining, 'remaining')
            })
            .catch(error => {
                console.log(error, 'remaining error')
            })
    }

    function getNextSession() {
        axiosInstance.get(`/student/next-session`,
            {
                headers: {Authorization: `Bearer ${user.access_token}`}
            })
            .then(response => {
                setNextSession(response.data);
                console.log(nextSession, 'nextSession')
            })
            .catch(error => {
                console.log(error, 'nextSession error')
            })
    }

    useEffect(() => {
        getRemainingPayment();
        getNextSession();
    }, [])

    return (
        <View className='flex-1 justify-between'>
            {/*<Spinner visible={isLoading} />*/}
            <View>
                <View className='bg-white rounded-xl max-w-full px-4 py-6 mx-2 mt-3 mb-1'
                    style={[
                        styles.cardShadow
                    ]}
                >
                    <View className='flex-row py-1 px-2 items-center'>
                        <Text className='text-base'>
                            {'Welcome '}
                        </Text>
                        <Text className='text-base text-sky-600 font-bold'>
                            {user.user.name}
                        </Text>
                        <View className='ml-auto'>
                            <MaterialCommunityIcons name="hand-wave-outline" size={30} color="#0284c7" />
                        </View>
                    </View>
                </View>
                <View className='flex-row'>
                    <View
                        className='bg-white rounded-xl max-w-full px-2 py-2 ml-2 mr-1 my-1 justify-between'
                        style={[
                            styles.cardShadow, styles.item
                        ]}
                    >
                        <View className='flex-row py-1 items-center'>
                            <Text className='text-xs'>
                                Remaining Payment
                            </Text>
                            <View className='ml-auto'>
                                <MaterialIcons name="payments" size={24} color="#0284c7"/>
                            </View>
                        </View>

                        <View className='flex-row py-1 items-end'>
                            <Text className='text-sm font-bold'>
                                {'EGP '}
                            </Text>
                            <Text className='text-xl font-bold'>
                                {new Intl.NumberFormat('en-EG').format(remaining)}
                            </Text>
                        </View>
                    </View>

                    <View
                        className='bg-white rounded-xl max-w-full px-2 py-2 ml-2 mr-1 my-1 justify-between'
                        style={[
                            styles.cardShadow, styles.item
                        ]}
                    >
                        <View className='flex-row py-1 items-center'>
                            <Text className='text-xs'>
                                Upcoming Session
                            </Text>
                            <View className='ml-auto'>
                                <AntDesign name="calendar" size={24} color="#0284c7" />
                            </View>
                        </View>

                        <View className='py-1 items-end'>
                            {nextSession ? (
                                <>
                                <Text className='text-sm font-bold'>
                                    {nextSession.day + ' at ' + nextSession.from_time}
                                </Text>
                                <Text className='text-xs font-bold text-gray-500'>
                                    {nextSession.humanDate}
                                </Text>
                                </>
                                )
                                : (
                                <Text className='text-sm font-bold'>
                                No Scheduled Session
                                </Text>
                                )}
                        </View>
                    </View>

                </View>
            </View>

            <View className='bg-sky-100 rounded-xl max-w-full px-4 py-6 mx-1 my-2'>
                <Text className='text-base'>
                    Please note that the application is undergoing development, and this is the first prototype.
                </Text>
            </View>
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
        elevation: 5,
    },
    item: {
        width: (ScreenWidth - 24) / 2 - 2,
    }
});

export default HomeScreen;
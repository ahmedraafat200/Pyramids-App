import React, {useContext} from "react";
import {Button, Pressable, StyleSheet, Text, View} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {SafeAreaView} from "nativewind/dist/preflight";
import i18next from "../../services/i18next";
import {useTranslation} from "react-i18next";

const ProfileScreen = () => {
    const {t} = useTranslation();
    const {isLoading, logout} = useContext(AuthContext);
    return (
        // <SafeAreaView className={`flex-1 w-full bg-gray-950`}>
        //     <View className={`flex-1 items-center justify-center gap-8`}>
        //         {/*<Avatar source={{ uri: "https://source.unsplash.com/random" }} />*/}
        //         <View className={`gap-2 items-center`}>
        //             <Text className={`text-gray-50 text-3xl font-bold`}>
        //                 Joe Bloggs
        //             </Text>
        //             <Text className={`text-gray-50 text-lg`}>joe@bloggs.com</Text>
        //         </View>
        //     </View>
        //     <View className={`flex-1 justify-center gap-8`}>
        //         <Pressable className={`flex-row items-center gap-2 px-8`}>
        //             <Ionicons name="settings-outline" size={24} color="#fff" />
        //             <Text className={`text-gray-50 text-lg`}>Settings</Text>
        //         </Pressable>
        //         <Pressable className={`flex-row items-center gap-2 px-8`}>
        //             <Ionicons name="help-buoy-outline" size={24} color="#fff" />
        //             <Text className={`text-gray-50 text-lg`}>Help</Text>
        //         </Pressable>
        //         <Pressable className={`flex-row items-center gap-2 px-8`}>
        //             <MaterialIcons name="logout" size={24} color="#fff" />
        //             <Text className={`text-gray-50 text-lg`}>Logout</Text>
        //         </Pressable>
        //     </View>
        // </SafeAreaView>
        <View className={('flex-1 items-center justify-center bg-slate-50')}>
            {/*<Spinner visible={isLoading} />*/}
            <View className={('p-8 w-full max-w-sm')}>
            <Pressable
                className={('h-12 bg-blue-500 rounded-md flex flex-row justify-center items-center px-6')}
                onPress={() => {
                    logout()
                }}
            >
                <View className={('flex-1 flex items-center')}>
                    <Text className={('text-white text-base font-medium')}>Logout</Text>
                </View>
            </Pressable>
            </View>
        </View>
    );
};

export default ProfileScreen;
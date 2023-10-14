import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {FontAwesome5, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {SafeAreaView} from "nativewind/dist/preflight";
import i18next from "../../services/i18next";
import {useTranslation} from "react-i18next";
import axiosInstance from "../axiosInstance";
import {use} from "i18next";
import userImage from "../../assets/user.png";
import {StatusBar} from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({})
    const [relatedData, setRelatedData] = useState({})
    const profile = Image.resolveAssetSource(userImage).uri;
    const [selectedImage, setSelectedImage] = useState(profile);
    const [updateProfile, setUpdateProfile] = useState(false)

    function updateProfilePicture() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);

            const fileName = selectedImage.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('userPhoto', {
                uri: selectedImage,
                name: fileName,
                type: `image/${fileType}`
            });

        axiosInstance.post('/user_change_photo.php', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(async response => {
                setIsLoading(false);
                setUpdateProfile(false);
                getUserData();
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            })
    }

    function getUserData() {
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        axiosInstance.post(`/user_account_data.php`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => {
                setUserData(response.data.data);
                if (user.role === 'owner'){
                    setRelatedData(response.data.relatedData.family.concat(response.data.relatedData.renter));
                }
            })
            .catch(error => {
                // console.log(error);
            })
    }

    useEffect(() => {
        getUserData();

        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, Camera roll permissions are required to make this work!');
                }
            }
        })();
    }, [])

    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.2,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setUpdateProfile(true);
        }
    };

    const renderRelated = ({item}) => (
            <View className='bg-gray-50 rounded-xl max-w-full px-2 py-3 m-2'
                  style={[
                      styles.cardShadow
                  ]}
            >
                <View className='flex-row py-1 px-1 items-center'>
                    <View className="space-y-1">
                        <View className="flex-row items-center">
                            <Text className='text-base text-black font-bold capitalize'>
                                {item.first_name + ' ' + item.last_name}
                            </Text>
                        </View>
                        <View className="flex-row space-x-1 items-center">
                            <Text
                                className="bg-gray-900 text-white py-1 px-4 rounded-full text-sm font-bold capitalize">
                                {item.source}
                            </Text>
                            <Text
                                className="bg-gray-600 text-white py-1 px-4 rounded-full text-sm font-bold capitalize">
                                {item.userstatus}
                            </Text>
                        </View>
                    </View>
                    <View className='ml-auto'>
                        <Image
                            source={{
                                uri: item.userPhoto !== "" ? item.userPhoto : profile,
                            }}
                            resizeMode="contain"
                            style={{width: 60, height: 60, borderRadius: 30}}
                        />
                    </View>
                </View>
            </View>
    );

    return (
        <View className="flex-1 px-10 items-center bg-white space-y-2 divide-y-2 divide-gray-400">
            <View className="flex flex-col w-full items-center">
                    <TouchableOpacity onPress={handleImageSelection}>
                        <Image
                            source={{ uri: updateProfile ? selectedImage : userData.userPhoto}}
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 85,
                                borderWidth: 2,
                                borderColor: 'black',
                                marginBottom: 10
                            }}
                        />
                    </TouchableOpacity>
                <Text className="text-xl font-bold capitalize">{userData.first_name + ' ' + userData.last_name}</Text>
                <Text className="text-lg font-medium capitalize">{userData.email}</Text>
                <Text className="text-lg font-normal capitalize">{userData.unit}</Text>
                { updateProfile &&
                    <Pressable
                        className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-1 px-6'
                        onPress={() => {
                            updateProfilePicture()
                        }}
                    >
                        <View className='flex-1 flex items-center'>
                            <Text className='text-white text-base font-medium'>Update Picture</Text>
                        </View>
                    </Pressable>
                }
            </View>
            <View className="flex flex-col w-full">
                <FlatList
                    data={relatedData}
                    renderItem={renderRelated}
                    keyExtractor={item => item.email}
                />
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
        elevation: 3,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: StatusBar.currentHeight,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
});

export default ProfileScreen;
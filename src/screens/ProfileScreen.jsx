import React, {useContext, useEffect, useState} from "react";
import {
    Alert,
    Button,
    FlatList, I18nManager,
    Image, ImageBackground,
    Platform,
    Pressable, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {useTranslation} from "react-i18next";
import axiosInstance from "../axiosInstance";
import userImage from "../../assets/user.png";
import {StatusBar} from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as Updates from "expo-updates";
import * as SecureStore from "expo-secure-store";
import * as ImageManipulator from "expo-image-manipulator";
import {useNavigation} from "@react-navigation/native";
import i18next from "../../services/i18next";
import {array} from "yup";
import RNRestart from "react-native-restart";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user, setUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null)
    const [relatedData, setRelatedData] = useState({})
    const profile = Image.resolveAssetSource(userImage).uri;
    const [selectedImage, setSelectedImage] = useState(profile);
    const [updateProfile, setUpdateProfile] = useState(false)
    const {toggleDrawer, closeDrawer, openDrawer} = useNavigation();

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
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(async response => {
                await SecureStore.setItemAsync('user', JSON.stringify(response.data));
                getUserData();
                setIsLoading(false);
                setUpdateProfile(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    function getUserData() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        axiosInstance.post(`/user_account_data.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                setUserData(response.data.data);
                if (user.role === 'owner') {
                    setRelatedData(response.data.relatedData.family.concat(response.data.relatedData.renter));
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    function deleteAccount() {
        setIsLoading(true);
        let formData = new FormData();
        console.log(user.email)
        formData.append('email', user.email);
        formData.append('description', 'Delete my account');
        axiosInstance.post(`/request_account_deletion.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                console.log(response.data)
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error)
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getUserData();

        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

            const resizedPhoto = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{resize: {width: 600}}], // resize to width of 300 and preserve aspect ratio
                {compress: 0.5, format: 'jpeg'},
            );
            setSelectedImage(resizedPhoto.uri);
            setUpdateProfile(true);
        }
    };

    const renderRelated = ({item}) => (
        <View className='bg-gray-50 rounded-xl max-w-full px-2 py-3 my-1 mx-2'
              style={[
                  styles.cardShadow
              ]}
        >
            <View className='flex-row py-1 px-1 items-center'>
                <View className="space-y-1">
                    <View className="flex-row items-center">
                        <Text style={{
                            fontFamily: 'BoldFont',
                        }} className='text-base text-black font-bold capitalize'>
                            {item.first_name + ' ' + item.last_name}
                        </Text>
                    </View>
                    <View className="flex-row space-x-1 items-center">
                        <Text style={{
                            fontFamily: 'BoldFont',
                        }}
                              className="bg-gray-900 text-white py-1 px-4 rounded-full text-sm font-bold capitalize">
                            {item.source}
                        </Text>
                        <Text style={{
                            fontFamily: 'BoldFont',
                        }}
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
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../assets/login-bg.png')}>
            <View className={"flex-row items-center mb-1 px-4"} style={{paddingTop : insets.top}}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../assets/app_bar.jpg') : require('../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={toggleDrawer} className="absolute left-6" style={{paddingTop : insets.top}}>
                    <Image source={require('../../assets/menu-button.png')}/>
                </Pressable>
            </View>
            <ScrollView className="flex-1 px-4 py-2">
                <Spinner visible={isLoading}/>
                {userData &&
                    <View className="flex-1 w-full">
                        <View className="flex-1 items-center space-y-2 divide-y-2 divide-gray-400">
                            <View className="flex-col w-full items-center">
                                <TouchableOpacity onPress={handleImageSelection}>
                                    <Image
                                        source={{uri: updateProfile ? selectedImage : userData.userPhoto}}
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
                                <Text style={{
                                    fontFamily: 'BoldFont',
                                }}
                                      className="text-xl font-bold capitalize">{userData.first_name + ' ' + userData.last_name}</Text>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className="text-lg font-medium capitalize">{userData.email}</Text>
                                <Text style={{
                                    fontFamily: 'LightFont',
                                }} className="text-lg font-normal capitalize">{userData.unit}</Text>
                                {updateProfile &&
                                    <Pressable
                                        className='h-12 bg-black rounded-md flex flex-row justify-center items-center my-1 px-6'
                                        onPress={() => {
                                            updateProfilePicture()
                                        }}
                                    >
                                        <View className='flex-1 flex items-center'>
                                            <Text style={{
                                                fontFamily: 'LightFont',
                                            }} className='text-white text-base font-medium'>{t('updatePicture')}</Text>
                                        </View>
                                    </Pressable>
                                }
                            </View>
                            <View className="rounded-xl w-fit py-1 px-4">
                                <Pressable
                                    onPress={() => {
                                        i18next.changeLanguage(i18next.language === 'ar' ? 'en' : 'ar')
                                            .then(() => {
                                                I18nManager.allowRTL(i18next.language === 'ar');
                                                I18nManager.forceRTL(i18next.language === 'ar');
                                                RNRestart.restart();
                                            })
                                    }}>
                                    <Image className={'h-10'}
                                           source={i18next.language === 'ar' ? require('../../assets/en.png') : require('../../assets/ar.png')}
                                           resizeMode={"contain"}
                                    />
                                    {/*<Text style={{*/}
                                    {/*    fontFamily: 'LightFont',*/}
                                    {/*}} className='text-white text-base font-medium'>{t('language')}</Text>*/}
                                </Pressable>
                            </View>
                            <View className="flex flex-col w-full">
                                <FlatList
                                    data={relatedData}
                                    renderItem={renderRelated}
                                    keyExtractor={item => item.email}
                                />
                            </View>
                        </View>
                        <ImageBackground
                            className={"rounded-xl h-16 my-1"}
                            source={require('../../assets/button-bg.png')}
                            resizeMode={'contain'}>
                            <Pressable
                                className='h-16 rounded-xl flex flex-row justify-center items-center px-6'
                                onPress={() => {
                                    Alert.alert(
                                        t('deleteConfirmation'),
                                        t('areYouSureYouWantToDeleteYourAccount'),
                                        [
                                            {text: t('no'), style: 'cancel'},
                                            {text: t('yes'), onPress: () => deleteAccount()},
                                        ]
                                    );
                                }}
                            >
                                <View className='flex-1 flex items-center'>
                                    <Text style={{
                                        fontFamily: 'LightFont',
                                    }} className='text-white text-base font-medium'>{t('deleteMyAccount')}</Text>
                                </View>
                            </Pressable>
                        </ImageBackground>
                    </View>
                }
            </ScrollView>
        </ImageBackground>
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
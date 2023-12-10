import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    Alert,
    Button,
    FlatList, I18nManager,
    Image, ImageBackground,
    Platform,
    Pressable, RefreshControl,
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
import {useNavigation} from "@react-navigation/native";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import i18next from "../../services/i18next";
import {useSafeAreaInsets} from "react-native-safe-area-context";


const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user, setUser} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const {toggleDrawer, closeDrawer, openDrawer} = useNavigation();
    const [newsItem, setNewsItem] = useState({})
    const [news, setNews] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false);
    const inviteModalRef = useRef(null);

    const handleInviteModalPress = useCallback((item) => () => {
        setNewsItem(item)
        inviteModalRef.current?.present();
    }, [newsItem, setNewsItem]);

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


    function getHomeData() {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);

        axiosInstance.post(`/get_home_page.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.data) {
                    setNews(response.data.data.news);
                }
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getHomeData();
        // getRemainingPayment();
        // getNextSession();
    }, [])

    const renderNews = ({item}) => (
        <TouchableOpacity
            onPress={handleInviteModalPress(item)}>
            <View className="flex-row gap-4 px-4 py-1">
                <Image className={"w-24 h-24 rounded-xl"} resizeMode="cover" source={{uri: item.itemPhotoUrl}}/>
                {/*<Text className="text-white self-center">01</Text>*/}
                <View className="flex-1">
                    <Text style={{color: '#000000', fontFamily: 'BoldFont'}}
                          className="text-lg text-white">{item.itemTitle}</Text>
                    <Text numberOfLines={3} ellipsizeMode='tail' style={{color: '#7a6f81', fontFamily: 'LightFont'}}
                          className="text-base text-white">{item.itemDescription.trim()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
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
                <View className="flex-1 py-2">
                    <Spinner visible={isLoading}/>
                    <FlatList
                        data={news}
                        renderItem={renderNews}
                        keyExtractor={item => item.itemId}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={() => getHomeData()}/>
                        }/>
                </View>
            </ImageBackground>

            <BottomSheetModalProvider>
                <View className="justify-center">
                    <BottomSheetModal
                        ref={inviteModalRef}
                        index={1}
                        snapPoints={useMemo(() => ['25%', '90%'], [])}
                        backdropComponent={renderBackdrop}
                        onChange={handleSheetChanges}
                    >
                        <View className="flex-1 justify-center px-6 space-y-3">
                            {newsItem.itemTitle &&
                                <>
                                    <Image className={"w-24 h-24 rounded-xl self-center"} resizeMode="cover"
                                           source={{uri: newsItem.itemPhotoUrl}}/>
                                    <View className="flex-1 py-1 items-center">
                                        <Text style={{color: '#000000', fontFamily: 'BoldFont'}}
                                              className="text-lg text-white">{newsItem.itemTitle}</Text>
                                        <Text style={{color: '#7a6f81', fontFamily: 'LightFont'}}
                                              className="text-base text-white">{newsItem.itemDescription}</Text>
                                    </View>
                                </>
                            }
                        </View>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </>
    );
};

export default ProfileScreen;
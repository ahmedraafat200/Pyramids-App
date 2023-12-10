import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    Button,
    Dimensions, FlatList,
    Image,
    ImageBackground, Pressable, RefreshControl, ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {AntDesign, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import axiosInstance from "../axiosInstance";
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {use} from "i18next";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel/src/Carousel";
import {ResizeMode, Video} from "expo-av";
import {navigationRef} from "../RootNavigation";
import i18next from "../../services/i18next";
import PaginationDot from 'react-native-animated-pagination-dot'
import {useSafeAreaInsets} from "react-native-safe-area-context";


const ScreenWidth = Dimensions.get("window").width;

const HomeScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const {toggleDrawer, closeDrawer, openDrawer} = useNavigation();
    const width = Dimensions.get('window').width;
    const [ads, setAds] = useState([])
    const [newsItem, setNewsItem] = useState({})
    const [newsHome, setNewsHome] = useState({})
    const [news, setNews] = useState([])
    const [media, setMedia] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const inviteModalRef = useRef(null);
    const [curPage, setCurPage] = useState(0);
    const [curPageMedia, setCurPageMedia] = useState(0);
    const carouselRef = useRef(null);
    const carouselRefMedia = useRef(null);

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
                    setAds(response.data.data.ads);
                    setNews(response.data.data.news);
                    setMedia(response.data.data.media);
                    setNewsHome(response.data.data.news.pop())
                }
                console.log(newsHome, 'news home')
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

    // const renderNews = ({item}) => (
    //     <TouchableOpacity
    //         onPress={handleInviteModalPress(item)}>
    //         <View className="flex-row gap-4 px-4 py-1">
    //             <Image className={"w-24 h-24 rounded-xl"} resizeMode="cover" source={{uri: item.itemPhotoUrl}}/>
    //             {/*<Text className="text-white self-center">01</Text>*/}
    //             <View className="flex-1">
    //                 <Text style={{color: '#cdc6ce', fontFamily: 'BoldFont'}}
    //                       className="text-lg text-white">{item.itemTitle}</Text>
    //                 <Text numberOfLines={3} ellipsizeMode='tail' style={{color: '#7a6f81', fontFamily: 'LightFont'}}
    //                       className="text-base text-white">{item.itemDescription.trim()}</Text>
    //             </View>
    //         </View>
    //     </TouchableOpacity>
    // );

    return (
        <>
        <ImageBackground className={"flex-1 w-full"}
                         resizeMode='cover'
                         source={require('../../assets/home-bg.png')}>
            <View className={"flex-row items-center mb-1 px-4"} style={{paddingTop : insets.top}}>
                <Image className={"w-full h-16 rounded-2xl"} resizeMode="contain"
                       source={i18next.language === 'ar' ? require('../../assets/app_bar.jpg') : require('../../assets/right-ban-withlogo.jpg')}/>
                <Pressable onPress={toggleDrawer} className="absolute left-6" style={{paddingTop : insets.top}}>
                    <Image source={require('../../assets/menu-button.png')}/>
                </Pressable>
            </View>
            <ScrollView className='flex-1 space-y-2'>
                <Spinner visible={isLoading}/>
                <View className={"px-4"}>
                    <Carousel
                        ref={carouselRef}
                        loop
                        width={width - 32}
                        height={width / 2}
                        autoPlay={true}
                        autoPlayInterval={4000}
                        data={ads}
                        scrollAnimationDuration={2000}
                        onProgressChange={(_offsetProgress, absoluteProgress) => {
                            const currentIndex = carouselRef.current?.getCurrentIndex() || 0;

                            if (absoluteProgress > 0.25 || currentIndex === 0) {
                                setCurPage(currentIndex);
                            }
                        }}
                        renderItem={({item}) => (
                            <View className={"flex-1 justify-center bg-white rounded-xl"}>
                                <Image className={'flex-1 w-full'} source={{uri: item.itemPhotoUrl}}
                                       resizeMode={"contain"}/>
                            </View>
                        )}
                    />
                    <View className={"self-center"}>
                    <PaginationDot
                        activeDotColor={'#cbc19e'}
                        curPage={curPage}
                        maxPage={ads.length}
                    />
                    </View>
                </View>
                <View className={"pb-4"} style={{backgroundColor: '#170922'}}>
                    <View className={"flex-row justify-between items-center"}>
                        <Text style={{color: '#cbc19e', fontFamily: 'BoldFont'}} className={"px-4 py-2 text-lg"}>{t('news')}</Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('News')}}>
                            <Text style={{color: '#cbc19e', fontFamily: 'BoldFont'}} className={"px-4 py-2 text-base"}>{t('readMore')}</Text>
                        </TouchableOpacity>
                    </View>
                    {newsHome.itemTitle && (
                    <TouchableOpacity
                        onPress={handleInviteModalPress(newsHome)}>
                        <View className="flex-row gap-4 px-4 py-1">
                            <Image className={"w-24 h-24 rounded-xl"} resizeMode="cover" source={{uri: newsHome.itemPhotoUrl}}/>
                            {/*<Text className="text-white self-center">01</Text>*/}
                            <View className="flex-1">
                                <Text style={{color: '#cdc6ce', fontFamily: 'BoldFont'}}
                                      className="text-lg text-white">{newsHome.itemTitle}</Text>
                                <Text numberOfLines={3} ellipsizeMode='tail' style={{color: '#7a6f81', fontFamily: 'LightFont'}}
                                      className="text-base text-white">{newsHome.itemDescription.trim()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )}
                    {/*<FlatList*/}
                    {/*    data={news.slice(0, 2)}*/}
                    {/*    renderItem={renderNews}*/}
                    {/*    keyExtractor={item => item.itemId}*/}
                    {/*    refreshControl={*/}
                    {/*        <RefreshControl refreshing={isRefreshing} onRefresh={() => getHomeData()}/>*/}
                    {/*    }/>*/}
                </View>
                <View className={"px-4 mb-5 pb-1"}  style={{backgroundColor: '#63236f'}}>
                    <Text style={{color: '#cbc19e', fontFamily: 'BoldFont'}} className={"py-1 text-lg"}>{t('media')}</Text>
                    <Carousel
                        ref={carouselRefMedia}
                        loop
                        width={width - 32}
                        height={width / 2}
                        autoPlay={true}
                        autoPlayInterval={6000}
                        data={media}
                        scrollAnimationDuration={2000}
                        onSnapToItem={(index) => {
                        }}
                        onProgressChange={(_offsetProgress, absoluteProgress) => {
                            const currentIndex = carouselRefMedia.current?.getCurrentIndex() || 0;

                            if (absoluteProgress > 0.25 || currentIndex === 0) {
                                setCurPageMedia(currentIndex);
                            }
                        }}
                        renderItem={({item}) => (
                            <View className={"flex-1 justify-center "}>
                                <Text style={{color: '#cdc6ce', fontFamily: 'BoldFont'}} className={"py-1 text-lg"}>{item.itemTitle}</Text>
                                <Video
                                    className={"flex-1 w-full rounded-xl"}
                                    ref={video}
                                    // style={styles.video}
                                    source={{
                                        uri: item.itemPhotoUrl,
                                    }}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                                />
                            </View>
                        )}
                    />
                    <View className={"self-center"}>
                        <PaginationDot
                            activeDotColor={'#cbc19e'}
                            curPage={curPageMedia}
                            maxPage={media.length}
                        />
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>

    <BottomSheetModalProvider>
        <View className="justify-center">
            <BottomSheetModal
                ref={inviteModalRef}
                index={1}
                snapPoints={useMemo(() => ['25%', '90%'], [])}
                snapPoints={useMemo(() => ['25%', '90%'], [])}
                backdropComponent={renderBackdrop}
                onChange={handleSheetChanges}
            >
                <View className="flex-1 justify-center px-6 space-y-3">
                    {newsItem.itemTitle &&
                        <>
                        <Image className={"w-24 h-24 rounded-xl self-center"} resizeMode="cover" source={{uri: newsItem.itemPhotoUrl}}/>
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

export default HomeScreen;
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    Animated,
    Button,
    Dimensions,
    FlatList,
    Image, Pressable, RefreshControl, Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from "../context/AuthContext";
import {AntDesign, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import axiosInstance from "../axiosInstance";
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {use} from "i18next";
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {StatusBar} from "expo-status-bar";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import async from "async";
import {useTranslation} from "react-i18next";


const ScreenWidth = Dimensions.get("window").width;

const InvitationsScreen = ({route, navigation}) => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false)
    const [familyInvitations, setFamilyInvitations] = useState([])
    const [tenantInvitations, setTenantInvitations] = useState([])
    const [oneTimeInvitations, setOneTimeInvitations] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const viewShot = useRef();

    const captureAndShareScreenshot = () => {
        viewShot.current.capture().then((uri) => {
            Sharing.shareAsync("file://" + uri);
        });
    };

    const shareInvitation = (code) => {
        Share.share({
            message: t('youCanUseThisCodeToLoginAndCreateYourAccountCode', {code: code})
        })
    };

    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'tenant', title: t('tenant')},
        {key: 'family', title: t('family')},
        {key: 'oneTime', title: t('oneTime')},
    ]);

    const renderTenant = ({item}) => (
        <TouchableOpacity
            onPress={() => shareInvitation(item.code)}
            disabled={item.codeStatus !== 'approved'}>
            <View className='bg-gray-50 rounded-xl max-w-full px-2 py-3 m-2'
                  style={[
                      styles.cardShadow
                  ]}
            >
                <View className='flex-row py-1 px-1 items-center'>
                    <View className="space-y-1">
                        <View className="flex-row items-center">
                            <Text className='text-xs'>
                                {t('generatedAt')}
                            </Text>
                            <Text className='text-sm text-black font-bold capitalize'>
                                {item.generated_at}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className='text-xs'>
                                {t('activeFrom')}
                            </Text>
                            <Text className='text-sm text-black font-bold capitalize'>
                                {item.from}
                            </Text>
                            <Text className='text-xs'>
                                 {t('to')}
                            </Text>
                            <Text className='text-sm text-black font-bold capitalize'>
                                {item.to}
                            </Text>
                        </View>
                    </View>
                    <View className='ml-auto'>
                        <Text
                            className="bg-gray-900 text-gray-100 py-2 px-2 rounded-full text-sm font-bold capitalize">{item.codeStatus}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFamily = ({item}) => (
        <TouchableOpacity
            onPress={() => shareInvitation(item.code)}
            disabled={item.codeStatus !== 'approved'}>
            <View className='bg-gray-50 rounded-xl max-w-full px-2 py-3 m-2'
                  style={[
                      styles.cardShadow
                  ]}
            >
                <View className='flex-row py-1 px-1 items-center'>
                    <View className="space-y-1">
                        <View className="flex-row items-center">
                            <Text className='text-xs'>
                                {t('generatedAt')}
                            </Text>
                            <Text className='text-sm text-black font-bold capitalize'>
                                {item.generated_at}
                            </Text>
                        </View>
                    </View>
                    <View className='ml-auto'>
                        <Text
                            className="bg-gray-900 text-gray-100 py-2 px-2 rounded-full text-sm font-bold capitalize">{item.codeStatus}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderOneTime = ({item}) => (
        <TouchableOpacity
            onPress={() =>
                handleUserAccessModalPress(item.qrcode)}
            disabled={item.codeStatus !== 'approved'}>
            <View className='bg-gray-50 rounded-xl max-w-full px-2 py-3 m-2'
                  style={[
                      styles.cardShadow
                  ]}
            >
                <View className='flex-row py-1 px-1 justify-between items-center'>
                    <View className="space-y-1">
                        <View className="flex-row items-center">
                            <Text className='text-xs'>
                                {t('generatedAt')}
                            </Text>
                            <Text className='text-sm text-black font-bold capitalize'>
                                {item.generated_at}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Text className='text-sm'>
                                    {t('guest')}
                                </Text>
                                <Text className='text-sm text-black font-bold capitalize'>
                                    {item.guest_name}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text className='text-xs'>
                                    {t('ride')}
                                </Text>
                                <Text className='text-sm text-black font-bold capitalize'>
                                    {item.guest_ride}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="">
                        <Text
                            className="bg-gray-900 text-gray-100 py-2 px-2 rounded-full text-sm font-bold capitalize">{item.codeStatus}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const Tenant = () => (
        <View className="flex-1">
            <FlatList
                data={tenantInvitations}
                renderItem={renderTenant}
                keyExtractor={item => item.invitationId}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => getInvitationsByType('renter')} />
                }
            />
        </View>
    );

    const Family = () => (
        <View style={{flex: 1}}>
            <FlatList
                data={familyInvitations}
                renderItem={renderFamily}
                keyExtractor={item => item.invitationId}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => getInvitationsByType('family')} />
                }
            />
        </View>
    );

    const OneTime = () => (
        <View style={{flex: 1}}>
            <FlatList
                data={oneTimeInvitations}
                renderItem={renderOneTime}
                keyExtractor={item => item.invitationId}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => getInvitationsByType('oneTimePass')} />
                }
            />
            <BottomSheetModalProvider>
                <View className="flex-1 justify-center">
                    <BottomSheetModal
                        ref={userAccessModalRef}
                        index={1}
                        snapPoints={useMemo(() => ['25%', '75%'], [])}
                        backdropComponent={renderBackdrop}
                        onChange={handleSheetChanges}
                    >
                        <ViewShot
                            ref = {viewShot}
                            options={{format: "jpg", quality: 0.9}}
                            className="flex-1 items-center space-y-1">
                            <Image className="flex-1 w-full"
                                   resizeMode={"contain"}
                                   source={{uri: 'data:image/png;base64,' + qrCode}}/>
                        </ViewShot>
                        <Pressable
                            className='h-12 bg-black rounded-md flex-row justify-center items-center m-4 px-6'
                            onPress={captureAndShareScreenshot}
                        >
                            <View className='flex-row items-center w-full justify-center space-x-2'>
                                <Text className='text-white text-base font-medium'>{t('share')}</Text>
                                <AntDesign name="sharealt" size={20} color="white" />
                            </View>
                        </Pressable>
                    </BottomSheetModal>
                </View>
            </BottomSheetModalProvider>
        </View>
    );

    function handleRefresh(type) {
        // setIsRefreshing(true);
        // getInvitationsByType(type);
    }

    const renderScene = SceneMap({
        tenant: Tenant,
        family: Family,
        oneTime: OneTime
    });

    const renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                activeColor={'white'}
                inactiveColor={'gray'}
                style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'black'}}
            />
        );
    };

    const userAccessModalRef = useRef(null);

    // callbacks
    const handleUserAccessModalPress = useCallback(async (qrCode) => {
        await setQrCode(qrCode);
        userAccessModalRef.current?.present();
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

    function getInvitationsByType(type) {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('role', user.role);
        formData.append('type', type);

        axiosInstance.post(`/get_invitations_by_type.php`, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
            .then(response => {
                if (response.data.status === 'OK') {
                    if (type === 'oneTimePass') {
                        setOneTimeInvitations(response.data.data)
                    } else if (type === 'renter') {
                        setTenantInvitations(response.data.data)
                    } else if (type === 'family') {
                        setFamilyInvitations(response.data.data)
                    }
                }
                setIsRefreshing(false)
                setIsLoading(false);
            })
            .catch(error => {
                setIsRefreshing(false)
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getInvitationsByType('renter');
        getInvitationsByType('family');
        getInvitationsByType('oneTimePass');
    }, [])

    return (
        <View className='flex-1 bg-white'>
            <Spinner visible={isLoading}/>
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{width: layout.width}}
            />
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

export default InvitationsScreen;
import React, {useContext, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {AuthContext} from "../../context/AuthContext";
import {Image} from "react-native-animatable";

const LoginScreen = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const {isLoading, login} = useContext(AuthContext)

    return (
        <View className='flex-1 items-center bg-white'>
            {/*<Spinner visible={isLoading} />*/}
            <View className='p-10 w-full max-w-sm'>
                <View className='items-center h-52 mt-10 py-10'>
                    <Image className={'flex-1 w-full'}
                           source={require('../../../assets/logo.png')}
                           resizeMode="contain"/>
                </View>

                <Text className='text-4xl font-bold mb-6 text-slate-900'>Register</Text>

                <TextInput
                    className='w-full bg-white border border-black rounded-md h-12 px-4 mb-4'
                    value={username}
                    placeholder={"Enter Username"}
                    placeholderTextColor="#000"
                    onChangeText={text => setUsername(text)}
                />
                <TextInput
                    className='w-full bg-white border border-black rounded-md h-12 px-4'
                    value={password}
                    placeholder={"Enter Password"}
                    placeholderTextColor="#000"
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />

                <View className='flex flex-row justify-between items-center my-8'>
                    <Pressable>
                        <Text className='text-black font-bold'>Login By Code</Text>
                    </Pressable>
                    <Pressable>
                        <Text className='text-black font-bold'>Reset password</Text>
                    </Pressable>
                </View>


                <Pressable
                    className='h-12 bg-black rounded-md flex flex-row justify-center items-center px-6'
                    onPress={() => {
                        login(username, password)
                    }}
                >
                    <View className='flex-1 flex items-center'>
                        <Text className='text-white text-base font-medium'>Login</Text>
                    </View>
                </Pressable>

                <View className='flex flex-row justify-center my-8'>
                        <Text className='text-gray-600'>Don't have an account? </Text>
                    <Pressable>
                        <Text className='text-black font-bold'>Signup</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;
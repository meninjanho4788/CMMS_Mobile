import React, { useState, useEffect } from 'react';
import { ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Center } from "native-base";


type LoadScreenProps =
    LoadScreenObj;

interface LoadScreenObj {
    navigation: any;
}
export default function LoadScreen(props: LoadScreenProps) {
  const [apiMaster, setApiMaster] = useState<string>('');
  useEffect(() => {
    defaultAPI();
    retrieveData();
  }, []);

  const defaultAPI = async () => {
    try {
      var value = await AsyncStorage.getItem('apiMaster');
      if (value !== null&&value !== undefined){
      } else {
        AsyncStorage.setItem('apiMaster','http://113.161.240.189:91/');
      }
    } catch (error) {
      AsyncStorage.setItem('apiMaster','http://113.161.240.189:91/');
    }
  };
  const retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('connectStr');
      if (value !== null&&value !== undefined){
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Otp');
      }
    } catch (error) {
      props.navigation.navigate('Otp');
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/bg1.png")} resizeMode="stretch" style={{ height: '100%'}}>
      <Center height={'100%'} width={'100%'}>
        <ActivityIndicator size="large" color="#00ff00" />
        {apiMaster}
      </Center>
    </ImageBackground>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground } from 'react-native';
import { Center, Box , Pressable, Button, Flex, HStack, Text, Input, Modal, useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons'; 
import { useDispatch } from 'react-redux';
import * as ConnectData from '../../store/Connect/Data';

type OtpScreenProps =
    OtpScreenObj;

interface OtpScreenObj {
  navigation: any;
}

export default function OtpScreen(props: OtpScreenProps) {
  let otp1Ref:any = useRef();let otp2Ref:any = useRef();let otp3Ref:any = useRef();let otp4Ref:any = useRef();let otp5Ref:any = useRef();let otp6Ref:any = useRef();
  const [otp1, setOtp1] = useState<string>('');
  const [otp2, setOtp2] = useState<string>('');
  const [otp3, setOtp3] = useState<string>('');
  const [otp4, setOtp4] = useState<string>('');
  const [otp5, setOtp5] = useState<string>('');
  const [otp6, setOtp6] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [apiMaster, setApiMaster] = useState<string>('');
  const toast = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    getLinkAPI();
  }, []);
  const getLinkAPI = async () => {
    try {
      var value = await AsyncStorage.getItem('apiMaster');
      if (value !== null&&value !== undefined){
        setApiMaster(value);
      } else {
        setApiMaster('http://113.161.240.189:91/');
      }
    } catch (error) {
      setApiMaster('http://113.161.240.189:91/');
    }
  };
  const onOtp1Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp1(tempS);
    checkAllInput(1,tempS);
    otp2Ref.focus();
  }
  const onOtp2Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp2(tempS);
    checkAllInput(2,tempS);
    otp3Ref.focus();
  }
  const onOtp3Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp3(tempS);
    checkAllInput(3,tempS);
    otp4Ref.focus();
  }
  const onOtp4Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp4(tempS);
    checkAllInput(4,tempS);
    otp5Ref.focus();
  }
  const onOtp5Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp5(tempS);
    checkAllInput(5,tempS);
    otp6Ref.focus();
  }
  const onOtp6Change = (text:string) => {
    const tempS = text.substr(text.length - 1);
    setOtp6(tempS);
    checkAllInput(6,tempS);
    otp1Ref.focus();
  }
  const checkAllInput = (pos:number,text:string) => {
    let str1 = otp1;let str2 = otp2;let str3 = otp3;let str4 = otp4;let str5 = otp5;let str6 = otp6;
    if(pos===1){
      str1 = text;
    } else if(pos===2){
      str2 = text;
    } else if(pos===3){
      str3 = text;
    } else if(pos===4){
      str4 = text;
    } else if(pos===5){
      str5 = text;
    } else if(pos===6){
      str6 = text;
    }
    if(str1!==''&&str2!==''&&str3!==''&&str4!==''&&str5!==''&&str6!==''){
      // check otp server
    const otpS = (str1) + (str2) + (str3) + (str4) + (str5) + (str6);
    const rowdata = '{ "Otp" : "' + otpS + '" }';
    fetch(apiMaster+'api/select/getotp',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData) => {
        if (responseData[0].Result === 'okie') {
          dispatch(ConnectData.actionCreators.setConnect(responseData[0].ApiLink));
          AsyncStorage.setItem('connectStr',responseData[0].ApiLink);
          AsyncStorage.setItem('OTPName',responseData[0].Name);
          AsyncStorage.setItem('defaultLang',responseData[0].LanguageDefault);
          props.navigation.navigate('Login');
        } else if (responseData[0].Result === 'fail') {
          toast.show({
            render: () => {
              return <Center bg="rgb(254, 205, 211)" height={'50px'} paddingLeft={3} paddingRight={3} rounded="md" mb={5}>
              <Flex direction="row">
                <Entypo name="warning" size={24} color="rgb(190, 18, 60)" />
                <Text paddingLeft={'5px'} fontSize={'md'}>OTP uncorrect.</Text>
              </Flex>
            </Center>;
            },
            placement: "top"
          });
        }
      })
      .catch((err) => {
        alert("Can't connect data master. " + err);
      });
    }
  }
  const btnSetAPI = () => {
    AsyncStorage.setItem('apiMaster',apiMaster);
    setModalVisible(false);
  }
  return (
    <ImageBackground source={require("../../assets/images/bg1.png")} resizeMode="stretch" style={{ height: '100%'}}>
      <Center height={'100%'} width={'100%'}>
        <Text fontSize={'24px'} color={'black'}>Input OTP</Text>
        <Center width={'80%'}>
        <HStack space={2} justifyContent="center">
          <Input keyboardType='numeric' ref={(input) => { otp1Ref = input }} value={otp1} onChangeText={onOtp1Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
          <Input keyboardType='numeric' ref={(input) => { otp2Ref = input }} value={otp2} onChangeText={onOtp2Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
          <Input keyboardType='numeric' ref={(input) => { otp3Ref = input }} value={otp3} onChangeText={onOtp3Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
          <Input keyboardType='numeric' ref={(input) => { otp4Ref = input }} value={otp4} onChangeText={onOtp4Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
          <Input keyboardType='numeric' ref={(input) => { otp5Ref = input }} value={otp5} onChangeText={onOtp5Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
          <Input keyboardType='numeric' ref={(input) => { otp6Ref = input }} value={otp6} onChangeText={onOtp6Change} w="14%" fontSize={'24px'} textAlign={'center'} color={'black'} />
        </HStack>
        </Center>
        <Box position={'absolute'} height={'100%'} width={'100%'}>
          <Box position={'absolute'} bottom={5} right={5}>
          <Pressable onPress={()=>{setModalVisible(true)}}>
            {({ isPressed }) => {
              return <Box style={{ transform: [{ scale: isPressed ? 0.8 : 1 }] }} padding={'20px'}>
              <Entypo name="database" size={36} color="#3645D5" />
            </Box>;
            }}
          </Pressable>
            
            
          </Box>
        </Box>
      </Center>
      <Modal isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size="md">
        <Box height={'200px'} width={'80%'} rounded={'lg'} backgroundColor={'white'}>
          <Box height={'10px'}/>
          <Center>
            <Text fontSize={'22px'} color={'#3645D5'}>Link API Master</Text>
            <Input marginTop={'10px'} value={apiMaster} onChangeText={(text:string)=> setApiMaster(text) } color={'#0000CC'} fontSize={'md'} height={'50px'} width={'90%'} placeholder="Link API Master" />
            <Button onPress={btnSetAPI} marginTop={'20px'}>Update</Button>
          </Center>
        </Box>
      </Modal>
    </ImageBackground>
  );
}

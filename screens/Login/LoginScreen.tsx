import React, { useState, useEffect } from 'react';
import { ImageBackground, BackHandler, Platform, Keyboard, Pressable } from 'react-native';
import { Center, Input, Box, Button, Image, Icon, Text, useToast, Flex, Radio, Checkbox, Link } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { Entypo, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationState } from '../../store';
import * as LoginData from '../../store/Login/Data';
import * as PermissionData from '../../store/Login/Permission';
import * as ConnectData from '../../store/Connect/Data';
import * as LangData from '../../store/Language/Data';
import MyLanguage from '../../store/Language/language';
import ShowAlert from '../../components/Util/Alert';
import * as Updates from 'expo-updates';
type LoginScreenProps =
    LoginScreenObj;

interface LoginScreenObj {
  navigation: any;
}

export default function LoginScreen(props: LoginScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const appVer = useSelector((state: ApplicationState) => state.versionData);
  const dispatch = useDispatch();
  const [txtUser, setTxtUser] = useState<string>('');//Tinh.Dang
  const [txtPass, setTxtPass] = useState<string>('');//!@#
  const toast = useToast();
  const [netInfo, setNetInfo] = useState('');
  const [radioLang, setRadioLang] = useState<string>('VN');
  const [remember, setRemember] = useState<boolean>(false);
  const [rememberStr, setRememberStr] = useState<string>('');
  useEffect(() => {
    onUpdate();
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      retrieveData();
    });
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`,
      );
    });
    return () => {
      unsubscribe();
      willFocusSubscription;
    };
  }, []);
  const defaultLang = async () => {
    try {
      var value = await AsyncStorage.getItem('defaultLang');
      console.log(value+'Default');
      if (value !== null&&value !== undefined){
        setRadioLang(value);
        dispatch(LangData.actionCreators.setLang(MyLanguage(value)));
      } else {
        AsyncStorage.setItem('defaultLang','VN');
        setRadioLang('VN');
        dispatch(LangData.actionCreators.setLang(MyLanguage('VN')));
      }
    } catch (error) {
      AsyncStorage.setItem('defaultLang','VN');
    }
  };
  const onUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        ShowAlert(toast,1,"Updating New App");
        await Updates.reloadAsync();
      }
    } catch (e) {}
  };
  const getNetInfo = () => {
    NetInfo.fetch().then((state) => {
      if(state.isConnected){
        actionLogin(false,"","","","");
      } else {
        ShowAlert(toast,2,"You are disconnected, Please check your wifi !");
      }
    });
  };
  const getRemember = async (strConn: string) => {
    try {
      var value = await AsyncStorage.getItem('remember');
      if (value !== null&&value !== undefined && value!==''){
        // có giá trị
        const obj = JSON.parse(value);
        setTxtUser(obj.UserName);
        setTxtPass(obj.Passwork);
        setRemember(true);
        setRadioLang(obj.Language);
        // NetInfo.fetch().then((state) => {
        //   if(state.isConnected){
        //     actionLogin(true,obj.UserName,obj.Passwork,obj.Language,strConn);
        //   } else {
        //     ShowAlert(toast,2,"You are disconnected, Please check your wifi !");
        //   }
        // });
      } else {
        setTxtUser('');
        setTxtPass('');
        setRemember(false);
        defaultLang();
      }
    } catch (error) {}
  };
  const retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('connectStr');
      if (value !== null&&value !== undefined){
        dispatch(ConnectData.actionCreators.setConnect(value));
        getRemember(value);
      } else {
        props.navigation.navigate('Otp');
      }
    } catch (error) {
      props.navigation.navigate('Otp');
    }
  };
  const btnLogin = () => {
    getNetInfo();
  }
  const radioChange = (text:string) => {
    // const uss = infor?.Infor.UserName===undefined?'':infor?.Infor.UserName;
    // const rowdata = '{ "UserName" : "' + uss + '", "DefaultLanguage" : "' + text + '" }';
    // fetch(connect?.StrCont+'api/modify/modify_login_language',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: rowdata
    //   }).then(response => response.json())
    //   .catch((err) => {
    //   });
    // let tempLG: InforLogin = {
    //   Result: infor?.Infor.Result===undefined?'':infor?.Infor.Result,
    //   UserName: uss,
    //   EmployeeNo: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
    //   GroupUser: infor?.Infor.GroupUser===undefined?'':infor?.Infor.GroupUser,
    //   DefaultLanguage: text,
    //   Role: infor?.Infor.Role===undefined?'':infor?.Infor.Role,
    // };
    // dispatch(LoginData.actionCreators.setLogin(tempLG));
    setRadioLang(text);
    dispatch(LangData.actionCreators.setLang(MyLanguage(text)));
  }
  const actionLogin = (cache: boolean,user: string, pass: string, lang: string,strConn: string) => {
    let tempUserName ='';
    let tempPassword ='';
    let tempConnect = '';
    let tempLang = '';
    if(cache){
      tempUserName=user;
      tempPassword=pass;
      tempConnect = strConn;
      tempLang = lang;
    } else {
      tempUserName=txtUser;
      tempPassword=txtPass;
      tempConnect = connect?.StrCont===undefined?'':connect?.StrCont;
      tempLang = radioLang;
    }
    if(remember){
      let tempLG: InforLogin = {
        UserName: txtUser,
        Passwork: txtPass,
        Language: tempLang
      };
      const myJSON = JSON.stringify(tempLG);
      AsyncStorage.setItem('remember',myJSON);
    } else {
      AsyncStorage.removeItem('remember');
    }
    const rowdata = '{ "Username" : "' + tempUserName + '" , "Password": "' + tempPassword + '" }';
    fetch(tempConnect+'api/select/getlogininformation',
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
          if(remember){
            responseData[0].DefaultLanguage = tempLang;
            const uss = responseData[0].UserName;
            const rowdata2 = '{ "UserName" : "' + uss + '", "DefaultLanguage" : "' + tempLang + '" }';
            fetch(tempConnect+'api/modify/modify_login_language',
              {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: rowdata2
              }).then(response => response.json())
              .catch((err) => {
              });
          }
          dispatch(LoginData.actionCreators.setLogin(responseData[0]));
          dispatch(LangData.actionCreators.setLang(MyLanguage(responseData[0].DefaultLanguage)));
          const perM = responseData[0].GroupUser;
          fetch(tempConnect+'api/select/get_basic_data/Permission/'+perM+'/b/c').then(response2 => response2.json())
            .then((responseData2) => {
              dispatch(PermissionData.actionCreators.setPermission(responseData2));
            })
            .catch((err) => {
              alert(err + ' Lỗi khi get permission');
            });
          props.navigation.navigate('Home');
        } else if (responseData[0].Result === 'username') {
          ShowAlert(toast,2,"Username doesn't exist");
        } else if (responseData[0].Result === 'password') {
          ShowAlert(toast,2,"Password is wrong");
        }
      })
      .catch((err) => {
        ShowAlert(toast,2,"Please check connect string uncorrect."+err);
        AsyncStorage.removeItem('remember');
        AsyncStorage.removeItem('connectStr');
        props.navigation.navigate('Otp');
      });
  }
  const onChangeTxtUser = (value:string) => {
    setTxtUser(value);
  }
  const onChangeTxtPass = (value:string) => {
    setTxtPass(value);
  }
  
  return (
    <ImageBackground source={require("../../assets/images/bg2.png")} resizeMode="stretch" style={{ height: '100%'}}>
      <StatusBar />
      <Center height={'100%'} width={'100%'}>
        <Box width={'60%'}>
          <Center>
            <Image width={'85px'} height={'69px'} source={require("../../assets/images/logoIAS.png")} alt="Alternate Text" resizeMode="contain" />
          </Center>
          <Center paddingTop={'4px'}>
            <Center>
              <Text width={'250px'} textAlign={'center'} bold color={'#0f5d84'} fontSize={radioLang==='VN'?'24px':'34px'}>{mylang?.MyLang.homescreen.menu.appname}</Text>
            </Center>
            
            <Box paddingTop={'4px'}>
              <Flex direction='row'>
                <Pressable onPress={()=>  {
                  setRadioLang('VN');
                  dispatch(LangData.actionCreators.setLang(MyLanguage('VN')));
                }}>
                {
                  radioLang==='VN'?<Box borderRadius={'10px'} borderWidth={'3px'} borderColor={'#E89F19'}>
                  <Image width={'40px'} alt="flagvn" height={'26px'} borderRadius={'3px'} borderWidth={'2px'} resizeMode="contain" source={require("../../assets/images/vnpure.jpg")}></Image>
                  </Box>:
                  <Box marginTop={'3px'}>
                  <Image width={'40px'} alt="flagusa" height={'26px'} borderRadius={'3px'} borderWidth={'2px'} resizeMode="contain" source={require("../../assets/images/vnpure.jpg")}></Image>
                </Box>
                }
                </Pressable>
                <Box width={'10px'}></Box>
                <Pressable onPress={()=>  {
                  setRadioLang('EN');
                  dispatch(LangData.actionCreators.setLang(MyLanguage('EN')));
                }}>
                {
                  radioLang==='EN'?<Box borderRadius={'10px'} borderWidth={'3px'} borderColor={'#E89F19'}>
                  <Image width={'40px'} alt="flagvn" height={'26px'} borderRadius={'3px'} borderWidth={'2px'} resizeMode="contain" source={require("../../assets/images/usapure.jpg")}></Image>
                  </Box>:
                  <Box marginTop={'3px'}>
                  <Image width={'40px'} alt="flagusa" height={'26px'} borderRadius={'3px'} borderWidth={'2px'} resizeMode="contain" source={require("../../assets/images/usapure.jpg")}></Image>
                </Box>
                }
                </Pressable>
              </Flex>
            </Box>
            <Text paddingTop={'8px'} bold color={'#E89F19'} fontSize={'14px'}>{mylang?.MyLang.homescreen.menu.version + ' ' + appVer?.StrVer}</Text>
          </Center>
          <Box height={'60px'} />
          <Box width={'100%'} backgroundColor={'white'} borderRadius={'10px'}>
            <Input borderRadius={'10px'} placeholder={mylang?.MyLang.settingsscreen.main.username} value={txtUser} onChangeText={onChangeTxtUser} height={'50px'} size={'xl'} fontSize={'16px'} w="100%" InputLeftElement={<Icon mx={3} as={<Entypo name="user" color="black" />} size={5} mr="2" color="muted.400" />} />
          </Box>
          <Box height={'4px'} />
          <Box width={'100%'} backgroundColor={'white'} borderRadius={'10px'}>
            <Input borderRadius={'10px'} placeholder={mylang?.MyLang.settingsscreen.main.password} value={txtPass} onChangeText={onChangeTxtPass} height={'50px'} size={'xl'} fontSize={'16px'} w="100%" type="password" InputLeftElement={<Icon mx={3} as={<Entypo name="lock" color="black" />} size={5} mr="2" color="muted.400" />} />
          </Box>
          <Box>
            <Pressable onPress={()=>{
              setRemember(!remember);
            }}>
              <Box height={'50px'}>
                <Flex paddingTop={'12px'} direction='row'>
                  {
                    remember?<Box marginTop={'2px'}><Fontisto name="checkbox-active" size={18} color="#0f5d84" /></Box>:
                    <Box marginTop={'2px'}><Fontisto name="checkbox-passive" size={18} color="#0f5d84" /></Box>
                  }
                  <Text color={'#0f5d84'} paddingLeft={'10px'}>
                    {mylang?.MyLang.settingsscreen.main.ghinho}
                  </Text>
                </Flex>
              </Box>
            </Pressable>
          </Box>
          
          <Button size="xl" borderRadius={'10px'} onPress={btnLogin} height={'50px'} width={'100%'}>
            {mylang?.MyLang.settingsscreen.main.login}
          </Button>
          
          {rememberStr}
          <Box height={'120px'}></Box>
          
        </Box>
      </Center>
      <Box position="absolute" bottom={0} width={'100%'} height={'40px'}>
        <Center>
          
          <Link href="https://solutionias.com/">
            <Text color={'#0f5d84'} fontSize={'12px'}>
              {mylang?.MyLang.homescreen.menu.makeby}
            </Text>
          </Link>
        </Center>
      </Box>
    </ImageBackground>
  );
}
interface InforLogin {
  UserName: string;
  Passwork: string;
  Language: string;
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { StatusBar, BackHandler, ImageBackground, Platform, DrawerLayoutAndroid, View, StyleSheet } from 'react-native';
import { Center, Box ,Image, Pressable, Button, Flex, HStack, VStack, Badge, AlertDialog, Text, useToast, Avatar, Checkbox, Modal, Menu, Divider, Input } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo, FontAwesome, Octicons, Fontisto } from '@expo/vector-icons'; 
import { ApplicationState } from '../../store';
import Layout from '../../constants/Layout';
import CameraScreen from '../Component/CameraScreen';
import * as LoginData from '../../store/Login/Data';
import ShowAlert from '../../components/Util/Alert';
import { useFonts, Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic } from '@expo-google-fonts/roboto';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type HomeScreenProps =
    HomeScreenObj;

interface HomeScreenObj {
  navigation: any;
}

export default function HomeScreen(props: HomeScreenProps) {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const permisson = useSelector((state: ApplicationState) => state.permissionData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const [countR, setCountR] = useState<CountRequest>({ countRepairR: 0, countMaintenanceRNew:0, countMaintenanceR: 0 });
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [lgName, setLgName] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [iconPicture, setIconPicture] = useState('');
  const [modalLogin, setModalLogin] = useState(false);
  const [removeOTP, setRemoveOTP] = useState(false);
  const [passOTP, setPassOTP] = useState('');
  const [nameOTP, setNameOTP] = useState('');

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    const strS = infor?.Infor.UserName===undefined?'':infor?.Infor.UserName;
    let tempS='';
    const arrS = strS.split('.');
    if(arrS.length>0){
      if(arrS.length===1){
        if(arrS[0].length>1){
          tempS = arrS[0].charAt(0)+arrS[0].charAt(1);
        }
      } else {
        tempS = arrS[arrS.length-1].charAt(0)+arrS[0].charAt(0);
      }
      setLgName(tempS.toUpperCase());
    }
    const strPic = infor?.Infor.Picture===undefined?'':infor?.Infor.Picture;
    setIconPicture(strPic);
    // notification register
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      //console.log(response);
    });
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      loopUpdate();
    });
    return willFocusSubscription;
  }, []);
  useEffect(()=>{
    var handle=setInterval(loopUpdate,10000);    
    return ()=>{
      clearInterval(handle);
    }
  });
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      if(infor?.Infor.Token!==token){
        const rowdata = '{ "action": "Token", "EmployeeNo": "'+infor?.Infor.EmployeeNo+'", "Values": "'+token+'" }';
        fetch(connect?.StrCont+'api/modify/modify_user',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: rowdata
          }).then(response => response.json())
          .catch((err) => {
            console.log('loi anyquery:'+err)
          });
        let tempLG: InforLogin = {
          Result: infor?.Infor.Result===undefined?'':infor?.Infor.Result,
          UserName: infor?.Infor.UserName===undefined?'':infor?.Infor.UserName,
          EmployeeNo: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
          GroupUser: infor?.Infor.GroupUser===undefined?'':infor?.Infor.GroupUser,
          DefaultLanguage: infor?.Infor.DefaultLanguage===undefined?'':infor?.Infor.DefaultLanguage,
          Role: infor?.Infor.Role===undefined?'':infor?.Infor.Role,
          Picture: infor?.Infor.Picture===undefined?'':infor?.Infor.Picture,
          Token: token,
          FullName: infor?.Infor.FullName===undefined?'':infor?.Infor.FullName
        };
        dispatch(LoginData.actionCreators.setLogin(tempLG));
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }
  const updateImageLink = (link:string) => {
    const rowdata = '{ "action": "Picture", "EmployeeNo": "'+infor?.Infor.EmployeeNo+'", "Values": "'+link+'" }';
    fetch(connect?.StrCont+'api/modify/modify_user',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .catch((err) => {
        console.log('loi anyquery:'+err)
      });
    let tempLG: InforLogin = {
      Result: infor?.Infor.Result===undefined?'':infor?.Infor.Result,
      UserName: infor?.Infor.UserName===undefined?'':infor?.Infor.UserName,
      EmployeeNo: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
      GroupUser: infor?.Infor.GroupUser===undefined?'':infor?.Infor.GroupUser,
      DefaultLanguage: infor?.Infor.DefaultLanguage===undefined?'':infor?.Infor.DefaultLanguage,
      Role: infor?.Infor.Role===undefined?'':infor?.Infor.Role,
      Picture: link,
      Token: infor?.Infor.Token===undefined?'':infor?.Infor.Token,
      FullName: infor?.Infor.FullName===undefined?'':infor?.Infor.FullName
    };
    setIconPicture(link);
    dispatch(LoginData.actionCreators.setLogin(tempLG));
    setModalVisible(false);
  }
  const loopUpdate = () => {
    countRequest();
    //getNotification();
  }
  const countRequest = () => {
    const rowdata = '{ "EmployeeNo" : "' + infor?.Infor.EmployeeNo + '" , "GroupUser": "' + infor?.Infor.GroupUser + '" }';
    fetch(connect?.StrCont+'api/select/getcountrepairrequest',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData) => {
        setCountR(responseData[0]);
      })
      .catch((err) => {
        
      });
  }
  const getNotification = async () => {
    let tempData:ArrayNotif = [];
    await fetch(connect?.StrCont+'api/select/get_notification_schedule/'+infor?.Infor.EmployeeNo)
      .then(response => response.json())
      .then((responseData:ArrayNotif) => {
        if(responseData.length>0){
          tempData = responseData;
        }
      })
      .catch((err) => {
      });
    if(tempData.length>0){
      tempData.map(async(ci,i)=>{
        await schedulePushNotification(ci.Title,ci.Content);
      })
      const query = "update M_Notification set IsSent=1 where EmployeeCode=N'"+infor?.Infor.EmployeeNo+"'";
      const rowdata = '{ "anyquery" : "' + query + '" }';
      fetch(connect?.StrCont+'api/modify/any_query',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: rowdata
        }).then(response => response.json())
        .then((responseData) => {
          
        })
        .catch((err) => {
          
        });
    }
  }
  function handleBackButtonClick() {
    if(props.navigation.getState(0).index>2){
      props.navigation.goBack();
    }
    return true;
  }
  const btnLogout = () => {
    AsyncStorage.removeItem('remember');
    dispatch(LoginData.actionCreators.removeLogin());
    props.navigation.navigate('Login');
  }
  const btnRemoveOtp = () => {
    if(nameOTP!==undefined&&nameOTP!==''){
      if(nameOTP.split('@')[1]===passOTP){
        AsyncStorage.removeItem('connectStr');
        AsyncStorage.removeItem('remember');
        AsyncStorage.removeItem('defaultLang');
        props.navigation.navigate('Otp');
      } else {
        ShowAlert(toast,2,"Password OTP incorrect !")
      }
    } else {
      AsyncStorage.removeItem('connectStr');
      AsyncStorage.removeItem('remember');
      AsyncStorage.removeItem('defaultLang');
      props.navigation.navigate('Otp');
    }
  }
  const openLogin = async ()  => {
    if(nameOTP===''){
      try {
        var value = await AsyncStorage.getItem('OTPName');
        if (value !== null&&value !== undefined){
          setNameOTP(value);
        } else {
        }
      } catch (error) {
      }

    }
    setModalLogin(true);
  }
  return (
    <ImageBackground source={require("../../assets/images/bg2.png")} resizeMode="stretch" style={{ height: '100%'}}>
    <Box height={'100%'} width={'100%'}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}/>
      <Box height={'100%'} width={'100%'} >
        <Box width={'100%'} height={'120px'}>
          <Box backgroundColor={'#EAEAEA'}>
          <Box height={'50px'} />
            <Flex direction="row">
              <Center>
                <Text paddingLeft={'20px'} width={'250px'} bold color={'#0f5d84'} fontSize={infor?.Infor.DefaultLanguage==='VN'?'20px':'24px'}>{mylang?.MyLang.homescreen.menu.appname}</Text>
              </Center>
              <Center height={'30px'} style={{ position: 'absolute',right: 0, paddingRight: 10, top: infor?.Infor.DefaultLanguage==='VN'?20:4 }}>
              <Pressable onPress={() => {
                openLogin();
                  // if(iconPicture===''){
                  //   setModalVisible(true);
                  // }
                }}>
                  {iconPicture ===''?<Avatar bg="green.500">
                    {lgName}
                  </Avatar>:<Avatar bg="green.500" source={{
                    uri: iconPicture
                  }}>
                    {lgName}
                  </Avatar>}
                </Pressable>
              </Center>
            </Flex>
            <Box height={'20px'} />
          </Box>
        </Box>
        <Center>
          <Box height={'20px'} />
          <VStack space={2} alignItems="center">
            <HStack space={2} justifyContent="center">
              <Pressable onPress={()=>{ props.navigation.navigate('RepairRequest',{rlistOld:false}); }}>
                {({ isPressed }) => {
                  return <Center style={{ transform: [{ scale: isPressed ? 0.9 : 1 }] }} h={125} w={125} rounded={isPressed?"md":"none"}>
                    <Center height={'60px'}>
                      {
                        countR.countRepairR===0?null:<Badge colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{ fontSize: 12 }}>
                          {countR.countRepairR}
                        </Badge>
                      }
                      <Image source={require("../../assets/images/icon/Requestorder.png")} alt="submit error" 
                      resizeMode="contain" width={'48px'} height={'48px'} />
                    </Center>
                    <Box height={'50px'}>
                      <Text textAlign={'center'}>
                        {mylang?.MyLang.homescreen.menu.listrepairrequest}
                      </Text>
                    </Box>
                  </Center>;
                }}
              </Pressable>
              <Pressable onPress={()=>{ props.navigation.navigate('CreateWO'); }}>
              {({ isPressed }) => {
                  return <Center style={{ transform: [{ scale: isPressed ? 0.9 : 1 }] }} h={125} w={125}  rounded={isPressed?"md":"none"}>
                  <Center height={'60px'}>
                    {
                      countR.countMaintenanceRNew===0?null:<Badge colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{ fontSize: 12 }}>
                        {countR.countMaintenanceRNew}
                      </Badge>
                    }
                   <Image source={require("../../assets/images/icon/Maintenanaceplan.png")} alt="submit error" 
                   resizeMode="contain" width={'48px'} height={'48px'} />
                  </Center>
                  <Box height={'50px'}>
                    <Text textAlign={'center'}>
                      {mylang?.MyLang.homescreen.menu.calendar}
                    </Text>
                  </Box>
                  </Center>;
                }}
              </Pressable>
              <Pressable onPress={()=>{ props.navigation.navigate('MRequest'); }}>
                  {({ isPressed }) => {
                    return <Center style={{ transform: [{ scale: isPressed ? 0.9 : 1 }] }} h={125} w={125}  rounded={isPressed?"md":"none"}>
                    <Center height={'60px'}>
                      {
                        countR.countMaintenanceR===0?null:<Badge colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{ fontSize: 12 }}>
                          {countR.countMaintenanceR}
                        </Badge>
                      }
                      <Image source={require("../../assets/images/icon/workorder.png")} alt="submit error" 
                      resizeMode="contain" width={'48px'} height={'48px'} />
                    </Center>
                    <Box height={'50px'}>
                      <Text textAlign={'center'}>
                        {mylang?.MyLang.homescreen.menu.mymaintenance}
                      </Text>
                    </Box>
                    </Center>;
                  }}
                </Pressable>
            </HStack>
            <HStack paddingTop={'20px'} space={2} justifyContent="center">
              <Pressable onPress={()=>{ props.navigation.navigate('History'); }}>
                {({ isPressed }) => {
                  return <Center style={{ transform: [{ scale: isPressed ? 0.9 : 1 }] }} h={125} w={125} rounded={isPressed?"md":"none"}>
                  <Center height={'60px'}>
                  <Image source={require("../../assets/images/icon/Equipmenttracking.png")} 
                  resizeMode="contain" width={'48px'} height={'48px'} />
                  </Center>
                  <Box height={'50px'}>
                      <Text textAlign={'center'}>
                        {mylang?.MyLang.homescreen.menu.equipmenthistory}
                      </Text>
                    </Box>
                </Center>;
                }}
              </Pressable>
              <Center h={125} w={125}/>
              <Center h={125} w={125}/>
            </HStack>
          </VStack>
        </Center>
      </Box>
      <Box height={'50px'}></Box>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{mylang?.MyLang.homescreen.logout.title}</AlertDialog.Header>
          <AlertDialog.Body>
            {mylang?.MyLang.homescreen.logout.question}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                {mylang?.MyLang.homescreen.logout.cancel}
              </Button>
              <Button colorScheme="danger" onPress={btnLogout}>
                {mylang?.MyLang.homescreen.logout.logout}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <CameraScreen btnDeleteImage={()=>{updateImageLink('');}} canDelete={true} location='@images@CMMS@CMMS_CAM@images@User@' btnTurnOffCamera={()=>{setModalVisible(false)}} btnUpdateLink={updateImageLink} chooseImageFromLib={true} navigation={props.navigation}></CameraScreen>
        </Box>
      </Modal>

      <Modal height={Layout.window.height} paddingTop={'400px'} isOpen={modalLogin} onClose={()=>{setModalLogin(false)}} size={'full'}>
        <Box backgroundColor={'white'} height={'100%'} width={'100%'}>
        <HStack space={2} justifyContent="center">
          <Center h={125} w={75} />
          
            <Center h={125} w={225}>
              <Pressable onPress={()=>{
                if(iconPicture===''){
                  setModalVisible(true);
                }
              }}>
              {iconPicture ===''?<Avatar size={'lg'} bg="green.500">
                {lgName}
              </Avatar>:<Avatar size={'lg'} bg="green.500" source={{
                uri: iconPicture
              }}>
                {lgName}
              </Avatar>}
              </Pressable>
              <Text color={'#143D66'} fontSize={'14px'}>
                {infor?.Infor.FullName}
              </Text>
            </Center>
          
          <Pressable>
            <Box h={125} w={75}>
              <Box position={'absolute'} width='100%'>
                <Box position={'absolute'} right={2} top={4}>
                  <Pressable onPress={()=>setModalLogin(false)}>
                    <Text color={'#287ACC'}>
                      {mylang?.MyLang.homescreen.menu.done}
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Box>
          </Pressable>
        </HStack>
        <Divider bgColor={'#F3F3F3'} />
        <Pressable onPress={()=>setModalVisible(true)}>
          <Flex height={'46px'} paddingLeft={'30px'} direction='row'>
            <Box marginTop={'15px'}>
              <Entypo name="images" size={14} color="black" />
            </Box>
            <Box>
              <Text paddingTop={'10px'} paddingLeft={'10px'} fontSize={'14px'}>{mylang?.MyLang.homescreen.menu.avatar}</Text>
            </Box>
          </Flex>
        </Pressable>
        <Divider bgColor={'#F3F3F3'} />
        <Pressable onPress={()=>btnLogout()}>
          <Flex height={'46px'} paddingLeft={'30px'} direction='row'>
            <Box marginTop={'15px'}>
              <Octicons name="sign-out" size={14} color="black" />
            </Box>
            <Box>
              <Text paddingTop={'10px'} paddingLeft={'10px'} fontSize={'14px'}>{mylang?.MyLang.homescreen.menu.signout}</Text>
            </Box>
          </Flex>
        </Pressable>
        <Divider bgColor={'#F3F3F3'} />
        <Pressable onPress={()=>{setRemoveOTP(!removeOTP)}}>
          <Flex height={'46px'} paddingLeft={'30px'} direction='row'>
            <Box marginTop={'15px'}>
              <FontAwesome name="remove" size={14} color="black" />
            </Box>
            <Box>
              <Text paddingTop={'10px'} paddingLeft={'10px'} fontSize={'14px'}>
              {mylang?.MyLang.homescreen.menu.removeotp}, {' '}
                <Text bold color={'#287ACC'}>{nameOTP.split('@')[0]}</Text>
              </Text>
            </Box>
          </Flex>
        </Pressable>
        <Box display={removeOTP===true?'flex':'none'} paddingLeft={'50px'} paddingRight={'50px'}>
        <Input value={passOTP} onChangeText={(values)=>setPassOTP(values)} color={'#000000'} fontSize={'10px'} height={'35px'} 
        InputRightElement={<Button onPress={()=>btnRemoveOtp()} rounded="none" w="2/6" h="full"><Text fontSize={'10px'}>{mylang?.MyLang.homescreen.menu.remove}</Text></Button>} placeholder={mylang?.MyLang.homescreen.menu.inputpassword} />
        </Box>
        </Box>
      </Modal>  
    </Box>
    </ImageBackground>
  );
}
interface CountRequest {
  countRepairR: number;
  countMaintenanceRNew: number;
  countMaintenanceR: number;
}
interface ArrayNotif extends Array<Notif> { }
interface Notif {
  DocEntry: number;
  DocType: string;
  EmployeeCode: string;
  DateSend: string;
  Title: string;
  Content: string;
}
async function schedulePushNotification(titlee:string, contentt: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titlee,
      body: contentt,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}
async function registerForPushNotificationsAsync() {
  // let token;
  // if (Constants.isDevice) {
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  //   console.log(token);


  //   const rowdata = '{ "action": "Picture", "EmployeeNo": "'+infor?.Infor.EmployeeNo+'", "Values": "'+link+'" }';
  //   fetch(connect?.StrCont+'api/modify/modify_user',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body: rowdata
  //     }).then(response => response.json())
  //     .catch((err) => {
  //       console.log('loi anyquery:'+err)
  //     });
  //   let tempLG: InforLogin = {
  //     Result: infor?.Infor.Result===undefined?'':infor?.Infor.Result,
  //     UserName: infor?.Infor.UserName===undefined?'':infor?.Infor.UserName,
  //     EmployeeNo: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
  //     GroupUser: infor?.Infor.GroupUser===undefined?'':infor?.Infor.GroupUser,
  //     DefaultLanguage: infor?.Infor.DefaultLanguage===undefined?'':infor?.Infor.DefaultLanguage,
  //     Role: infor?.Infor.Role===undefined?'':infor?.Infor.Role,
  //     Picture: link,
  //     Token: infor?.Infor.Token===undefined?'':infor?.Infor.Token
  //   };
  //   dispatch(LoginData.actionCreators.setLogin(tempLG));




  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }
  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'default',
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  // }
  // return token;
}
interface InforLogin {
  Result: string;
  UserName: string;
  EmployeeNo: string;
  GroupUser: string;
  DefaultLanguage: string;
  Role: string;
  Picture: string;
  Token: string;
  FullName: string;
}
const styles = StyleSheet.create({
  fRoboto_100Thin: {
    fontFamily: 'Roboto_100Thin'
  },
  fRoboto_100Thin_Italic: {
    fontFamily: 'Roboto_100Thin_Italic'
  },
  fRoboto_300Light: {
    fontFamily: 'Roboto_300Light'
  },
  fRoboto_300Light_Italic: {
    fontFamily: 'Roboto_300Light_Italic'
  },
  fRoboto_400Regular: {
    fontFamily: 'Roboto_400Regular'
  },
  fRoboto_400Regular_Italic: {
    fontFamily: 'Roboto_400Regular_Italic'
  },
  fRoboto_500Medium: {
    fontFamily: 'Roboto_500Medium'
  },
  fRoboto_500Medium_Italic: {
    fontFamily: 'Roboto_500Medium_Italic'
  },
  fRoboto_700Bold: {
    fontFamily: 'Roboto_700Bold'
  },
  fRoboto_700Bold_Italic: {
    fontFamily: 'Roboto_700Bold_Italic'
  },
  fRoboto_900Black: {
    fontFamily: 'Roboto_900Black'
  },
  fRoboto_900Black_Italic: {
    fontFamily: 'Roboto_900Black_Italic'
  },
});
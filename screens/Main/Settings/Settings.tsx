import React, { useState } from 'react';
import { StatusBar, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Center, Button, Box, Text, IconButton, Radio, Image, Flex, AlertDialog } from "native-base";
import { Fontisto } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../constants/Layout';
import { ApplicationState } from '../../../store';
import * as LoginData from '../../../store/Login/Data';
import * as LangData from '../../../store/Language/Data';
import MyLanguage from '../../../store/Language/language';
type SettingsScreenProps =
  SettingsScreenObj;

interface SettingsScreenObj {
    navigation: any;
}
export default function SettingsScreen(props: SettingsScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  const cancelRef2 = React.useRef(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const onClose2 = () => setIsOpen2(false);
  const dispatch = useDispatch();
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const btnRemoveOtp = () => {
    AsyncStorage.removeItem('connectStr');
    AsyncStorage.removeItem('remember');
    AsyncStorage.removeItem('defaultLang');
    props.navigation.navigate('Otp');
  }
  const btnLogOut = () => {
    AsyncStorage.removeItem('remember');
    dispatch(LoginData.actionCreators.removeLogin());
    props.navigation.navigate('Login');
  }
  const btnTest = () => {
    
  }
  const radioChange = (text:string) => {
    const uss = infor?.Infor.UserName===undefined?'':infor?.Infor.UserName;
    const rowdata = '{ "UserName" : "' + uss + '", "DefaultLanguage" : "' + text + '" }';
    fetch(connect?.StrCont+'api/modify/modify_login_language',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .catch((err) => {
      });
    let tempLG: InforLogin = {
      Result: infor?.Infor.Result===undefined?'':infor?.Infor.Result,
      UserName: uss,
      EmployeeNo: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
      GroupUser: infor?.Infor.GroupUser===undefined?'':infor?.Infor.GroupUser,
      DefaultLanguage: text,
      Role: infor?.Infor.Role===undefined?'':infor?.Infor.Role,
      Picture: infor?.Infor.Picture===undefined?'':infor?.Infor.Picture,
      Token: infor?.Infor.Token===undefined?'':infor?.Infor.Token
    };
    dispatch(LoginData.actionCreators.setLogin(tempLG));
    dispatch(LangData.actionCreators.setLang(MyLanguage(text)));
  }
  return (
    <Box height={'100%'} width={'100%'}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}/>
      <Box height={Layout.window.height} backgroundColor={'white'}>
        <Box height={'100%'} width={'100%'}>
          <ScrollView>
            <Box width={'100%'} height={'80px'}>
              <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
                <Box height={'34px'}/>
                <Center height={'46px'}>
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.settingsscreen.main.title}</Text>
                  <Box width={'100%'} position={'absolute'}>
                      <Box left={5} top={-13} width={50} position={'absolute'}>
                        <IconButton onPress={btnGoBack} _icon={{
                                        as: Fontisto,
                                        name: "angle-left",
                                        color: '#FF1919',
                                        size: '16px'
                                      }} />
                      </Box>
                  </Box>
                </Center>
              </ImageBackground>
            </Box>
            <Center height={'500px'}>
              <Flex direction="row">
              <Box width={'40%'}>
                <Box width={'100%'} position={'absolute'}>
                <Box position={'absolute'} right={3} top={7}>
                <Text fontSize={'22px'}>{mylang?.MyLang.settingsscreen.main.language}</Text>
                </Box>
                </Box>
              </Box>
              <Box width={'60%'}>
                <Radio.Group value={infor?.Infor.DefaultLanguage} name="myRadioGroup" onChange={radioChange} accessibilityLabel="favorite number">
                  <Flex paddingTop={'10px'} direction="row">
                  <Radio value="EN" my={1}>
                      <Image source={require("../../../assets/images/usa.png")} alt="submit error" height={'64px'} width={'64px'} resizeMode="stretch" />
                    </Radio>
                    <Radio marginLeft={'10px'} value="VN" my={1}>
                      <Image source={require("../../../assets/images/vietnam.png")} alt="submit error" height={'64px'} width={'64px'} resizeMode="stretch" />
                    </Radio>
                  </Flex>
                </Radio.Group>
              </Box>
            </Flex>
            <Flex direction="row">
            <Box width={'40%'}>
                <Box width={'100%'} position={'absolute'}>
                <Box position={'absolute'} right={3}>
                <Text fontSize={'22px'}>{mylang?.MyLang.settingsscreen.main.version}</Text>
                </Box>
                </Box>
              </Box>
              <Box width={'60%'}><Text fontSize={'22px'}>6.0.0</Text></Box>
            </Flex>
              <Center paddingTop={'25px'} width={'60%'}><Text onPress={() => setIsOpen(!isOpen)} color={'#0000CC'} fontSize={'22px'}>{mylang?.MyLang.settingsscreen.main.removeOTP}</Text></Center>
            </Center>
          </ScrollView>
        </Box>
      </Box>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{mylang?.MyLang.settingsscreen.outotp.title}</AlertDialog.Header>
          <AlertDialog.Body>
          {mylang?.MyLang.settingsscreen.outotp.question}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                {mylang?.MyLang.settingsscreen.outotp.cancel}
              </Button>
              <Button colorScheme="danger" onPress={btnRemoveOtp}>
                {mylang?.MyLang.settingsscreen.outotp.logout}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <AlertDialog leastDestructiveRef={cancelRef2} isOpen={isOpen2} onClose={onClose2}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{mylang?.MyLang.homescreen.logout.title}</AlertDialog.Header>
          <AlertDialog.Body>
            {mylang?.MyLang.homescreen.logout.question}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose2} ref={cancelRef2}>
                {mylang?.MyLang.homescreen.logout.cancel}
              </Button>
              <Button colorScheme="danger" onPress={btnLogOut}>
                {mylang?.MyLang.homescreen.logout.logout}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
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
}

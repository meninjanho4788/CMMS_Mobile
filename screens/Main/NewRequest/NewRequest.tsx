import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ImageBackground, Keyboard } from 'react-native';
import { Center, Button, Box, Pressable, Text, HStack, Flex, Input, TextArea, Image, IconButton, useToast, Modal, Checkbox } from "native-base";
import { Fontisto, Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import { ApplicationState } from '../../../store';
import CameraScreen from '../../Component/CameraScreen';
import BarCodeScreen from '../../Component/BarCodeScreen';
import Layout from '../../../constants/Layout';
import dataF from '../../../services/api/Select';
import ShowAlert from '../../../components/Util/Alert';
type NewRequestScreenProps =
  NewRequestScreenObj;

interface NewRequestScreenObj {
    navigation: any;
}
export default function NewRequestScreen(props: NewRequestScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const [priority, setPriority] = useState<string>('2');
  const [modalVisible, setModalVisible] = useState(false);
  const [imageExist, setImageExist] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState<string|undefined>(undefined);
  const [equipment, setEquipment] = useState<Equipment>({EquipID:'',Code:'',Name:'',Name2:'',QRCode:'',Location:''});
  const [barVisible, setBarVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const toast = useToast();
  const [repairRequest, setRepairRequest] = useState<RequestDetail>({ IdRow: 0,DocEntry: 0,EquipID: 0,StartDate: '',EndDate: '',Cost: 0,EditWho: '',StopEquipment: 0,Code: '',Name: '',
  Location: '',Priority: 0,Description: '',RootCase: '',Solution: '',PathPicture: '',PathPictureFixed: '',SourceNo: '',Status: '',Comments: '',ListAssignee: [],
  DocumentType: '', Assignee: '', Downtime: 0, WorkTime: 0, EstTime: 0, Requestor: '', AddWho: '' });
  const [stopDevice, setStopDevice] = useState(false);
  const [txtDesc, setTxtDesc] = useState<string>('');
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       setKeyboardVisible(true);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardVisible(false);
  //     }
  //   );
  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const updateImageLink = (link:string) => {
    setImageLink(link);
    setModalVisible(false);
    setImageExist(true);
  }
  const btnRemovePicture = () => {
    setImageLink(undefined);
    setImageExist(false);
  }
  const btnTakePicture = () => {
    if(imageExist===false){
      setModalVisible(true);
    }
  }
  const btnTakeBarCode = () => {
    setBarVisible(true);
  }
  const onEquipmentChange = (text:string) => {
    setEquipment({EquipID:equipment.EquipID,Code:equipment.Code,Name:equipment.Name,Name2:equipment.Name2,QRCode:text,Location:equipment.Location});
  }
  const btnEquipmentSearch = () => {
    equipmentSearch(equipment.QRCode);
  }
  const equipmentSearch = async (txtSearch:string) => {
    let obj = await dataF.GetBasicData(connect?.StrCont,'CWEquipment',txtSearch,'a','b');
    if (obj === undefined || obj === null) {
    } else {
      setEquipment({EquipID:obj[0].EquipID,Code:obj[0].Code,Name:obj[0].Name,Name2:obj[0].Name2,QRCode:obj[0].QRCode,Location:obj[0].Location});
    }
  }
  const updateBarCode = (barcode:string) => {
    equipmentSearch(barcode);
    setBarVisible(false);
  }
  const onTxtDescChange = (text:string) => {
    setTxtDesc(text);
  }
  const btnSave = () => {
    let requester = infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo;
    let addWho = infor?.Infor.UserName===undefined?'':infor?.Infor.UserName;

    if(equipment.EquipID===undefined || equipment.EquipID===''){
      ShowAlert(toast,2,""+mylang?.MyLang.errormessage.chuachon+mylang?.MyLang.errormessage.thietbi);
      return;
    }
    if(txtDesc === undefined || txtDesc.trim() ===''){
      ShowAlert(toast,2,""+mylang?.MyLang.newrequestscreen.main.description+mylang?.MyLang.errormessage.notempty);
      return;
    }
    let tempRepairR: RequestDetail = {
      DocEntry: 0,
      EquipID: parseInt(equipment.EquipID),
      Description: txtDesc,
      DocumentType: '',
      Downtime: 0,
      Priority: parseInt(priority),
      WorkTime: 0,
      EstTime: 0,
      Requestor: requester,
      Assignee: '',
      SourceNo: 'MobileDevice',
      PathPicture: imageLink===undefined?'':imageLink,
      StartDate: '',
      EndDate: '',
      Cost: 0,
      Comments: '',
      AddWho: addWho,
      EditWho: addWho,
      Status: '1',
      StopEquipment: stopDevice===false? 0 : 1,
      RootCase: '',
      Solution: '',
      IdRow: 0,
      Code: '', 
      Name: '', 
      Location: '', 
      PathPictureFixed: '', 
      ListAssignee: []
  };
    
    fetch(connect?.StrCont + 'api/modify/modify_cwticket/insert',
    {
        method: 'POST',
        body: JSON.stringify(tempRepairR)
    })
    .then(response => response.json())
    .then((responseData) => {
      ShowAlert(toast,1,mylang?.MyLang.errormessage.insertsuccess+'');
      props.navigation.goBack();
    })
    .catch((err)=>{
      ShowAlert(toast,2,""+mylang?.MyLang.errormessage.insertfail+':'+err);
    })
  }
  return (
    <Box height={'100%'} width={'100%'}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}/>
      <Box height={Layout.window.height-50} backgroundColor={'white'}>
        <Box height={'100%'} width={'100%'}>
          <ScrollView>
            <Box width={'100%'} height={'80px'}>
              <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
                <Box height={'34px'}/>
                <Center height={'46px'}>
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.newrequestscreen.main.title}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              <Box padding={'10px'}>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.qrcode}<Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Text>
                    <Input value={equipment.QRCode} onChangeText={onEquipmentChange} color={'#000000'} fontSize={'md'} height={'40px'} InputRightElement={<Button fontSize={'md'} leftIcon={<Fontisto name="search" size={20} color="#CCFFFF" />} onPress={btnEquipmentSearch} rounded="none" w="2/6" h="full"></Button>} placeholder={mylang?.MyLang.newrequestscreen.main.qrcode} />
                </Box>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.equipmentcode}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipment.Code}</Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.equipmentlocation}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipment.Location}</Text>
                  </Box>
                </Flex>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                      <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.equipmentname}</Text>
                      <Text lineHeight={'50px'} color={'#000000'} fontSize={'md'}>{equipment.Name}</Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.priority}<Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Text>
                    <Picker
                      selectedValue={priority}
                      onValueChange={(itemValue:string, itemIndex:any) =>
                        setPriority(itemValue)
                      }>
                      <Picker.Item label={mylang?.MyLang.combostring.priority.low} color={mylang?.MyLang.color.low} value="1" />
                      <Picker.Item label={mylang?.MyLang.combostring.priority.medium} color={mylang?.MyLang.color.medium} value="2" />
                      <Picker.Item label={mylang?.MyLang.combostring.priority.high} color={mylang?.MyLang.color.urgency} value="3" />
                    </Picker>
                  </Box>
                </Flex>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.description}<Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Text>
                    <TextArea color={'#000000'} fontSize={'md'} h={'70px'} value={txtDesc} onChangeText={onTxtDescChange} placeholder={mylang?.MyLang.newrequestscreen.main.description} />
                </Box>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.newrequestscreen.main.picture}</Text>
                    <Center width={'100%'} backgroundColor={'white'} height={'160px'}>
                      <Box width={'220px'}>
                        <Pressable onPress={btnTakePicture}>
                          {({ isPressed }) => {
                            return <Box   width={'100%'} height={'150px'}>
                              <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} width={'100%'}>
                                <Box width={'100%'} height={'150px'}>
                                  {imageExist===true?<Image source={{ uri: imageLink }} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />:
                                  <Image source={require("../../../assets/images/empty_photo.jpg")} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />}
                                </Box>
                                <Box width={'100%'} height={'150px'} position='absolute'>
                                  <Box position={'absolute'} top={0} right={0}>
                                    <IconButton onPress={btnRemovePicture} _icon={{
                                        as: Fontisto,
                                        name: "close-a",
                                        color: '#7F7F00',
                                        size: '16px'
                                      }} />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>;
                          }}
                        </Pressable>
                      </Box>
                    </Center>
                </Box>
                <Box width={'100%'} paddingTop={'20px'}>
                  <Box height={'40px'} width={'100%'}>
                    <Box>
                      <Checkbox isChecked={stopDevice} value="test" onChange={(value)=>{ setStopDevice(value) }}><Text color={'#000000'} fontSize={'md'}> {mylang?.MyLang.newrequestscreen.main.stopdevice}</Text></Checkbox>
                    </Box>
                    <Box width={'100%'} height={'40px'} position='absolute'>
                      <Box position={'absolute'} top={0} right={0}>
                        <Button onPress={btnSave} width={'100px'} height={'40px'} size={'20px'}><Text color={'#CCFFFF'}>{mylang?.MyLang.newrequestscreen.main.btnsave}</Text></Button>
                      </Box>  
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
      <Box display={isKeyboardVisible===true?'flex':'none'} position={isKeyboardVisible===true?'relative':'absolute'} bottom={0} borderTopColor={'rgb(216, 216, 216)'} borderTopWidth={1} backgroundColor={'white'} width={'100%'} height={50}>
        <HStack space={2} justifyContent="center">
          <Pressable onPress={btnGoBack}>
            {({ isPressed }) => {
              return <Center backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'}  h={'50px'} w={125}>
                <Fontisto name="angle-left" size={16} color="#009999" />
              </Center>;
            }}
          </Pressable>
          <Pressable onPress={btnTakeBarCode}>
            {({ isPressed }) => {
              return <Center backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'} h={'50px'} w={125}>
              <Box width={'80px'} height={'80px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderColor={'rgb(216, 216, 216)'} borderWidth={1} marginBottom={2} backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'}>
                <Fontisto name="qrcode" style={{ position:'absolute' }}  size={36} color="#009999" />
              </Box>
            </Center>;
            }}
          </Pressable>
          <Center h={'50px'} w={125} />
        </HStack>
      </Box>
      <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <CameraScreen btnDeleteImage={()=>{}} canDelete={false} location='@images@CMMS@CMMS_CAM@images@Ticket@' btnTurnOffCamera={()=>{setModalVisible(false)}} chooseImageFromLib={false} btnUpdateLink={updateImageLink} navigation={props.navigation}></CameraScreen>
        </Box>
      </Modal>
      <Modal height={Layout.window.height} isOpen={barVisible} onClose={()=>{setBarVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <BarCodeScreen btnUpdateBarCode={updateBarCode} navigation={props.navigation}></BarCodeScreen>
        </Box>
      </Modal>
    </Box>
  );
}
interface Equipment {
  EquipID: string;
  Code: string;
  Name: string;
  Name2: string;
  QRCode: string;
  Location: string;
}
interface ArrayAssignee extends Array<Assignee> { }
interface Assignee {
  IdRow: number;
  DocEntry: number;
  EmployeeCode: string;
  KeyPerson: boolean;
  FullName: string;
  EditWho: string;
  Choice: boolean;
}
interface RequestDetail {
  IdRow: number;
  DocEntry: number;
  EquipID: number;
  StartDate: string;
  EndDate: string;
  Cost: number;
  EditWho: string;
  StopEquipment: number;
  Code: string;
  Name: string;
  Location: string;
  Priority: number;
  Description: string;
  DocumentType: string;
  Assignee: string;
  Downtime: number;
  WorkTime: number;
  EstTime: number;
  Requestor: string;
  RootCase: string;
  Solution: string;
  PathPicture: string;
  PathPictureFixed: string;
  SourceNo: string;
  Status: string;
  Comments: string;
  AddWho: string;
  ListAssignee: ArrayAssignee;
}

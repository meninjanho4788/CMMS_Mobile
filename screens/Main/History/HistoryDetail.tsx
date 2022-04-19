import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Center, Box, Pressable, Text, HStack, Flex, Checkbox, Image, Divider, Modal, IconButton, Avatar } from "native-base";
import { Fontisto, FontAwesome5 } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';
import Layout from '../../../constants/Layout';
import MyTab from './MyTab';
import BarCodeScreen from '../../Component/BarCodeScreen';
import CameraScreen from '../../Component/CameraScreen';
import { ApplicationState } from '../../../store';
type HistoryDetailScreenProps =
HistoryDetailScreenObj;

interface HistoryDetailScreenObj {
  route:any;
  navigation: any;
}
type FirstRouteProps = FirstRouteObj;
interface FirstRouteObj { idx:number,curIdx:number,data: EquipHistory, myLang:any, navigation: any; }
const FirstRoute = (props:FirstRouteObj) => (
  <Box display={props.idx===props.curIdx?'flex':'none'} width={'100%'}>
    {
      props.data.FailTrack !==undefined && props.data.FailTrack.map((zi,i)=>{
        return <Box key={i}>
          <Pressable onPress={()=>{ props.navigation.navigate('RepairRequestDetail', {repairID: zi.DocEntry, sourcelink: 'history' }); }}>
            {({ isPressed }) => {
              return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} paddingTop={'15px'} paddingLeft={'20px'} paddingRight={'20px'}>
                <Box>
                  <Box width={'90%'}>
                    <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                      {/* {zi.DocEntry===0?null:<Text fontSize={'14px'} color={'#000000'}>{zi.DocEntry+' - '}</Text>} */}
                      <Text fontSize={'12px'} isTruncated>
                      {props.myLang.repairrequestscreen.main.description}
                    </Text>{zi.Description}
                    </Text>
                  </Box>
                  <Box width={'100%'} position={'absolute'}>
                    <Box width={'10%'} position={'absolute'} right={0} top={'0px'}>
                      {
                        zi.EmployeeCode===undefined?null:
                        (zi.Picture===''?<Avatar size={'xs'} bg="green.500">
                          {zi.EmployeeCode}
                        </Avatar>:<Avatar size={'xs'} bg="green.500" source={{
                          uri: zi.Picture
                        }}>
                          {zi.EmployeeCode}
                        </Avatar>)
                      }
                    </Box>
                  </Box> 
                </Box>
                <Box>
                  <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                    <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                      {props.myLang.repairrequestscreen.main.postingdate}
                    </Text>
                    <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                      {' '}{zi.PostingDate}
                    </Text>
                  </Text>
                </Box>
                <Box>
                  <Box>
                    <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                      <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                        {props.myLang.repairrequestscreen.main.priority}
                      </Text>
                      <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                        {' '}{zi.Priority===1?(<Text color={props.myLang.color.low}>Low</Text>):
                        (zi.Priority===2?(<Text color={props.myLang.color.medium}>Medium</Text>):
                        (<Text color={props.myLang.color.urgency}>Urgency</Text>))}
                      </Text>
                    </Text>


                    
                  </Box>
                  <Box width={'100%'} position={'absolute'}>
                    <Box position={'absolute'} right={0} top={'0px'}>
                      
                    </Box>
                  </Box> 
                </Box>
                
                <Box height={'15px'}></Box>
                {i===props.data.FailTrack.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
            </Box>;
            }}
          </Pressable>
        </Box>
      })
    }
  </Box>
);

const SecondRoute = (props:FirstRouteObj) => (
  <Box display={props.idx===props.curIdx?'flex':'none'} width={'100%'}>
    {
      props.data.MaintenanceTrack !== undefined && props.data.MaintenanceTrack.map((zi,i)=>{
        return <Box key={i}>
        <Pressable onPress={()=>{ props.navigation.navigate('MRequestDetail', { requestID: zi.WorkOrderNo, sourcelink: 'history' }); }}>
                      {({ isPressed }) => {
                        return <Box paddingTop={'15px'} paddingLeft={'20px'} paddingRight={'20px'}>
                          <Box>
                            <Box>
                              <Text fontSize={'14px'} isTruncated>
                                <Text color={'#000000'}>{'WO#'+zi.WorkOrderNo}
                                  
                                </Text>
                              </Text>
                            </Box>
                            <Box width={'100%'} position={'absolute'}>
                              <Box position={'absolute'} right={0} top={0}>
                                {
                                  zi.EmployeeCode===undefined?null:
                                  (zi.Picture===''?<Avatar size={'xs'} bg="green.500">
                                    {zi.EmployeeCode}
                                  </Avatar>:<Avatar size={'xs'} bg="green.500" source={{
                                    uri: zi.Picture
                                  }}>
                                    {zi.EmployeeCode}
                                  </Avatar>)
                                }
                              </Box>
                            </Box> 
                          </Box>
                          {zi.Description===''?null:<Text color={'#C0C0C0'} fontSize={'12px'}><Text color={'#C0C0C0'} fontSize={'12px'}>{props.myLang.maintenancescreen.main.description}</Text>{' '+zi.Description}</Text>}
                          <Box>
                            <Text fontSize={'12px'} color={'#C0C0C0'}>{props.myLang.maintenancescreen.main.duedate}
                              <Text>{zi.DueDate}</Text>
                            </Text>
                          </Box>
                          <Box>
                            <Box>
                              <Text fontSize={'12px'} color={'#C0C0C0'}>
                                  {props.myLang.maintenancescreen.main.priority}
                                    {zi.Priority===1?(<Text color={props.myLang.color.low}>Low</Text>):
                                    (zi.Priority===2?(<Text color={props.myLang.color.medium}>Medium</Text>):
                                    (<Text color={props.myLang.color.urgency}>Urgency</Text>))}
                              </Text>
                            </Box>
                            <Box width={'100%'} position={'absolute'}>
                              <Box position={'absolute'} right={0} top={0}>
                              
                              </Box>
                            </Box> 
                          </Box>
                          <Box paddingLeft={'20px'}>
                          
                          </Box>
                          <Box height={'15px'}></Box>
                          {i===props.data.MaintenanceTrack.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
                      </Box>;
                      }}
                    </Pressable>
      </Box>
      })
    }
    
    </Box>
);
const ThreeRoute = (props:FirstRouteObj) => (
  <Box display={props.idx===props.curIdx?'flex':'none'} width={'100%'}>
    {
      props.data.Replacement !== undefined && props.data.Replacement.map((zi,i)=>{
        return <Box key={i}>
        <Box marginTop={'5px'} width={'100%'} borderRadius={'5px'} padding={'10px'}>
          <Flex direction="row">
            <Box width={'80%'}>
              <Text color={'#000000'} isTruncated fontSize={'14px'}>WO#{zi.DocEntry+' - '}
                <Text fontSize={'12px'} color={'#555555'}>{zi.ItemCode} - {zi.Name}</Text>
              </Text>
            </Box>
            <Box width={'100%'} position='absolute'>
              <Box position={'absolute'} top={1} right={0}>
              <Text color={'#A5A5A5'} fontSize={'12px'}>Qty: {zi.Qty}</Text>
              </Box>
            </Box>
          </Flex>
          <Flex direction="row">
            <Box width={'80%'}>
              <Text color={'#C0C0C0'} fontSize={'12px'}><Text color={'#C0C0C0'} fontSize={'12px'}>{props.myLang.maintenancescreen.main.description}</Text>{zi.Description===''?'':zi.Description}</Text>
            </Box>
            <Box width={'100%'} position='absolute'>
              <Box position={'absolute'} top={1} right={0}>
              <Text color={'#A5A5A5'} fontSize={'12px'}>Cost: {zi.UnitPrice}</Text>
              </Box>
            </Box>
          </Flex>
        </Box>
        <Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>
      </Box>
      })
    }
    
    </Box>
);

export default function HistoryDetailScreen(props: HistoryDetailScreenProps) {
  const layout = useWindowDimensions();
  const { QRCode } = props.route.params;
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const [qrcode, setQrcode] = useState<string>('');
  const [imageLink, setImageLink] = useState<string>('');
  const [barVisible, setBarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [menuu, setMenuu] = useState<ArrayMyMenu>([{index:0,TabName: mylang?.MyLang.equipmenthistoryscreen.main.failtrack },{index:1,TabName: mylang?.MyLang.equipmenthistoryscreen.main.maintrack },{index:2,TabName: mylang?.MyLang.equipmenthistoryscreen.main.replace }]);
  const [equipHis, setEquipHis] = useState<EquipHistory>({ Code: '',Name: '',QRCode: '',Location: '',Power: 0,MainEquipGroup: false,Status:true,PathPicture: '',Specification: '',Description: '',FailTrack: [],MaintenanceTrack: [],Replacement: []});
  const [loading, setLoading] = useState(true);
  const [linkPic, setLinkPic] = useState<string>('');
  useEffect(() => {
    equipmentSearch(props.route.params.QRCode);
  }, []);
  // useEffect(() => {
  //   equipmentSearch(props.route.params.QRCode);
  // }, [equipHis]);
  //equipHis
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const tabChangeIndex = (idx: number) =>{
    setTabIndex(idx);
  }
  const equipmentSearch = async (barCode:string) => {
    setLoading(true);
    setTabIndex(0);
    const rowdata = '{ "BarCode" : "' + barCode + '" }';
    fetch(connect?.StrCont+'api/select/get_equipment_information',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData) => {
        setEquipHis(responseData[0]);
        setLinkPic(responseData[0].PathPicture);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }
  const updateBarCode = (barcode:string) => {
    equipmentSearch(barcode);
    setBarVisible(false);
  }
  const updateImageLink = (link:string) => {
    equipHis.PathPicture = link;
    setEquipHis(equipHis);
    setLinkPic(link);
    const rowdata = '{ "QRCode" : "' + equipHis.QRCode + '", "PathPicture": "'+link+'" }';
    fetch(connect?.StrCont+'api/modify/update_image_equipment',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      })
      .catch((err) => {
        setLoading(false);
      });
    setModalVisible(false);
  }
  const btnTakePicture = () => {
    if(equipHis.PathPicture ===''){
      setModalVisible(true);
    }
  }
  const btnRemovePicture = () => {
    equipHis.PathPicture = '';
    setEquipHis(equipHis);
    setLinkPic('');
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{equipHis.Code}{mylang?.MyLang.equipmenthistoryscreen.main.title2}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              {loading===false?<Box padding={'10px'}>
                <Flex direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.equipmentcode}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Code}</Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.qrcode}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.QRCode}</Text>
                  </Box>
                </Flex>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.equipmentname}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Name}</Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.equipmentlocation}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Location}</Text>
                  </Box>
                </Flex>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Box>
                      <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.power}</Text>
                      <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Power}</Text>
                    </Box>
                    <Box>
                      <Text paddingTop={'10px'} color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.mainequipment}</Text>
                      <Checkbox isChecked={equipHis.MainEquipGroup} value="test" isDisabled><Text color={'#000000'} fontSize={'md'}></Text></Checkbox>
                    </Box>
                    <Box>
                      <Text paddingTop={'10px'} color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.isactive}</Text>
                      <Checkbox isChecked={equipHis.Status} value="test" isDisabled><Text color={'#000000'} fontSize={'md'}></Text></Checkbox>
                    </Box>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.picture}</Text>
                    <Box width={'100%'}>
                        <Pressable onPress={btnTakePicture}>
                          {({ isPressed }) => {
                            return <Box   width={'100%'} height={'150px'}>
                              <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} width={'100%'}>
                                <Box width={'100%'} height={'150px'}>
                                  {linkPic ===''?<Image source={require("../../../assets/images/empty_photo.jpg")} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />:
                                  <Image source={{ uri: linkPic }} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />}
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
                  </Box>
                </Flex>
                <Flex direction="row">
                  {
                    equipHis.Specification===''?null:<Box width={'48%'}>
                      <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.spec}</Text>
                      <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Specification}</Text>
                    </Box>
                  }
                  {
                    equipHis.Description===''?null:<Box paddingLeft={'10px'} width={'48%'}>
                      <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.note}</Text>
                      <Text color={'#000000'} fontSize={'md'} isTruncated>{equipHis.Description}</Text>
                    </Box>
                  }
                </Flex>
                <Box height={'10px'}></Box>
                <MyTab index={tabIndex} changeIndex={tabChangeIndex} menu={menuu}/>
                <Box>
                  {
                    menuu.map((zi,i)=>{
                      return zi.index===0?<FirstRoute navigation={props.navigation} key={i} data={equipHis} idx={zi.index} curIdx={tabIndex} myLang={mylang?.MyLang} />:(zi.index===1?<SecondRoute navigation={props.navigation} key={i} data={equipHis} idx={zi.index} curIdx={tabIndex} myLang={mylang?.MyLang}/>:<ThreeRoute navigation={props.navigation} key={i} data={equipHis} idx={zi.index} curIdx={tabIndex} myLang={mylang?.MyLang}/>)
                    })
                  }
                </Box>
              </Box>:<Center height={'600px'}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </Center>}
              


            </Box>
          </ScrollView>
        </Box>
      </Box>
      <Box position={'absolute'} bottom={0} borderTopColor={'rgb(216, 216, 216)'} borderTopWidth={1} backgroundColor={'white'} width={'100%'} height={50}>
        <HStack space={2} justifyContent="center">
          <Pressable onPress={btnGoBack}>
            <Center h={'50px'} w={125}>
              <Fontisto name="angle-left" size={16} color="#009999" />
            </Center>
          </Pressable>
          
          <Pressable onPress={()=>setBarVisible(true)}>
            {({ isPressed }) => {
              return <Center backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'} h={'50px'} w={125}>
              <Box width={'80px'} height={'80px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderColor={'rgb(216, 216, 216)'} borderWidth={1} marginBottom={2} backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'}>
                <Fontisto name="qrcode" style={{ position:'absolute' }}  size={36} color="#009999" />
              </Box>
            </Center>;
            }}
          </Pressable>
          
          <Pressable onPress={()=>{ props.navigation.navigate('Home'); }}>
            {({ isPressed }) => {
              return <Center backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'}  h={'50px'} w={125}>
                <FontAwesome5 name="home" size={16} color="#009999" />
              </Center>;
            }}
          </Pressable>
        </HStack>
      </Box>
      <Modal height={Layout.window.height} isOpen={barVisible} onClose={()=>{setBarVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <BarCodeScreen btnUpdateBarCode={updateBarCode} navigation={props.navigation}></BarCodeScreen>
        </Box>
      </Modal>
      <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <CameraScreen btnDeleteImage={()=>{}} canDelete={false} location='@images@CMMS@CMMS_CAM@images@Equip@' btnTurnOffCamera={()=>{setModalVisible(false)}} chooseImageFromLib={true} btnUpdateLink={updateImageLink} navigation={props.navigation}></CameraScreen>
        </Box>
      </Modal>
    </Box>
  );
}
interface ArrayMyMenu extends Array<MyMenu> { }
interface MyMenu {
  index: number;
  TabName: string|undefined;
}
interface EquipHistory {
  Code: string;
  Name: string;	
  QRCode: string;
  Location: string;
  Power: number;
  MainEquipGroup:boolean;	
  Status:boolean;
  PathPicture: string;
  Specification: string;
  Description: string;
  FailTrack:ArrayFailTrack;
  MaintenanceTrack:ArrayMaintenanceTrack;
  Replacement:ArrayReplacement;
}
interface ArrayFailTrack extends Array<FailTrack> { }
interface FailTrack {
  DocEntry:number;
  PostingDate:string;
  Priority:number;
  Description:string;
  EmployeeCode: string;
  Picture: string;
}
interface ArrayMaintenanceTrack extends Array<MaintenanceTrack> { }
interface MaintenanceTrack {
  WorkOrderNo:number;
  EquipId:number;
  StartDate: string;
  Remarks:string;
  Priority:number;
  Description:string;
  DueDate: string;
  EmployeeCode: string;
  Picture: string;
}
interface ArrayReplacement extends Array<Replacement> { }
interface Replacement {
  DocEntry:number;
  DocType:string;
  ItemCode:string;
  Qty:number;
  Description:string;
  Name:string;
  UnitPrice:number;
}

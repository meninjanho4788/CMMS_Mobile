import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground } from 'react-native';
import { Center, Button, Box, Pressable, Text, HStack, Flex, Select, CheckIcon, TextArea, Image, IconButton, useToast, Modal, Divider } from "native-base";
import { Fontisto, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import BarCodeScreen from '../../Component/BarCodeScreen';
import Layout from '../../../constants/Layout';
import CameraScreen from '../../Component/CameraScreen';
import ShowAlert from '../../../components/Util/Alert';
type MRequestDetailScreenProps =
  MRequestDetailScreenObj;

interface MRequestDetailScreenObj {
  route:any;
  navigation: any;
}
export default function MRequestDetailScreen(props: MRequestDetailScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageExist, setImageExist] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState<string|undefined>(undefined);
  const [showModalEquip, setShowModalEquip] = useState<boolean>(false);
  const [barVisible, setBarVisible] = useState(false);
  const [requestDetail, setRequestDetail] = useState<ArrayMRequestDetail>([]);
  const [equipID, setEquipID] = useState<number>(0);
  const [pictureA, setPictureA] = useState<string>('');
  const [descriptionA, setDescriptionA] = useState<string>('');
  const [finishA, setFinishA] = useState<string>('0');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const toast = useToast();
  useEffect(() => {
    loadRequestDetail(props.route.params.requestID);
  }, []);
  const loadRequestDetail = (requestID: number) => {
    fetch(connect?.StrCont+'api/select/get_maintenance_request_detail/'+requestID.toString())
      .then(response => response.json())
      .then((responseData:ArrayMRequestDetail) => {
        responseData.map(ce=>{
          ce.ListEquipment.map(pi=>{
            pi.ListWork.map(yi=>{
              pi.RequestID = requestID;
              pi.Status = yi.Status;
              pi.EquipID = yi.EquipId;
              pi.PathPicture = yi.PathPicture;
              pi.Remarks = yi.Remarks;
            })
          })
          if(ce.Status==='10'){
            setIsComplete(true);
          }
        })
        setRequestDetail(responseData);
      })
      .catch((err) => {
      });
  }
  const setEquipmentA = (equipID: number) => {
    setEquipID(equipID);
    const lstE = requestDetail[0].ListEquipment.filter(fi=>fi.EquipID===equipID);
    if(lstE.length>0){
      const lstW = lstE[0].ListWork;
      if(lstW.length>0){
        let linkPicA = lstW[0].PathPicture;
        let descA = lstW[0].Remarks;
        let isFinish = lstW[0].Status;
        setPictureA(linkPicA);
        setDescriptionA(descA);
        setFinishA(isFinish);
      }
    }
  }
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const btnRemovePicture = () => {
    setPictureA('');
  }
  const btnTakePicture = () => {
    if(pictureA===''){
      setModalVisible(true);
    }
  }
  const btnTakeBarCode = () => {
    setBarVisible(true);
  }
  const updateImageLink = (link:string) => {
    setPictureA(link);
    let tempR = requestDetail;
    let lstE = tempR[0].ListEquipment.filter(fi=>fi.EquipID===equipID);
    if(lstE.length>0){
      lstE[0].PathPicture = link;
      let lstW = lstE[0].ListWork;
      if(lstW.length>0){
        lstW.map((mi,i)=>{
          mi.PathPicture = link;
        })
        setRequestDetail(tempR);
      }
    }
    setModalVisible(false);
    setShowModalEquip(false);
    setShowModalEquip(true);
  }
  const setDescA =(text:string)=>{
    setDescriptionA(text);
    let tempR = requestDetail;
    let lstE = tempR[0].ListEquipment.filter(fi=>fi.EquipID===equipID);
    if(lstE.length>0){
      lstE[0].Remarks = text;
      let lstW = lstE[0].ListWork;
      if(lstW.length>0){
        lstW.map((mi,i)=>{
          mi.Remarks = text;
        })
        setRequestDetail(tempR);
      }
    }
  }
  const setStatusA =(text:string)=>{
    setFinishA(text);
    let tempR = requestDetail;
    let lstE = tempR[0].ListEquipment.filter(fi=>fi.EquipID===equipID);
    if(lstE.length>0){
      lstE[0].Status = text;
      let lstW = lstE[0].ListWork;
      if(lstW.length>0){
        lstW.map((mi,i)=>{
          mi.Status = text;
        })
        setRequestDetail(tempR);
      }
    }
  }
  const btnSave = () => {
    let temp = {...requestDetail[0]};
    let addWho = infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.UserName;
    temp.ListEquipment.map(ci=>{
      ci.EditWho = addWho;
    })
    fetch(connect?.StrCont + 'api/modify/modify_maintenance_detail/update',
    {
      method: 'POST',
      body: JSON.stringify(temp)
    })
    .then(response => response.json())
    .then((responseData) => {
      setShowModalEquip(false);
      ShowAlert(toast,1,'Update Successful WO#'+responseData[0].RequestID);
      if(responseData[0].IsFinished==='yes'){
        props.navigation.goBack();
      }else {
        loadRequestDetail(props.route.params.requestID);
      }
    })
    .catch((err)=>{
      ShowAlert(toast,2,mylang?.MyLang.errormessage.insertfail+err);
    })
  }
  const updateBarCode = (barcode:string) => {
    let chkExist = false;
    let EquipIDD = 0;
    requestDetail[0].ListEquipment.map(ci=>{
      if(ci.QRCode===barcode){
        EquipIDD = ci.EquipID;
        chkExist=true;
      }
    })
    if(chkExist){
      setShowModalEquip(true); 
      setEquipmentA(EquipIDD);
    } else {
      ShowAlert(toast,2,mylang?.MyLang.errormessage.cantfindequip+"#"+props.route.params.requestID);
    }
    setBarVisible(false);
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>WO#{props.route.params.requestID}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              {requestDetail.length>0?<Box padding={'10px'}>
                <Flex direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.priority}</Text>
                    {requestDetail[0].Priority===1?(<Text fontSize={'md'} color={mylang?.MyLang.color.low}>{mylang?.MyLang.combostring.priority.low}</Text>):
                            (requestDetail[0].Priority===2?(<Text fontSize={'md'} color={mylang?.MyLang.color.medium}>{mylang?.MyLang.combostring.priority.medium}</Text>):
                            (<Text fontSize={'md'} color={mylang?.MyLang.color.urgency}>{mylang?.MyLang.combostring.priority.high}</Text>))}
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.duedate}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{requestDetail[0].DueDate}</Text>
                  </Box>
                </Flex>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.status}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>
                      {requestDetail[0].Status==='1'? mylang?.MyLang.combostring.status.open :(requestDetail[0].Status==='2'? mylang?.MyLang.combostring.status.onhold :(requestDetail[0].Status==='3'? mylang?.MyLang.combostring.status.inprogress : mylang?.MyLang.combostring.status.complete ))}
                    </Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                  </Box>
                </Flex>
                {
                  requestDetail[0].Description===''?null:<Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.description} :</Text>
                    <Text color={'#000000'} fontSize={'md'}>{requestDetail[0].Description}</Text>
                  </Box>
                }
                <Box paddingTop={'10px'} width={'100%'} >
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.listequipment}</Text>
                    <Box width={'100%'}>
                      {
                        requestDetail[0].ListEquipment.map((mi,i)=>{
                          return <Pressable key={i} onPress={()=>{ setShowModalEquip(true); setEquipmentA(mi.EquipID); }}>
                          {({ isPressed }) => {
                            return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} paddingTop={'15px'} paddingLeft={'10px'} paddingRight={'10px'}>
                              <Box>
                                <Box width={'70%'}>
                                  <Text fontSize={'16px'} isTruncated>
                                    <Text color={'#555555'}>{mi.Code + ' - ' + mi.Name + ' - '+ mi.Location}</Text>
                                  </Text>
                                </Box>
                                <Box width={'100%'} position={'absolute'}>
                                  <Box position={'absolute'} right={0} top={'4px'}>
                                  {mi.Status===''?(null):(
                                    mi.Status==='10'?(<Text color={'#BFBFBF'} fontSize={'12px'}>{mylang?.MyLang.combostring.status.complete}</Text>):
                                    (<Text color={'#FFA3A3'} fontSize={'12px'}>
                                    {mi.Status==='1'?mylang?.MyLang.combostring.status.open:(mi.Status==='2'?mylang?.MyLang.combostring.status.onhold:mylang?.MyLang.combostring.status.inprogress)}
                                    </Text>)
                                  )}
                                  </Box>
                                </Box> 
                              </Box>
                              <Box paddingLeft={'10px'}>
                                {
                                  mi.ListWork.map((lw,r)=>{
                                    return <Text key={r} color={'#878787'} isTruncated>{' * '+lw.WorkCode+' - '+lw.Name}</Text>
                                  })
                                }
                              </Box>
                              <Box height={'15px'}></Box>
                              {i===requestDetail[0].ListEquipment.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
                          </Box>;
                          }}
                        </Pressable>
                        })
                      }
                    </Box>
                </Box>
                {/* <Box width={'100%'} paddingTop={'20px'}>
                  <Box height={'40px'} width={'100%'}>
                    <Box>
                    </Box>
                    <Box width={'100%'} height={'40px'} position='absolute'>
                      <Box position={'absolute'} top={0} right={0}>
                        <Button width={'100px'} height={'40px'} leftIcon={<Fontisto color={'#CCFFFF'} name="save-1" size={20} />} size={'20px'}><Text color={'#CCFFFF'}>SAVE</Text></Button>
                      </Box>  
                    </Box>
                  </Box>
                </Box> */}
              </Box>:null}
            </Box>
          </ScrollView>
        </Box>
      </Box>
      <Box position={'absolute'} bottom={0} borderTopColor={'rgb(216, 216, 216)'} borderTopWidth={1} backgroundColor={'white'} width={'100%'} height={50}>
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
          <Pressable onPress={()=>{ props.navigation.navigate('Home'); }}>
            {({ isPressed }) => {
              return <Center backgroundColor={isPressed===true?'rgb(216, 216, 216)':'white'}  h={'50px'} w={125}>
                <FontAwesome5 name="home" size={16} color="#009999" />
              </Center>;
            }}
          </Pressable>
        </HStack>
      </Box>
      <Modal height={Layout.window.height} isOpen={showModalEquip} onClose={() => setShowModalEquip(false)} size={'full'}>
        <Box backgroundColor={'white'} width={'100%'} height={'100%'}>
          <ScrollView>
            <Box>



            <Box width={'100%'} height={'80px'}>
              <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
                <Box height={'34px'}/>
                <Center height={'46px'}>
                {requestDetail.length>0&&requestDetail[0].ListEquipment.length>0 && requestDetail[0].ListEquipment.filter(fi=>fi.EquipID===equipID).map((si,i)=>{
                  return <Text width={'70%'} isTruncated fontSize={'16px'} bold><Text color={'#000000'}>{'WO#'+requestDetail[0].IdRow+' - '}</Text><Text color={'#555555'}>{si.Code+' - '+si.Name+' - '+si.Location}</Text></Text>
                })}
                </Center>
              </ImageBackground>
            </Box>
            
          <Box pointerEvents={(props.route.params.sourcelink==='history'||(infor?.Infor.Role!=='man'&&requestDetail[0].KeyEmpCode!==infor?.Infor.EmployeeNo))?'none':'auto'} padding={'20px'}>
              <Box paddingTop={'10px'} width={'100%'}>
                <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.listofwork}</Text>
                <Box paddingTop={'10px'} paddingRight={'10px'} paddingBottom={'10px'} paddingLeft={'10px'}>
                {requestDetail.length>0 && requestDetail[0].ListEquipment.length>0 && requestDetail[0].ListEquipment.filter(fi=>fi.EquipID===equipID).length>0 && requestDetail[0].ListEquipment.filter(fi=>fi.EquipID===equipID)[0].ListWork.map((vi,o)=>{
                  return <Box key={o}>
                    <Box width={'80%'}><Text isTruncated color={'#000000'}>{vi.WorkCode+' - '+vi.Name}</Text></Box>
                    <Box width={'100%'} position={'absolute'}><Box position={'absolute'} right={0} top={'2px'}><Text fontSize={'12px'} color={'#878787'}>{vi.NextDate}</Text></Box></Box>
                    <Box>
                      <Text isTruncated fontSize={'12px'} color={'#999999'}>{vi.Description}</Text>
                    </Box>
                  </Box>
                })}
                </Box>
              </Box>
              <Box paddingTop={'10px'} width={'100%'}>
                <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.picture}</Text>
                <Center width={'100%'} height={'160px'}>
                  <Box width={'220px'}>
                    <Pressable onPress={btnTakePicture}>
                      {({ isPressed }) => {
                        return <Box   width={'100%'} height={'150px'}>
                          <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} width={'100%'}>
                            <Box width={'100%'} height={'150px'}>
                              {pictureA===''?<Image source={require("../../../assets/images/empty_photo.jpg")} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />:<Image source={{ uri: pictureA }} borderRadius={20} alt="submit error" resizeMode="stretch" style={{ height: '100%'}} />}
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
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.description}</Text>
                    <TextArea color={'#000000'} fontSize={'md'} value={descriptionA} onChangeText={(text)=>{setDescA(text)}} h={'60px'} />
                </Box>
                <Box paddingTop={'10px'} width={'100%'}>
                  <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.status}</Text>
                  <Box height={'40px'} width={'100%'}>
                    <Box width={'100%'}>
                      <Select  selectedValue={finishA} accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                        }} onValueChange={(text)=>{setStatusA(text)}}>
                          <Select.Item label={mylang?.MyLang.combostring.status.open} value="1" />
                          <Select.Item label={mylang?.MyLang.combostring.status.onhold} value="2" />
                          <Select.Item label={mylang?.MyLang.combostring.status.inprogress} value="3" />
                          <Select.Item label={mylang?.MyLang.combostring.status.complete} value="10" />
                      </Select>
                    </Box>
                    <Box width={'100%'} height={'40px'} position='absolute'>
                      <Box position={'absolute'} right={0}>
                        
                      </Box>  
                    </Box>
                  </Box>
                </Box>
                <Box paddingTop={'20px'}>
                <Button width={'100%'} height={'40px'} onPress={btnSave} size={'20px'}><Text color={'#CCFFFF'}>{mylang?.MyLang.maintenancescreen.main.btnsave}</Text></Button>
                </Box>
                <Box height={'50px'} />
            </Box>
            </Box>
          
          </ScrollView>
          
        </Box>
      </Modal>
      <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <CameraScreen btnDeleteImage={()=>{}} canDelete={false} location='@images@CMMS@CMMS_CAM@images@WorkOrder@' btnTurnOffCamera={()=>{setModalVisible(false)}} btnUpdateLink={updateImageLink} chooseImageFromLib={false} navigation={props.navigation}></CameraScreen>
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
interface ArrayMRequestDetail extends Array<MRequestDetail> { }
interface MRequestDetail {
  IdRow: number;
  Priority: number;
  Status: string;
  Description: string;
  DueDate: string;
  ListEquipment: ArrayListEquipment;
  KeyEmpCode: string;
}
interface ArrayListEquipment extends Array<ListEquipment> { }
interface ListEquipment {
  RequestID: number;
  EquipID: number;
  QRCode: string;
  Code: string;
  Name: string;
  Location: string;
  Status: string;
  PathPicture: string;
  Remarks: string;
  EditWho: string;
  ListWork: ArrayListWork;
}
interface ArrayListWork extends Array<ListWork> { }
interface ListWork {
  EquipId: number;
  WorkCode: string;
  NextDate: string;
  Name: string;
  Description: string;
  Status: string;
  PathPicture: string;
  Remarks: string;
}

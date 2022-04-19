import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground  } from 'react-native';
import { Center, Button, Box, Pressable, Text, Flex, Select, CheckIcon,useToast, TextArea, Image, IconButton, Modal } from "native-base";
import { Fontisto, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import Layout from '../../../constants/Layout';
import CameraScreen from '../../Component/CameraScreen';
import CbbAssignee from './CbbAssignee';
import ShowAlert from '../../../components/Util/Alert';

type RepairRequestDetailScreenProps =
  RepairRequestDetailScreenObj;

interface RepairRequestDetailScreenObj {
  route:any;
  navigation: any;
}

export default function RepairRequestDetailScreen(props: RepairRequestDetailScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [date1, setDate1] = useState(new Date(1598051730000));
  const [showD1, setShowD1] = useState(false);
  const [modeD1, setModeD1] = useState<string>('date');
  const [date2, setDate2] = useState(new Date(1598051730000));
  const [showD2, setShowD2] = useState(false);
  const [modeD2, setModeD2] = useState<string>('date');
  const [imageLink, setImageLink] = useState<string|undefined>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [requestDetail, setRequestDetail] = useState<RequestDetail>({ IdRow: 0,DocEntry: 0,EquipID: 0,StartDate: '',EndDate: '',Cost: 0,EditWho: '',StopEquipment: 0,Code: '',Name: '',
  Location: '',Priority: 0,Description: '',RootCase: '',Solution: '',PathPicture: '',PathPictureFixed: '',SourceNo: '',Status: '',Comments: '',ListAssignee: [],
  DocumentType: '', Assignee: '', Downtime: 0, WorkTime: 0, EstTime: 0, Requestor: '', AddWho: '', PCId: '' });
  const [assigneeModal, setAssigneeModal] = useState(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const toast = useToast();
  useEffect(() => {
    loadRequestDetail(props.route.params.repairID);
  }, []);
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const loadRequestDetail = (repairID: string) => {
    fetch(connect?.StrCont+'api/select/get_repair_request_detail/'+repairID)
      .then(response => response.json())
      .then((responseData) => {
        setRequestDetail(responseData[0]);
        if(responseData[0].Status==='4'){
          setIsComplete(true);
        }
      })
      .catch((err) => {
        
      });
  }
  const onChangeD1 = (event:any, selectedDate:any) => {
    let currentDate = selectedDate;
    if(modeD1==='date'){
      setDate1(currentDate);
      setModeD1('time');
    } else {
      setShowD1(false);
      setModeD2('date');
      setDate1(currentDate);
    }
  };
  const onChangeD2 = (event:any, selectedDate:any) => {
    let currentDate = selectedDate;
    if(modeD2==='date'){
      setDate2(currentDate);
      setModeD2('time');
    } else {
      setShowD2(false);
      setModeD2('date');
      setDate2(currentDate);
    }
  };
  const btnRemovePicture = () => {
    let temp = {...requestDetail};
    temp.PathPictureFixed = '';
    setRequestDetail(temp);
  }
  const btnTakePicture = () => {
    if(requestDetail.PathPictureFixed===""){
      setModalVisible(true);
    }
  }
  const onTxtRootCaseChange = (text:string) => {
    let temp = {...requestDetail};
    temp.RootCase = text;
    setRequestDetail(temp);
  }
  const onTxtSolutionChange = (text:string) => {
    let temp = {...requestDetail};
    temp.Solution = text;
    setRequestDetail(temp);
  }
  const onCommentChange = (text:string) => {
    let temp = {...requestDetail};
    temp.Comments = text;
    setRequestDetail(temp);
  }
  const onStatusChange = (text:string) => {
    let temp = {...requestDetail};
    temp.Status = text;
    setRequestDetail(temp);
  }
  const updateImageLink = (link:string) => {
    let temp = {...requestDetail};
    temp.PathPictureFixed = link;
    setRequestDetail(temp);
    setModalVisible(false);
  }
  const btnChooseAssignee = () => {
    if(infor?.Infor.Role==='man'){
      setAssigneeModal(true);
    } else {
      ShowAlert(toast,2,mylang?.MyLang.errormessage.permissionchooseassignee+"");      
    }
  }
  const onAssigneChoose = (EmployeeCode: string, FullName:string, FullName2: string) => {
    let temp = {...requestDetail};
    if(temp.ListAssignee===undefined){
      temp.ListAssignee = [];
    }
    let temp2 = temp.ListAssignee.filter(fi=>fi.EmployeeCode===EmployeeCode);
    if(temp2.length===0){
      let keyP = false;
      if(temp.ListAssignee.length===0){
        keyP = true;
      }
      temp.ListAssignee.push({ IdRow: 0,
        DocEntry: requestDetail.DocEntry,
        EmployeeCode: EmployeeCode,
        KeyPerson: keyP,
        FullName: FullName,
        EditWho: infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.EmployeeNo,
        Choice: false,
        FullName2: FullName2 })
    }
    setRequestDetail(temp);
  }
  const btnDeleteAssignee = (empCode: string) => {
    if(infor?.Infor.Role==='man'){
      let temp = {...requestDetail};
      let temp2 = temp.ListAssignee.filter(fi=>fi.EmployeeCode!==empCode);
      temp.ListAssignee = temp2;
      setRequestDetail(temp);
    }else{
      ShowAlert(toast,2,mylang?.MyLang.errormessage.permissionchooseassignee+'');
    }
  }

  const onCheckBoxChange = (keyChange: string) => {
    if(infor?.Infor.Role==='man'){
      let temp = {...requestDetail};
      temp.ListAssignee.map((ci,i)=>{
        ci.KeyPerson = false;
      })
      temp.ListAssignee.map((ci,i)=>{
        if(ci.EmployeeCode===keyChange){
          ci.KeyPerson = true;
        }
      })
      //temp.ListAssignee = temp2;
      setRequestDetail(temp);
    }else {
      ShowAlert(toast,2,mylang?.MyLang.errormessage.permissionchooseassignee+'');
    }
  }
  const btnSave = () => {
    let temp = {...requestDetail};
    if(temp.ListAssignee !== undefined) {
      if(temp.ListAssignee.filter(fi=>fi.KeyPerson===true).length===0){
        ShowAlert(toast,2,mylang?.MyLang.errormessage.notyetchoosekeyperson+'');
        return;
      }
    } else {
      ShowAlert(toast,2,''+mylang?.MyLang.repairrequestscreen.main.assignee+mylang?.MyLang.errormessage.isrequired);
      return;
    }
    if(infor?.Infor.Role.trim()==='emp'){
      if(temp.Solution===''){
        ShowAlert(toast,2,''+mylang?.MyLang.repairrequestscreen.main.solution+mylang?.MyLang.errormessage.notempty+mylang?.MyLang.errormessage.cantsave);
        return;
      }
      if(temp.RootCase.trim()===''){
        ShowAlert(toast,2,''+mylang?.MyLang.repairrequestscreen.main.rootcase+mylang?.MyLang.errormessage.notempty+mylang?.MyLang.errormessage.cantsave);
        return;
      }
    }
    let addWho = infor?.Infor.EmployeeNo===undefined?'':infor?.Infor.UserName;
    temp.EditWho = addWho;
    fetch(connect?.StrCont + 'api/modify/modify_cwticket/update',
    {
      method: 'POST',
      body: JSON.stringify(temp)
    })
    .then(response => response.json())
    .then((responseData) => {
      ShowAlert(toast,1,mylang?.MyLang.errormessage.insertsuccess+'');
      props.navigation.goBack();
    })
    .catch((err)=>{
      ShowAlert(toast,2,mylang?.MyLang.errormessage.insertfail+':'+err);
    })
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.repairrequestscreen.main.title2}</Text>
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
            <Box pointerEvents={(props.route.params.sourcelink==='history'||(infor?.Infor.Role!=='man'&&requestDetail.KeyEmpCode!==infor?.Infor.EmployeeNo))?'none':'auto'}>
              <Box padding={'10px'}>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.equipmentcode}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{requestDetail.Code}</Text>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.equipmentlocation}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{requestDetail.Location}</Text>
                  </Box>
                </Flex>
                <Flex paddingTop={'10px'} direction="row">
                <Box width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.equipmentname}</Text>
                    <Text color={'#000000'} fontSize={'md'} isTruncated>{requestDetail.Name}</Text>
                </Box>
                <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.priority}</Text>
                    {requestDetail.Priority===1?(<Text color={mylang?.MyLang.color.low}>{mylang?.MyLang.combostring.priority.low}</Text>):
                    (requestDetail.Priority===2?(<Text color={mylang?.MyLang.color.medium}>{mylang?.MyLang.combostring.priority.medium}</Text>):
                    (<Text color={mylang?.MyLang.color.urgency}>{mylang?.MyLang.combostring.priority.high}</Text>))}
                  </Box>
                </Flex>
                {requestDetail.Description===''?'':<Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.description}</Text>
                    <Text color={'#000000'} fontSize={'md'}>{requestDetail.Description}</Text>
                </Box>}
                <Box paddingTop={'10px'} width={'100%'}>
                    <Flex direction='row'>
                      <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.rootcase}</Text><Box display={infor?.Infor.Role==='man'?'none':'flex'} paddingLeft={'2px'} marginTop={'3px'}><Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Box>
                    </Flex>
                    <TextArea color={'#000000'} fontSize={'md'} onChangeText={onTxtRootCaseChange} value={requestDetail.RootCase} h={'70px'} />
                </Box>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Flex direction='row'>
                      <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.solution}</Text><Box display={infor?.Infor.Role==='man'?'none':'flex'} paddingLeft={'2px'} marginTop={'3px'}><Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Box>
                    </Flex>
                    <TextArea color={'#000000'} fontSize={'md'} onChangeText={onTxtSolutionChange} value={requestDetail.Solution} h={'70px'} />
                </Box>
                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                  <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.before}</Text>
                    <Box width={'100%'}>
                    <Pressable>
                        {({ isPressed }) => {
                          return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} width={'100%'} height={'150px'}>
                          <Box width={'100%'}>
                            <Box width={'100%'} height={'150px'}>
                              {(requestDetail.PathPicture==='')? <Image source={require("../../../assets/images/empty_photo.jpg")} borderRadius={20} alt="image link error" resizeMode="stretch" style={{ height: '100%'}} />:
                              <Image source={{ uri: requestDetail.PathPicture }} borderRadius={20} alt="image link error" resizeMode="stretch" style={{ height: '100%'}} />
                              }
                            </Box>
                          </Box>
                          
                        </Box>;
                        }}
                      </Pressable>                      
                    </Box>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.after}</Text>
                    <Box width={'100%'}>
                      <Pressable onPress={btnTakePicture}>
                        {({ isPressed }) => {
                          return <Box width={'100%'} height={'150px'}>
                            <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} width={'100%'}>
                              <Box width={'100%'} height={'150px'}>
                                {(requestDetail.PathPictureFixed==='')? <Image source={require("../../../assets/images/empty_photo.jpg")} borderRadius={20} alt="image link error" resizeMode="stretch" style={{ height: '100%'}} />:
                                <Image source={{ uri: requestDetail.PathPictureFixed }} borderRadius={20} alt="image link error" resizeMode="stretch" style={{ height: '100%'}} />
                                }
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
                                {/* <Box position={'absolute'} bottom={0} right={0}>
                                  <IconButton onPress={btnRemovePicture} _icon={{
                                      as: FontAwesome5,
                                      name: "expand-arrows-alt",
                                      color: '#D8FF66',
                                      size: 'sm'
                                    }} />
                                </Box> */}
                              </Box>
                            </Box>
                            
                          </Box>;
                        }}
                      </Pressable>
                    </Box>
                  </Box>
                </Flex>

                <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Flex direction='row'>
                      <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.remark}</Text><Box display={infor?.Infor.Role==='emp'?'none':'flex'} paddingLeft={'2px'} marginTop={'3px'}><Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Box>
                    </Flex>
                    {/* <Box borderRadius={'5px'} borderColor={'rgb(216, 216, 216)'} borderWidth={1}>
                      <Picker
                        selectedValue={requestDetail.Comments}
                        onValueChange={onCommentChange}>
                        <Picker.Item label={mylang?.MyLang.combostring.danhgia.good} color="#000000" value="Y" />
                        <Picker.Item label={mylang?.MyLang.combostring.danhgia.notgood} color="#000000" value="" />
                      </Picker>
                    </Box> */}
                      <Select isDisabled={infor?.Infor.Role==='man'?false:true} selectedValue={requestDetail.Comments} accessibilityLabel="Please Choose" placeholder="Please Choose" _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />
                      }} onValueChange={itemValue => onCommentChange(itemValue)}>
                        <Select.Item label={mylang?.MyLang.combostring.danhgia.good} value="Y" />
                        <Select.Item label={mylang?.MyLang.combostring.danhgia.notgood} value="" />
                      </Select>
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}>
                  <Flex direction='row'>
                    <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.status}</Text><Box display={infor?.Infor.Role==='man'?'none':'flex'} paddingLeft={'2px'} marginTop={'3px'}><Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Box>
                  </Flex>
                    {/* <Box borderRadius={'5px'} borderColor={'rgb(216, 216, 216)'} borderWidth={1}>
                      <Picker
                        selectedValue={requestDetail.Status}
                        onValueChange={onStatusChange}>
                        <Picker.Item label={mylang?.MyLang.combostring.status.open} color="#000000" value="1" />
                        <Picker.Item label={mylang?.MyLang.combostring.status.onhold} color="#000000" value="2" />
                        <Picker.Item label={mylang?.MyLang.combostring.status.inprogress} color="#000000" value="3" />
                        <Picker.Item label={mylang?.MyLang.combostring.status.complete} color="#000000" value="4" />
                      </Picker>
                    </Box> */}
                    

                    <Select isDisabled={(isComplete&&infor?.Infor.Role==='emp')?true:false} selectedValue={requestDetail.Status} accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />
                      }} onValueChange={itemValue => onStatusChange(itemValue)}>
                        <Select.Item label={mylang?.MyLang.combostring.status.open} value="1" />
                        <Select.Item label={mylang?.MyLang.combostring.status.onhold} value="2" />
                        <Select.Item label={mylang?.MyLang.combostring.status.inprogress} value="3" />
                        <Select.Item label={mylang?.MyLang.combostring.status.complete} value="4" />
                    </Select>
                  </Box>
                </Flex>

                {/* <Flex paddingTop={'10px'} direction="row">
                  <Box width={'48%'}>
                    <Text color={'#878787'}>Cost :</Text>
                    <Input color="#000000" fontSize={'md'} height={'58px'} placeholder="Cost Input" />
                    
                  </Box>
                  <Box paddingLeft={'10px'} width={'48%'}></Box>
                </Flex> */}
                <Box pointerEvents={infor?.Infor.Role==='man'?'auto':'none'} paddingTop={'10px'} width={'100%'} >
                    <Flex direction='row'>
                      <Text color={'#878787'}>{mylang?.MyLang.repairrequestscreen.main.assignee}</Text><Box display={infor?.Infor.Role==='emp'?'none':'flex'} paddingLeft={'2px'} marginTop={'3px'}><Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Box>
                    </Flex>
                    <Box width={'100%'} backgroundColor={'#EFF7EF'} borderRadius={'5px'} borderColor={'rgb(216, 216, 216)'} borderWidth={1} paddingLeft={'20px'} paddingRight={'20px'}  paddingTop={'5px'}  paddingBottom={'5px'}>
                      <Button width={'100%'} height={'40px'} onPress={btnChooseAssignee}>{mylang?.MyLang.repairrequestscreen.main.assigneechoose}</Button>
                      {
                        requestDetail.ListAssignee!==undefined && requestDetail.ListAssignee.length>0?
                        requestDetail.ListAssignee.map((ci,i)=>{
                          return <Flex key={i} paddingTop={'15px'} direction="row">
                            <Box width={'100%'}>
                              <Pressable onPress={()=>{onCheckBoxChange(ci.EmployeeCode)}}>
                                <Box width={'100%'}>
                                  <Text fontSize={'md'}>{ci.FullName}</Text>
                                </Box>
                                <Box width={'100%'} position='absolute'>
                                  <Box position={'absolute'} top={0} right={0}>
                                  <Flex direction="row">
                                    {
                                      ci.KeyPerson?<Box marginTop={'2px'}><Fontisto name="checkbox-active" size={18} color="#004000" /></Box>:
                                      <Box marginTop={'2px'}><Fontisto name="checkbox-passive" size={18} color="#004000" /></Box>
                                    }

                                    <Box width={'20px'}/>
                                    <Box marginTop={'-5px'}>
                                    <IconButton onPress={()=>{ btnDeleteAssignee(ci.EmployeeCode); }} _icon={{
                                          as: Fontisto,
                                          name: "close-a",
                                          color: '#7F7F00',
                                          size: '16px'
                                        }} />

                                    </Box>
                                    <Box width={'10px'}/>
                                  </Flex>
                                  </Box>
                                </Box>
                              </Pressable>
                              
                            </Box>
                          </Flex>
                        }):null
                      }
                    </Box>
                </Box>
                
                <Box width={'100%'} paddingTop={'20px'}>
                  <Box height={'40px'} width={'100%'}>
                  <Button onPress={btnSave} width={'100%'} height={'40px'} size={'20px'}><Text color={'#CCFFFF'}>{mylang?.MyLang.repairrequestscreen.main.btnsave}</Text></Button>
                    {/* <Box>
                    </Box>
                    <Box width={'100%'} height={'40px'} position='absolute'>
                      <Box position={'absolute'} top={0} right={0}>
                        <Button onPress={btnSave} width={'100px'} height={'40px'} size={'20px'}><Text color={'#CCFFFF'}>{mylang?.MyLang.repairrequestscreen.main.btnsave}</Text></Button>
                      </Box>  
                    </Box> */}
                  </Box>
                </Box>
                <Box height={'20px'}></Box>
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
      <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <CameraScreen btnDeleteImage={()=>{}} canDelete={false} location='@images@CMMS@CMMS_CAM@images@TicketRepair@' btnTurnOffCamera={()=>{}} btnUpdateLink={updateImageLink} chooseImageFromLib={false} navigation={props.navigation}></CameraScreen>
        </Box>
      </Modal>
      <CbbAssignee modalVisible={assigneeModal} closeModalVisible={()=>setAssigneeModal(false)}
      assigner={requestDetail.ListAssignee} setAssigner={onAssigneChoose} />
    </Box>
  );
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
  FullName2: string;
}
interface RequestDetail {
  IdRow: number;
  DocEntry: number;
  EquipID: number;
  StartDate: string;
  EndDate: string;
  Cost: number;
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
  EditWho: string;
  ListAssignee: ArrayAssignee;
  PCId: string;
  KeyEmpCode: string;
}

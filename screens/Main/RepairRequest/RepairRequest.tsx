import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { Center, Box, Pressable, Icon, Text, HStack, Flex, Input, Modal, Divider, Switch, Button, IconButton, useToast, Avatar } from "native-base";
import { Fontisto, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import BarCodeScreen from '../../Component/BarCodeScreen';
import Layout from '../../../constants/Layout';
import CbbAssignee from './CbbAssignee';
import ShowAlert from '../../../components/Util/Alert';
type RepairRequestScreenProps =
  RepairRequestScreenObj;

interface RepairRequestScreenObj {
  route:any;
  navigation: any;
}
export default function RepairRequestScreen(props: RepairRequestScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [barVisible, setBarVisible] = useState<boolean>(false);
  const [listRequest, setListRequest] = useState<ArrayRequest>([]);
  const [strFilter, setStrFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [mAssign, setMAssign] = useState<boolean>(false);
  const [requestDetail, setRequestDetail] = useState<RequestDetail>({ IdRow: 0,DocEntry: 0,EquipID: 0,StartDate: '',EndDate: '',Cost: 0,EditWho: '',StopEquipment: 0,Code: '',Name: '',
  Location: '',Priority: 0,Description: '',RootCase: '',Solution: '',PathPicture: '',PathPictureFixed: '',SourceNo: '',Status: '',Comments: '',ListAssignee: [],
  DocumentType: '', Assignee: '', Downtime: 0, WorkTime: 0, EstTime: 0, Requestor: '', AddWho: '' });
  const [currDocEntry, setCurrDocEntry] = useState<string>('');
  const toast = useToast();
  const [assigneeModal, setAssigneeModal] = useState(false);
  const [listOpen, setListOpen] = useState<boolean>(true);
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
      loadListRequest(listOpen);
    });
    return willFocusSubscription;
  }, [listOpen]);
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const btnTakeBarCode = () => {
    setBarVisible(true);
  }
  const updateBarCode = (barcode:string) => {
    const lstTemp = listRequest.filter(fi=>fi.QRCode===barcode);
    if(lstTemp.length>0){
      props.navigation.navigate('RepairRequestDetail', {repairID: lstTemp[0].DocEntry, sourcelink: 'list' });
    }
  }
  const loadRequestDetail = (repairID: string) => {
    fetch(connect?.StrCont+'api/select/get_repair_request_detail/'+repairID)
      .then(response => response.json())
      .then((responseData) => {
        setRequestDetail(responseData[0]);
        if(responseData[0].Status==='4'){
          
        }
      })
      .catch((err) => {
        
      });
  }
  const loadListRequest = (listOpe:boolean) => {
    let isOld = '1';
    if(listOpe) {
      isOld = '0';
    }
    setLoading(true);
    const rowdata = '{ "EmployeeNo" : "' + infor?.Infor.EmployeeNo + '" , "GroupUser": "' + infor?.Infor.GroupUser + '", "IsOld": "'+isOld+'" }';
    fetch(connect?.StrCont+'api/select/get_list_repair_request',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData:ArrayRequest) => {
        setListRequest(responseData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }
  const btnChooseAssignee = () => {
    if(infor?.Infor.Role==='man'){
      setAssigneeModal(true);
    } else {
      ShowAlert(toast,2,mylang?.MyLang.errormessage.permissionchooseassignee+"");      
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
      //props.navigation.goBack();
      setMAssign(false);
      let tempRQ = listRequest.filter(fi=>fi.RepairID===currDocEntry);
      if(tempRQ.length>0){
        let tempList = temp.ListAssignee.filter(fi=>fi.KeyPerson===true);
        if(tempList.length>0){
          tempRQ[0].EmployeeCode = tempList[0].FullName2;
        }

        
      }
      console.log(tempRQ);
    })
    .catch((err)=>{
      ShowAlert(toast,2,mylang?.MyLang.errormessage.insertfail+':'+err);
    })
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.homescreen.menu.listrepairrequest}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              <Box padding={'10px'}>
                <Flex direction='row'>
                  <Box width={'80%'}>
                  <Input value={strFilter} color={'#555555'} onChangeText={(text)=>setStrFilter(text)} backgroundColor={'#E9E9E9'} fontSize={'md'} borderRadius={'10px'} w={{ base: "100%", md: "25%" }} InputLeftElement={<Icon as={<Fontisto name="search" />} size={5} ml="2" color="muted.400" />} placeholder={mylang?.MyLang.repairrequestscreen.main.search1} />
                  </Box>
                  <Box paddingLeft={'20px'} width={'20%'}>
                    <Button onPress={()=> props.navigation.navigate('NewRequest') }><Ionicons name="add-outline" size={28} color="white" /></Button>
                  </Box>
                </Flex>
                
              </Box>
              <Box backgroundColor={'#E9E9E9'} height={'10px'}></Box>
              {
                loading===false ?
                listRequest.length===0?
                <Center>
                    <Box padding={'20px'}>
                      <Text fontSize={'14px'}>{mylang?.MyLang.errormessage.listempty}</Text>
                    </Box>
                </Center>:
                
                listRequest.filter(fi=>
                  (fi.RepairID.indexOf(strFilter)!==-1||
                  fi.Code.toLowerCase().indexOf(strFilter.toLowerCase())!==-1||
                  fi.Name.toLowerCase().indexOf(strFilter.toLowerCase())!==-1||
                  fi.QRCode.toLowerCase().indexOf(strFilter.toLowerCase())!==-1)).map((ci,i)=>{
                  return <Pressable key={i} onPress={()=>{ props.navigation.navigate('RepairRequestDetail', {repairID: ci.DocEntry, sourcelink: 'list' }); }}
                  onLongPress={()=>{ loadRequestDetail(ci.DocEntry);setMAssign(true);setCurrDocEntry(ci.RepairID); }}
                  >
                    {({ isPressed }) => {
                      return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} paddingTop={'15px'} paddingLeft={'20px'} paddingRight={'20px'}>
                        <Box>
                          <Box width={'90%'}>
                            <Text fontSize={'14px'} isTruncated>
                              <Text color={'#555555'}>{ci.Code + ' - ' + ci.Name}</Text>
                            </Text>
                          </Box>
                          <Box width={'100%'} position={'absolute'}>
                            <Box width={'10%'} position={'absolute'} right={0} top={'0px'}>
                              {
                                ci.EmployeeCode===undefined?null:
                                (ci.Picture===''?<Avatar size={'xs'} bg="green.500">
                                  {ci.EmployeeCode}
                                </Avatar>:<Avatar size={'xs'} bg="green.500" source={{
                                  uri: ci.Picture
                                }}>
                                  {ci.EmployeeCode}
                                </Avatar>)
                              }
                            </Box>
                          </Box> 
                        </Box>
                        <Box>
                          <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                            <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                              {mylang?.MyLang.repairrequestscreen.main.description}
                            </Text>{ci.Description}
                          </Text>
                        </Box>
                        <Box>
                          <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                            <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                              {mylang?.MyLang.repairrequestscreen.main.postingdate}
                            </Text>
                            <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                              {' '}{ci.PostingDate}
                            </Text>
                          </Text>
                        </Box>
                        <Box>
                          <Box>
                            <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                              <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                                {mylang?.MyLang.repairrequestscreen.main.priority}
                              </Text>
                              <Text color={'#C0C0C0'} fontSize={'12px'} isTruncated>
                                {' '}{ci.Priority===1?(<Text color={mylang?.MyLang.color.low}>Low</Text>):
                                (ci.Priority===2?(<Text color={mylang?.MyLang.color.medium}>Medium</Text>):
                                (<Text color={mylang?.MyLang.color.urgency}>Urgency</Text>))}
                              </Text>
                            </Text>
                          </Box>
                          <Box width={'100%'} position={'absolute'}>
                            <Box position={'absolute'} right={0} top={'0px'}>
                              
                            </Box>
                          </Box> 
                        </Box>
                        
                        <Box height={'15px'}></Box>
                        {i===listRequest.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
                    </Box>;
                    }}
                  </Pressable>
                })
                :<Center height={'600px'}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </Center>
              }
              
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
          
          <Center h={'50px'} w={125}>
            <Flex direction='row'>
              <Text marginTop={'11px'}>{listOpen===true?'Open':'Complete'}</Text>
              <Switch value={listOpen} defaultIsChecked onValueChange={(val)=> {setListOpen(val);loadListRequest(val);}} size="sm" />
            </Flex>
          </Center>
        </HStack>
      </Box>
      <Modal height={Layout.window.height} isOpen={barVisible} onClose={()=>{setBarVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <BarCodeScreen btnUpdateBarCode={updateBarCode} navigation={props.navigation}></BarCodeScreen>
        </Box>
      </Modal>
      <Modal isOpen={mAssign} onClose={()=>{setMAssign(false)}} size={'full'}>
        <Box height={'300px'} width={'100%'} backgroundColor={'white'}>
        <Box paddingTop={'10px'} width={'100%'} >
              <Text color={'#878787'} italic>{mylang?.MyLang.repairrequestscreen.main.assignee} <Text color={'#0000CC'}>#{currDocEntry}</Text> </Text>
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
                    <Box>
                    </Box>
                    <Box width={'100%'} height={'40px'} position='absolute'>
                      <Box position={'absolute'} top={0} right={0}>
                        <Button onPress={btnSave} width={'100px'} height={'40px'} size={'20px'}><Text color={'#CCFFFF'}>{mylang?.MyLang.repairrequestscreen.main.btnsave}</Text></Button>
                      </Box>  
                    </Box>
                  </Box>
                </Box>
        </Box>
      </Modal>
      <CbbAssignee modalVisible={assigneeModal} closeModalVisible={()=>setAssigneeModal(false)}
      assigner={requestDetail.ListAssignee} setAssigner={onAssigneChoose} />
    </Box>
  );
}
interface ArrayRequest extends Array<Request> { }
interface Request {
  RepairID: string;
  PostingDate: string;
  Code: string;
  Name: string;
  Priority:number;
  Description: string;
  QRCode: string;
  EmployeeCode: string;
  DocEntry: string;
  Picture: string;
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
}

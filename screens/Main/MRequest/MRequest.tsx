import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { Center, Box, Pressable, Text, HStack, Flex, Divider, Switch, useToast, Modal, Avatar, Input, Icon } from "native-base";
import { Fontisto, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';
import BarCodeScreen from '../../Component/BarCodeScreen';
import Layout from '../../../constants/Layout';
import ShowAlert from '../../../components/Util/Alert';
type MRequestScreenProps =
  MRequestScreenObj;

interface MRequestScreenObj {
    navigation: any;
}
export default function MRequestScreen(props: MRequestScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [barVisible, setBarVisible] = useState(false);
  const [listRequest, setListRequest] = useState<ArrayMRequest>([]);
  const [loading, setLoading] = useState(true);
  //const [listOld, setListOld] = useState(false);
  const toast = useToast();
  const [listOpen, setListOpen] = useState<boolean>(true);
  const [strFilter, setStrFilter] = useState<string>('');
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener('focus', () => {
        loadListRequest(listOpen);
    });
    return willFocusSubscription;
  }, [listOpen]);
  const loadListRequest = (listOpe:boolean) => {
    let isOld = '1';
    if(listOpe) {
      isOld = '0';
    }
    setLoading(true);
    const rowdata = '{ "EmployeeNo" : "' + infor?.Infor.EmployeeNo + '" , "GroupUser": "' + infor?.Infor.GroupUser + '", "IsOld": "'+isOld+'" }';
    fetch(connect?.StrCont+'api/select/get_list_maintenance_request',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData:ArrayMRequest) => {
        setListRequest(responseData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const btnTakeBarCode = () => {
    setBarVisible(true);
  }
  const updateBarCode = (barcode:string) => {
    let chkExist = false;
    let WOID = 0;
    listRequest.map(ci=>{
      ci.Equip.map(ki=>{
        if(ki.QRCode===barcode){
          chkExist = true;
          WOID = ci.WorkOrderNo;
        }
      })
    })
    if(chkExist){
      props.navigation.navigate('MRequestDetail', { requestID: WOID, sourcelink: 'list' });
    } else {
      ShowAlert(toast,1,mylang?.MyLang.errormessage.noplan+"");
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.maintenancescreen.main.title1}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              <Box padding={'10px'}>
                <Box>
                  <Input value={strFilter} color={'#555555'} onChangeText={(text)=>setStrFilter(text)} backgroundColor={'#E9E9E9'} fontSize={'md'} borderRadius={'10px'} w={{ base: "100%", md: "25%" }} InputLeftElement={<Icon as={<Fontisto name="search" />} size={5} ml="2" color="muted.400" />} placeholder={mylang?.MyLang.repairrequestscreen.main.search1} />
                </Box>
              </Box>
              <Box backgroundColor={'#E9E9E9'} height={'10px'}></Box>
              <Box paddingBottom={'10px'} paddingRight={'10px'} paddingLeft={'10px'} paddingTop={'0px'}>
                {
                  loading===false ?
                  listRequest.length===0?<Center>
                    <Box padding={'20px'}>
                      <Text fontSize={'16px'}>{mylang?.MyLang.errormessage.listempty}</Text>
                    </Box>
                  </Center>:(
                  listRequest.filter(fi=>fi.Equip.filter(cfi=>
                    cfi.Code.toLowerCase().indexOf(strFilter.toLowerCase())!==-1||
                    cfi.Name.toLowerCase().indexOf(strFilter.toLowerCase())!==-1
                    ).length>0).map((ci,i)=>{
                    return <Pressable key={i} onPress={()=>{ props.navigation.navigate('MRequestDetail', { requestID: ci.WorkOrderNo, sourcelink: 'list' }); }}>
                      {({ isPressed }) => {
                        return <Box paddingTop={'15px'} paddingLeft={'20px'} paddingRight={'20px'}>
                          <Box>
                            <Box>
                              <Text fontSize={'14px'} isTruncated>
                                <Text color={'#000000'}>{'WO#'+ci.WorkOrderNo}
                                  
                                </Text>
                              </Text>
                            </Box>
                            <Box width={'100%'} position={'absolute'}>
                              <Box position={'absolute'} right={0} top={0}>
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
                          {ci.Description===''?null:<Text color={'#C0C0C0'} fontSize={'12px'}><Text color={'#C0C0C0'} fontSize={'12px'}>{mylang?.MyLang.maintenancescreen.main.description}</Text>{' '+ci.Description}</Text>}
                          <Box>
                            <Text fontSize={'12px'} color={'#C0C0C0'}>{mylang?.MyLang.maintenancescreen.main.duedate}
                              <Text>{ci.DueDate}</Text>
                            </Text>
                          </Box>
                          <Box>
                            <Box>
                              <Text fontSize={'12px'} color={'#C0C0C0'}>
                                  {mylang?.MyLang.maintenancescreen.main.priority}
                                    {ci.Priority===1?(<Text color={mylang?.MyLang.color.low}>Low</Text>):
                                    (ci.Priority===2?(<Text color={mylang?.MyLang.color.medium}>Medium</Text>):
                                    (<Text color={mylang?.MyLang.color.urgency}>Urgency</Text>))}
                              </Text>
                            </Box>
                            <Box width={'100%'} position={'absolute'}>
                              <Box position={'absolute'} right={0} top={0}>
                              
                              </Box>
                            </Box> 
                          </Box>
                          <Box>
                          {
                            ci.Equip.map((qi,r)=>{
                              return <Box key={r}>
                                <Box width={'95%'}>
                                  <Text isTruncated color={'#555555'} key={r}>
                                    {
                                      qi.Status==='10'?<FontAwesome5 name="check" size={10} color="#4CA64C" />:'   '
                                    }
                                    {' '+qi.Code + ' - '+qi.Name+ ' - ' +qi.Location}</Text>
                                </Box>
                                <Box width={'100%'} position={'absolute'}>
                                  <Box position={'absolute'} right={'6px'} top={'6px'}>
                                    
                                  </Box>
                                </Box>
                              </Box>
                            })
                          }
                          </Box>
                          <Box height={'15px'}></Box>
                          {i===listRequest.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
                      </Box>;
                      }}
                    </Pressable>
                  }))
                  :<Center height={'600px'}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </Center>
                }
              </Box>
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
    </Box>
  );
}
interface ArrayMRequest extends Array<MRequest> { }
interface MRequest {
  WorkOrderNo: number;
  Priority: number;
  Description: string;
  Equip: ArrayEquipment;
  DueDate: string;
  EmployeeCode: string;
  Picture: string;
}
interface ArrayEquipment extends Array<Equipment> { }
interface Equipment {
  EquipId: number;
  Code:string;
  Name:string;
  Location: string;
  QRCode: string;
  Status: string;
}

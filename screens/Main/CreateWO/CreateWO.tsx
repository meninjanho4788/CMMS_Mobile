import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { Center, Button, Box, Pressable, Icon, Text, Modal, Flex, Divider, Checkbox, TextArea, IconButton, useToast } from "native-base";
import { Fontisto, Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import {Calendar} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import { ApplicationState } from '../../../store';
import Layout from '../../../constants/Layout';
import ShowAlert from '../../../components/Util/Alert';
type CreateWOScreenProps =
  CreateWOScreenObj;
interface CreateWOScreenObj {
    navigation: any;
}
export default function CreateWOScreen(props: CreateWOScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const [priority, setPriority] = useState<string>('1');
  const [dayChoose, setDayChoose] = useState<string>('');
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<ArrayOneDay>([]);
  const [oneday, setOneday] = useState<datetype>({});
  const [equipment, setEquipment] = useState<ArrayOneDay>([]);
  const [loading, setLoading] = useState(true);
  const [currDay, setCurrDay] = useState<string>('2022-03-20');
  const [isWO, setIsWO] = useState<boolean>(true);
  const [requestDetail, setRequestDetail] = useState<ArrayMRequestDetail>([]);
  const [equipDetail, setEquipDetail] = useState<ArrayEquipInfor>([]);
  const toast = useToast();
  useEffect(() => {
    const dateNow = new Date();
    setCurrDay(dateNow.getFullYear() + '-' + String(dateNow.getMonth()+1).padStart(2, '0') + '-' + String(dateNow.getDate()).padStart(2, '0'));
    loadCalendar(dateNow.getMonth()+1);
  }, []);
  const loadEquip = (equipID: string, dateStr: string) => {
    const rowdata = '{ "EquipID" : "' + equipID + '" , "NextDate": "' + dateStr + '" }';
    fetch(connect?.StrCont+'api/select/get_calendar_equip',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: rowdata
      }).then(response => response.json())
      .then((responseData) => {
        setEquipDetail(responseData);
        console.log(responseData);
      })
      .catch((err) => {
        ShowAlert(toast,2,"Have error:"+err);
      });

  }
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
        })
        setRequestDetail(responseData);
      })
      .catch((err) => {
      });
  }
  const loadCalendar  = (dayNum:number) => {
    setLoading(true);
    fetch(connect?.StrCont+'api/select/get_calendar/'+(dayNum).toString())
    .then(response => response.json())
    .then((responseData:ArrayOneDay) => {
      setCalendar(responseData);
      let arrDay:string[]=[];
      responseData.map(ci=>{
        if(arrDay.indexOf(ci.NextDate)===-1){
          arrDay.push(ci.NextDate);
        }
      })
      let strA = '{';
      let temp:ArrayOneDay=[];
      arrDay.map(ci=>{
        temp = responseData.filter(fi=>fi.NextDate===ci && fi.OnTime==='Over');
        if(temp.length>0){
          strA += '"'+ci+'": { "selected": true, "selectedColor": "#FF2F2F" },';
        }else{
          strA += '"'+ci+'": { "selected": true, "selectedColor": "#3299FF" },';
        }
      })
      strA = strA.slice(0, strA.length - 1);
      if(strA!==''){
        strA += ' }';
      }
      if(strA!==undefined && strA!==''){
        let strJson:datetype = JSON.parse(strA);
        setOneday(strJson);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log('Loi calendar:'+err);
      setLoading(false);
    });
  }
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const onDayPressA = (day:any) => {
    setDayChoose(String(day.day).padStart(2, '0') +'-'+  String(day.month).padStart(2, '0') +'-'+day.year);
    const dayC = calendar.filter(fi=>fi.NextDate===day.dateString);
    setEquipment(dayC);
    const strDay =day.year + '-' + String(day.month).padStart(2, '0') + '-' + String(day.day).padStart(2, '0'); 
    setCurrDay(strDay);
  }
  const btnSave = () => {
    setShowModalDetail(false);
  }
  return (
    <Box height={'100%'} width={'100%'}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}/>
      <Box height={Layout.window.height}>
        <Box height={'100%'} width={'100%'} backgroundColor={'white'}>
          <ScrollView>
            <Box width={'100%'} height={'80px'}>
              <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
                <Box height={'34px'}/>
                <Center height={'46px'}>
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.calendarscreen.main.title}</Text>
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
            <Box>
            {
              loading===false?<Calendar
              initialDate={currDay}
              onDayPress={onDayPressA}
              monthFormat={'ddd dd-MM-yyyy'}
              onMonthChange={(month)  => {
                loadCalendar(month.month);
                setCurrDay(month.year + '-' + String(month.month).padStart(2, '0') + '-01');
              }}
              renderArrow={direction => { if ( direction == 'left') return (<Fontisto name="angle-left" size={18} color="#B9C6EC" />); if ( direction == 'right') return (<Fontisto name="angle-right" size={18} color="#B9C6EC" />);}}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              hideExtraDays={false}
              disableMonthChange={false}
              firstDay={0}
              disableAllTouchEventsForDisabledDays={false}
              enableSwipeMonths={true}
              markedDates={oneday}
            />:<Center height={'300px'}>
              <ActivityIndicator size="large" color="#00ff00" />
            </Center>
            }
            
            <Divider my="2" />
            <Box display={dayChoose===''?'none':'flex'} paddingTop={'10px'} width={'100%'} >
              <Text paddingLeft={'20px'} color={'#878787'}>{mylang?.MyLang.calendarscreen.main.listequipment}<Text bold color={'#FF1919'}>{dayChoose}</Text></Text>
              <Box display={equipment.length === 0?'none':'flex'} width={'100%'} paddingTop={'0px'}  paddingBottom={'10px'}>
                {
                  equipment.map((ci,i)=>{
                    return <Pressable key={i} onPress={()=>{
                      if(ci.WorkOrderNo===''){
                        setIsWO(false);
                        loadEquip(ci.EquipId.toString(),currDay);
                      } else {
                        setIsWO(true);
                        loadRequestDetail(parseInt(ci.WorkOrderNo));
                      }
                      setShowModalDetail(true);
                      }}>
                    {({ isPressed }) => {
                      return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} paddingTop={'15px'} paddingLeft={'20px'} paddingRight={'20px'}>
                        <Box>
                          <Box>
                            <Text fontSize={'14px'} isTruncated>
                              <Text color={'#555555'}>{ci.Code + ' - ' + ci.Name}</Text>
                            </Text>
                          </Box>
                          <Box width={'100%'} position={'absolute'}>
                            <Box position={'absolute'} right={0} top={'2px'}>
                            
                            </Box>
                          </Box> 
                        </Box>
                        
                        <Box>
                        {
                          ci.OnTime==='Over'?(<Text color={'#FF2F2F'} fontSize={'12px'}>
                          {
                            ci.Status===''?('OVER'):('WO#'+ci.WorkOrderNo+'.'+
                              (ci.Status==='1'?mylang?.MyLang.combostring.status.open:
                              (ci.Status==='2'?mylang?.MyLang.combostring.status.onhold:
                              (ci.Status==='3'?mylang?.MyLang.combostring.status.inprogress:mylang?.MyLang.combostring.status.complete))))
                          }
                          </Text>):(<Text color={'#3299FF'} fontSize={'12px'}>
                          {
                            ci.Status===''?(''):('WO#'+ci.WorkOrderNo+'.'+
                              (ci.Status==='1'?mylang?.MyLang.combostring.status.open:
                              (ci.Status==='2'?mylang?.MyLang.combostring.status.onhold:
                              (ci.Status==='3'?mylang?.MyLang.combostring.status.inprogress:mylang?.MyLang.combostring.status.complete))))
                          }
                          </Text>)
                        }
                        </Box>
                        <Box>
                          <Text fontSize={'12px'} color={'#C0C0C0'}>
                          {'Finish date: '+ci.FinishDate}
                          </Text>
                        </Box>
                        <Box height={'15px'}></Box>
                        {i===equipment.length-1?null:<Center><Box width={'80%'}><Divider bg="#E9E9E9" thickness="1" orientation="horizontal" /></Box></Center>}
                    </Box>;
                    }}
                  </Pressable>;
                  })
                }
              </Box>
              <Box display={equipment.length === 0 && dayChoose !== ''?'flex':'none'} width={'100%'} paddingLeft={'20px'} paddingRight={'20px'}  paddingTop={'0px'}  paddingBottom={'10px'}>
                <Box marginTop={'5px'} width={'100%'} height={'50px'} borderRadius={'5px'} backgroundColor={'#E5E5E5'} padding={'10px'}>
                  <Center width={'100%'}>
                    <Text color={'#444444'} isTruncated fontSize={'md'}>{mylang?.MyLang.errormessage.nomaintenaceequipment}</Text>
                  </Center>
                </Box>
              </Box>
            </Box>
        </Box>
      </ScrollView>
    </Box>
  </Box>
  <Modal height={Layout.window.height} isOpen={showModalDetail} onClose={() => setShowModalDetail(false)} size={'full'}>
    <Box height={'100%'} backgroundColor={'white'} width={'100%'}>
    <ScrollView>
      {
        isWO?<Box>

        <Box width={'100%'} height={'80px'}>
          <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
            <Box height={'34px'}/>
            <Center height={'46px'}>
              <Text fontSize={'16px'} bold color={'#484F4F'}>WO#{requestDetail.length>0?requestDetail[0].IdRow:''}</Text>
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
                          return <Pressable key={i}>
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


      </Box>:<Box>

            <Box width={'100%'} height={'80px'}>
            <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
              <Box height={'34px'}/>
              <Center height={'46px'}>
                
                {equipDetail.length>0?
                <Text fontSize={'14px'} bold color={'#484F4F'}>{equipDetail[0].Code+' - '+equipDetail[0].Name+' - '+equipDetail[0].Location}</Text>
                :null}
              </Center>
            </ImageBackground>
          </Box>
          <Box padding={'20px'}>
              <Box paddingTop={'10px'} width={'100%'}>
                <Text color={'#878787'}>{mylang?.MyLang.maintenancescreen.main.listofwork}</Text>
                <Box paddingTop={'10px'} paddingRight={'10px'} paddingBottom={'10px'} paddingLeft={'10px'}>
                {equipDetail.length>0 && equipDetail[0].ListWork.length>0 && equipDetail[0].ListWork.map((vi,o)=>{
                  return <Box key={o}>
                    <Box width={'80%'}><Text isTruncated color={'#000000'}>{vi.Code+' - '+vi.Name}</Text></Box>
                    <Box>
                      <Text isTruncated fontSize={'12px'} color={'#999999'}>{vi.Description}</Text>
                    </Box>
                  </Box>
                })}
                </Box>
              </Box>
                
                <Box height={'50px'} />
            </Box>
            </Box>
      }
           
       
    </ScrollView>
    </Box>
  </Modal>
</Box>
  );
}
interface ArrayOneDay extends Array<OneDay> { }
interface OneDay {
  EquipId: number;
  NextDate: string;
  WOEquipId: string;
  Code: string;
  Name: string;
  WorkOrderNo: string;
  Status: string;
  DueDate: string;
  EndDate: string;
  OnTime: string;
  FinishDate: string;
}
interface datetype {
  [key: string]: MarkingProps;
};
interface MarkingProps {
  selected?: boolean;
  selectedColor?: string;
}
interface ArrayMRequestDetail extends Array<MRequestDetail> { }
interface MRequestDetail {
  IdRow: number;
  Priority: number;
  Status: string;
  Description: string;
  DueDate: string;
  ListEquipment: ArrayListEquipment;
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

interface ArrayEquipInfor extends Array<EquipInfor> { }
interface EquipInfor {
  EquipID: string;
  Code: string;
  Name: string;
  Location: string;
  ListWork: ArrayWork;
}
interface ArrayWork extends Array<Work> { }
interface Work {
  Code: string;
  Name: string;
  Description: string;
}
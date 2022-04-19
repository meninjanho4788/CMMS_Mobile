import React, { useState } from 'react';
import { StatusBar, ScrollView, ImageBackground } from 'react-native';
import { Center, Button, Box, Pressable, Text, HStack, Input, Modal, useToast } from "native-base";
import { Fontisto, Entypo } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';
import Layout from '../../../constants/Layout';
import dataF from '../../../services/api/Select';
import { ApplicationState } from '../../../store';
import BarCodeScreen from '../../Component/BarCodeScreen';
import ShowAlert from '../../../components/Util/Alert';
type HistoryScreenProps =
HistoryScreenObj;

interface HistoryScreenObj {
    navigation: any;
}
export default function HistoryScreen(props: HistoryScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const [equipment, setEquipment] = useState<Equipment>({EquipID:'',Code:'',Name:'',Name2:'',QRCode:'',Location:''});
  const [barVisible, setBarVisible] = useState(false);
  const toast = useToast();
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  const onEquipmentChange = (text:string) => {
    setEquipment({EquipID:equipment.EquipID,Code:equipment.Code,Name:equipment.Name,Name2:equipment.Name2,QRCode:text,Location:equipment.Location});
  }
  const btnEquipmentSearch = () => {
    equipmentSearch(equipment.QRCode);
  }
  const equipmentSearch = async (txtSearch:string) => {
    let obj = await dataF.GetBasicData(connect?.StrCont,'CWEquipment',txtSearch,'a','b');
    if (obj[0] === undefined || obj[0] === null) {
      ShowAlert(toast,2, mylang?.MyLang.errormessage.kotimthay + mylang?.MyLang.equipmenthistoryscreen.main.qrcode+ '');
    } else {
      setEquipment({EquipID:obj[0].EquipID,Code:obj[0].Code,Name:obj[0].Name,Name2:obj[0].Name2,QRCode:obj[0].QRCode,Location:obj[0].Location});
    }
    props.navigation.navigate('HistoryDetail',{QRCode:obj[0].QRCode});
  }
  const updateBarCode = (barcode:string) => {
    equipmentSearch(barcode);
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
                  <Text fontSize={'16px'} bold color={'#484F4F'}>{mylang?.MyLang.equipmenthistoryscreen.main.title1}</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box>
              <Box padding={'10px'}>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'}>{mylang?.MyLang.equipmenthistoryscreen.main.qrcode+' '}<Text fontSize={'11px'} color={"#FF4D4D"}>(*)</Text></Text>
                    <Input value={equipment.QRCode} onChangeText={onEquipmentChange} color={'#0000CC'} fontSize={'md'} height={'40px'} InputRightElement={<Button fontSize={'md'} leftIcon={<Fontisto name="search" size={20} color="#CCFFFF" />} onPress={btnEquipmentSearch} rounded="none" w="2/6" h="full"></Button>} placeholder="QR Code" />
                </Box>
              </Box>
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
          <Center h={'50px'} w={125} />
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
interface Equipment {
  EquipID: string;
  Code: string;
  Name: string;
  Name2: string;
  QRCode: string;
  Location: string;
}
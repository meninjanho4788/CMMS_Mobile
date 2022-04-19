import React from 'react';
import { StatusBar, ScrollView, ImageBackground } from 'react-native';
import { Center, Box, Pressable, Text, IconButton, Input, Flex } from "native-base";
import { Fontisto } from '@expo/vector-icons'; 
import Layout from '../../../constants/Layout';
type MNotificationScreenProps =
  MNotificationScreenObj;

interface MNotificationScreenObj {
    navigation: any;
}
export default function MNotificationScreen(props: MNotificationScreenProps) {
  const btnGoBack = () => {
    props.navigation.goBack();
  }
  return (
    <Box height={'100%'} width={'100%'}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'}/>
      <Box height={Layout.window.height}>
        <Box height={'100%'} width={'100%'}>
          <ScrollView>
            <Box width={'100%'} height={'80px'}>
              <ImageBackground source={require("../../../assets/images/topbg.jpg")} resizeMode="cover" style={{ height: '100%'}}>
                <Box height={'34px'}/>
                <Center height={'46px'}>
                  <Text fontSize={'xl'} bold color={'#484F4F'}>Maintenance Notification</Text>
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
              <Box padding={'10px'}>
                <Box paddingTop={'10px'} width={'100%'}>
                    <Text color={'#878787'} italic>Preventative maintenace:</Text>
                    <Input value={'7'}  color={'#0000CC'} fontSize={'md'} height={'40px'} placeholder="Preventative maintenace" />
                </Box>
                <Box height={'10px'} />
                <Pressable onPress={()=>{ props.navigation.navigate('MRequestDetail'); }}>
                  {({ isPressed }) => {
                    return <Box style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }} backgroundColor={'white'} borderRadius={'10px'} borderColor={'#C2D5AB'} borderWidth={1} width={'100%'} padding={'10px'}>
                      <Box width={'100%'}>
                        <Text width={'75%'} isTruncated fontSize={'14px'} color={'#3232FF'}>10CC01 - Chain conveyor - Intake 1</Text>
                        <Box width={'100%'} height={'50px'} position='absolute'>
                          <Box position={'absolute'} top={0} right={0}>
                            <Text fontSize={'12px'}>Đăng Xuân Tính</Text>
                          </Box>  
                        </Box>
                      </Box>
                      <Flex direction="row" width={'100%'} padding={'10px'} backgroundColor={'#DBFFBE'}>

                        <Text fontSize={'12px'} isTruncated>BC.001</Text>
                        <Text fontSize={'12px'} isTruncated>The furnace body is closed</Text>
                        
                      </Flex>
                      
                      
                    </Box>;
                  }}
                </Pressable> 
              </Box>
            </Box>
          </ScrollView>
        </Box>
      </Box>
      
    </Box>
  );
}

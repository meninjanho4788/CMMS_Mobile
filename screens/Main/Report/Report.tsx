import React, { useState, useEffect } from 'react';
import { StatusBar, ScrollView, ImageBackground } from 'react-native';
import { Center, Box, Pressable, Text, HStack } from "native-base";
import { Fontisto } from '@expo/vector-icons'; 
import Layout from '../../../constants/Layout';
type ReportScreenProps =
  ReportScreenObj;

interface ReportScreenObj {
    navigation: any;
}
export default function ReportScreen(props: ReportScreenProps) {
  const btnGoBack = () => {
    props.navigation.goBack();
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
                  <Text fontSize={'xl'} bold color={'#484F4F'}>This is Text</Text>
                </Center>
              </ImageBackground>
            </Box>
            <Box height={2000}>
              Report Screen
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
          
          <Pressable>
            <Center h={'50px'} w={125}>
              <Box width={'80px'} height={'80px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderColor={'rgb(216, 216, 216)'} borderWidth={1} marginBottom={2} backgroundColor={'white'}>
                <Fontisto name="qrcode" style={{ position:'absolute' }}  size={36} color="#009999" />
              </Box>
            </Center> 
          </Pressable>
          
          <Center h={'50px'} w={125} />
        </HStack>
      </Box>
    </Box>
  );
}

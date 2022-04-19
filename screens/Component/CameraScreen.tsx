import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Center, Box, HStack, Pressable, Modal, AlertDialog, Button } from 'native-base';
import { useSelector } from 'react-redux';
import { Camera } from 'expo-camera';
import { Fontisto } from '@expo/vector-icons';
import { ApplicationState } from '../../store';
import PickImageScreen from './PickImageScreen';
import Layout from '../../constants/Layout';

type CameraScreenProps =
    CameraScreenObj;

interface CameraScreenObj {
  navigation: any;
  btnUpdateLink(link: string): void;
  btnTurnOffCamera(): void;
  chooseImageFromLib: boolean;
  location: string;
  canDelete: boolean;
  btnDeleteImage(): void;
}
let camera:any;
export default function CameraScreen(props: CameraScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [modalVisible, setModalVisible] = useState(false);
  const cancelRef2 = React.useRef(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const onClose2 = () => setIsOpen2(false);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const takePicture = () => {
    const options = { quality: 1, base64: true, fixOrientation: true, exif: true};
    if (camera) {
      camera.takePictureAsync(options).then((photo:any) => {
        //@images@CMMS@CMMS_CAM@images@User@
        fetch(connect?.StrCont+'api/modify/uploadwrite/type1/'+props.location, {
          method: 'POST',
          body: photo.base64
        }).then(response => response.json())
        .then((responseData) => {
          props.btnUpdateLink(responseData.link);
        })
        .catch((err) => {
          console.log('Data error: ' + err);
        });
      });
    }
 };
 const btnDeleteImage = () => {
   props.btnDeleteImage();
}
  return (
    <View style={styles.container}>
      {modalVisible===false?<Camera ref={ (ref) => {camera = ref} } style={styles.camera} type={type}>
      <Box position={'absolute'} bottom={0} backgroundColor={'black'} width={'100%'} height={'200px'}>
        <HStack space={2} justifyContent="center">
          <Center h={'200px'} w={125}>
            {props.chooseImageFromLib?<Pressable onPress={()=>{ setModalVisible(true) }}>
              {({ isPressed }) => {
                return <Box width={'80px'} height={'80px'} style={{ transform: [{ scale: isPressed ? 0.8 : 1 }] }} display={'flex'} justifyContent={'center'} alignItems={'center'} marginBottom={10} borderWidth={4}>
                  <Fontisto name="picture" size={24} color={isPressed?"#F58190":"white"} />
                </Box>;
              }}
            </Pressable>:null}
          </Center>
          <Center  h={'200px'} w={125}>
          <Pressable onPress={takePicture}>
            {({ isPressed }) => {
              return <Box width={'80px'} height={'80px'} style={{ transform: [{ scale: isPressed ? 0.8 : 1 }] }} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderColor={'rgb(216, 216, 216)'} marginBottom={10} borderWidth={4}>
                <Fontisto name="camera" size={36} color={isPressed?"#F58190":"white"} />
              </Box>;
            }}
          </Pressable>
            
          </Center>
          <Center h={'200px'} w={125}>
          {props.canDelete?<Pressable onPress={()=>{ setIsOpen2(true) }}>
              {({ isPressed }) => {
                return <Box width={'80px'} height={'80px'} style={{ transform: [{ scale: isPressed ? 0.8 : 1 }] }} display={'flex'} justifyContent={'center'} alignItems={'center'} marginBottom={10} borderWidth={4}>
                  <Fontisto name="close-a" size={24} color={isPressed?"white":"#F58190"} />
                </Box>;
              }}
            </Pressable>:null}
          </Center>
        </HStack>
      </Box>
      </Camera>:<Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
          <PickImageScreen location={props.location} btnUpdateLink={props.btnUpdateLink} btnTurnOffCamera={props.btnTurnOffCamera}></PickImageScreen>
        </Box>
      </Modal>}
      <AlertDialog leastDestructiveRef={cancelRef2} isOpen={isOpen2} onClose={onClose2}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{mylang?.MyLang.settingsscreen.main.titledeleteimage}</AlertDialog.Header>
          <AlertDialog.Body>
            {mylang?.MyLang.settingsscreen.main.questiondeleteimage}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose2} ref={cancelRef2}>
                {mylang?.MyLang.settingsscreen.main.cancel}
              </Button>
              <Button colorScheme="danger" onPress={btnDeleteImage}>
                {mylang?.MyLang.settingsscreen.main.delete}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width:'100%'
  },
  camera: {
    flex: 1,
    height: '100%',
    width:'100%'
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

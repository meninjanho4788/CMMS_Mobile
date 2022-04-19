import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ApplicationState } from '../../store';
import { Center, Box, HStack, Pressable, Modal, Button, Image } from 'native-base';
import Layout from '../../constants/Layout';
import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

type PickImageScreenProps =
    PickImageScreenObj;

interface PickImageScreenObj {
  btnTurnOffCamera(): void;
  btnUpdateLink(link: string): void;
  location: string;
}
export default function PickImageScreen(props: PickImageScreenProps) {
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string|undefined>(undefined);
  const [imageData, setImageData] = useState<any>(null);
  const [editorVisible, setEditorVisible] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    openImagePickerAsync();
  }, []);
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({base64: true, exif: true });//{base64: true, exif: true}
    
    if (pickerResult.cancelled === true) {
      return;
    }
    //launchEditor(pickerResult.uri);
    //setModalVisible(true);
    //setImageData(pickerResult);
    // const manipResult = await manipulateAsync(
    //   pickerResult.uri,
    //     [
    //       { rotate: 270 },
    //       { flip: FlipType.Vertical },
    //     ],
    //     { compress: 1, format: SaveFormat.PNG, base64:true }
    // );
    //setImageData(manipResult);
    //console.log(manipResult);
    //@images@CMMS@CMMS_CAM@images@User@
    const tempIm = pickerResult.base64.replace(/^data:image\/(png|jpg);base64,/, "");
    fetch(connect?.StrCont+'api/modify/uploadwrite/type1/'+props.location, {
      method: 'POST',
      body: tempIm
    }).then(response => response.json())
    .then((responseData) => {
      console.log(responseData.link);
      props.btnUpdateLink(responseData.link);
    })
    .catch((err) => {
      alert('Data error: ' + err);
    });
    props.btnTurnOffCamera();
  };
  // const _rotate90andFlip = async () => {
  //   const manipResult = await manipulateAsync(
  //     imageData.uri,
  //     [
  //       { rotate: 90 },
  //       { flip: FlipType.Vertical },
  //     ],
  //     { compress: 1, format: SaveFormat.PNG }
  //   );
  //   setImageData(manipResult);
  // };
  // const launchEditor = (uri: string) => {
  //   // Then set the image uri
  //   setImageUri(uri);
  //   // And set the image editor to be visible
  //   setEditorVisible(true);
  // };
  return (
    <View style={styles.container}>

      {/* <Modal height={Layout.window.height} isOpen={modalVisible} onClose={()=>{setModalVisible(false)}} size={'full'}>
        <Box height={'100%'} width={'100%'}>
        {(imageData!==null&&imageData!==undefined)?<Image
          style={{ height: 300, width: 300 }}
          source={{ uri: imageData.uri }}
        />:null}
        <Button onPress={_rotate90andFlip}>Roll Image</Button>
        </Box>
      </Modal> */}
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width:'100%'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
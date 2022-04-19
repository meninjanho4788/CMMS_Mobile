import { Box,Flex,Text } from "native-base";
import { Fontisto } from '@expo/vector-icons';

const ShowAlert = (toast:any,type:number,content:string) => {
  let colorS = '#7FBF7F';
  let iconS = 'like';
  let iconColorS = '#FFFF32';
  if(type===1){
    colorS = '#7FBF7F';
    iconS = 'like';
    iconColorS ='red.400';
  } else if(type===2){
    colorS = 'red.400';
    iconS = 'grunt';
    iconColorS ='#FFFF32';
  }
  return toast.show({
    placement: "top",
    render: () => {
      return <Box bg={colorS} px="2" py="1" rounded="sm" mb={5}>
        <Flex direction='row'>
          <Fontisto name={iconS} size={20} color={iconColorS} />
          <Text paddingLeft={'5px'}>{content}</Text>
        </Flex>
      </Box>;
    }
  });;
};
export default ShowAlert;
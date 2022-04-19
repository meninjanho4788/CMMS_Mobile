import React, { useEffect } from 'react';
import { Center, Box, Pressable, Text, HStack } from "native-base";
type MyTabScreenProps =
MyTabScreenObj;

interface MyTabScreenObj {
  index: number;
  menu: ArrayMyMenu;
  changeIndex(idx:number): void;
}

export default function MyTabScreen(props: MyTabScreenProps) {
  useEffect(() => {
    
  }, []);
  return (
    <Box>
      <HStack justifyContent="center">
        {props.menu.map((ci,i)=>{
          return i===props.index?<Pressable onPress={()=>{props.changeIndex(i)}} width={(100/props.menu.length).toString()+'%'} key={i}>
          {({ isPressed }) => {
            return <Box>
          <Box >
            <Box height={'35px'} backgroundColor={'#E0FFFF'} width={'100%'} borderColor={'#C6DAE0'} borderTopRightRadius={'10px'} borderTopLeftRadius={'10px'} borderWidth={1} borderBottomWidth={0}>
              <Center>
                <Text fontSize={'12px'} marginTop={'5px'} isTruncated>
                  {ci.TabName}
                </Text>
              </Center>
            </Box>
          </Box>
        </Box>}}
        </Pressable>:
        <Pressable onPress={()=>{props.changeIndex(i)}} width={(100/props.menu.length).toString()+'%'} key={i}>
          {({ isPressed }) => {
            return <Box>
            <Box>
            <Box height={'35px'} width={'100%'} borderColor={'#C6DAE0'} borderTopRightRadius={'10px'} borderTopLeftRadius={'10px'} borderWidth={1}>
            <Center>
              <Text fontSize={'12px'} marginTop={'5px'} isTruncated>
                {ci.TabName}
              </Text>
            </Center>
            </Box>
            </Box></Box>
            }}
        </Pressable>
        })}
      </HStack>
    </Box>
  );
}
interface ArrayMyMenu extends Array<MyMenu> { }
interface MyMenu {
  index: number;
  TabName: string|undefined;
}
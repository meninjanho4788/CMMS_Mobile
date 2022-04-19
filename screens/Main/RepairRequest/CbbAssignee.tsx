import React, { useState, useEffect, useRef, Fragment } from 'react';
import { ScrollView  } from 'react-native';
import { Box, Pressable, Text, Flex, Input, Modal } from "native-base";
import { Fontisto, Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../store';

type CbbAssigneeScreenProps =
  CbbAssigneeScreenObj;

interface CbbAssigneeScreenObj {
  modalVisible: boolean;
  closeModalVisible(): void;
  assigner: ArrayAssignee;
  setAssigner(EmployeeCode: string,FullName:string, FullName2:string): void;
}
export default function CbbAssigneeScreen(props: CbbAssigneeScreenProps) {
  const infor = useSelector((state: ApplicationState) => state.loginData);
  const mylang = useSelector((state: ApplicationState) => state.langData);
  const connect = useSelector((state: ApplicationState) => state.connectData);
  const [componentData, setComponentData] = useState<ArrayAssignee>([]);
  const [filterKey, setFilterKey] = useState<string>('');
  useEffect(() => {
    loadAssignee();
  }, []);
  useEffect(() => {
    let temp = componentData;
    if(props.assigner!==undefined){
      temp.map((xi,i)=>{
        xi.Choice = false;
      })
      temp.map((xi,i)=>{
        let tempA = props.assigner.filter(fi=>fi.EmployeeCode===xi.EmployeeCode);
        if(tempA.length>0){
          xi.Choice = true;
        }
      })
    }
    setComponentData(temp);
  }, [props.modalVisible,props.assigner]);
  const loadAssignee = () => {
    console.log(connect?.StrCont);
    fetch(connect?.StrCont+'api/select/get_basic_data/Employee/b/c/d').then(response => response.json())
      .then((responseData:ArrayAssignee) => {
        if(props.assigner!==undefined){
          responseData.map((xi,i)=>{
            let tempA = props.assigner.filter(fi=>fi.EmployeeCode===xi.EmployeeCode);
            if(tempA.length>0){
              xi.Choice = true;
            }
          })
        }
        setComponentData(responseData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const childPress = (empCode: string,fullName: string, fullName2: string) => {
    props.setAssigner(empCode, fullName, fullName2);
    props.closeModalVisible();
  }
  return (
    <Modal isOpen={props.modalVisible} onClose={()=>{props.closeModalVisible()}} size={'full'}>
      <Box height={'400px'} width={'100%'} backgroundColor={'white'} padding={'20px'}>
        <Input placeholder={mylang?.MyLang.repairrequestscreen.main.assigneefilter} value={filterKey} onChangeText={(text)=>{setFilterKey(text)}} rightElement={<Box marginRight={'20px'}><Fontisto name="search" color="#00CCCC" /></Box>} />
        <Box marginTop={'10px'} height={'310px'}>
          <ScrollView>
            <Box>
              {componentData.filter(fi=> (fi.FullName.indexOf(filterKey)!==-1||fi.EmployeeCode.indexOf(filterKey)!==-1)).map((ci,i)=>{
                return <Pressable key={i} onPress={() => { childPress(ci.EmployeeCode,ci.FullName,ci.FullName2) }}>
                  <Box padding={'10px'}>
                    <Box>
                      <Text fontSize={'md'}>{ci.FullName}</Text>
                    </Box>
                    <Box position={'absolute'} width={'100%'}>
                      <Box position={'absolute'} right={0} top={'15px'}>
                        <Flex direction="row">
                          <Text fontSize={'14px'} color={'#979797'}>{ci.EmployeeCode}</Text>  
                          <Box width={'20px'} paddingLeft={'10px'} marginTop={'5px'}>
                            {ci.Choice?<Entypo name="check" color="#1ED760" />:null}
                          </Box>
                        </Flex>
                      </Box>  
                    </Box>
                  </Box>
                </Pressable>
              })}
            </Box>
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
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
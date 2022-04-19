 import { Fontisto } from '@expo/vector-icons';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import * as React from 'react';
 import { ColorSchemeName } from 'react-native';
 import { View } from '../components/Themed';
 import Colors from '../constants/Colors';
 import useColorScheme from '../hooks/useColorScheme';
 import LoadScreen from '../screens/Load/LoadScreen';
 import OtpScreen from '../screens/Load/OtpScreen';
 import LoginScreen from '../screens/Login/LoginScreen';
 import HomeScreen from '../screens/Home/HomeScreen';
 import NotFoundScreen from '../screens/Component/NotFoundScreen';
 import CreateWOScreen from '../screens/Main/CreateWO/CreateWO';
 import HistoryScreen from '../screens/Main/History/History';
 import HistoryDetailScreen from '../screens/Main/History/HistoryDetail';
 import MNotificationScreen from '../screens/Main/MNotification/MNotification';
 import MRequestScreen from '../screens/Main/MRequest/MRequest';
 import MRequestDetailScreen from '../screens/Main/MRequest/MRequestDetail';
 import NewRequestScreen from '../screens/Main/NewRequest/NewRequest';
 import RepairRequestScreen from '../screens/Main/RepairRequest/RepairRequest';
 import RepairRequestDetailScreen from '../screens/Main/RepairRequest/RepairRequestDetail';
 import ReportScreen from '../screens/Main/Report/Report';
 import SettingsScreen from '../screens/Main/Settings/Settings';
 import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
 import LinkingConfiguration from './LinkingConfiguration';
 
 export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
   return (
     <NavigationContainer
       linking={LinkingConfiguration}
       theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <RootNavigator />
     </NavigationContainer>
   );
 }
 
 const Stack = createNativeStackNavigator<RootStackParamList>();

 function RootNavigator() {
   return (
     <Stack.Navigator initialRouteName="Load">
       <Stack.Screen name="Load" component={LoadScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Otp" component={OtpScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
       <Stack.Screen name="CreateWO" component={CreateWOScreen} options={{ headerShown: false }} />
       <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
       <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ headerShown: false }} />
       <Stack.Screen name="MNotification" component={MNotificationScreen} options={{ headerShown: false }} />
       <Stack.Screen name="MRequest" component={MRequestScreen} options={{ headerShown: false }} />
       <Stack.Screen name="MRequestDetail" component={MRequestDetailScreen} options={{ headerShown: false }} />
       <Stack.Screen name="NewRequest" component={NewRequestScreen} options={{ headerShown: false }} />
       <Stack.Screen name="RepairRequest" component={RepairRequestScreen} options={{ headerShown: false }} />
       <Stack.Screen name="RepairRequestDetail" component={RepairRequestDetailScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
       <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
       <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
     </Stack.Navigator>
   );
 }
 
 const BottomTab = createBottomTabNavigator<RootTabParamList>();
 
 function BottomTabNavigator() {
   const colorScheme = useColorScheme();
 
   return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={NotFoundScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: '',
          tabBarIcon: ({ color }) => <Fontisto name="angle-left" style={{ marginBottom: -15 }} size={16} color={color} />,
        })}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            alert('A B C');
          },
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={NotFoundScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => 
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 0.5 * 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: 'rgb(216, 216, 216)',
              borderWidth: 1,
              marginBottom: -10
            }}>
            <Fontisto name="qrcode" size={24} color={color} />
          </View>,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            alert('A B C');
          },
        })}
      />
      <BottomTab.Screen
        name="TabThree"
        component={NotFoundScreen}
        options={{
          title: '',
          tabBarIcon: ({ }) => null,
        }}
      />
    </BottomTab.Navigator>
  );
 }
 
 
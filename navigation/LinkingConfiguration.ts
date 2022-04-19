/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Load: {
        screens: {
          LoadScreen: 'load',
        },
      },
      Otp: {
        screens: {
          OtpScreen: 'otp',
        },
      },
      Login: {
        screens: {
          LoginScreen: 'login',
        },
      },
      Home: {
        screens: {
          HomeScreen: 'home',
        },
      },
      CreateWO: {
        screens: {
          CreateWOScreen: 'createwo',
        },
      },
      History: {
        screens: {
          HistoryScreen: 'history',
        },
      },
      HistoryDetail: {
        screens: {
          HistoryDetailScreen: 'historydetail',
        },
      },
      MNotification: {
        screens: {
          MNotificationScreen: 'mnotification',
        },
      },
      MRequest: {
        screens: {
          MRequestScreen: 'mrequest',
        },
      },
      MRequestDetail: {
        screens: {
          MRequestDetailScreen: 'mrequestdetail',
        },
      },
      NewRequest: {
        screens: {
          NewRequestScreen: 'newrequest',
        },
      },
      RepairRequest: {
        screens: {
          RepairRequestScreen: 'repairrequest',
        },
      },
      RepairRequestDetail: {
        screens: {
          RepairRequestDetailScreen: 'repairrequestdetail',
        },
      },
      Report: {
        screens: {
          ReportScreen: 'report',
        },
      },
      Settings: {
        screens: {
          SettingsScreen: 'settings',
        },
      },
      NotFound: '*',
    },
  },
};

export default linking;

import React from 'react';
import type { RouteName } from './types';
import LoginScreen from '../../screens/LoginScreen';
import MainScreen from '../../screens/MainScreen';
import RegenerationScreen from '../../screens/RegenerationScreen';
import { useRouter } from './RouterProvider';
import MessagesScreen from '../../screens/MessagesScreen';
import IdentityScreen from '../../screens/IdentityScreen';
import Cuidados from '../../screens/CareScreen';
import CheckUps from '../../screens/CheckUps';
import MaintenanceScreen from '../../screens/MaintenanceScreen';
import TrailScreen from '../../screens/TrailScreen';
import NewsScreen from '../../screens/NewsScreen';
import ResultsScreen from '../../screens/ResultsScreen';
import NextStepsScreen from '../../screens/NextStepsScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const screens: Record<RouteName, React.ComponentType> = {
  Login: () => {
    const { navigate } = useRouter();
    return <LoginScreen onEnter={() => navigate('Main')} />;
  },
  Main: MainScreen,
  Regeneration: RegenerationScreen,
  Messages: MessagesScreen,
  Account: IdentityScreen,
  Care: Cuidados,
  Checkups: CheckUps,
  Maintenance: MaintenanceScreen,
  Trail: TrailScreen,
  News: NewsScreen,
  Results: ResultsScreen,
  NextSteps: NextStepsScreen,
  Profile: ProfileScreen,
};

export default function ScreenRegistry() {
  const { current } = useRouter();
  const Screen = screens[current];
  return <Screen />;
}

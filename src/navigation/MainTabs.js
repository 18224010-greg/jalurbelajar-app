import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LearnStack from './LearnStack';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const icon = (symbol) => ({ color }) => <Text style={{ fontSize: 20, color }}>{symbol}</Text>;

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{ tabBarIcon: icon('🏠'), title: 'Beranda' }}
      />
      <Tab.Screen
        name="Belajar"
        component={LearnStack}
        options={{ tabBarIcon: icon('📚'), headerShown: false }}
      />
      <Tab.Screen
        name="Progres"
        component={ProgressScreen}
        options={{ tabBarIcon: icon('📈'), title: 'Progres' }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarIcon: icon('👤'), title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

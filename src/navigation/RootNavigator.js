import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoadingView } from '../components/StateViews';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

// Pengguna belum login -> AuthStack; sudah login -> MainTabs.
export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LoadingView message="Menyiapkan aplikasi..." />
      </View>
    );
  }

  return <NavigationContainer>{user ? <MainTabs /> : <AuthStack />}</NavigationContainer>;
}

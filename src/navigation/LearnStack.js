import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModulesScreen from '../screens/ModulesScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function LearnStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Modules" component={ModulesScreen} options={{ title: 'Modul Belajar' }} />
      <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} options={{ title: 'Detail Modul' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Kuis' }} />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Hasil Kuis', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}

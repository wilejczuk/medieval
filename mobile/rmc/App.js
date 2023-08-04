import MainMenu from './components/MainMenu';
import RusMenu from './components/RusMenu';
import CategoryMenu from './components/CategoryMenu';
import IssuersCoins from './components/IssuersCoins';
import CoinType from './components/CoinType';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Set headerShown to false to hide the header
        }}
      >
        <Stack.Screen name="Home" component={MainMenu} />
        <Stack.Screen name="RusMenu" component={RusMenu} />
        <Stack.Screen name="CategoryMenu" component={CategoryMenu} />
        <Stack.Screen name="IssuersCoins" component={IssuersCoins} />
        <Stack.Screen name="CoinType" component={CoinType} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
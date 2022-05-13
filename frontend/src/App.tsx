import { registerRootComponent } from "expo";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from "./Login";

const Stack = createNativeStackNavigator();

export const endpoint = "http://localhost:3000";

const App = () => {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login/Sign Up">
          <Stack.Screen name="Login/Sign Up" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
};

export default registerRootComponent(App);

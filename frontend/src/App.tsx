import { registerRootComponent } from "expo";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./Home";
import Login from "./Login";
import { RootStackParamList } from "./config";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login/Sign Up">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login/Sign Up" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
};

export default registerRootComponent(App);

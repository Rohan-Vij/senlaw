import { registerRootComponent } from "expo";
import { TailwindProvider } from "tailwind-rn";
import utilities from "../tailwind.json";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import Login from "./screens/Login";
import { RootStackParamList } from "./config";
import Loading from "./components/Loading";

import { setCustomText, setCustomTextInput } from "react-native-global-props";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { useEffect } from "react";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
  });

  useEffect(() => {
    setCustomText({
      style: {
        fontFamily: "Montserrat_400Regular",
      },
    });

    setCustomTextInput({
      style: {
        fontFamily: "Montserrat_400Regular",
      }
    })
  }, [fontsLoaded]);

  return !fontsLoaded ? (
    <Loading />
  ) : (
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

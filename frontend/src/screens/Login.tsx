import { useTailwind } from "tailwind-rn";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import { endpoint, RootStackParamList } from "../config";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login/Sign Up"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Login = ({ navigation }: Props) => {
  const tailwind = useTailwind();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    let result;
    try {
      result = await axios.post(
        endpoint + "/login",
        { username, password },
        { validateStatus: () => true }
      );
    } catch (e) {
      console.error(e);
      return;
    }

    if (result.status === 404) {
      setError("User wasn't found.");
      return;
    } else if (result.status === 401) {
      setError("Username or password are incorrect.");
      return;
    }

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ username, ...result.data })
    );
    navigation.navigate("Home");
  };

  const signup = async () => {
    let result;
    try {
      result = await axios.post(
        endpoint + "/signup",
        { username, password },
        { validateStatus: () => true }
      );
    } catch (e) {
      console.error(e);
      return;
    }

    if (result.status === 400) {
      setError("Username already exists! Please pick another one, or login.");
      return;
    }

    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ username, ...result.data })
    );
    navigation.navigate("Home");
  };

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem("user")) {
        navigation.navigate("Login/Sign Up");
      }
    })();
  }, []);

  return (
    <View
      style={tailwind(
        "flex items-center justify-center h-full w-full bg-gray-100"
      )}
    >
      <Text style={tailwind("text-4xl mb-8")}>Login or Sign Up</Text>

      <Image
        source={require("../assets/icon.png")}
        style={tailwind("h-36 w-36 mb-4")}
      />

      <View style={tailwind("w-2/3 rounded p-4 bg-gray-100 bg-slate-300")}>
        <TextInput
          placeholder="Username"
          style={tailwind(
            "border-2 border-slate-400 rounded w-full px-2 py-1 mb-3 text-xl"
          )}
          value={username}
          onChangeText={(text) =>
            setUsername(text.replace(/[^a-zA-Z0-9-_ ]/g, ""))
          }
          maxLength={20}
        ></TextInput>
        <TextInput
          placeholder="Password"
          style={tailwind(
            "border-2 border-slate-400 rounded w-full px-2 py-1 mb-2 text-xl"
          )}
          value={password}
          maxLength={20}
          onChangeText={(text) => setPassword(text.replace(/ /g, ""))}
          secureTextEntry={true}
        ></TextInput>
        <Pressable
          style={tailwind("bg-orange-700 p-2 rounded w-full mb-3")}
          onPress={login}
        >
          <Text style={tailwind("text-white text-2xl text-center")}>Login</Text>
        </Pressable>
        <Pressable
          style={tailwind("bg-orange-700 p-2 rounded w-full")}
          onPress={signup}
        >
          <Text style={tailwind("text-white text-2xl text-center")}>
            Sign Up
          </Text>
        </Pressable>
        {error !== "" && (
          <Text style={tailwind("text-center text-red-600")}>{error}</Text>
        )}
      </View>
    </View>
  );
};

export default Login;

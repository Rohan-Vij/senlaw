import { useTailwind } from "tailwind-rn";
import { View, Text, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { endpoint, RootStackParamList } from "./config";
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

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    let result;
    try {
      console.log(username, password, endpoint + "/login");
      result = axios.post(endpoint + "/login", {
        username: username,
        password: password,
      }).then((val) => console.log(val));
      console.log("DONE");
    } catch (e) {
      console.error(e);
      return;
    }
    console.log("lol");

    /*
    if (result.status === 404) {
      setError("User wasn't found.");
      return;
    } else if (result.status === 401) {
      setError("Username or password are incorrect.");
      return;
    }

    console.log(result.data);
    await AsyncStorage.setItem("user", { username, ...result.data });
    navigation.navigate("Home");*/
  };

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem("user")) {
        navigation.navigate("Login/Sign Up");
      }
    })();
  }, []);

  return (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-4xl mb-4")}>
        {!isSigningUp ? "Login" : "Sign Up"}
      </Text>
      <View style={tailwind("w-2/3")}>
        <TextInput
          placeholder="Username"
          style={tailwind(
            "border-2 border-slate-300 rounded w-full px-2 py-1 mb-4 text-xl"
          )}
          value={username}
          onChangeText={(text) =>
            setUsername(text.replace(/[^a-zA-Z0-9-_]/g, ""))
          }
          maxLength={20}
        ></TextInput>
        <TextInput
          placeholder="Password"
          style={tailwind(
            "border-2 border-slate-300 rounded w-full px-2 py-1 mb-4 text-xl"
          )}
          maxLength={20}
          onChangeText={(text) => setPassword(text.replace(/ /g, ""))}
          secureTextEntry={true}
        ></TextInput>
        <Pressable
          style={tailwind("bg-blue-500 p-2 rounded w-full mb-3")}
          onPress={() => login()}
        >
          <Text style={tailwind("text-white text-xl text-center")}>
            {!isSigningUp ? "Login" : "Sign Up"}
          </Text>
        </Pressable>
        <Text style={tailwind("text-center mb-3 text-lg")}>or...</Text>
        <Pressable
          style={tailwind("bg-blue-500 p-2 rounded w-full")}
          onPress={() => setIsSigningUp(!isSigningUp)}
        >
          <Text style={tailwind("text-white text-xl text-center")}>
            {!isSigningUp ? "Sign Up" : "Login"}
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

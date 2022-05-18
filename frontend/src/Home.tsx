import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { RootStackParamList, UserAuth } from "./config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  const tailwind = useTailwind();
  const [auth, setAuth] = useState<null | UserAuth>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        navigation.navigate("Home");
        return;
      }
      setAuth(JSON.parse(user) as UserAuth);
    })();
  }, []);

  return !auth ? (
    <Text style={tailwind("text-3xl mt-4")}>Loading...</Text>
  ) : (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-3xl text-center mt-4 mb-4")}>
        Welcome, {auth.username}!
      </Text>
      <View style={tailwind("rounded-full w-11/12 h-12 bg-white border-2 border-gray-300 flex items-center flex-row px-4")}>
        <MaterialIcons name="search" size={24} />
        <TextInput style={tailwind("bg-blue-500 grow")} value={search} onChangeText={setSearch} placeholder="Search..." />
      </View>
    </View>
  );
};

export default Home;

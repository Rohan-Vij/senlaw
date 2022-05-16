import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { RootStackParamList, UserAuth } from "./config";

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

  return !auth ? <Text style={tailwind("text-xl")}>Loading...</Text> : (
    <>
      <Text style={tailwind("text-xl")}>Hello, {auth.username}</Text>
    </>
  );
};

export default Home;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { RootStackParamList, UserAuth } from "./config";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
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

  return (
    <>
      <Text>{auth?.username || "Loading..."}</Text>
      <Text>{auth?.access_token || "Loading..."}</Text>
    </>
  );
};

export default Home;

import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "react-native";
import { RootStackParamList } from "./config";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  return <Text>balls</Text>;
};

export default Home;

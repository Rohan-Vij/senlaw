import { View, ActivityIndicator } from "react-native";
import { useTailwind } from "tailwind-rn";

const Loading = () => {
  const tailwind = useTailwind();

  return (
    <View style={tailwind("h-full w-full flex justify-center items-center")}>
      <ActivityIndicator size="large" color="#2243ff" />
    </View>
  );
};
export default Loading;

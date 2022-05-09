import { useTailwind } from "tailwind-rn";
import { View, Text, TextInput, Pressable } from "react-native";

const Login = () => {
  const tailwind = useTailwind();

  return (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-4xl mb-4")}>Login</Text>
      <View style={tailwind("w-2/3")}>
        <TextInput
          placeholder="Username"
          style={tailwind(
            "border-2 border-slate-300 rounded w-full px-2 py-1 mb-4 text-xl"
          )}
        ></TextInput>
        <TextInput
          placeholder="Password"
          style={tailwind(
            "border-2 border-slate-300 rounded w-full px-2 py-1 mb-4 text-xl"
          )}
        ></TextInput>
        <Pressable style={tailwind("bg-blue-500 p-2 rounded w-full")}>
          <Text style={tailwind("text-white text-xl text-center")}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

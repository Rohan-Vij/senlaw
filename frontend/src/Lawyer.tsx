import { View, Text, Pressable, Linking } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { Lawyer } from "./config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const LawyerComponent = ({ lawyer }: { lawyer: Lawyer }) => {
  const tailwind = useTailwind();

  return (
    <Pressable
      style={tailwind("w-full bg-neutral-100 rounded-md p-4 mb-4")}
      onPress={() => Linking.openURL(`tel:${lawyer.contact}`)}
    >
      <Text style={tailwind("text-xl mb-1")}>
        {lawyer.username} ({lawyer.title})
      </Text>
      <Text style={tailwind("text-sm text-slate-500 mb-2")}>
        {lawyer.description}
      </Text>
      <View style={tailwind("flex flex-row items-center mb-2")}>
        <MaterialIcons name="call" style={tailwind("mr-2")} />
        <Text>{lawyer.contact}</Text>
      </View>
      <View style={tailwind("flex flex-row mb-1")}>
        {lawyer.tags.map((tag) => (
          <Text
            key={tag}
            style={tailwind(
              "border border-gray-600 rounded-full px-2 mr-2 text-center"
            )}
          >
            {tag}
          </Text>
        ))}
      </View>
    </Pressable>
  );
};

export default LawyerComponent;

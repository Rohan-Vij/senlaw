import { View, Text, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { Lawyer } from "../config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";
import { EventScreenNavigationProp } from "../screens/Lawyer";

const LawyerComponent = ({ lawyer }: { lawyer: Lawyer }) => {
  const tailwind = useTailwind();
  const navigation = useNavigation<EventScreenNavigationProp["navigation"]>();

  return (
    <Pressable
      style={tailwind("w-full bg-neutral-100 rounded-md p-4 pb-2 mb-4")}
      onPress={() => navigation.navigate("Lawyer", { postId: lawyer._id })}
    >
      <Text style={tailwind("text-2xl mb-1")}>
        {lawyer.username} ({lawyer.title})
      </Text>
      <Text style={tailwind("text-lg text-slate-800 mb-2")} numberOfLines={3}>
        {lawyer.description}
      </Text>
      <View style={tailwind("flex flex-row items-center mb-2")}>
        <MaterialIcons name="call" style={tailwind("mr-2")} />
        <Text style={tailwind("text-lg")}>{lawyer.contact}</Text>
      </View>
      <View style={tailwind("flex flex-row flex-wrap mb-1")}>
        {lawyer.tags.map((tag) => (
          <Text
            key={tag}
            style={tailwind(
              "border border-gray-600 rounded-full px-2 mr-2 text-center text-lg mb-2"
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

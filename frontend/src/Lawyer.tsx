import { View, Text } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { Lawyer } from "./config";

const LawyerComponent = ({ lawyer }: { lawyer: Lawyer }) => {
  const tailwind = useTailwind();

  return (
    <View
      style={tailwind("w-full bg-neutral-100 rounded-md p-4 mb-4")}
      key={lawyer.username}
    >
      <Text style={tailwind("text-xl mb-1")}>{lawyer.username} ({lawyer.title})</Text>
      <View style={tailwind("flex flex-row mb-1")}>
        {lawyer.tags.map((tag) => (
          <Text key={tag} style={tailwind("border border-gray-600 rounded-full px-2 mr-2 text-center")}>{tag}</Text>
        ))}
      </View>
      <Text style={tailwind("text-sm text-slate-500")}>
        {lawyer.description}
      </Text>
    </View>
  );
};

export default LawyerComponent;

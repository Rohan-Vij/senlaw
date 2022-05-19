import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTailwind } from "tailwind-rn/dist";
import { filterTags } from "./util";

const TagPicker = ({
  shown,
  setShown,
  items,
  currentItems,
  setCurrentItems,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
  items: string[];
  currentItems: string[];
  setCurrentItems: (items: string[]) => void;
}) => {
  const tailwind = useTailwind();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    setMatches(items.filter((value) => !currentItems.includes(value)));
    setSearch("");
  }, [shown]);

  useEffect(() => {
    setMatches(
      filterTags(
        items.filter((value) => !currentItems.includes(value)),
        search
      )
    );
  }, [search]);

  return (
    <>
      <Pressable
        style={{
          ...tailwind("absolute top-0 h-1/3 w-full bg-black opacity-70"),
          display: shown ? undefined : "none",
        }}
        onPress={() => setShown(false)}
      ></Pressable>
      <View
        style={{
          ...tailwind(
            "absolute bottom-0 h-2/3 w-full bg-gray-100 flex items-center p-4"
          ),
          display: shown ? undefined : "none",
        }}
      >
        <View
          style={tailwind(
            "z-10 rounded-full w-11/12 h-12 bg-white border-2 border-gray-500 flex items-center flex-row px-4 mb-4"
          )}
        >
          <MaterialIcons name="search" size={24} />
          <View style={tailwind("ml-4 mr-2 grow border-b-2 border-blue-400")}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="I need legal help with..."
            />
          </View>
        </View>
        <ScrollView
          style={tailwind("w-full bg-white border-2 border-gray-500")}
        >
          {matches.map((tag) => (
            <Pressable
              onPress={() => {
                if (!currentItems.includes(tag))
                  setCurrentItems([...currentItems, tag]);
                setShown(false);
              }}
              key={tag}
            >
              <Text style={tailwind("p-2")}>{tag}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default TagPicker;

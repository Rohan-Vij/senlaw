import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { filterTags } from "./util";

const SearchDropdown = ({
  items,
  currentItems,
  setCurrentItems,
}: {
  items: string[];
  currentItems: string[];
  setCurrentItems: (items: string[]) => void;
}) => {
  const tailwind = useTailwind();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    setMatches(filterTags(items, search));
    console.log(matches);
  }, [search]);

  return (
    <View style={tailwind("ml-4 mr-2 grow border-b-2 border-blue-400 relative")}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        onFocus={() => setSearchFocused(true)}
        placeholder="I need legal help with..."
      />
      <ScrollView
        style={{
          ...tailwind(
            "z-10 absolute top-7 w-full h-48 grow bg-white border border-gray-300"
          ),
          display: searchFocused ? undefined : "none",
        }}
      >
        {matches.map((tag) => (
          <Pressable
            onPress={() => {
              setSearchFocused(false);
              if (!currentItems.includes(tag))
                setCurrentItems([...currentItems, tag]);
            }}
          >
            <Text style={tailwind("p-2")} key={tag}>
              {tag}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchDropdown;

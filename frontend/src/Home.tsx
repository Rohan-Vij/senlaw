import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { Lawyer, RootStackParamList, UserAuth } from "./config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loading from "./Loading";
import LawyerComponent from "./Lawyer";
import SearchDropdown from "./SearchDropdown";

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
  const tags = ["Law", "Health", "Home", "Criminal"];
  const [lawyersList, setLawyersList] = useState<Lawyer[]>([]);
  const [tagsShown, setTagsShown] = useState<string[]>([]);

  useEffect(() => {
    setLawyersList(
      Array(10).fill({
        username: "lawyer123",
        title: "hi",
        description: "very good lawyer",
        tags: ["Health", "Criminal", "Tax"],
      })
    );

    (async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        navigation.navigate("Home");
        return;
      }

      setAuth(JSON.parse(user) as UserAuth);
    })();
  }, []);

  useEffect(() => {
    console.log("TAGS SHOWN", tagsShown);
  }, [tagsShown]);

  return !auth ? (
    <Loading />
  ) : (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-3xl text-center mt-8 mb-4")}>
        Welcome, {auth.username}!
      </Text>
      <View
        style={tailwind(
          "z-10 rounded-full w-11/12 h-12 bg-white border-2 border-gray-300 flex items-center flex-row px-4 mb-4"
        )}
      >
        <MaterialIcons name="search" size={24} />
        <SearchDropdown
          items={tags}
          currentItems={tagsShown}
          setCurrentItems={setTagsShown}
        />
      </View>
      {tagsShown && (
        <View style={tailwind("flex flex-row mb-4")}>
          {tagsShown.map((tag) => (
            <Pressable
              onPress={() =>
                setTagsShown(tagsShown.filter((value) => value !== tag))
              }
            >
              <View
                style={tailwind(
                  "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center"
                )}
              >
                <MaterialIcons name={"cancel"} style={tailwind("mr-1")} />
                <Text style={tailwind("text-center")}>{tag}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
      <ScrollView style={tailwind("bg-slate-400 w-full p-4")}>
        {!lawyersList ? (
          <Loading />
        ) : (
          <>
            {lawyersList.map((lawyer) => (
              <LawyerComponent lawyer={lawyer} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

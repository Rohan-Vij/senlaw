import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { endpoint, Lawyer, RootStackParamList, UserAuth } from "./config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loading from "./Loading";
import LawyerComponent from "./Lawyer";
import TagPicker from "./TagPicker";
import axios, { AxiosRequestConfig } from "axios";

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

  const [lawyersList, setLawyersList] = useState<undefined | Lawyer[]>(undefined);
  const [tags, setTags] = useState<undefined | string[]>(undefined);

  const [tagsShown, setTagsShown] = useState<string[]>([]);
  const [tagPickerShown, setTagPickerShown] = useState(false);

  const getHeaders = (): AxiosRequestConfig<any> => {
    if (auth === null) throw "Tried to get headers without authentication!";
    console.log(auth?.access_token);
    return {
      headers: {
        Authorization: "Bearer " + auth?.access_token,
      },
    };
  };

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

  useEffect(() => {
    if (!auth) return;

    (async () => {
      const headers: AxiosRequestConfig<any> = {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        },
      };

      console.log((await axios.get(endpoint + "/lawyers/all", headers)).data.posts);

      try {
        setLawyersList(
          ((await axios.get(endpoint + "/lawyers/all", headers)).data.posts) as Lawyer[]
        );
      } catch (e) {
        console.error(e);
        return;
      }

      try {
        setTags(
          (
            ((await axios.get(endpoint + "/lawyers/listtags", headers)).data
              .tags) as string[]
          ).map((value) => value.replace(/_/g, " "))
        );
      } catch (e) {
        console.error(e);
        return;
      }
    })();
  }, [auth]);

  useEffect(() => {
    console.log("tags", tags);
  }, [tags]);

  useEffect(() => {
    console.log(lawyersList);
  }, [lawyersList]);

  useEffect(() => {
    //console.log("TAGS SHOWN", tagsShown);
  }, [tagsShown]);

  return !auth || !lawyersList || !tags ? (
    <Loading />
  ) : (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-3xl text-center mt-8 mb-4")}>
        Welcome, {auth.username}!
      </Text>

      <View
        style={tailwind("flex flex-row flex-wrap justify-center mb-4 w-2/3")}
      >
        {tagsShown.length > 0 ? (
          tagsShown.map((tag) => (
            <Pressable
              onPress={() =>
                setTagsShown(tagsShown.filter((value) => value !== tag))
              }
            >
              <View
                style={tailwind(
                  "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center mb-2"
                )}
              >
                <MaterialIcons name={"cancel"} style={tailwind("mr-1")} />
                <Text style={tailwind("text-center text-base")}>{tag}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={tailwind("mr-2 text-base")}>No tags</Text>
        )}
        <Pressable onPress={() => setTagPickerShown(true)}>
          <View
            style={tailwind(
              "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center mb-2 bg-slate-400"
            )}
          >
            <MaterialIcons name={"add-box"} style={tailwind("mr-1")} />
            <Text style={tailwind("text-center text-base")}>Add Tag</Text>
          </View>
        </Pressable>
      </View>

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

      <TagPicker
        shown={tagPickerShown}
        setShown={setTagPickerShown}
        items={tags}
        currentItems={tagsShown}
        setCurrentItems={setTagsShown}
      />
    </View>
  );
};

export default Home;

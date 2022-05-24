import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { endpoint, Lawyer, RootStackParamList, UserAuth } from "../config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Loading from "../components/Loading";
import LawyerComponent from "../components/Lawyer";
import TagPicker from "../components/TagPicker";
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

  const [lawyersList, setLawyersList] = useState<undefined | Lawyer[]>(
    undefined
  );
  const [tagsList, setTagsList] = useState<undefined | string[]>(undefined);

  const [tagsShown, setTagsShown] = useState<string[]>([]);
  const [lawyersShown, setLawyersShown] = useState<Lawyer[]>([]);
  const [tagPickerShown, setTagPickerShown] = useState(false);

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

      try {
        setLawyersList(
          (
            (await axios.get(endpoint + "/lawyers/all", headers)).data
              .posts as Lawyer[]
          ).map((lawyer) => ({
            ...lawyer,
            tags: lawyer.tags.map((tag) => tag.replace(/_/g, " ")),
          }))
        );
      } catch (e) {
        console.error(e);
        return;
      }

      try {
        setTagsList(
          (
            (await axios.get(endpoint + "/lawyers/listtags", headers)).data
              .tags as string[]
          ).map((value) => value.replace(/_/g, " "))
        );
      } catch (e) {
        console.error(e);
        return;
      }
    })();
  }, [auth]);

  useEffect(() => {
    // please the all mighty typescript compiler
    if (lawyersList) setLawyersShown(lawyersList);
  }, [lawyersList]);

  useEffect(() => {
    if (!lawyersList) return;

    setLawyersShown(
      lawyersList.filter((lawyer) =>
        tagsShown.every((tag) => lawyer.tags.includes(tag))
      )
    );
  }, [tagsShown]);

  return !auth || !lawyersList || !tagsList ? (
    <Loading />
  ) : (
    <View style={tailwind("flex items-center justify-center h-full w-full")}>
      <Text style={tailwind("text-3xl text-center mt-8 mb-4")}>
        Welcome, {auth.username}!
      </Text>

      <Text style={tailwind("text-xl text-center mb-4 text-gray-800")}>
        Click a lawyer below to contact!
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
              key={tag}
            >
              <View
                style={tailwind(
                  "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center mb-2"
                )}
              >
                <MaterialIcons
                  name={"cancel"}
                  size={16}
                  style={tailwind("mr-1")}
                />
                <Text style={tailwind("text-center text-base")}>{tag}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={tailwind("mr-2 text-base text-gray-800")}>
            No categories
          </Text>
        )}
        <Pressable onPress={() => setTagPickerShown(true)}>
          <View
            style={tailwind(
              "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center mb-2 bg-slate-400"
            )}
          >
            <MaterialIcons
              name={"add-box"}
              size={16}
              style={tailwind("mr-1")}
            />
            <Text style={tailwind("text-center text-base")}>Filter...</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView style={tailwind("bg-slate-400 w-full p-4")}>
        {!lawyersList ? (
          <Loading />
        ) : (
          <>
            {lawyersShown.length > 0 ? (
              lawyersShown.map((lawyer) => (
                <LawyerComponent key={lawyer._id} lawyer={lawyer} />
              ))
            ) : (
              <Text style={tailwind("text-xl")}>
                No lawyers found! Try removing a few tags.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      <TagPicker
        shown={tagPickerShown}
        setShown={setTagPickerShown}
        items={tagsList}
        currentItems={tagsShown}
        setCurrentItems={setTagsShown}
      />
    </View>
  );
};

export default Home;

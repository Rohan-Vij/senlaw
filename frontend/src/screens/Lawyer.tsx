import Loading from "../components/Loading";
import { View, Text, Pressable, Linking, ScrollView } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import { RootStackParamList, Lawyer, endpoint, UserAuth } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type EventScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Lawyer"
>;

const LawyerScreen = ({ route, navigation }: EventScreenNavigationProp) => {
  const tailwind = useTailwind();

  const { postId } = route.params;

  const [auth, setAuth] = useState<null | UserAuth>();
  const [post, setPost] = useState<undefined | Lawyer>(undefined);

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
        setPost(
          (await axios.get(endpoint + "/lawyers/" + postId, headers)).data
            .post as Lawyer
        );
      } catch (e) {
        console.error(e);
        return;
      }
    })();
  }, [auth]);

  useEffect(
    () => navigation.setOptions({ title: post?.title || "Lawyer" }),
    [post]
  );

  return !post ? (
    <Loading />
  ) : (
    <ScrollView style={tailwind("flex h-full")} contentContainerStyle={tailwind("p-4 pt-8")}>
      <Text style={tailwind("text-4xl mb-2")}>{post.title}</Text>

      <View style={tailwind("flex flex-row flex-wrap mb-2")}>
        {post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <View
              style={tailwind(
                "px-2 mr-2 rounded-full border-2 border-gray-300 flex flex-row items-center mb-2"
              )}
              key={tag}
            >
              <MaterialIcons name="tag" size={16} style={tailwind("mr-1")} />
              <Text style={tailwind("text-center text-base")}>{tag}</Text>
            </View>
          ))
        ) : (
          <Text style={tailwind("mr-2 text-base text-gray-800")}>
            No categories
          </Text>
        )}
      </View>

      <Text style={tailwind("text-xl mb-4")}>Posted by {post.username}</Text>

      <Text style={tailwind("text-lg mb-4")}>{post.description}</Text>

      <View
        style={tailwind(
          "flex flex-col justify-center w-full items-center bg-white p-4 rounded"
        )}
      >
        <Text style={tailwind("text-2xl mb-4")}>Contact:</Text>
        <View
          style={tailwind(
            "flex flex-row justify-center w-full items-center mb-4"
          )}
        >
          <MaterialIcons name="phone" size={32} style={tailwind("mr-4")} />
          <Text style={tailwind("text-xl")}>{post.contact}</Text>
        </View>
        <Pressable
          style={tailwind("p-4 px-8 bg-slate-300 rounded-full")}
          onPress={() => Linking.openURL("tel:" + post.contact)}
        >
          <Text style={tailwind("text-lg")}>Call Now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LawyerScreen;

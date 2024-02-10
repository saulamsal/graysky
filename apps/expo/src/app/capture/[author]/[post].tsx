import { useRef } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { Image, type ImageSource } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { AppBskyFeedDefs } from "@atproto/api";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { PrimaryPost } from "~/components/primary-post";
import { QueryWithoutData } from "~/components/query-without-data";
import { Text } from "~/components/themed/text";
import { TransparentHeaderUntilScrolled } from "~/components/transparent-header";
import { useAgent } from "~/lib/agent";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appIcon = require("../../../../assets/icon.png") as ImageSource;

export default function ShareAsImageScreen() {
  const { author, post: rkey } = useLocalSearchParams<{
    post: string;
    author: string;
  }>();

  const agent = useAgent();
  const captureRef = useRef<ViewShot>(null);
  const router = useRouter();
  const theme = useTheme();

  const post = useQuery({
    queryKey: ["profile", author, "post", rkey, "no-context"],
    queryFn: async () => {
      if (!author || !rkey) throw new Error("Invalid author or post");
      let did = author;
      if (!did.startsWith("did:")) {
        const { data } = await agent.resolveHandle({ handle: author });
        did = data.did;
      }
      const uri = `at://${did}/app.bsky.feed.post/${rkey}`;
      const postThread = await agent.getPostThread({
        uri,
        parentHeight: 0,
        depth: 0,
      });

      const post = postThread.data.thread;

      if (!AppBskyFeedDefs.isThreadViewPost(post)) {
        throw new Error("Post not found");
      }

      return post;
    },
  });

  if (post.data) {
    return (
      <>
        <TransparentHeaderUntilScrolled>
          <ScrollView
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
          >
            <ViewShot
              ref={captureRef}
              options={{ format: "jpg", quality: 0.9 }}
              style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                marginTop: 16,
              }}
            >
              <View className="relative flex-1 px-3 pb-1.5 pt-3">
                <PrimaryPost
                  post={post.data.post}
                  dataUpdatedAt={post.dataUpdatedAt}
                  className="overflow-hidden rounded-lg border"
                />
                <View className="mt-1 flex-row items-center gap-x-1.5">
                  <Text className="text-sm">a bluesky post, via</Text>
                  <Image className="h-3 w-3 rounded" source={appIcon} />
                  <Text className="text-sm">graysky.app</Text>
                </View>
              </View>
            </ViewShot>
            <View className="mt-8 flex-1 p-4">
              <TouchableHighlight
                className="rounded-xl"
                style={{ borderCurve: "continuous" }}
                onPress={async () => {
                  try {
                    const uri = await captureRef.current?.capture?.();
                    if (!uri) throw new Error("Failed to capture image");
                    await Sharing.shareAsync(uri, {
                      mimeType: "image/jpeg",
                      dialogTitle: `Share ${post.data.post.author.handle}'s post`,
                      UTI: "public.jpeg",
                    });
                    router.push("../");
                  } catch (err) {
                    console.error(err);
                    Alert.alert("Error", "Failed to capture image");
                  }
                }}
              >
                <View
                  className="w-full items-center rounded-xl py-3"
                  style={{
                    borderCurve: "continuous",
                    backgroundColor: theme.colors.primary,
                  }}
                >
                  <Text className="text-center text-base font-medium text-white">
                    Share image
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </TransparentHeaderUntilScrolled>
        <Stack.Screen
          options={{
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push("../")}>
                <Text primary className="text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
      </>
    );
  }

  return (
    <>
      <QueryWithoutData query={post} />
      {Platform.OS === "ios" && (
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerShadowVisible: false,
            headerBlurEffect: undefined,
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      )}
    </>
  );
}
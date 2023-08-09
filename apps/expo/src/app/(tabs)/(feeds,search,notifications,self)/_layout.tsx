import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack, useNavigation, useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

import { Avatar } from "../../../components/avatar";
import { useDrawer } from "../../../components/drawer-content";
import { useAgent } from "../../../lib/agent";

const stackOptions = {
  screenOptions: {
    fullScreenGestureEnabled: true,
  },
};

export default function SubStack({
  segment,
}: {
  segment: "(feeds)" | "(search)" | "(notifications)" | "(self)";
}) {
  const openDrawer = useDrawer();
  const navigation = useNavigation();
  const router = useRouter();
  const theme = useTheme();
  const agent = useAgent();

  const headerLeft = () => (
    <TouchableOpacity onPress={() => openDrawer()} className="mr-3">
      <Avatar size="small" />
    </TouchableOpacity>
  );

  if (!agent.hasSession) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-center text-base">Connecting...</Text>
      </View>
    );
  }

  switch (segment) {
    case "(feeds)":
      return (
        <Stack {...stackOptions}>
          <Stack.Screen
            name="feeds/index"
            options={{
              title: "Feeds",
              headerLargeTitle: true,
              headerLeft,
            }}
          />
          <Stack.Screen
            name="feeds/discover"
            options={{
              title: "Discover Feeds",
              headerSearchBarOptions: {},
              presentation: "modal",
              headerRight: Platform.select({
                ios: () => (
                  <TouchableOpacity
                    onPress={() => {
                      if (navigation.canGoBack()) {
                        router.push("../");
                      } else {
                        router.push("/feeds");
                      }
                    }}
                  >
                    <Text
                      style={{ color: theme.colors.primary }}
                      className="text-lg font-medium"
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                ),
              }),
            }}
          />
          <Stack.Screen
            name="feeds/following"
            options={{
              title: "Following",
            }}
          />
        </Stack>
      );
    case "(search)":
      return (
        <Stack {...stackOptions}>
          <Stack.Screen
            name="search/index"
            options={{
              title: "Search",
              headerLeft: Platform.select({
                ios: headerLeft,
              }),
              headerLargeTitle: true,
              headerSearchBarOptions: {},
            }}
          />
          <Stack.Screen
            name="search/posts"
            options={{
              title: "Search Posts",
              headerSearchBarOptions: {},
            }}
          />
          <Stack.Screen
            name="search/feeds"
            options={{
              title: "Search Feeds",
              headerSearchBarOptions: {},
            }}
          />
          <Stack.Screen
            name="search/people"
            options={{
              title: "Search People",
              headerSearchBarOptions: {},
            }}
          />
        </Stack>
      );
    case "(notifications)":
      return (
        <Stack {...stackOptions}>
          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
              headerLargeTitle: true,
              headerLeft,
            }}
          />
        </Stack>
      );
    case "(self)":
      return (
        <Stack {...stackOptions}>
          <Stack.Screen
            name="self"
            options={{
              headerShown: false,
              headerBackTitle: "Profile",
            }}
          />
        </Stack>
      );
  }
}

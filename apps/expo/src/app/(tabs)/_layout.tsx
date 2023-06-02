import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, type ColorValue } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { Stack, Tabs, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Bell, Cloudy, Search, User } from "lucide-react-native";
import { type ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";
import { z } from "zod";

import { DrawerContent, DrawerProvider } from "../../components/drawer-content";
import {
  InviteCodes,
  type InviteCodesRef,
} from "../../components/invite-codes";
import { useAuthedAgent } from "../../lib/agent";
import { useColorScheme } from "../../lib/utils/color-scheme";

export default function AppLayout() {
  const agent = useAuthedAgent();
  const [open, setOpen] = useState(false);
  const inviteRef = useRef<InviteCodesRef>(null);
  const { colorScheme, setColorScheme } = useColorScheme();
  const textColor = colorScheme === "light" ? "#000" : "#FFF";

  const tabBarIconColors =
    colorScheme === "light"
      ? {
          color: {
            focused: "#1C1C1C",
            unfocused: "#9b9b9b",
          },
          fill: {
            focused: "#1C1C1C",
            unfocused: undefined,
          },
        }
      : {
          color: {
            focused: "#fff",
            unfocused: "#fff",
          },
          fill: {
            focused: "#fff",
            unfocused: undefined,
          },
        };
  const tabBarBadgeColor: ColorValue =
    colorScheme === "light" ? "#262626" : "#FFF";
  const notifications = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      return await agent.countUnreadNotifications();
    },
    // refetch every 15 seconds
    refetchInterval: 1000 * 15,
  });

  const renderDrawerContent = useCallback(
    () => (
      <DrawerContent
        openInviteCodes={() => inviteRef.current?.open()}
        textColor={textColor}
      />
    ),
    [textColor],
  );

  useEffect(() => {
    void AsyncStorage.getItem("color-scheme").then((value) => {
      const scheme = z.enum(["light", "dark", "system"]).safeParse(value);
      if (scheme.success) {
        setColorScheme(scheme.data);
      } else {
        void AsyncStorage.setItem(
          "color-scheme",
          "system" satisfies ColorSchemeSystem,
        );
      }
    });
  }, [setColorScheme]);

  const openDrawer = useCallback(() => setOpen(true), []);
  const theme = useTheme();
  const segments = useSegments();

  const iconProps = (focused: boolean) => ({
    color: focused
      ? tabBarIconColors.color.focused
      : tabBarIconColors.color.unfocused,
    fill: focused
      ? tabBarIconColors.fill.focused
      : tabBarIconColors.fill.unfocused,
  });

  return (
    <DrawerProvider value={openDrawer}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "none",
          gestureEnabled: false,
        }}
      />
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={renderDrawerContent}
        drawerType="slide"
        statusBarAnimation="slide"
        drawerStyle={{
          width: Dimensions.get("window").width * 0.8,
          backgroundColor: theme.colors.card,
        }}
        swipeEdgeWidth={Dimensions.get("window").width * 0.1}
        swipeEnabled={segments.length === 3}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            // Would be nice - need to fix composer
            // tabBarStyle: {
            //   position: "absolute",
            //   backgroundColor: "rgba(255, 255, 255, 0.95)",
            // },
          }}
        >
          <Tabs.Screen
            name="(feeds)"
            options={{
              title: "Feeds",
              tabBarIcon({ focused }) {
                return <Cloudy {...iconProps(focused)} />;
              },
            }}
          />
          <Tabs.Screen
            name="(search)"
            options={{
              title: "Search",
              tabBarIcon({ focused }) {
                return <Search {...iconProps(focused)} />;
              },
            }}
          />
          <Tabs.Screen
            name="(notifications)"
            options={{
              title: `Notifications${
                notifications.data?.data?.count || undefined
                  ? ", new items"
                  : ""
              }`,
              tabBarBadge: notifications.data?.data?.count || undefined,
              tabBarBadgeStyle: {
                backgroundColor: tabBarBadgeColor,
                fontSize: 12,
              },
              tabBarIcon({ focused }) {
                return <Bell {...iconProps(focused)} />;
              },
            }}
          />
          <Tabs.Screen
            name="(self)"
            options={{
              title: "Profile",
              tabBarIcon({ focused }) {
                return <User {...iconProps(focused)} />;
              },
            }}
          />
        </Tabs>
      </Drawer>
      <InviteCodes ref={inviteRef} />
    </DrawerProvider>
  );
}

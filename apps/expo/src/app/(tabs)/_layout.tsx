import { Stack, Tabs } from "expo-router";
import { Bell, Cloudy, Search, User } from "lucide-react-native";

export default function AppLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="timeline"
          options={{
            title: "Timeline",
            tabBarShowLabel: false,
            tabBarIcon({ focused }) {
              return <Cloudy color={focused ? "#505050" : "#9b9b9b"} />;
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarShowLabel: false,
            tabBarIcon({ focused }) {
              return <Search color={focused ? "#505050" : "#9b9b9b"} />;
            },
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarShowLabel: false,
            tabBarIcon({ focused }) {
              return <Bell color={focused ? "#505050" : "#9b9b9b"} />;
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarShowLabel: false,
            tabBarIcon({ focused }) {
              return <User color={focused ? "#505050" : "#9b9b9b"} />;
            },
          }}
        />
      </Tabs>
    </>
  );
}
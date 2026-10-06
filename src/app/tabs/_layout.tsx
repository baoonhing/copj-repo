import CustomNavBar from "@/components/CustomNavBar";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
export default function _layout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props: any) => <CustomNavBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: "#fff" },
        }}
      >
        <Tabs.Screen name="homepage" options={{ title: "" }} />
        <Tabs.Screen name="chat" options={{ title: "" }} />
        <Tabs.Screen name="feedback" options={{ title: "" }} />
        <Tabs.Screen name="money" options={{ title: "" }} />
        <Tabs.Screen name="account" options={{ title: "" }} />
      </Tabs>
    </>
  );
}

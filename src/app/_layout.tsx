import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
export default function FirstLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login1" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}

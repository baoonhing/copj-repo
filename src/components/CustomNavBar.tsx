import { Ionicons } from "@expo/vector-icons";
import {
  PlatformPressable,
  Text,
  useLinkBuilder,
  useTheme,
} from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";
const CustomNavBar = ({ state, descriptors, navigation }: any) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        console.log("route:", route);
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
            data: {
              behavior: {
                scrollToTop:
                  isFocused &&
                  options.tabBarRepeatedPressBehavior?.scrollToTop !== false,
                popToTop:
                  isFocused &&
                  options.tabBarRepeatedPressBehavior?.popToTop !== false,
              },
            },
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            {getIcon(route.name)}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label as string}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );

  function getIcon(routename: string) {
    switch (routename) {
      case "homepage":
        return <Ionicons name="home-outline" size={25} />;
      case "chat":
        return <Ionicons name="chatbubble-outline" size={25} />;
      case "feedback":
        return <Ionicons name="star-outline" size={25} />;
      case "money":
        return <Ionicons name="wallet-outline" size={25} />;
      case "account":
        return <Ionicons name="person-outline" size={25} />;
    }
  }
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    bottom: 30,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
  },
});
export default CustomNavBar;

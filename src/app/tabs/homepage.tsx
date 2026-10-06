import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Broom,
  CircleArrowRight,
  CircleEllipsis,
  Package,
  PawPrint,
  Siren,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SwitchMode() {
  const [selected, setSelected] = useState(0);
  const slideX = useRef(new Animated.Value(0)).current;
  const handleUrgent = () => {
    router.push("/urgent");
  };
  const handlePress = (index: number) => {
    setSelected(index);
    Animated.spring(slideX, {
      toValue: index === 0 ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.switchmodeButton}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateX: slideX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 170],
                  }),
                },
              ],
            },
          ]}
        />
        <TouchableOpacity style={styles.tab} onPress={() => handlePress(0)}>
          <Text style={[styles.text, selected === 0 && styles.activeText]}>
            Tìm việc làm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => handlePress(1)}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Hind Kochi",
              color: "white",
              marginLeft: "auto",
            }}
          >
            Đăng việc làm
          </Text>
        </TouchableOpacity>
      </View>
      {selected === 0 ? (
        <>
          <View style={styles.search}>
            <TouchableOpacity style={styles.findtaskButton}>
              <View style={{ marginRight: 4, marginLeft: 12 }}>
                <Ionicons name="search-outline" size={24} color="#828282" />
              </View>

              <Text style={{ color: "#828282", paddingLeft: 12, fontSize: 14 }}>
                Bạn muốn tìm task?
              </Text>

              <View style={styles.iconContainer}>
                <FontAwesome6 name="location-dot" size={24} color="#828282" />
              </View>
            </TouchableOpacity>

            <View style={{ marginLeft: 12 }}>
              <Ionicons name="notifications-outline" size={35} color="black" />
            </View>
          </View>

          <ScrollView horizontal style={{ flexGrow: 0 }}>
            <View style={styles.filter}>
              <View style={styles.filterButton}>
                <Ionicons
                  name="heart-outline"
                  size={24}
                  style={{
                    marginTop: 5,
                    marginLeft: 4,
                    marginRight: 5,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontSize: 14,
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  Loại task
                </Text>
              </View>
              <View style={styles.FilterButtonKC}>
                <Ionicons
                  name="map-outline"
                  size={24}
                  style={{ marginTop: 5, marginLeft: 4, marginRight: 5 }}
                />
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontSize: 14,
                    textAlign: "center",
                    paddingTop: 5,
                    marginLeft: "auto",
                    marginRight: 4,
                  }}
                >
                  Khoảng cách
                </Text>
              </View>
              <View style={styles.filterButton}>
                <Ionicons
                  name="cash-outline"
                  size={24}
                  style={{
                    marginTop: 5,
                    marginLeft: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Inter",
                    fontSize: 14,
                    textAlign: "center",
                    paddingTop: 5,
                    marginLeft: 10,
                    marginRight: 4,
                  }}
                >
                  Thù lao
                </Text>
              </View>
            </View>
          </ScrollView>
          <ScrollView>
            <View
              style={{
                width: "100%",
                marginTop: 12,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("@/assets/images/18-pro-iphone.png")}
                style={styles.AdButton}
                resizeMode="cover"
              />
            </View>
            <View style={styles.categoriesRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleUrgent}
                style={styles.categoryItem}
              >
                <Siren color="black" size={32} />
                <Text style={styles.categoryText}>Urgency</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.categoryItem}>
                <PawPrint color="black" size={30} />
                <Text style={styles.categoryText}>Pet</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.categoryItem}>
                <Broom color="black" size={30} />
                <Text style={styles.categoryText}>Cleaning</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.categoryItem}>
                <Package color="black" size={30} />
                <Text style={styles.categoryText}>Moving</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.categoryItem}>
                <CircleEllipsis color="black" size={30} />
                <Text style={styles.categoryText}>More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.KhamPha}>
              <Text
                style={{ color: "black", fontSize: 17, fontFamily: "Inter" }}
              >
                Khám phá
              </Text>
              <CircleArrowRight
                size={23}
                style={{
                  marginLeft: 12,
                  marginTop: 4,
                }}
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <ScrollView>
          <Text>Đăng việc</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
    color: "black",
  },
  KhamPha: {
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 14,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },
  switchmodeButton: {
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
    position: "relative",
    marginTop: 15,
    backgroundColor: "#828282",
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 3,
    backgroundColor: "#fff",
  },
  slider: {
    position: "absolute",
    width: 192,
    height: 45,
    backgroundColor: "#2C2C2C",
    borderRadius: 50,
  },
  tab: {
    width: 170,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontFamily: "Hind Kochi",
    color: "white",
    textAlign: "center",
  },
  findtaskButton: {
    backgroundColor: "#E6E6E6",
    width: 320,
    height: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    color: "#818080",
    marginLeft: "auto",
    marginRight: 16,
  },
  filter: {
    flexDirection: "row",
    marginTop: 19,
  },
  filterButton: {
    borderRadius: 6,
    borderWidth: 1,
    height: 35,
    width: 120,
    flexDirection: "row",
    borderColor: "#E6E6E6",
    marginLeft: 5,
  },
  FilterButtonKC: {
    borderRadius: 6,
    borderWidth: 1,
    height: 35,
    width: 152,
    flexDirection: "row",
    borderColor: "#E6E6E6",
    marginLeft: 5,
  },
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 60,
  },
  AdButton: {
    aspectRatio: 2.43,
    width: "100%",
    height: 148,
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});

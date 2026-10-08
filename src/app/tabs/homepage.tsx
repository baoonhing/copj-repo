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
const task = [
  {
    id: "1",
    category: "Urgency",
    tag: "Khẩn cấp - trước 15g00",
    price: "30.000đ",
    title: "Nhận hàng Shopee cổng sau KTX khu B",
    desc: "Cần một bạn lấy giúp mình đơn hàng shopee 3017 mang lên trước phòng 409 tòa D4.",
    user: "Phương Vy",
    rating: "4.9 (vàng)",
    distance: "250m",
  },
  {
    id: "2",
    category: "Pet",
    tag: "16g00 - 22/12/2026",
    time: "20m ago",
    price: "150.000đ",
    title: "Dắt cún đi dạo tại công viên KTX",
    desc: "Bé Poodle nhà mình cần đi dạo tầm 30-45 phút quanh Làng Đại học.",
    user: "Minh Anh",
    rating: "5.0",
    distance: "500 m",
  },
  {
    id: "3",
    category: "Moving",
    tag: "8h00 - 15/11/2026",
    time: "33m ago",
    price: "75.000đ/h",
    title: "Phụ chuyển phòng trọ",
    desc: "Vì đồ đạc trong phòng nhiều, mình cần 1 bạn hỗ trợ dọn phòng trọ.",
    user: "Nguyễn Thùy",
    rating: "5.0 (kim cương)",
    distance: "1 km",
  },
  {
    id: "4",
    category: "Cleaning",
    tag: "12g00 - 17/11/2026",
    time: "39m ago",
    price: "120.000đ/h",
    title: "Phụ tìm người dọn vệ sinh căn hộ",
    desc: "Tìm 1 bạn hỗ trợ dọn vệ sinh nhà ở, yêu cầu kỹ tính, gọn gàng và sạch sẽ.",
    user: "Bảo Nhi",
    rating: "5.0 (kim cương)",
    distance: "3 km",
  },
];
export default function SwitchMode() {
  const [selected, setSelected] = useState(0);
  const slideX = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setCategory] = useState<string>("Urgency");
  const handlePress = (index: number) => {
    setSelected(index);
    Animated.spring(slideX, {
      toValue: index === 0 ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };
  const displayTask = task.filter((task) => task.category === selectedCategory);
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
          <Text style={[styles.textD, selected === 1 && styles.activeText]}>
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
                width: "99%",
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
                onPress={() => setCategory("Urgency")}
                style={styles.categoryItem}
              >
                <Siren color="black" size={32} />
                <Text style={styles.categoryText}>Urgency</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.categoryItem}
                onPress={() => setCategory("Pet")}
              >
                <PawPrint color="black" size={30} />
                <Text style={styles.categoryText}>Pet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.categoryItem}
                onPress={() => setCategory("Cleaning")}
              >
                <Broom color="black" size={30} />
                <Text style={styles.categoryText}>Cleaning</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.categoryItem}
                onPress={() => setCategory("Moving")}
              >
                <Package color="black" size={30} />
                <Text style={styles.categoryText}>Moving</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.categoryItem}
                onPress={() => setCategory("More")}
              >
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

            <View style={styles.cardListContainer}>
              {displayTask.length > 0 ? (
                displayTask.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: "/ChitietCV",
                        params: { id: item.id },
                      })
                    }
                  >
                    <View style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.badgeWrapper}>
                          <Text style={styles.badgeText}>{item.tag}</Text>
                        </View>
                        <Text style={styles.cardTime}>{item.time}</Text>
                        <View style={styles.priceBadge}>
                          <Text style={styles.priceText}>{item.price}</Text>
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text numberOfLines={2} style={styles.cardDesc}>
                        {item.desc}
                      </Text>

                      <View style={styles.cardDivider} />

                      <View style={styles.cardFooter}>
                        <Text style={styles.footerUser}>{item.user}</Text>
                        <Text style={styles.footerRating}>★ {item.rating}</Text>
                        <Text style={styles.footerDistance}>
                          {item.distance}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Chưa có bài đăng nào trong mục này
                </Text>
              )}
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
  activeCategoryText: {
    color: "#E04848",
    fontWeight: "700",
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
  textD: {
    fontSize: 16,
    fontFamily: "Hind Kochi",
    color: "white",
    textAlign: "center",
    marginLeft: "auto",
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
  cardListContainer: {
    paddingBottom: 40,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeWrapper: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#E04848",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTime: {
    color: "#888",
    fontSize: 11,
    marginLeft: 8,
  },
  priceBadge: {
    marginLeft: "auto",
    backgroundColor: "#E8F8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: "#27AE60",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  footerRating: {
    fontSize: 12,
    color: "#E67E22",
    marginLeft: 14,
  },
  footerDistance: {
    fontSize: 12,
    color: "#888",
    marginLeft: "auto",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
});

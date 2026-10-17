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
  TextInput,
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

// ===== Chế độ "Đăng việc làm" =====
// Đổi đường dẫn nếu file nằm chỗ khác trong app/
const POST_ROUTES = {
  postJob: "/dangvclam", // dangvclam.tsx - màn Đăng việc
  jobDetail: "/ChitietCV", // ChitietCV.tsx - chi tiết công việc
};

type PostedStatus = "recruiting" | "accepted" | "done";

type PostedJob = {
  id: string;
  title: string;
  price: string;
  time: string;
  postedAgo: string;
  urgent?: boolean;
  status: PostedStatus;
  taskerAvatar?: any;
};

const POSTED_JOBS: PostedJob[] = [
  {
    id: "p1",
    title: "Nhận hàng Shopee ở cổng sau KTX khu B",
    price: "30.000đ",
    time: "KHẨN CẤP - trước 15h00",
    postedAgo: "12m ago",
    urgent: true,
    status: "recruiting",
  },
  {
    id: "p2",
    title: "Nhận giúp tài liệu photo và giao cho mình",
    price: "27.000đ",
    time: "14h00 - 17/09/2026",
    postedAgo: "12h ago",
    status: "accepted",
    taskerAvatar: require("@/assets/images/Vy.png"),
  },
  {
    id: "p3",
    title: "Hỗ trợ chuyển phòng tòa D4 KTX khu B",
    price: "80.000đ",
    time: "9h00 - 29/08/2026",
    postedAgo: "1 day ago",
    status: "done",
    taskerAvatar: require("@/assets/images/Trâm.png"),
  },
];

const POSTED_STATUS = {
  recruiting: { label: "Đang tuyển...", bg: "#E8D77A", color: "#444444" },
  accepted: { label: "Có tasker nhận", bg: "#B7D0FF", color: "#1F3F8F" },
  done: { label: "Hoàn thành", bg: "#C9F7B8", color: "#1C5A10" },
};

const TRUSTED_TASKERS = [
  {
    id: "t1",
    name: "Bảo Nhi",
    rating: "5.0",
    rank: "kim cương",
    avatar: require("@/assets/images/Nhi.png") as any,
    months: "3m",
    diamond: true,
    online: false,
  },
  {
    id: "t2",
    name: "Anh Minh",
    rating: "4.8",
    rank: "Bạc",
    avatar:
      "https://theselfishmeme.co.uk/wp-content/uploads/2025/11/anh-avatar-zalo-mac-dinh-cute-2.webp" as any,
    months: "",
    diamond: false,
    online: true,
  },
];

const toSource = (img: any) => (typeof img === "string" ? { uri: img } : img);

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

  // Chế độ Đăng việc làm
  const [postSearch, setPostSearch] = useState("");
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>(POSTED_JOBS);
  const visiblePosted = postedJobs.filter((j) =>
    j.title.toLowerCase().includes(postSearch.trim().toLowerCase()),
  );
  const handleDeletePosted = (id: string) =>
    setPostedJobs((prev) => prev.filter((j) => j.id !== id));
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
        <>
          <View style={styles.search}>
            <View style={styles.pSearch}>
              <Ionicons name="search-outline" size={24} color="#828282" />
              <TextInput
                style={styles.pSearchInput}
                placeholder="Tìm kiếm...."
                placeholderTextColor="#828282"
                value={postSearch}
                onChangeText={setPostSearch}
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Ionicons name="notifications-outline" size={35} color="black" />
              <View style={styles.pBellDot} />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Banner quảng cáo */}
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

            {/* Nút Đăng việc ngay */}
            <Text style={styles.pAsk}>Bạn cần giúp đỡ?</Text>
            <TouchableOpacity
              style={styles.pPostButton}
              activeOpacity={0.8}
              onPress={() => router.push(POST_ROUTES.postJob as never)}
            >
              <Ionicons name="add" size={28} color="#fff" />
              <Text style={styles.pPostButtonText}>Đăng việc ngay</Text>
            </TouchableOpacity>

            {/* Lịch sử đăng việc */}
            <View style={styles.pSectionHead}>
              <Text style={styles.pSectionTitle}>Lịch sử đăng việc</Text>
              <CircleArrowRight size={23} style={{ marginLeft: 12 }} />
            </View>

            {visiblePosted.map((job) => {
              const st = POSTED_STATUS[job.status];
              return (
                <TouchableOpacity
                  key={job.id}
                  style={styles.pJob}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: POST_ROUTES.jobDetail,
                      params: { id: job.id },
                    } as never)
                  }
                >
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.badgeWrapper,
                        !job.urgent && { backgroundColor: "#FFF0A3" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          !job.urgent && { color: "#6B4F00" },
                        ]}
                      >
                        {job.time}
                      </Text>
                    </View>
                    <Text style={styles.cardTime}>{job.postedAgo}</Text>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>{job.price}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{job.title}</Text>

                  <View style={styles.pJobBottom}>
                    <View style={[styles.pStatus, { backgroundColor: st.bg }]}>
                      {job.status === "accepted" && job.taskerAvatar && (
                        <Image
                          source={toSource(job.taskerAvatar)}
                          style={styles.pStatusAvatar}
                        />
                      )}
                      <Text style={{ fontSize: 13, color: st.color }}>
                        {st.label}
                      </Text>
                    </View>
                    {job.status === "done" && job.taskerAvatar && (
                      <Image
                        source={toSource(job.taskerAvatar)}
                        style={styles.pDoneAvatar}
                      />
                    )}
                    <View style={styles.pActions}>
                      <TouchableOpacity
                        hitSlop={8}
                        onPress={() =>
                          router.push({
                            pathname: POST_ROUTES.postJob,
                            params: { id: job.id },
                          } as never)
                        }
                      >
                        <Ionicons name="create-outline" size={24} color="#000" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        hitSlop={8}
                        onPress={() => handleDeletePosted(job.id)}
                      >
                        <Ionicons name="trash-outline" size={24} color="#B30000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {visiblePosted.length === 0 && (
              <Text style={styles.emptyText}>
                Chưa có việc nào. Bấm “Đăng việc ngay” để bắt đầu.
              </Text>
            )}

            {/* Taskers uy tín gần đây */}
            <View style={styles.pSectionHead}>
              <Text style={styles.pSectionTitle}>Taskers uy tín gần đây</Text>
              <CircleArrowRight size={23} style={{ marginLeft: 12 }} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TRUSTED_TASKERS.map((t) => {
                const color = t.diamond ? "#14A7C4" : "#666";
                return (
                  <View
                    key={t.id}
                    style={[
                      styles.pTasker,
                      { backgroundColor: t.diamond ? "#E6F7F9" : "#E6E6E6" },
                    ]}
                  >
                    <View style={{ width: 56, height: 56 }}>
                      <Image source={toSource(t.avatar)} style={styles.pAvatar} />
                      {!!t.months && (
                        <View style={styles.pMonths}>
                          <Text style={{ fontSize: 11, color: "#2D6A3A" }}>
                            {t.months}
                          </Text>
                        </View>
                      )}
                      {t.online && <View style={styles.pOnline} />}
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.footerUser}>{t.name}</Text>
                      <Text style={{ fontSize: 12, marginTop: 4, color }}>
                        ★ {t.rating} ({t.rank})
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </ScrollView>
        </>
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
  // ----- Chế độ Đăng việc làm -----
  pSearch: {
    backgroundColor: "#E6E6E6",
    width: 320,
    height: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  pSearchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter",
    color: "#000",
    padding: 0,
  },
  pBellDot: {
    position: "absolute",
    top: 3,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D40000",
  },
  pAsk: {
    marginTop: 18,
    marginLeft: 6,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#000",
  },
  pPostButton: {
    height: 52,
    borderRadius: 50,
    backgroundColor: "#2C2C2C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pPostButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter",
  },
  pSectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 6,
  },
  pSectionTitle: {
    fontSize: 17,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#000",
  },
  pJob: {
    backgroundColor: "#EFEFEF",
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  pJobBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  pStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 50,
  },
  pStatusAvatar: {
    position: "absolute",
    left: -8,
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  pDoneAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pActions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  pTasker: {
    width: 240,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 18,
    marginRight: 12,
  },
  pAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e1e1e1",
  },
  pMonths: {
    position: "absolute",
    bottom: -2,
    right: -4,
    paddingHorizontal: 7,
    borderRadius: 50,
    backgroundColor: "#BFF0C8",
  },
  pOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#34c759",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

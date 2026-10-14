import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuGroups = [
  {
    title: "TÀI KHOẢN",
    items: [
      {
        label: "Thông tin cá nhân",
        icon: <Ionicons name="person-outline" size={22} color="#000" />,
        route: "/account/personal-info",
      },
    ],
  },
  {
    title: "CHUNG",
    items: [
      {
        label: "Thông báo",
        icon: <Ionicons name="notifications-outline" size={22} color="#000" />,
        route: "/account/notifications",
      },
      {
        label: "Bảo mật",
        icon: <Ionicons name="shield-checkmark-outline" size={22} color="#000" />,
        route: "/account/security",
      },
      {
        label: "Trung tâm trợ giúp",
        icon: <Ionicons name="help-circle" size={22} color="#000" />,
        route: "/account/help-center",
      },
      {
        label: "Quản lý rút tiền",
        icon: <Ionicons name="camera-outline" size={22} color="#000" />,
        route: "/account/withdrawal",
      },
      {
        label: "Giao diện",
        icon: <Ionicons name="phone-portrait-outline" size={22} color="#000" />,
        route: "/account/appearance",
      },
    ],
  },
  {
    title: "LỊCH SỬ",
    items: [
      {
        label: "Lịch sử công việc",
        icon: <Ionicons name="briefcase-outline" size={22} color="#000" />,
        route: "/account/job-history",
      },
    ],
  },
];

export default function AccountScreen() {
  const confirmLogout = () =>
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { text: "Tiếp tục", style: "destructive", onPress: () => router.dismissTo("/") },
    ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Thông tin cá nhân */}
        <View style={styles.profile}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Phương Vy</Text>
              <MaterialIcons name="verified" size={20} color="#1d9bf0" />
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#f59e0b" style={{ marginRight: 4 }} />
              <Text style={styles.rating}>4.9 (vàng)</Text>
              <Text style={styles.divider}>|</Text>
              <Text style={styles.ratingMeta}>Điểm tích lũy: 95/100</Text>
            </View>
          </View>
        </View>

        {/* Các nhóm menu */}
        {menuGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.menuCard}>
              {group.items.map(({ label, icon, route }, index) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  onPress={() => router.push(route as any)}
                  style={[styles.menuItem, index > 0 && styles.itemBorder]}
                >
                  <View style={styles.iconContainer}>{icon}</View>
                  <Text style={styles.menuLabel}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Nút Đăng xuất */}
        <Pressable accessibilityRole="button" onPress={confirmLogout} style={styles.logout}>
          <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e5e7eb",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#eab308",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    color: "#9ca3af",
    fontSize: 13,
    marginHorizontal: 6,
  },
  ratingMeta: {
    color: "#374151",
    fontSize: 12,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  menuCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  menuItem: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  menuLabel: {
    flex: 1,
    color: "#000000",
    fontSize: 15,
    fontWeight: "500",
  },
  logout: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e86d6d",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const JOB_TYPES = ["Khẩn cấp", "Thú cưng", "Dọn dẹp", "Chuyển đồ", "Khác"];
const TIME_OPTIONS = [
  "Ngay bây giờ",
  "Trong hôm nay",
  "Ngày mai",
  "Cuối tuần này",
];
const MAX_IMAGES = 5;
const SERVICE_FEE_RATE = 0.05;

// 30000 -> "30.000"
const formatMoney = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function PostJobScreen({}) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(
    "Kí túc xá khu A\nĐHQG TP Hồ Chí Minh",
  );
  const [reward, setReward] = useState("30000");
  const [jobType, setJobType] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<"type" | "time" | null>(null);

  const rewardNumber = Number(reward) || 0;
  const fee = Math.round(rewardNumber * SERVICE_FEE_RATE);
  const total = rewardNumber + fee;

  const handleAddImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("Tối đa " + MAX_IMAGES + " hình ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const handleRemoveImage = (uri: string) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

  const handlePost = () => {
    if (title.trim() === "") {
      setError("Vui lòng nhập tiêu đề công việc");
      return;
    }
    if (rewardNumber <= 0) {
      setError("Thù lao phải lớn hơn 0");
      return;
    }
    setError("");
    // TODO: gọi API đăng việc ở đây
    Alert.alert("Đăng việc thành công", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng việc</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* Tiêu đề công việc */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tiêu đề{"\n"}công việc</Text>
            <TextInput
              style={styles.rowInput}
              placeholder="..."
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Địa điểm thực hiện */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Địa điểm{"\n"}thực hiện</Text>
            <TextInput
              style={styles.rowInput}
              value={location}
              onChangeText={setLocation}
              multiline
            />
            <Ionicons name="location-sharp" size={34} color="#828282" />
          </View>

          {/* Thù lao công việc */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Thù lao{"\n"}công việc</Text>
            <TextInput
              style={[styles.rowInput, styles.green]}
              value={reward === "" ? "" : formatMoney(Number(reward))}
              onChangeText={(t) => setReward(t.replace(/\D/g, ""))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#9ca3af"
            />
            <Text style={[styles.rowInput, styles.green, styles.unit]}>vnđ</Text>
          </View>

          {/* Loại công việc / Thời gian */}
          <View style={styles.selectRow}>
            <TouchableOpacity
              style={styles.select}
              activeOpacity={0.8}
              onPress={() => setPicker("type")}
            >
              <Text style={[styles.selectText, jobType !== "" && styles.blackText]}>
                {jobType || "Loại công việc"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.select}
              activeOpacity={0.8}
              onPress={() => setPicker("time")}
            >
              <Text style={[styles.selectText, time !== "" && styles.blackText]}>
                {time || "Thời gian"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Mô tả chi tiết */}
          <Text style={styles.sectionLabel}>MÔ TẢ CHI TIẾT</Text>
          <TextInput
            style={styles.descInput}
            placeholder="..."
            placeholderTextColor="#9ca3af"
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="top"
          />

          {/* Thêm hình ảnh */}
          <TouchableOpacity
            style={styles.addImage}
            activeOpacity={0.8}
            onPress={handleAddImage}
          >
            <Text style={styles.addImageText}>Thêm hình ảnh</Text>
            <Ionicons name="add" size={20} color="#000000" />
          </TouchableOpacity>

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14 }}
            >
              {images.map((uri) => (
                <View key={uri} style={styles.thumbWrap}>
                  <Image source={{ uri }} style={styles.thumb} />
                  <TouchableOpacity
                    style={styles.thumbRemove}
                    hitSlop={6}
                    onPress={() => handleRemoveImage(uri)}
                  >
                    <Ionicons name="close" size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {error !== "" && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        {/* Tổng kết chi phí + nút Đăng */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, styles.green]}>Thù lao chi trả</Text>
            <Text style={[styles.summaryText, styles.green]}>
              {formatMoney(rewardNumber)} vnđ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Phí dịch vụ (5%)</Text>
            <Text style={styles.summaryText}>{formatMoney(fee)} vnđ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTotal, styles.red]}>Tổng</Text>
            <Text style={[styles.summaryTotal, styles.red]}>
              {formatMoney(total)} vnđ
            </Text>
          </View>
        </View>
        <SafeAreaView edges={["bottom"]} style={styles.postWrap}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePost}
          >
            <Text style={styles.buttonText}>Đăng</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Menu chọn Loại công việc / Thời gian */}
      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPicker(null)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {picker === "type" ? "Loại công việc" : "Thời gian"}
            </Text>
            {(picker === "type" ? JOB_TYPES : TIME_OPTIONS).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.sheetItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (picker === "type") setJobType(opt);
                  else setTime(opt);
                  setPicker(null);
                }}
              >
                <Text style={styles.sheetItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    position: "absolute",
    left: 16,
    height: 56,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Semi Bold",
    color: "#000000",
  },
  scroll: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  rowLabel: {
    width: 104,
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Inter",
    color: "#000000",
  },
  rowInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Inter",
    color: "#000000",
    padding: 0,
  },
  unit: {
    flex: 0,
    marginLeft: 4,
  },
  green: {
    color: "#2B8A00",
  },
  red: {
    color: "#ff0000",
  },
  blackText: {
    color: "#000000",
  },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 14,
  },
  select: {
    width: "48%",
    height: 44,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#000000",
  },
  sectionLabel: {
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 18,
    fontSize: 14,
    fontFamily: "Inter",
    color: "#000000",
  },
  descInput: {
    height: 120,
    marginHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "#9E9E9E",
    borderRadius: 20,
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 15,
    fontFamily: "Inter",
    color: "#000000",
  },
  addImage: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 22,
    marginLeft: 18,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  addImageText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#000000",
  },
  thumbWrap: {
    marginLeft: 18,
  },
  thumb: {
    width: 100,
    height: 154,
    backgroundColor: "#e1e1e1",
  },
  thumbRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 14,
    marginHorizontal: 18,
    color: "red",
    fontSize: 12,
  },
  summary: {
    backgroundColor: "#C2F0FF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 17,
    fontFamily: "Inter",
    color: "#000000",
  },
  summaryTotal: {
    fontSize: 22,
    fontFamily: "Inter",
  },
  postWrap: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 10,
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Inter",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Semi Bold",
    color: "#000000",
    marginBottom: 8,
  },
  sheetItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sheetItemText: {
    fontSize: 16,
    fontFamily: "Inter",
    color: "#000000",
  },
});

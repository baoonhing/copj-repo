import { AccountCard, AccountPage, SectionLabel } from "@/components/account/AccountPage";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const themes = [
  { name: "Sáng", description: "Nền sáng, dễ nhìn ban ngày", color: "#ffffff", border: "#dedede" },
  { name: "Tối", description: "Nền tối, dịu mắt buổi tối", color: "#292929", border: "#292929" },
  { name: "Theo thiết bị", description: "Tự động theo cài đặt điện thoại", color: "#ededed", border: "#dedede" },
];

export default function AppearanceScreen() {
  const [selected, setSelected] = useState("Sáng");
  return (
    <AccountPage title="Giao diện" subtitle="Tùy chỉnh cách Co-work hiển thị trên thiết bị của bạn.">
      <SectionLabel>CHỌN GIAO DIỆN</SectionLabel>
      <AccountCard>
        {themes.map((theme, index) => <Pressable key={theme.name} onPress={() => { setSelected(theme.name); Alert.alert("Đã chọn giao diện", `Giao diện “${theme.name}” đã được chọn trên màn hình này.`); }} style={[styles.option, index < themes.length - 1 && styles.border]}><View style={[styles.preview, { backgroundColor: theme.color, borderColor: theme.border }]}><View style={styles.previewBar} /><View style={styles.previewLine} /><View style={styles.previewLineShort} /></View><View style={styles.copy}><Text style={styles.title}>{theme.name}</Text><Text style={styles.description}>{theme.description}</Text></View><View style={[styles.radio, selected === theme.name && styles.radioSelected]}>{selected === theme.name ? <Check size={12} color="#fff" /> : null}</View></Pressable>)}
      </AccountCard>
      <Text style={styles.note}>Tùy chọn giao diện hiện chỉ áp dụng cho trang cài đặt này.</Text>
    </AccountPage>
  );
}

const styles = StyleSheet.create({ option: { minHeight: 77, flexDirection: "row", alignItems: "center", gap: 11 }, border: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e5e5" }, preview: { width: 48, height: 51, borderWidth: 1, borderRadius: 7, padding: 5, justifyContent: "space-around" }, previewBar: { height: 7, backgroundColor: "#e96d70", borderRadius: 3 }, previewLine: { height: 4, width: "90%", backgroundColor: "#aaa", borderRadius: 2 }, previewLineShort: { height: 4, width: "62%", backgroundColor: "#ccc", borderRadius: 2 }, copy: { flex: 1 }, title: { fontSize: 12, fontWeight: "600", color: "#333" }, description: { fontSize: 10, color: "#888", marginTop: 4 }, radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1, borderColor: "#bbb", alignItems: "center", justifyContent: "center" }, radioSelected: { backgroundColor: "#e96d70", borderColor: "#e96d70" }, note: { color: "#888", fontSize: 11, lineHeight: 17 } });

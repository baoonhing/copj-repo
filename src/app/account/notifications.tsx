import { AccountCard, AccountPage, SectionLabel } from "@/components/account/AccountPage";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const initialOptions = [
  { key: "jobs", title: "Công việc", description: "Thông báo công việc mới phù hợp với bạn." },
  { key: "progress", title: "Cập nhật công việc", description: "Nhắc lịch, trạng thái và thay đổi công việc đang nhận." },
  { key: "wallet", title: "Ví và thanh toán", description: "Thông báo khi có thu nhập hoặc yêu cầu rút tiền." },
  { key: "social", title: "Đánh giá và bình luận", description: "Khi có người thích hoặc bình luận bài viết của bạn." },
  { key: "news", title: "Tin tức Co-work", description: "Thông tin tính năng và ưu đãi mới." },
];

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ jobs: true, progress: true, wallet: true, social: true, news: false });
  return (
    <AccountPage title="Thông báo" subtitle="Chọn những thông tin bạn muốn nhận từ Co-work.">
      <SectionLabel>TÙY CHỌN THÔNG BÁO</SectionLabel>
      <AccountCard>
        {initialOptions.map((option, index) => <View key={option.key} style={[styles.row, index < initialOptions.length - 1 && styles.border]}><View style={styles.copy}><Text style={styles.title}>{option.title}</Text><Text style={styles.description}>{option.description}</Text></View><Switch value={enabled[option.key]} onValueChange={(value) => setEnabled((current) => ({ ...current, [option.key]: value }))} trackColor={{ false: "#ddd", true: "#f2a0a2" }} thumbColor={enabled[option.key] ? "#e96d70" : "#fff"} /></View>)}
      </AccountCard>
      <Text style={styles.note}>Thông báo hệ thống quan trọng về bảo mật tài khoản vẫn sẽ được gửi đến bạn.</Text>
    </AccountPage>
  );
}

const styles = StyleSheet.create({ row: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 }, border: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e5e5" }, copy: { flex: 1 }, title: { color: "#292929", fontSize: 12, fontWeight: "600" }, description: { color: "#888", fontSize: 10, lineHeight: 15, marginTop: 4 }, note: { color: "#888", fontSize: 11, lineHeight: 17, marginTop: 2 } });

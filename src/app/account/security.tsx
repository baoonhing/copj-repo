import { AccountCard, AccountPage, SectionLabel } from "@/components/account/AccountPage";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SecurityScreen() {
  const [biometric, setBiometric] = useState(false);
  const [loginAlert, setLoginAlert] = useState(true);
  return (
    <AccountPage title="Bảo mật" subtitle="Quản lý cách bảo vệ và xác minh tài khoản của bạn.">
      <SectionLabel>XÁC MINH TÀI KHOẢN</SectionLabel>
      <AccountCard>
        <View style={[styles.row, styles.border]}><View style={styles.copy}><Text style={styles.title}>Số điện thoại</Text><Text style={styles.detail}>090 123 4567 · Đã xác minh</Text></View><Text style={styles.verified}>Đã xác minh</Text></View>
        <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Email</Text><Text style={styles.detail}>phuongvy@email.com</Text></View><Text style={styles.verified}>Đã xác minh</Text></View>
      </AccountCard>
      <SectionLabel>ĐĂNG NHẬP AN TOÀN</SectionLabel>
      <AccountCard>
        <View style={[styles.row, styles.border]}><View style={styles.copy}><Text style={styles.title}>Đăng nhập bằng sinh trắc học</Text><Text style={styles.detail}>Dùng Face ID hoặc vân tay trên thiết bị</Text></View><Switch value={biometric} onValueChange={setBiometric} trackColor={{ false: "#ddd", true: "#f2a0a2" }} thumbColor={biometric ? "#e96d70" : "#fff"} /></View>
        <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Cảnh báo đăng nhập mới</Text><Text style={styles.detail}>Báo cho bạn khi tài khoản đăng nhập trên thiết bị lạ</Text></View><Switch value={loginAlert} onValueChange={setLoginAlert} trackColor={{ false: "#ddd", true: "#f2a0a2" }} thumbColor={loginAlert ? "#e96d70" : "#fff"} /></View>
      </AccountCard>
      <Pressable style={styles.password} onPress={() => Alert.alert("Đổi mật khẩu", "Liên kết xác minh sẽ được gửi đến email phuongvy@email.com.")}><Text style={styles.passwordText}>Đổi mật khẩu</Text><Text style={styles.arrow}>›</Text></Pressable>
      <Text style={styles.note}>Co-work không bao giờ yêu cầu bạn cung cấp mã OTP hoặc mật khẩu qua tin nhắn.</Text>
    </AccountPage>
  );
}

const styles = StyleSheet.create({ row: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 }, border: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e5e5" }, copy: { flex: 1 }, title: { color: "#292929", fontSize: 12, fontWeight: "600" }, detail: { color: "#888", fontSize: 10, marginTop: 4 }, verified: { color: "#329964", fontSize: 10, fontWeight: "600" }, password: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 10, borderColor: "#eee", borderWidth: 1, paddingHorizontal: 15 }, passwordText: { fontSize: 12, color: "#333" }, arrow: { fontSize: 23, color: "#aaa" }, note: { color: "#888", fontSize: 11, lineHeight: 17, marginTop: 14 } });

import { AccountCard, AccountPage, PrimaryButton, SectionLabel } from "@/components/account/AccountPage";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

const fields = [
  { key: "name", label: "Họ và tên", initial: "Phương Vy" },
  { key: "phone", label: "Số điện thoại", initial: "090 123 4567", keyboardType: "phone-pad" as const },
  { key: "email", label: "Email", initial: "phuongvy@email.com", keyboardType: "email-address" as const },
  { key: "address", label: "Địa chỉ", initial: "Ký túc xá khu B" },
];

export default function PersonalInfoScreen() {
  const [values, setValues] = useState(Object.fromEntries(fields.map((field) => [field.key, field.initial])));
  return (
    <AccountPage title="Thông tin cá nhân" subtitle="Thông tin này giúp mọi người nhận biết và liên hệ với bạn khi cần.">
      <SectionLabel>THÔNG TIN CỦA BẠN</SectionLabel>
      <AccountCard>
        {fields.map((field, index) => (
          <View key={field.key} style={[styles.field, index !== fields.length - 1 && styles.border]}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              value={values[field.key]}
              onChangeText={(value) => setValues((current) => ({ ...current, [field.key]: value }))}
              keyboardType={field.keyboardType ?? "default"}
              autoCapitalize={field.key === "email" ? "none" : "words"}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>
        ))}
      </AccountCard>
      <Text style={styles.note}>Số điện thoại và email chỉ được dùng để liên hệ về công việc và tài khoản.</Text>
      <PrimaryButton title="Lưu thay đổi" onPress={() => Alert.alert("Đã lưu", "Thông tin cá nhân của bạn đã được cập nhật trên thiết bị này.")} />
    </AccountPage>
  );
}

const styles = StyleSheet.create({
  field: { paddingVertical: 11 }, border: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e5e5" },
  label: { color: "#777", fontSize: 11, marginBottom: 5 },
  input: { padding: 0, color: "#222", fontSize: 14, minHeight: 22 },
  note: { color: "#888", fontSize: 11, lineHeight: 17, marginBottom: 12 },
});

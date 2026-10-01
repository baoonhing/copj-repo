import { StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Login1Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Co-work</Text>
      <Text style={styles.subtitle}>Tạo tài khoản</Text>
      <Text style={styles.label}>Nhập SĐT của bạn</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    marginTop: 102,
    marginBottom: 11,
    color: "#000000",
    fontFamily: "Semi Bold",
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
    marginBottom: 16,
    fontFamily: "Regular",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Semi Bold",
    color: "#000000",
    marginTop: 11,
    marginBottom: 2,
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
});

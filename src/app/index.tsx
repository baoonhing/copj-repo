import { ThemedText } from "@/components/themed-text";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function LoginEmailScreen() {
  const [email, setEmail] = useState("");
  const handleContinue = () => {
    console.log("Email entered:", email);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Tên app */}
      <Text style={styles.title}>Co-work</Text>
      <Text style={styles.subtitle}>Tạo tài khoản</Text>
      {/* Tiêu đề */}
      <Text style={styles.label}>Nhập email của bạn</Text>
      {/* Ô nhập Email */}
      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {/* Nút bấm Tiếp tục */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>hoặc</Text>
        <View style={styles.dividerLine} />
      </View>
      {/* tiep tuc voi google */}
      <TouchableOpacity
        style={styles.buttonGoogle}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <View style={styles.iconContainer}>
          <AntDesign name="google" size={20} color="#EA4335" />
        </View>
        <Text style={styles.buttonText2}>Tiếp tục với Google</Text>
      </TouchableOpacity>
      {/* tiep tuc voi apple*/}
      <TouchableOpacity
        style={styles.buttonApple}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <View style={styles.iconContainer}>
          <FontAwesome name="apple" size={20} color="#000000" />
        </View>
        <Text style={styles.buttonText2}>Tiếp tục với Apple</Text>
      </TouchableOpacity>
      {/*tiep tuc voi SDT*/}
      <TouchableOpacity
        style={styles.buttonApple}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="call" size={20} color="#000000" />
        </View>
        <Text style={styles.buttonText2}>Tiếp tục với SĐT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    marginTop: 102,
    marginBottom: 11,
    color: "#000000",
    fontFamily: "Semi Bold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Semi Bold",
    color: "#000000",
    marginTop: 11,
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
    marginBottom: 16,
    fontFamily: "Regular",
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
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#000000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 9.5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  buttonGoogle: {
    backgroundColor: "#e5e7eb",
    width: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: 48,
    marginBottom: 8,
    borderColor: "#e5e7eb",
    flexDirection: "row",
  },
  buttonApple: {
    backgroundColor: "#e5e7eb",
    width: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: 48,
    borderColor: "#e5e7eb",
    marginBottom: 8,
    flexDirection: "row",
  },
  buttonText2: {
    textAlign: "left",
    color: "#000000",
    fontSize: 14,
    fontFamily: "Medium",
    justifyContent: "center",
  },
  GoogleImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  AppleImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

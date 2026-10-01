import { ThemedText } from "@/components/themed-text";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {router} from "expo-router";
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
  const [error, setError] = useState("");
  const handleContinue = () => {
    if (email.trim() === "") {
      setError("Vui lòng nhập email");
      return;
    }
    if (
      !email.includes("@") ||
      !email.includes("gmail") ||
      !email.includes(".com")
    ) {
      setError("Email không hợp lệ");
      return;
    }
    setError("");
    router.push("/login1")
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
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}
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
        style={styles.buttonall}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/tabIcons/Google-icon.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.buttonText2}>Tiếp tục với Google</Text>
      </TouchableOpacity>
      {/* tiep tuc voi apple*/}
      <TouchableOpacity
        style={styles.buttonall}
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
        style={styles.buttonall}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="call" size={20} color="#000000" />
        </View>
        <Text style={styles.buttonText2}>Tiếp tục với SĐT</Text>
      </TouchableOpacity>
      <Text style={styles.Policy}>
        Khi nhấn tiếp tục bạn sẽ đồng ý với
        <Text style={styles.PolicyBold}> Điều khoản dịch vụ</Text> và
        <Text style={styles.PolicyBold}> Chính sách bảo mật</Text> của chúng tôi
      </Text>
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
    fontFamily: "Inter",
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
  buttonall: {
    width: "100%",
    height: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  buttonText2: {
    textAlign: "left",
    color: "#000000",
    fontSize: 14,
    fontFamily: "Inter",
    justifyContent: "center",
    marginLeft: 111,
  },
  iconContainer: {
    position: "absolute",
    width: 20,
    height: 20,
    left: 85,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  googleIcon: {
    width: 20,
    height: 22,
  },
  Policy: {
    width: "90%",
    fontFamily: "Inter",
    fontSize: 12,
    color: "#828282",
    marginTop: 36,
    textAlign: "center",
  },
  PolicyBold: {
    fontFamily: "Semi Bold",
    fontSize: 12,
    color: "#080808",
  },
  errorText: {
    width: "100%",
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

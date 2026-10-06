import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Login1Screen({}) {
  const [phone, setPhone] = useState("");
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [cccd, setCccd] = useState("");
  const handleSendOTP = () => {
    if (phone.length !== 10) {
      setError("Lỗi! Số điện thoại không hợp lệ");
      return;
    }
    setError("");
  };
  const handleCheckOTP = () => {
    router.push("/tabs/homepage");
  };
  const handleNext = () => {
    console.log("CCCD:", cccd);
    router.push("/tabs/homepage");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Co-work</Text>
      <Text style={styles.subtitle}>Tạo tài khoản</Text>
      <Text style={styles.label}>Nhập SĐT của bạn</Text>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          placeholder="Số điện thoại"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity style={styles.OtpButton} onPress={handleSendOTP}>
          <Text style={styles.OtpText}>Gửi mã</Text>
        </TouchableOpacity>
      </View>
      {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      <Text
        style={{
          fontSize: 15,
          fontFamily: "Inter",
          color: "black",
          marginBottom: 4,
        }}
      >
        Mã OTP
      </Text>
      <OtpInput
        numberOfDigits={6}
        focusColor="green"
        focusStickBlinkingDuration={400}
        autoFocus={false}
        onTextChange={setOTP}
      />
      <TouchableOpacity
        style={styles.nextButton}
        activeOpacity={0.8}
        onPress={handleCheckOTP}
      >
        <Text style={styles.nextButtonText}>Tiếp tục</Text>
      </TouchableOpacity>
      <Text style={{ fontFamily: "Inter", fontSize: 15, marginTop: 20 }}>
        Số CCCD/CMND (không bắt buộc)
      </Text>
      <View style={styles.inputCCCD}>
        <TextInput
          style={styles.textInput}
          placeholder="Số CCCD/CMND"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          value={cccd}
          onChangeText={setCccd}
        />
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        activeOpacity={0.8}
        onPress={handleNext}
      >
        <Text
          style={{
            fontFamily: "Inter",
            fontSize: 14,
            color: "white",
          }}
        >
          Tiếp tục
        </Text>
      </TouchableOpacity>
      <Text style={styles.Policy}>
        Khi nhấn tiếp tục bạn sẽ đồng ý với{" "}
        <Text style={styles.PolicyBold}>Điều khoản dịch vụ</Text> và{" "}
        <Text style={styles.PolicyBold}>Chính sách bảo mật</Text> của chúng tôi
      </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  errorText: {
    width: "100%",
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    marginTop: 102,
    marginBottom: 11,
    color: "#000000",
    fontFamily: "Semi Bold",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
    marginBottom: 16,
    fontFamily: "Regular",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Semi Bold",
    color: "#000000",
    marginTop: 11,
    marginBottom: 2,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 0,
    marginBottom: 16,
    marginTop: 41,
  },
  inputCCCD: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 0,
    marginTop: 4,
  },
  nextButton: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#000000",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  OtpButton: {
    backgroundColor: "#E6E6E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9E9E9E",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    paddingTop: 16,
    width: 84,
  },
  OtpText: {
    fontSize: 15,
    color: "#000000",
    fontFamily: "Inter",
    textAlign: "center",
    height: "140%",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#828282",
    height: "100%",
  },
  Policy: {
    width: "100%",
    fontFamily: "Inter",
    fontSize: 12,
    color: "#828282",
    marginTop: 9,
    alignItems: "center",
    textAlign: "center",
  },
  PolicyBold: {
    fontFamily: "Semi Bold",
    fontSize: 12,
    color: "#080808",
    textDecorationLine: "underline",
  },
  nextButtonText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "white",
  },
  setError: {},
});

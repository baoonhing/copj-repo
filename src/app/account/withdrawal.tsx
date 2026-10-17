import { AccountCard, AccountPage, PrimaryButton, SectionLabel } from "@/components/account/AccountPage";
import { Building2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function WithdrawalScreen() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Ngân hàng");
  const parsed = Number(amount.replace(/\D/g, ""));
  const methods = [
    { label: "Ngân hàng", detail: "Vietcombank •••• 2868", Icon: Building2 },
  ];
  return (
    <AccountPage title="Quản lý rút tiền" subtitle="Rút thu nhập từ công việc về tài khoản bạn đã liên kết.">
      <View style={styles.balance}><Text style={styles.balanceLabel}>SỐ DƯ CÓ THỂ RÚT</Text><Text style={styles.balanceAmount}>850.000đ</Text><Text style={styles.balanceHint}>Đã bao gồm thu nhập từ các công việc hoàn thành</Text></View>
      <SectionLabel>PHƯƠNG THỨC NHẬN TIỀN</SectionLabel>
      {methods.map(({ label, detail, Icon }) => <Pressable key={label} onPress={() => setMethod(label)} style={[styles.method, method === label && styles.methodSelected]}><View style={styles.methodIcon}><Icon size={19} color="#333" /></View><View style={styles.methodInfo}><Text style={styles.methodTitle}>{label}</Text><Text style={styles.methodDetail}>{detail}</Text></View><View style={[styles.radio, method === label && styles.radioSelected]}>{method === label ? <View style={styles.radioDot} /> : null}</View></Pressable>)}
      <SectionLabel>SỐ TIỀN MUỐN RÚT</SectionLabel>
      <AccountCard><View style={styles.amountRow}><TextInput value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, ""))} keyboardType="number-pad" placeholder="Nhập số tiền" placeholderTextColor="#aaa" style={styles.input} /><Text style={styles.currency}>đ</Text></View><Text style={styles.available}>Tối thiểu 20.000đ · Tối đa 850.000đ</Text></AccountCard>
      <PrimaryButton title="Tạo yêu cầu rút tiền" onPress={() => {
        if (!parsed || parsed < 20000 || parsed > 850000) {
          Alert.alert("Số tiền chưa hợp lệ", "Vui lòng nhập số tiền từ 20.000đ đến 850.000đ.");
          return;
        }
        Alert.alert("Đã tạo yêu cầu", `${parsed.toLocaleString("vi-VN")}đ sẽ được chuyển qua ${method}.`);
        setAmount("");
      }} />
    </AccountPage>
  );
}

const styles = StyleSheet.create({
  balance: { backgroundColor: "#292929", borderRadius: 14, padding: 18, marginBottom: 22 },
  balanceLabel: { color: "#ccc", fontSize: 10, letterSpacing: 0.8, fontWeight: "600" }, balanceAmount: { color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 8 }, balanceHint: { color: "#c8c8c8", fontSize: 10, marginTop: 4 },
  method: { backgroundColor: "#fff", borderColor: "#e8e8e8", borderWidth: 1, borderRadius: 11, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 9 }, methodSelected: { borderColor: "#e96d70" }, methodIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#f6f6f6", alignItems: "center", justifyContent: "center" }, methodInfo: { flex: 1, marginLeft: 10 }, methodTitle: { color: "#292929", fontWeight: "700", fontSize: 12 }, methodDetail: { color: "#888", fontSize: 10, marginTop: 3 }, radio: { width: 18, height: 18, borderWidth: 1, borderColor: "#bbb", borderRadius: 10, alignItems: "center", justifyContent: "center" }, radioSelected: { borderColor: "#e96d70" }, radioDot: { width: 10, height: 10, backgroundColor: "#e96d70", borderRadius: 5 },
  amountRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 }, input: { flex: 1, fontSize: 17, color: "#222", padding: 0 }, currency: { color: "#444", fontWeight: "700", fontSize: 15 }, available: { color: "#888", fontSize: 10, paddingBottom: 12 }, footnote: { color: "#888", fontSize: 11, textAlign: "center", marginTop: 12 },
});

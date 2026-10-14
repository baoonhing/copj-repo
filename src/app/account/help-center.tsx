import { AccountCard, AccountPage, SectionLabel } from "@/components/account/AccountPage";
import { ChevronDown, Mail, MessageCircle } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const faqs = [
  { question: "Làm sao để nhận một công việc?", answer: "Mở trang chủ, chọn công việc phù hợp và làm theo hướng dẫn để gửi yêu cầu nhận việc." },
  { question: "Khi nào thu nhập được cộng vào ví?", answer: "Thu nhập sẽ được cập nhật sau khi công việc hoàn thành và được xác nhận từ hai phía." },
  { question: "Tôi cần hỗ trợ về một công việc", answer: "Bạn có thể quay lại trang chủ đăng việc để tìm người giúp đỡ, hoặc liên hệ đội ngũ hỗ trợ Co-Work qua email nếu có sự cố hoặc khiếu nại." },
];

export default function HelpCenterScreen() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <AccountPage title="Trung tâm trợ giúp" subtitle="Tìm câu trả lời nhanh hoặc liên hệ đội ngũ Co-work.">
      <SectionLabel>CÂU HỎI THƯỜNG GẶP</SectionLabel>
      <AccountCard>
        {faqs.map((faq, index) => <View key={faq.question} style={index < faqs.length - 1 && styles.border}><Pressable onPress={() => setOpen(open === index ? null : index)} style={styles.question}><Text style={styles.questionText}>{faq.question}</Text><ChevronDown size={17} color="#888" /></Pressable>{open === index ? <Text style={styles.answer}>{faq.answer}</Text> : null}</View>)}
      </AccountCard>
      <SectionLabel>BẠN CẦN HỖ TRỢ THÊM?</SectionLabel>
      <Pressable style={styles.contact} onPress={() => Alert.alert("Chat với Co-work", "Tính năng trò chuyện với đội ngũ hỗ trợ sẽ sớm có mặt.")}><View style={styles.icon}><MessageCircle size={18} color="#e96d70" /></View><View style={styles.contactCopy}><Text style={styles.contactTitle}>Trò chuyện với chúng tôi</Text><Text style={styles.contactDetail}>Thời gian phản hồi thường dưới 10 phút</Text></View><Text style={styles.arrow}>›</Text></Pressable>
      <Pressable style={styles.contact} onPress={() => Alert.alert("Email hỗ trợ", "Gửi email đến hotro@cowork.app để được hỗ trợ.")}><View style={styles.icon}><Mail size={18} color="#e96d70" /></View><View style={styles.contactCopy}><Text style={styles.contactTitle}>Gửi email</Text><Text style={styles.contactDetail}>hotro@cowork.app</Text></View><Text style={styles.arrow}>›</Text></Pressable>
    </AccountPage>
  );
}

const styles = StyleSheet.create({ border: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e5e5" }, question: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 46, gap: 8 }, questionText: { flex: 1, fontSize: 12, color: "#333", fontWeight: "600" }, answer: { color: "#777", fontSize: 11, lineHeight: 17, paddingBottom: 13, paddingRight: 15 }, contact: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 11, borderWidth: 1, borderColor: "#eee", padding: 12, marginBottom: 9 }, icon: { height: 36, width: 36, borderRadius: 10, backgroundColor: "#fff2f2", alignItems: "center", justifyContent: "center" }, contactCopy: { flex: 1, marginLeft: 10 }, contactTitle: { color: "#333", fontSize: 12, fontWeight: "600" }, contactDetail: { color: "#888", fontSize: 10, marginTop: 3 }, arrow: { color: "#aaa", fontSize: 22 } });

import { AccountPage } from "@/components/account/AccountPage";
import { BriefcaseBusiness, CheckCircle2, Clock3, XCircle } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const jobs = [
  { title: "Nhận hàng Shopee cổng sau KTX khu B", type: "Urgency", date: "12/10/2026", price: "30.000đ", status: "Hoàn thành" },
  { title: "Dắt cún đi dạo tại công viên KTX", type: "Pet", date: "08/10/2026", price: "20.000đ", status: "Hoàn thành" },
  { title: "Phụ chuyển phòng trọ", type: "Moving", date: "02/10/2026", price: "75.000đ", status: "Đã hủy" },
  { title: "Hỗ trợ dọn vệ sinh căn hộ", type: "Cleaning", date: "Hôm nay", price: "120.000đ", status: "Đang thực hiện" },
];
const filters = ["Tất cả", "Đang làm", "Hoàn thành", "Đã hủy"];

export default function JobHistoryScreen() {
  const [filter, setFilter] = useState("Tất cả");
  const shown = jobs.filter((job) => filter === "Tất cả" || (filter === "Đang làm" ? job.status === "Đang thực hiện" : job.status === filter));
  return (
    <AccountPage title="Lịch sử công việc" subtitle="Theo dõi những công việc bạn đã nhận và thu nhập tương ứng.">
      <View style={styles.filters}>
        {filters.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.selected]}><Text style={[styles.filterText, filter === item && styles.selectedText]}>{item}</Text></Pressable>)}
      </View>
      {shown.map((job) => {
        const done = job.status === "Hoàn thành";
        const canceled = job.status === "Đã hủy";
        const Icon = done ? CheckCircle2 : canceled ? XCircle : Clock3;
        return (
          <View key={job.title} style={styles.card}>
            <View style={styles.cardTop}><View style={styles.icon}><BriefcaseBusiness size={18} color="#e96d70" /></View><Text style={styles.category}>{job.type}</Text><View style={styles.status}><Icon size={14} color={done ? "#3caa72" : canceled ? "#999" : "#e4a330"} /><Text style={[styles.statusText, { color: done ? "#329964" : canceled ? "#888" : "#be8521" }]}>{job.status}</Text></View></View>
            <Text style={styles.title}>{job.title}</Text>
            <View style={styles.bottom}><Text style={styles.date}>{job.date}</Text><Text style={styles.price}>{job.price}</Text></View>
          </View>
        );
      })}
      {shown.length === 0 ? <Text style={styles.empty}>Chưa có công việc ở trạng thái này.</Text> : null}
    </AccountPage>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 15 },
  filter: { borderRadius: 18, borderWidth: 1, borderColor: "#e5e5e5", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 7 },
  selected: { backgroundColor: "#282828", borderColor: "#282828" },
  filterText: { fontSize: 11, color: "#555" }, selectedText: { color: "#fff", fontWeight: "600" },
  card: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 }, icon: { width: 31, height: 31, borderRadius: 10, backgroundColor: "#fff0f0", alignItems: "center", justifyContent: "center" },
  category: { fontSize: 11, color: "#777", marginLeft: 8, flex: 1 }, status: { flexDirection: "row", gap: 4, alignItems: "center" }, statusText: { fontSize: 10, fontWeight: "600" },
  title: { fontSize: 13, fontWeight: "700", color: "#262626", lineHeight: 19 }, bottom: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: "#e8e8e8", marginTop: 10, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  date: { color: "#888", fontSize: 11 }, price: { color: "#299b60", fontSize: 12, fontWeight: "700" }, empty: { textAlign: "center", color: "#888", marginTop: 25, fontSize: 13 },
});

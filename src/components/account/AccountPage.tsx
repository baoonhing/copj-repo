import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AccountPage({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <ChevronLeft size={23} color="#242424" />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.back} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function AccountCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function AccountRow({ label, value, last = false }: { label: string; value?: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.primaryButton}><Text style={styles.primaryText}>{title}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8f8f8" },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, backgroundColor: "#fff", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e8e8e8" },
  back: { width: 32, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { color: "#202020", fontSize: 16, fontWeight: "700" },
  content: { padding: 18, paddingBottom: 36 },
  subtitle: { color: "#777", fontSize: 13, lineHeight: 19, marginBottom: 18 },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ededed", paddingHorizontal: 15, marginBottom: 16 },
  row: { minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#e7e7e7" },
  rowLabel: { color: "#303030", fontSize: 13, flex: 1 },
  rowValue: { color: "#777", fontSize: 12 },
  sectionLabel: { color: "#333", fontSize: 12, fontWeight: "700", marginBottom: 9, marginTop: 5 },
  primaryButton: { minHeight: 46, borderRadius: 24, backgroundColor: "#e96d70", alignItems: "center", justifyContent: "center", marginTop: 8 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});

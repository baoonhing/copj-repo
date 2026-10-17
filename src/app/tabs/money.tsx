import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  green: '#2E9E00',
  greenBtn: '#C8F59A',
  greenBorder: '#9ADB5A',
  greenText: '#2B6A00',
  gray: '#8A8A8A',
  line: '#E6E6E6',
  darkGreen: '#1F4D3A',
  bar: '#3DB880',
  cardBorder: '#DADADA',
};

const formatMoney = (n: number | string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const REVENUE_DATA = {
  total: 3500000,
  growth: 12,
  thisMonth: 1600000,
  jobsDone: 8,
  chart: [
    { label: 'T4', value: 1200000, height: 62 },
    { label: 'T5', value: 650000, height: 32 },
    { label: 'T6', value: 1500000, height: 78 },
    { label: 'T7', value: 1000000, height: 52 },
    { label: 'T8', value: 1800000, height: 96 },
  ],
  transactions: [
    {
      id: 1,
      type: 'Urgency',
      icon: 'alarm-light-outline' as const,
      color: '#D40000',
      title: 'Hoàn thành: Urgent',
      time: 'Hôm qua, 14:20',
      amount: 30000,
      code: 'GD260901',
    },
    {
      id: 2,
      type: 'Pet',
      icon: 'paw' as const,
      color: '#111',
      title: 'Hoàn thành: Pet',
      time: 'Hôm qua, 16:30',
      amount: 40000,
      code: 'GD260902',
    },
    {
      id: 3,
      type: 'Cleaning',
      icon: 'broom' as const,
      color: '#111',
      title: 'Hoàn thành: Cleaning',
      time: '20/08/2026',
      amount: 50000,
      code: 'GD260820',
    },
    {
      id: 4,
      type: 'Moving',
      icon: 'package-variant-closed' as const,
      color: '#111',
      title: 'Hoàn thành: Moving',
      time: '18/08/2026',
      amount: 25000,
      code: 'GD260818',
    },
  ],
};

const TX_FILTERS = ['Tất cả', 'Urgency', 'Pet', 'Cleaning', 'Moving'];

function Sheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function MoneyScreen() {
  const data = REVENUE_DATA;
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [filter, setFilter] = useState('Tất cả');
  const [sort, setSort] = useState<'newest' | 'amount'>('newest');
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailTx, setDetailTx] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<any>(null);

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2000);
  };

  const money = (n: number | string) => (hidden ? '•••••••' : `${formatMoney(n)}đ`);
  const bar = selectedBar !== null ? data.chart[selectedBar] : null;

  let txs = data.transactions.filter((t) => filter === 'Tất cả' || t.type === filter);
  if (sort === 'amount') txs = [...txs].sort((a, b) => b.amount - a.amount);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Đã cập nhật doanh thu');
    }, 900);
  };

  const toggleHidden = () => {
    setHidden((h) => !h);
    showToast(hidden ? 'Đã hiện số tiền' : 'Đã ẩn số tiền');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.headerBtn}>
          <Ionicons name="menu" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.dashTitle}>Doanh thu</Text>
        <TouchableOpacity onPress={toggleHidden} style={styles.headerBtn}>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Tổng doanh thu */}
        <TouchableOpacity activeOpacity={0.9} style={styles.totalCard} onPress={toggleHidden}>
          <Text style={styles.totalLabel}>TỔNG DOANH THU ĐÃ NHẬN</Text>
          <Text style={styles.totalValue}>{money(data.total)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Ionicons name="trending-up" size={14} color={COLORS.green} />
            <Text style={styles.growthText}>
              {' '}
              <Text style={{ fontWeight: '700', color: COLORS.green }}>Tăng {data.growth}%</Text>
              <Text style={{ color: COLORS.gray }}> so với tháng trước</Text>
            </Text>
          </View>
        </TouchableOpacity>

        {/* Biểu đồ cột */}
        <View style={styles.chartCard}>
          <View style={styles.chartTooltipRow}>
            {bar ? (
              <Text style={styles.chartTooltip}>
                {bar.label}: {money(bar.value)}
              </Text>
            ) : (
              <Text style={styles.chartHint}>Chạm vào cột để xem doanh thu</Text>
            )}
          </View>
          <View style={styles.chartRow}>
            {data.chart.map((c, i) => (
              <TouchableOpacity
                key={c.label}
                activeOpacity={0.8}
                style={styles.barCol}
                onPress={() => setSelectedBar(selectedBar === i ? null : i)}
              >
                <View
                  style={[
                    styles.barItem,
                    {
                      height: c.height,
                      opacity: selectedBar === null || selectedBar === i ? 1 : 0.45,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    selectedBar === i && { color: COLORS.darkGreen, fontWeight: '800' },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2 ô thống kê */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.statBox}
            onPress={() => showToast(`Tháng này: ${money(data.thisMonth)}`)}
          >
            <Text style={styles.statLabel}>Tháng này</Text>
            <Text style={styles.statValue}>{money(data.thisMonth)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.statBox}
            onPress={() => {
              setFilter('Tất cả');
              showToast(`Bạn đã làm ${data.jobsDone} nhiệm vụ`);
            }}
          >
            <Text style={styles.statLabel}>Số việc đã làm:</Text>
            <Text style={styles.statValue}>{data.jobsDone} nhiệm vụ</Text>
          </TouchableOpacity>
        </View>

        {/* Giao dịch gần đây */}
        <View style={styles.recentHead}>
          <Text style={styles.recentTitle}>GIAO DỊCH GẦN ĐÂY</Text>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => {
              const next = sort === 'newest' ? 'amount' : 'newest';
              setSort(next);
              showToast(
                next === 'amount' ? 'Sắp xếp theo số tiền cao nhất' : 'Sắp xếp theo mới nhất'
              );
            }}
          >
            <Ionicons name="swap-vertical" size={16} color={COLORS.darkGreen} />
            <Text style={styles.sortText}>{sort === 'newest' ? 'Mới nhất' : 'Tiền cao'}</Text>
          </TouchableOpacity>
        </View>

        {/* Chip lọc loại giao dịch */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {TX_FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {txs.length === 0 && <Text style={styles.emptyTx}>Không có giao dịch nào.</Text>}
        {txs.map((t, idx) => (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.7}
            onPress={() => setDetailTx(t)}
            style={[styles.txRow, idx < txs.length - 1 && styles.txBorder]}
          >
            <View style={styles.txIconBox}>
              <MaterialCommunityIcons name={t.icon} size={34} color={t.color} />
              <Text style={[styles.txIconLabel, t.type === 'Urgency' && { color: '#D40000' }]}>
                {t.type}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.txTitle}>{t.title}</Text>
              <Text style={styles.txTime}>{t.time}</Text>
            </View>
            <Text style={styles.txAmount}>{hidden ? '•••••' : `+${formatMoney(t.amount)} đ`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Toast thông báo */}
      {toast ? (
        <View pointerEvents="none" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* Sheet: tuỳ chọn (nút menu) */}
      <Sheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <Text style={styles.sheetTitle}>Tuỳ chọn hiển thị</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Ẩn số tiền</Text>
          <Switch
            value={hidden}
            onValueChange={setHidden}
            trackColor={{ true: COLORS.bar, false: '#D5D5D5' }}
          />
        </View>

        <Text style={[styles.sheetNote, { marginTop: 12 }]}>Sắp xếp giao dịch</Text>
        {[
          { k: 'newest' as const, t: 'Mới nhất' },
          { k: 'amount' as const, t: 'Số tiền cao nhất' },
        ].map((o) => (
          <TouchableOpacity key={o.k} style={styles.reasonRow} onPress={() => setSort(o.k)}>
            <Ionicons
              name={sort === o.k ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={sort === o.k ? COLORS.green : '#999'}
            />
            <Text style={styles.reasonText}>{o.t}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.sheetBtnRow}>
          <TouchableOpacity
            style={[styles.sheetBtn, styles.sheetBtnGhost]}
            onPress={() => {
              setHidden(false);
              setSort('newest');
              setFilter('Tất cả');
              setSelectedBar(null);
            }}
          >
            <Text style={styles.sheetBtnGhostText}>Đặt lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetBtn, styles.sheetBtnMain]}
            onPress={() => setMenuOpen(false)}
          >
            <Text style={styles.sheetBtnMainText}>Xong</Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      {/* Sheet: chi tiết giao dịch */}
      <Sheet visible={!!detailTx} onClose={() => setDetailTx(null)}>
        {detailTx && (
          <View>
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <MaterialCommunityIcons name={detailTx.icon} size={44} color={detailTx.color} />
              <Text style={styles.txDetailAmount}>
                {hidden ? '•••••' : `+${formatMoney(detailTx.amount)} đ`}
              </Text>
              <Text style={{ color: COLORS.gray, marginTop: 2 }}>{detailTx.title}</Text>
            </View>
            <View style={styles.sheetInfo}>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Thời gian</Text>
                <Text style={styles.detailVal}>{detailTx.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Loại việc</Text>
                <Text style={styles.detailVal}>{detailTx.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Mã giao dịch</Text>
                <Text style={styles.detailVal}>{detailTx.code}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Trạng thái</Text>
                <Text style={[styles.detailVal, { color: COLORS.green }]}>Đã nhận vào ví</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.sheetBtn, styles.sheetBtnMain, { marginTop: 16 }]}
              onPress={() => setDetailTx(null)}
            >
              <Text style={styles.sheetBtnMainText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  headerBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  dashTitle: { fontSize: 20, fontWeight: '800', color: '#111' },

  totalCard: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#fff',
  },
  totalLabel: { fontSize: 13, fontWeight: '600', color: COLORS.darkGreen },
  totalValue: { fontSize: 38, fontWeight: '800', color: COLORS.darkGreen, marginTop: 4 },
  growthText: { fontSize: 12 },

  chartCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  chartTooltipRow: { height: 22, alignItems: 'center', justifyContent: 'center' },
  chartTooltip: { fontSize: 13, fontWeight: '700', color: COLORS.darkGreen },
  chartHint: { fontSize: 11, color: '#B5B5B5' },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 6,
  },
  barCol: { alignItems: 'center', justifyContent: 'flex-end', width: 40 },
  barItem: { width: 36, backgroundColor: COLORS.bar, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontSize: 10, color: COLORS.gray, marginTop: 4 },

  statsRow: { flexDirection: 'row', marginTop: 16 },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  statLabel: { fontSize: 13, color: COLORS.gray },
  statValue: { fontSize: 17, fontWeight: '800', color: '#111', marginTop: 4 },

  recentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EAF7F0',
  },
  sortText: { fontSize: 12, fontWeight: '700', color: COLORS.darkGreen, marginLeft: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: COLORS.darkGreen, borderColor: COLORS.darkGreen },
  filterText: { fontSize: 13, fontWeight: '600', color: '#333' },
  filterTextActive: { color: '#fff' },
  emptyTx: { textAlign: 'center', color: COLORS.gray, marginVertical: 24 },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.line },
  txIconBox: { width: 62, alignItems: 'center' },
  txIconLabel: { fontSize: 10, fontWeight: '700', marginTop: 2, color: '#111' },
  txTitle: { fontSize: 15, color: '#111', fontWeight: '500' },
  txTime: { fontSize: 11, color: '#B0B0B0', marginTop: 3 },
  txAmount: { fontSize: 15, fontWeight: '800', color: COLORS.green },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    marginBottom: 14,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 12 },
  sheetNote: { fontSize: 13, color: '#555', lineHeight: 19, marginTop: 10 },
  sheetBtnRow: { flexDirection: 'row', marginTop: 18 },
  sheetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  sheetBtnGhost: { borderWidth: 1, borderColor: '#CFCFCF', backgroundColor: '#fff' },
  sheetBtnGhostText: { fontSize: 15, fontWeight: '700', color: '#444' },
  sheetBtnMain: { backgroundColor: COLORS.greenBtn, borderWidth: 1, borderColor: COLORS.greenBorder },
  sheetBtnMainText: { fontSize: 15, fontWeight: '800', color: COLORS.greenText },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  reasonText: { marginLeft: 10, fontSize: 15, color: '#222' },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  optionText: { fontSize: 15, color: '#222', fontWeight: '600' },
  txDetailAmount: { fontSize: 28, fontWeight: '800', color: COLORS.green, marginTop: 8 },
  sheetInfo: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailKey: { color: COLORS.gray, fontSize: 13 },
  detailVal: { color: '#111', fontSize: 13, fontWeight: '700' },

  toast: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    maxWidth: '88%',
    backgroundColor: 'rgba(30,30,30,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});

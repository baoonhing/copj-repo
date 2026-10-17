import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert, 
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/* =====================================================
   CHỈ CODE 2 MÀN HÌNH:
   1) Home  = Chi tiết công việc
   2) Wallet = Doanh thu (Dashboard)
   Các tab còn lại (chat, đã lưu, cá nhân) KHÔNG code.
   ===================================================== */

const COLORS = {
  green: '#2E9E00',
  greenBtn: '#C8F59A',
  greenBorder: '#9ADB5A',
  greenText: '#2B6A00',
  urgentBg: '#FFD6D6',
  urgentText: '#D40000',
  gray: '#8A8A8A',
  line: '#E6E6E6',
  star: '#F5A623',
  blue: '#3B7DDD',
  // dashboard
  darkGreen: '#1F4D3A',
  bar: '#3DB880',
  cardBorder: '#DADADA',
};

const formatMoney = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ================= DỮ LIỆU ================= */
const JOB = {
  poster: 'Phương Vy',
  rating: '4.9',
  ratingLabel: 'vàng',
  postedAgo: 'Đã đăng tải 5 phút trước',
  title: 'Nhận hàng Shopee ở cổng sau KTX khu B',
  desc:
    'Cần một bạn lấy giúp mình đơn hàng shopee 3107 mang lên trước phòng 409 tòa D4 giúp mình',
  urgentText: 'KHẨN CẤP - trước 15h00',
  pay: 30000,
  time: '14h45 - 15h',
  date: 'Hôm nay',
  location: 'KTX khu B ĐHQG TP Hồ Chí Minh',
  tags: ['Nhận hàng', 'Không yêu cầu kinh nghiệm'],
};

const REVENUE = {
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
    { id: 1, type: 'Urgency', icon: 'alarm-light-outline', color: '#D40000', title: 'Hoàn thành: Urgent', time: 'Hôm qua, 14:20', amount: 30000, code: 'GD260901' },
    { id: 2, type: 'Pet', icon: 'paw', color: '#111', title: 'Hoàn thành: Pet', time: 'Hôm qua, 16:30', amount: 40000, code: 'GD260902' },
    { id: 3, type: 'Cleaning', icon: 'broom', color: '#111', title: 'Hoàn thành: Cleaning', time: '20/08/2026', amount: 50000, code: 'GD260820' },
    { id: 4, type: 'Moving', icon: 'package-variant-closed', color: '#111', title: 'Hoàn thành: Moving', time: '18/08/2026', amount: 25000, code: 'GD260818' },
  ],
};

/* ================= AVATAR ================= */
const Avatar = ({ name, size = 48 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#3A3A3A',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.4 }}>
      {name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
    </Text>
  </View>
);

/* =====================================================
   MÀN 1: CHI TIẾT CÔNG VIỆC (HOME)
   Mọi thao tác đều diễn ra ngay trong trang này
   (bottom sheet + đổi trạng thái), không chuyển sang màn khác.

   Luồng trạng thái:
   open -> accepted -> doing -> done
   (accepted có thể "Huỷ nhận việc" để quay về open)
   ===================================================== */
const STATUS_META = {
  open: { text: 'Đang chờ người nhận', bg: '#EEF4FF', color: '#3B7DDD' },
  accepted: { text: 'Đã nhận việc', bg: '#EAFBD6', color: '#2B6A00' },
  doing: { text: 'Đang thực hiện', bg: '#FFF3D6', color: '#B26B00' },
  done: { text: 'Đã hoàn thành', bg: '#E8E8E8', color: '#555' },
};

const CANCEL_REASONS = [
  'Bận việc đột xuất',
  'Không kịp thời gian',
  'Giá chưa phù hợp',
  'Lý do khác',
];

const STEPS = [
  { key: 'accepted', label: 'Đã nhận' },
  { key: 'doing', label: 'Thực hiện' },
  { key: 'done', label: 'Hoàn thành' },
];

/* ---------- Bottom sheet dùng chung ---------- */
function Sheet({ visible, onClose, children }) {
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

function JobDetailScreen({ job = JOB, onBack, onChat, onAccept }) {
  const [status, setStatus] = useState('open'); // open | accepted | doing | done
  const [saved, setSaved] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sheet, setSheet] = useState(null); // accept | cancel | finish | chat | rate | null
  const [cancelReason, setCancelReason] = useState(null);
  const [agreedPay, setAgreedPay] = useState(null);
  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);
  const [toast, setToast] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'them', text: 'Chào bạn, bạn cần hỏi gì về công việc này không?' },
  ]);
  const [draft, setDraft] = useState('');
  const toastTimer = useRef(null);
  const chatScroll = useRef(null);

  const pay = agreedPay || job.pay;
  const meta = STATUS_META[status];

  const showToast = (text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  /* ----- Header ----- */
  const handleBack = () => {
    if (onBack) onBack();
    else Alert.alert('Quay lại', 'Nút quay lại (nối với navigation của bạn).');
  };

  const toggleSave = () => {
    setSaved((s) => !s);
    showToast(saved ? 'Đã bỏ lưu công việc' : 'Đã lưu công việc');
  };

  /* ----- Nhận việc ----- */
  const confirmAccept = () => {
    setSheet(null);
    setStatus('accepted');
    showToast('Đã nhận việc. Hãy có mặt đúng giờ nhé!');
    if (onAccept) onAccept({ ...job, pay });
  };

  /* ----- Huỷ nhận việc ----- */
  const openCancel = () => {
    setCancelReason(null);
    setSheet('cancel');
  };
  const confirmCancel = () => {
    if (!cancelReason) {
      Alert.alert('Chọn lý do', 'Vui lòng chọn lý do huỷ nhận việc.');
      return;
    }
    setSheet(null);
    setStatus('open');
    showToast('Đã huỷ nhận việc');
  };

  /* ----- Bắt đầu / hoàn thành ----- */
  const startJob = () => {
    setStatus('doing');
    showToast('Bắt đầu thực hiện công việc');
  };
  const confirmFinish = () => {
    setStatus('done');
    setSheet('rate');
  };

  /* ----- Đánh giá ----- */
  const submitRating = () => {
    setRated(true);
    setSheet(null);
    showToast(`Cảm ơn bạn đã đánh giá ${rating} sao`);
  };

  /* ----- Chat ----- */
  const openChat = () => {
    if (onChat) onChat(job);
    setSheet('chat');
  };

  const sendMessage = (text, offer) => {
    const t = (text || '').trim();
    if (!t) return;
    setMessages((m) => [...m, { id: 'me' + Date.now(), from: 'me', text: t }]);
    setDraft('');
    setTimeout(() => {
      if (offer) {
        setAgreedPay(offer);
        setMessages((m) => [
          ...m,
          {
            id: 'th' + Date.now(),
            from: 'them',
            text: `Ok bạn, mình đồng ý mức ${formatMoney(offer)} vnd nhé!`,
          },
        ]);
        showToast(`Thù lao mới: ${formatMoney(offer)} vnd`);
      } else {
        setMessages((m) => [
          ...m,
          { id: 'th' + Date.now(), from: 'them', text: 'Mình đã nhận được tin nhắn, bạn đợi chút nhé!' },
        ]);
      }
    }, 900);
    setTimeout(() => chatScroll.current?.scrollToEnd({ animated: true }), 100);
  };

  /* ----- Khu vực nút chính theo trạng thái ----- */
  const renderActions = () => {
    if (status === 'open') {
      return (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setSheet('accept')} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Nhận thực hiện công việc</Text>
        </TouchableOpacity>
      );
    }
    if (status === 'accepted') {
      return (
        <View>
          <TouchableOpacity style={styles.primaryBtn} onPress={startJob} activeOpacity={0.8}>
            <Ionicons name="play-circle" size={22} color={COLORS.greenText} />
            <Text style={[styles.primaryBtnText, { marginLeft: 8 }]}>Bắt đầu thực hiện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerBtn} onPress={openCancel} activeOpacity={0.8}>
            <Text style={styles.dangerBtnText}>Huỷ nhận việc</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (status === 'doing') {
      return (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setSheet('finish')} activeOpacity={0.8}>
          <Ionicons name="checkmark-done-circle" size={22} color={COLORS.greenText} />
          <Text style={[styles.primaryBtnText, { marginLeft: 8 }]}>Hoàn thành công việc</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <View style={[styles.primaryBtn, styles.primaryBtnDone]}>
          <Ionicons name="checkmark-circle" size={22} color="#666" />
          <Text style={[styles.primaryBtnText, { color: '#666', marginLeft: 8 }]}>
            Công việc đã hoàn thành
          </Text>
        </View>
        {!rated && (
          <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 12 }]} onPress={() => setSheet('rate')}>
            <Text style={styles.secondaryBtnText}>Đánh giá người đăng</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const stepIndex = status === 'accepted' ? 0 : status === 'doing' ? 1 : status === 'done' ? 2 : -1;

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết công việc</Text>
        <TouchableOpacity onPress={toggleSave} style={styles.headerBtn}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Người đăng */}
        <View style={styles.posterRow}>
          <Avatar name={job.poster} />
          <Text style={styles.posterName}>{job.poster}</Text>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.blue} style={{ marginLeft: 4 }} />
          <Ionicons name="star" size={13} color={COLORS.star} style={{ marginLeft: 14 }} />
          <Text style={styles.ratingText}>
            {' '}
            {job.rating} ({job.ratingLabel})
          </Text>
        </View>
        <Text style={styles.postedAgo}>{job.postedAgo}</Text>

        {/* Trạng thái công việc */}
        <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.text}</Text>
        </View>

        {/* Thanh tiến trình (hiện sau khi nhận việc) */}
        {status !== 'open' && (
          <View style={styles.stepper}>
            {STEPS.map((s, i) => {
              const active = i <= stepIndex;
              return (
                <View key={s.key} style={styles.stepItem}>
                  <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                    {active ? (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    ) : (
                      <Text style={styles.stepNum}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, active && { color: COLORS.greenText, fontWeight: '700' }]}>
                    {s.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobDesc}>{job.desc}</Text>

        {status !== 'done' && (
          <View style={styles.urgentChip}>
            <Text style={styles.urgentText}>{job.urgentText}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Thù lao công việc</Text>
          <View>
            <Text style={styles.value}>{formatMoney(pay)} vnd</Text>
            {agreedPay ? <Text style={styles.agreedText}>Đã thoả thuận</Text> : null}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Thời gian thực hiện:</Text>
          <View>
            <Text style={styles.value}>{job.time}</Text>
            <Text style={styles.value}>{job.date}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={30} color="#C62828" />
          <Text style={styles.locationText}>{job.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Đặc điểm công việc</Text>
        <View style={styles.tagWrap}>
          {job.tags.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedTag(selectedTag === t ? null : t)}
              style={[styles.tag, selectedTag === t && styles.tagSelected]}
            >
              <Text style={styles.tagText}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Thẻ tiền thưởng khi hoàn thành */}
        {status === 'done' && (
          <View style={styles.earnedCard}>
            <Ionicons name="wallet" size={26} color={COLORS.green} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: COLORS.greenText, fontWeight: '700' }}>
                +{formatMoney(pay)} vnd
              </Text>
              <Text style={{ color: COLORS.gray, fontSize: 12 }}>Đã cộng vào ví của bạn</Text>
            </View>
          </View>
        )}

        {renderActions()}

        {status !== 'done' && (
          <Text style={styles.negotiateText}>Bạn cần trao đổi thêm về giá?</Text>
        )}

        <TouchableOpacity
          style={[styles.secondaryBtn, status === 'done' && { marginTop: 14 }]}
          onPress={openChat}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Chat với người đăng</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast */}
      {toast ? (
        <View pointerEvents="none" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* ===== Sheet: xác nhận nhận việc ===== */}
      <Sheet visible={sheet === 'accept'} onClose={() => setSheet(null)}>
        <Text style={styles.sheetTitle}>Xác nhận nhận việc</Text>
        <View style={styles.sheetInfo}>
          <Text style={styles.sheetInfoTitle}>{job.title}</Text>
          <Text style={styles.sheetInfoLine}>Thời gian: {job.time} · {job.date}</Text>
          <Text style={styles.sheetInfoLine}>Địa điểm: {job.location}</Text>
          <Text style={[styles.sheetInfoLine, { color: COLORS.green, fontWeight: '700' }]}>
            Thù lao: {formatMoney(pay)} vnd
          </Text>
        </View>
        <Text style={styles.sheetNote}>
          Sau khi nhận, bạn cần có mặt đúng giờ. Nếu không thể làm, hãy huỷ sớm để người đăng tìm bạn khác.
        </Text>
        <View style={styles.sheetBtnRow}>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnGhost]} onPress={() => setSheet(null)}>
            <Text style={styles.sheetBtnGhostText}>Để sau</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnMain]} onPress={confirmAccept}>
            <Text style={styles.sheetBtnMainText}>Xác nhận nhận việc</Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      {/* ===== Sheet: huỷ nhận việc ===== */}
      <Sheet visible={sheet === 'cancel'} onClose={() => setSheet(null)}>
        <Text style={styles.sheetTitle}>Huỷ nhận việc</Text>
        <Text style={styles.sheetNote}>Vui lòng chọn lý do:</Text>
        {CANCEL_REASONS.map((r) => (
          <TouchableOpacity key={r} style={styles.reasonRow} onPress={() => setCancelReason(r)}>
            <Ionicons
              name={cancelReason === r ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={cancelReason === r ? COLORS.green : '#999'}
            />
            <Text style={styles.reasonText}>{r}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.sheetBtnRow}>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnGhost]} onPress={() => setSheet(null)}>
            <Text style={styles.sheetBtnGhostText}>Giữ công việc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnDanger]} onPress={confirmCancel}>
            <Text style={styles.sheetBtnMainText}>Huỷ nhận việc</Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      {/* ===== Sheet: xác nhận hoàn thành ===== */}
      <Sheet visible={sheet === 'finish'} onClose={() => setSheet(null)}>
        <Text style={styles.sheetTitle}>Hoàn thành công việc?</Text>
        <Text style={styles.sheetNote}>
          Hãy chắc chắn bạn đã giao xong hàng cho người đăng. Thù lao {formatMoney(pay)} vnd sẽ được cộng vào ví.
        </Text>
        <View style={styles.sheetBtnRow}>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnGhost]} onPress={() => setSheet(null)}>
            <Text style={styles.sheetBtnGhostText}>Chưa xong</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnMain]} onPress={confirmFinish}>
            <Text style={styles.sheetBtnMainText}>Đã hoàn thành</Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      {/* ===== Sheet: đánh giá ===== */}
      <Sheet visible={sheet === 'rate'} onClose={() => setSheet(null)}>
        <Text style={styles.sheetTitle}>Đánh giá {job.poster}</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setRating(n)}>
              <Ionicons
                name={n <= rating ? 'star' : 'star-outline'}
                size={38}
                color={COLORS.star}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sheetBtnRow}>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnGhost]} onPress={() => setSheet(null)}>
            <Text style={styles.sheetBtnGhostText}>Để sau</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnMain]} onPress={submitRating}>
            <Text style={styles.sheetBtnMainText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      </Sheet>

      {/* ===== Sheet: chat với người đăng ===== */}
      <Sheet visible={sheet === 'chat'} onClose={() => setSheet(null)}>
        <View style={styles.chatHead}>
          <Avatar name={job.poster} size={34} />
          <Text style={[styles.sheetTitle, { marginLeft: 10, marginBottom: 0, flex: 1 }]}>
            {job.poster}
          </Text>
          <TouchableOpacity onPress={() => setSheet(null)}>
            <Ionicons name="close" size={26} color="#444" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={chatScroll}
          style={styles.chatList}
          onContentSizeChange={() => chatScroll.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}
            >
              <Text style={{ color: '#222' }}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Đề xuất giá nhanh */}
        {status !== 'done' && (
          <View style={styles.offerRow}>
            <Text style={styles.offerLabel}>Đề xuất giá:</Text>
            {[35000, 40000].map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.offerChip}
                onPress={() => sendMessage(`Mình đề xuất thù lao ${formatMoney(p)} vnd được không bạn?`, p)}
              >
                <Text style={styles.offerChipText}>{formatMoney(p)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Nhập tin nhắn..."
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(draft)}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(draft)}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </Sheet>
    </View>
  );
}

/* =====================================================
   MÀN 2: DOANH THU (DASHBOARD)
   Mọi thao tác đều diễn ra ngay trong trang này
   (bottom sheet + đổi hiển thị), không chuyển sang màn khác.
   ===================================================== */
const TX_FILTERS = ['Tất cả', 'Urgency', 'Pet', 'Cleaning', 'Moving'];

function DashboardScreen({ data = REVENUE }) {
  const [selectedBar, setSelectedBar] = useState(null); // index cột đang chọn
  const [hidden, setHidden] = useState(false); // ẩn / hiện số tiền
  const [filter, setFilter] = useState('Tất cả');
  const [sort, setSort] = useState('newest'); // newest | amount
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailTx, setDetailTx] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2000);
  };

  const money = (n) => (hidden ? '•••••••' : `${formatMoney(n)}đ`);
  const bar = selectedBar !== null ? data.chart[selectedBar] : null;

  // Lọc + sắp xếp giao dịch
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
    <View style={{ flex: 1 }}>
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
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Tổng doanh thu (chạm để ẩn/hiện) */}
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

        {/* Biểu đồ cột (chạm cột để xem chi tiết) */}
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
                <Text style={[styles.barLabel, selectedBar === i && { color: COLORS.darkGreen, fontWeight: '800' }]}>
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
              showToast(next === 'amount' ? 'Sắp xếp theo số tiền cao nhất' : 'Sắp xếp theo mới nhất');
            }}
          >
            <Ionicons name="swap-vertical" size={16} color={COLORS.darkGreen} />
            <Text style={styles.sortText}>{sort === 'newest' ? 'Mới nhất' : 'Tiền cao'}</Text>
          </TouchableOpacity>
        </View>

        {/* Chip lọc loại giao dịch */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
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

      {/* Toast */}
      {toast ? (
        <View pointerEvents="none" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* ===== Sheet: tuỳ chọn (nút menu) ===== */}
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
          { k: 'newest', t: 'Mới nhất' },
          { k: 'amount', t: 'Số tiền cao nhất' },
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

      {/* ===== Sheet: chi tiết giao dịch ===== */}
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
    </View>
  );
}

/* =====================================================
   THANH TAB DƯỚI
   Chỉ 'home' và 'wallet' có màn hình.
   chat / saved / profile: KHÔNG code (bấm không làm gì).
   ===================================================== */
const TABS = [
  { key: 'home', lib: 'ion', on: 'home', off: 'home-outline', enabled: true },
  { key: 'chat', lib: 'ion', on: 'chatbubble', off: 'chatbubble-outline', enabled: false },
  { key: 'saved', lib: 'ion', on: 'bookmark', off: 'bookmark-outline', enabled: false },
  { key: 'wallet', lib: 'ion', on: 'cash', off: 'cash-outline', enabled: true },
  { key: 'profile', lib: 'ion', on: 'person', off: 'person-outline', enabled: false },
];

function TabBar({ active, onChange }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={styles.tabItem}
          activeOpacity={t.enabled ? 0.6 : 1}
          onPress={() => t.enabled && onChange(t.key)}
        >
          <Ionicons
            name={active === t.key ? t.on : t.off}
            size={28}
            color={active === t.key ? '#000' : '#7A7A7A'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ================= APP ================= */
export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1 }}>
        {tab === 'wallet' ? <DashboardScreen /> : <JobDetailScreen />}
      </View>
      <TabBar active={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  headerBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },

  /* --- Chi tiết công việc --- */
  content: { padding: 18, paddingBottom: 30 },
  posterRow: { flexDirection: 'row', alignItems: 'center' },
  posterName: { fontSize: 16, fontWeight: '700', color: '#111', marginLeft: 12 },
  ratingText: { color: COLORS.star, fontSize: 12, fontWeight: '600' },
  postedAgo: { color: COLORS.gray, fontSize: 11, marginTop: 8 },
  jobTitle: { fontSize: 18, fontWeight: '800', marginTop: 16, color: '#111' },
  jobDesc: { fontSize: 15, lineHeight: 22, marginTop: 16, color: '#222' },
  urgentChip: {
    backgroundColor: COLORS.urgentBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 22,
  },
  urgentText: { color: COLORS.urgentText, fontWeight: '800', fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  label: { fontSize: 15, fontWeight: '700', color: '#111', width: 160 },
  value: { fontSize: 15, fontWeight: '700', color: COLORS.green },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 14, fontWeight: '600', marginLeft: 10, color: '#222', flex: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 18, marginBottom: 10, color: '#111' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#F4F4F4',
    marginRight: 10,
    marginBottom: 8,
  },
  tagSelected: { borderColor: COLORS.blue, borderWidth: 2, backgroundColor: '#fff' },
  tagText: { fontSize: 13, color: '#222' },
  primaryBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.greenBtn,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryBtnDone: { backgroundColor: '#E8E8E8', borderColor: '#CFCFCF' },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: COLORS.greenText },
  negotiateText: { textAlign: 'center', fontSize: 12, marginTop: 22, color: '#111' },
  secondaryBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.greenText },

  /* --- Dashboard --- */
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

  recentTitle: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.line },
  txIconBox: { width: 62, alignItems: 'center' },
  txIconLabel: { fontSize: 10, fontWeight: '700', marginTop: 2, color: '#111' },
  txTitle: { fontSize: 15, color: '#111' },
  txTime: { fontSize: 11, color: '#B0B0B0', marginTop: 3 },
  txAmount: { fontSize: 15, fontWeight: '800', color: COLORS.green },

  /* --- Trạng thái, tiến trình, nút phụ (Chi tiết công việc) --- */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },

  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F7FBF2',
    borderWidth: 1,
    borderColor: '#E1F2CC',
  },
  stepItem: { flex: 1, alignItems: 'center' },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: COLORS.green },
  stepNum: { fontSize: 12, color: '#777', fontWeight: '700' },
  stepLabel: { fontSize: 11, color: COLORS.gray, marginTop: 4 },

  agreedText: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  earnedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EAFBD6',
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
  },
  dangerBtn: {
    marginTop: 12,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#F0A0A0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dangerBtnText: { fontSize: 15, fontWeight: '700', color: '#D40000' },

  /* --- Bottom sheet dùng chung --- */
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
  sheetInfo: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  sheetInfoTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 6 },
  sheetInfoLine: { fontSize: 13, color: '#333', marginTop: 3 },
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
  sheetBtnDanger: { backgroundColor: '#FFD6D6', borderWidth: 1, borderColor: '#F0A0A0' },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  reasonText: { marginLeft: 10, fontSize: 15, color: '#222' },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },

  /* --- Chat trong sheet --- */
  chatHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chatList: { height: 220, marginBottom: 8 },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 14, marginBottom: 8 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: COLORS.greenBtn },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: '#EFEFEF' },
  offerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  offerLabel: { fontSize: 12, color: COLORS.gray, marginRight: 8 },
  offerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    backgroundColor: '#F4FFE8',
    marginRight: 8,
  },
  offerChipText: { fontSize: 12, fontWeight: '700', color: COLORS.greenText },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* --- Toast --- */
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

  /* --- Dashboard: thao tác thêm --- */
  recentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
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
  },
  filterChipActive: { backgroundColor: COLORS.darkGreen, borderColor: COLORS.darkGreen },
  filterText: { fontSize: 13, fontWeight: '600', color: '#333' },
  filterTextActive: { color: '#fff' },
  emptyTx: { textAlign: 'center', color: COLORS.gray, marginVertical: 24 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  optionText: { fontSize: 15, color: '#222', fontWeight: '600' },
  txDetailAmount: { fontSize: 28, fontWeight: '800', color: COLORS.green, marginTop: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailKey: { color: COLORS.gray, fontSize: 13 },
  detailVal: { color: '#111', fontSize: 13, fontWeight: '700' },

  /* --- Tab bar --- */
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    backgroundColor: '#fff',
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
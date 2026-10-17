import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
};

const formatMoney = (n: number | string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const JOBS_DATA: Record<string, any> = {
  '1': {
    id: '1',
    poster: 'Phương Vy',
    rating: '4.9',
    ratingLabel: 'vàng',
    postedAgo: 'Đã đăng tải 5 phút trước',
    title: 'Nhận hàng Shopee ở cổng sau KTX khu B',
    desc: 'Cần một bạn lấy giúp mình đơn hàng shopee 3107 mang lên trước phòng 409 tòa D4 giúp mình',
    urgentText: 'KHẨN CẤP - trước 15h00',
    pay: 30000,
    time: '14h45 - 15h',
    date: 'Hôm nay',
    location: 'KTX khu B ĐHQG TP Hồ Chí Minh',
    tags: ['Nhận hàng', 'Không yêu cầu kinh nghiệm'],
  },
  '2': {
    id: '2',
    poster: 'Minh Anh',
    rating: '5.0',
    ratingLabel: 'vàng',
    postedAgo: 'Đã đăng tải 20 phút trước',
    title: 'Dắt cún đi dạo tại công viên KTX',
    desc: 'Bé Poodle nhà mình cần đi dạo tầm 30-45 phút quanh Làng Đại học.',
    urgentText: 'Hẹn trước - 16g00',
    pay: 150000,
    time: '16h00 - 17h',
    date: '22/12/2026',
    location: 'Công viên KTX khu B ĐHQG TP Hồ Chí Minh',
    tags: ['Thú cưng', 'Yêu động vật'],
  },
  '3': {
    id: '3',
    poster: 'Nguyễn Thùy',
    rating: '5.0',
    ratingLabel: 'kim cương',
    postedAgo: 'Đã đăng tải 33 phút trước',
    title: 'Phụ chuyển phòng trọ',
    desc: 'Vì đồ đạc trong phòng nhiều, mình cần 1 bạn hỗ trợ dọn phòng trọ.',
    urgentText: 'Hẹn trước - 8h00',
    pay: 75000,
    time: '8h00 - 11h',
    date: '15/11/2026',
    location: 'KTX khu A ĐHQG TP Hồ Chí Minh',
    tags: ['Chuyển đồ', 'Cần sức khỏe'],
  },
  '4': {
    id: '4',
    poster: 'Bảo Nhi',
    rating: '5.0',
    ratingLabel: 'kim cương',
    postedAgo: 'Đã đăng tải 39 phút trước',
    title: 'Phụ tìm người dọn vệ sinh căn hộ',
    desc: 'Tìm 1 bạn hỗ trợ dọn vệ sinh nhà ở, yêu cầu kỹ tính, gọn gàng và sạch sẽ.',
    urgentText: 'Hẹn trước - 12g00',
    pay: 120000,
    time: '12h00 - 15h',
    date: '17/11/2026',
    location: 'Chung cư Làng Đại học, TP Thủ Đức',
    tags: ['Dọn dẹp', 'Gọn gàng'],
  },
};

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

const Avatar = ({ name, size = 48 }: { name: string; size?: number }) => (
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
      {name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)}
    </Text>
  </View>
);

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

export default function ChitietCVScreen() {
  const params = useLocalSearchParams();
  const jobId = (params.id as string) || '1';
  const job = JOBS_DATA[jobId] || JOBS_DATA['1'];

  const [status, setStatus] = useState<'open' | 'accepted' | 'doing' | 'done'>('open');
  const [saved, setSaved] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'accept' | 'cancel' | 'finish' | 'chat' | 'rate' | null>(null);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [agreedPay, setAgreedPay] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);
  const [toast, setToast] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm0', from: 'them', text: 'Chào bạn, bạn cần hỏi gì về công việc này không?' },
  ]);
  const [draft, setDraft] = useState('');
  const toastTimer = useRef<any>(null);
  const chatScroll = useRef<ScrollView>(null);

  const pay = agreedPay || job.pay;
  const meta = STATUS_META[status];

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const handleBack = () => {
    router.back();
  };

  const toggleSave = () => {
    setSaved((s) => !s);
    showToast(saved ? 'Đã bỏ lưu công việc' : 'Đã lưu công việc');
  };

  const confirmAccept = () => {
    setSheet(null);
    setStatus('accepted');
    showToast('Đã nhận việc. Hãy có mặt đúng giờ nhé!');
  };

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

  const startJob = () => {
    setStatus('doing');
    showToast('Bắt đầu thực hiện công việc');
  };

  const confirmFinish = () => {
    setStatus('done');
    setSheet('rate');
  };

  const submitRating = () => {
    setRated(true);
    setSheet(null);
    showToast(`Cảm ơn bạn đã đánh giá ${rating} sao`);
  };

  const openChat = () => {
    setSheet('chat');
  };

  const sendMessage = (text: string, offer?: number) => {
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
          <Ionicons name="location-sharp" size={26} color="#C62828" />
          <Text style={styles.locationText}>{job.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Đặc điểm công việc</Text>
        <View style={styles.tagWrap}>
          {job.tags.map((t: string) => (
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

      {/* Toast thông báo */}
      {toast ? (
        <View pointerEvents="none" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {/* Sheet: xác nhận nhận việc */}
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

      {/* Sheet: huỷ nhận việc */}
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

      {/* Sheet: xác nhận hoàn thành */}
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

      {/* Sheet: đánh giá */}
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

      {/* Sheet: chat với người đăng */}
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
            placeholderTextColor="#8e8e93"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(draft)}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(draft)}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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

  content: { padding: 18, paddingBottom: 40 },
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

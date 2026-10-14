import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONVERSATIONS: Record<
  string,
  {
    user: { name: string; verified: boolean; avatar: any };
    messages: { id: string; text?: string; isMe: boolean; image?: any }[];
  }
> = {
  '1': {
    user: {
      name: 'Phương Vy',
      verified: true,
      avatar: require('@/assets/images/Vy.png'),
    },
    messages: [
      { id: '1', text: 'Hello bạn', isMe: true },
      { id: '2', text: 'Hello', isMe: false },
      { id: '3', text: 'Bạn nhận hàng mã đơn 3107 giúp mình nhé', isMe: false },
      {
        id: '4',
        text: 'Mình đang đứng trước cổng rồi, 2 phút nữa mình gửi ảnh kiện hàng cho bạn nhé',
        isMe: true,
      },
    ],
  },
  '2': {
    user: {
      name: 'Anh Minh',
      verified: false,
      avatar: 'https://i.pravatar.cc/150?u=tram',
    },
    messages: [
      { id: '1', text: 'Chào bạn, chiều nay bạn có rảnh dắt cún đi dạo không?', isMe: false },
      { id: '2', text: 'Chào bạn, mình có nhận nhé. Bé cún nhà bạn thuộc giống gì ạ?', isMe: true },
      { id: '3', text: 'Bé là Corgi nha, ngoan lắm. Mình gửi ảnh cho bạn xem nè!', isMe: false},
      { id: '4', isMe: false, image: require('@/assets/images/cún.jpg') },
    ],
  },
  '3': {
    user: {
      name: 'Bảo Nhi',
      verified: false,
      avatar: require('@/assets/images/Nhi.png'),
    },
    messages: [
      { id: '1', text: 'Mình vừa chuyển khoản tiền công việc hôm nay rồi nhé.', isMe: true },
      { id: '2', text: 'Mình nhận được tiền rồi nhé. Cảm ơn bạn rất nhiều!', isMe: false },
    ],
  },
  '4': {
    user: {
      name: 'Trâm Lê',
      verified: false,
      avatar: require('@/assets/images/Trâm.png'),
    },
    messages: [
      { id: '1', text: 'Bạn đã giao xong hàng tới địa chỉ yêu cầu chưa?', isMe: false },
      { id: '2', text: 'Mình vừa giao xong và khách đã ký nhận rồi ạ.', isMe: true },
      { id: '3', text: 'Cảm ơn bạn nhé', isMe: false },
    ],
  },
  '5': {
    user: {
      name: 'Nguyễn Thùy',
      verified: false,
      avatar: require('@/assets/images/thùy.png'),
    },
    messages: [
      { id: '1', text: 'Hôm nay dọn dẹp nhà cửa như vậy đã đạt yêu cầu chưa bạn?', isMe: true },
      { id: '2', text: 'Cảm ơn bạn nha, nhà cửa rất sạch sẽ và gọn gàng!', isMe: false },
    ],
  },
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const currentChat = CONVERSATIONS[(id as string) || '1'] || CONVERSATIONS['1'];
  const user = currentChat.user;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(currentChat.messages);

  useEffect(() => {
    setMessages(currentChat.messages);
  }, [id]);

  const handleSend = () => {
    if (message.trim().length === 0) return;
    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isMe: true, // Tin nhắn do mình gửi
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Entypo name="chevron-left" size={28} color="black" />
        </TouchableOpacity>
        
        <Image 
          source={typeof user.avatar === 'string' ? { uri: user.avatar } : user.avatar} 
          style={styles.headerAvatar} 
        />
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.headerName}>{user.name}</Text>
            {user.verified && (
              <MaterialIcons name="verified" size={16} color="#1d9bf0" style={styles.verifiedIcon} />
            )}
          </View>
          <View style={styles.statusRow}>
            <MaterialIcons name="lock" size={12} color="#8e8e93" />
            <Text style={styles.statusText}>Ẩn SĐT</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionIcon}>
            <Feather name="phone" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Feather name="video" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Entypo name="dots-three-horizontal" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.chatContainer}>
          {/* Thông báo điều khoản */}
          <View style={styles.noticeBox}>
            <MaterialIcons name="security" size={16} color="black" style={styles.noticeIcon} />
            <Text style={styles.noticeText}>
              Co-work ghi nhận thỏa thuận tại khung chat này để bảo vệ quyền lợi nếu xảy ra tranh chấp
            </Text>
          </View>

          {/* Hiển thị danh sách tin nhắn tự động */}
          {messages.map((msg, index) => {
            if (msg.isMe) {
              return (
                <View key={msg.id} style={styles.messageRowRight}>
                  {msg.image ? (
                    <Image
                      source={typeof msg.image === 'string' ? { uri: msg.image } : msg.image}
                      style={styles.messageImage}
                    />
                  ) : (
                    <View style={styles.bubbleRight}>
                      <Text style={styles.textRight}>{msg.text}</Text>
                    </View>
                  )}
                </View>
              );
            } else {
              // Kiểm tra xem tin nhắn tiếp theo có phải của người này không, nếu phải thì ẩn avatar đi cho gọn
              const isLastInBlock = index === messages.length - 1 || messages[index + 1].isMe;
              return (
                <View key={msg.id} style={styles.messageRowLeft}>
                  {isLastInBlock ? (
                    <Image 
                      source={typeof user.avatar === 'string' ? { uri: user.avatar } : user.avatar} 
                      style={styles.messageAvatar} 
                    />
                  ) : (
                    <View style={styles.messageAvatarPlaceholder} />
                  )}
                  {msg.image ? (
                    <Image
                      source={typeof msg.image === 'string' ? { uri: msg.image } : msg.image}
                      style={styles.messageImage}
                    />
                  ) : (
                    <View style={styles.bubbleLeft}>
                      <Text style={styles.textLeft}>{msg.text}</Text>
                    </View>
                  )}
                </View>
              );
            }
          })}

        </ScrollView>

        {/* Thanh nhập tin nhắn */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Gửi tin nhắn..."
              placeholderTextColor="#8e8e93"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend} // Hỗ trợ ấn nút Enter/Send trên bàn phím
              returnKeyType="send"
            />
            {message.trim().length > 0 ? (
              <TouchableOpacity style={styles.inputIcon} onPress={handleSend}>
                <Ionicons name="send" size={20} color="#208AEF" />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.inputIcon}>
                  <Feather name="mic" size={20} color="#8e8e93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIcon}>
                  <Feather name="smile" size={20} color="#8e8e93" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIcon}>
                  <Feather name="image" size={20} color="#8e8e93" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  backButton: {
    padding: 5,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 15,
  },
  keyboardAvoid: {
    flex: 1,
  },
  chatContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  noticeIcon: {
    marginRight: 6,
  },
  noticeText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'center',
  },
  messageRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  bubbleRight: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  textRight: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
  },
  messageRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  messageAvatarPlaceholder: {
    width: 28,
    marginRight: 8,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  bubbleLeft: {
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
   },
  textLeft: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 24,
    paddingHorizontal: 15,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    height: '100%',
  },
  inputIcon: {
    marginLeft: 12,
  },
});

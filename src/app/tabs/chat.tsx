import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export interface ChatItem {
  id: string;
  name: string;
  verified: boolean;
  time: string;
  lastMessage: string;
  online: boolean;
  hasUnreadDot: boolean;
  avatar: any;
  attachment?: any;
  disableChat?: boolean;
}

const CHAT_DATA: ChatItem[] = [
  {
    id: '1',
    name: 'Phương Vy',
    verified: true,
    time: '3m',
    lastMessage: 'Bạn nhận hàng mã đơn 48...',
    online: true,
    hasUnreadDot: true,
    avatar: require('@/assets/images/Vy.png'),
  },
  {
    id: '2',
    name: 'Anh Minh',
    verified: false,
    time: '5m',
    lastMessage: 'Đã gửi một ảnh',
    online: true,
    hasUnreadDot: false,
    avatar: 'https://i.pravatar.cc/150?u=tram',
    attachment: require('@/assets/images/cún.jpg'),
  },
  {
    id: '3',
    name: 'Bảo Nhi',
    verified: false,
    time: '2d',
    lastMessage: 'Mình nhận được tiền rồi nhé...',
    online: false,
    hasUnreadDot: false,
    avatar: require('@/assets/images/Nhi.png'),
  },
  {
    id: '4',
    name: 'Trâm Lê',
    verified: false,
    time: '3d',
    lastMessage: 'Cảm ơn bạn nhé',
    online: false,
    hasUnreadDot: false,
    avatar: require('@/assets/images/Trâm.png'),
  },
  {
    id: '5',
    name: 'Nguyễn Thùy',
    verified: false,
    time: '4d',
    lastMessage: 'Cảm ơn bạn nha',
    online: false,
    hasUnreadDot: false,
    avatar: require('@/assets/images/thùy.png'),
  },
];

export default function ChatListScreen() {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState(CHAT_DATA); // Quản lý dữ liệu bằng state

  const handlePressChat = (id: string) => {
    // Tìm xem người bạn vừa bấm vào là ai trong danh sách
    const selectedPerson = chats.find(chat => chat.id === id);
    
    // Nếu người này bị đánh dấu disableChat = true, thì dừng lại (return) không làm gì cả
    if (selectedPerson && selectedPerson.disableChat) {
      return; 
    }
    // 1. Cập nhật state để đánh dấu tin nhắn là "đã đọc"
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === id ? { ...chat, hasUnreadDot: false } : chat
      )
    );
    // 2. Chuyển trang
    router.push({ pathname: "/chat/chatdetail", params: { id } } as any);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => handlePressChat(item.id)}
    >
      {/* Unread Dot */}
      <View style={styles.unreadDotContainer}>
        {item.hasUnreadDot && <View style={styles.unreadDot} />}
      </View> 

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image 
          source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar} 
          style={styles.avatar} 
        />
        {item.online && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.verified && (
              <MaterialIcons
                name="verified"
                size={16}
                color="#1d9bf0"
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage, 
              item.hasUnreadDot && { fontWeight: 'bold', color: '#000' }
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </View>

      {/* Attachment */}
      {item.attachment && (
        <Image 
          source={typeof item.attachment === 'string' ? { uri: item.attachment } : item.attachment} 
          style={styles.attachment} 
        />
      )}
    </TouchableOpacity>
  );

  // Lọc danh sách dựa trên từ khóa tìm kiếm (search)
  const filteredChats = chats.filter((chat) => 
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tin nhắn"
          placeholderTextColor="#8e8e93"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredChats} // Sử dụng danh sách đã được lọc
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 5,
    paddingBottom: 100,

  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 4, 
    paddingRight: 16,
  },
  unreadDotContainer: {
    width: 11, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff2d55',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e1e1e1',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34c759',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  time: {
    fontSize: 14,
    color: '#8e8e93',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8e8e93',
    flex: 1,
  },
  attachment: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginLeft: 10,
  },
});

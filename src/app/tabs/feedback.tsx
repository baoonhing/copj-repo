import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Post {
  id: string;
  name: string;
  verified?: boolean;
  time: string;
  avatar: string;
  image?: string;
  caption: string;
  likes: number;
  comments: number;
}

const initialPosts: Post[] = [
  {
    id: "1",
    name: "Phương Vy",
    verified: true,
    time: "3 min ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    image: "https://i.ibb.co/xSGNHmdv/nhanhang.png",
    caption: "Tốt, nhanh chóng",
    likes: 21,
    comments: 4,
  },
  {
    id: "2",
    name: "Bảo Nhi",
    verified: false,
    time: "2 hrs ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    caption: "Dịch vụ rất tốt. Bạn có mặt rất nhanh để giúp mình.",
    likes: 6,
    comments: 18,
  },
  {
    id: "3",
    name: "Anh Minh",
    verified: false,
    time: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    caption: "Hỗ trợ nhiệt tình, chuyên nghiệp.",
    likes: 12,
    comments: 2,
  },
];

export default function FeedbackScreen() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [addedComments, setAddedComments] = useState<Record<string, string[]>>({});

  const toggleLike = (id: string) => {
    setLikedPosts((current) =>
      current.includes(id)
        ? current.filter((postId) => postId !== id)
        : [...current, id]
    );
  };

  const addComment = (id: string) => {
    const comment = draft.trim();
    if (!comment) return;
    setAddedComments((current) => ({
      ...current,
      [id]: [...(current[id] ?? []), comment],
    }));
    setDraft("");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Danh sách Feedback/Review */}
      <ScrollView
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
      >
        {initialPosts.map((post) => {
          const isLiked = likedPosts.includes(post.id);
          const comments = addedComments[post.id] ?? [];

          return (
            <View key={post.id} style={styles.post}>
              {/* Header của bài viết */}
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <View style={styles.identity}>
                  <View style={styles.nameLine}>
                    <Text style={styles.name}>{post.name}</Text>
                    {post.verified && (
                      <MaterialIcons
                        name="verified"
                        size={16}
                        color="#1d9bf0"
                        style={styles.verified}
                      />
                    )}
                  </View>
                  <Text style={styles.time}>{post.time}</Text>
                </View>
                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Hình ảnh (nếu có) */}
              {post.image ? (
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              ) : null}

              {/* Nội dung đánh giá */}
              <Text style={styles.caption}>{post.caption}</Text>

              {/* Cụm Thích & Bình luận */}
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => toggleLike(post.id)}
                  style={styles.action}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={22}
                    color={isLiked ? "#e34f59" : "#000"}
                  />
                  <Text style={styles.actionText}>
                    {post.likes + (isLiked ? 1 : 0)} lượt thích
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setCommentingPost(commentingPost === post.id ? null : post.id);
                    setDraft("");
                  }}
                  style={styles.action}
                >
                  <Feather name="message-square" size={20} color="#000" />
                  <Text style={styles.actionText}>
                    {post.comments + comments.length} bình luận
                  </Text>
                </Pressable>
              </View>

              {/* Danh sách bình luận thêm mới */}
              {comments.map((comment, commentIndex) => (
                <Text key={`${post.id}-${commentIndex}`} style={styles.commentText}>
                  <Text style={styles.commentAuthor}>Bạn </Text>
                  {comment}
                </Text>
              ))}

              {/* Ô gõ bình luận (khi bấm vào nút bình luận) */}
              {commentingPost === post.id && (
                <View style={styles.commentComposer}>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="Viết bình luận..."
                    placeholderTextColor="#8e8e93"
                    style={styles.commentInput}
                    returnKeyType="send"
                    onSubmitEditing={() => addComment(post.id)}
                  />
                  <TouchableOpacity
                    onPress={() => addComment(post.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="send" size={18} color="#208AEF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
    width: 120,
  },
  tabText: {
    fontSize: 16,
    color: "#8e8e93",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "bold",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    width: 44,
    height: 3,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  feed: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  post: {
    marginBottom: 28,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f3f4f6",
  },
  identity: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  nameLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  verified: {
    marginLeft: 4,
  },
  time: {
    color: "#8e8e93",
    fontSize: 13,
    marginTop: 2,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginBottom: 10,
  },
  caption: {
    color: "#000000",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
  },
  commentText: {
    color: "#000000",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  commentComposer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 14,
    marginTop: 12,
    height: 42,
    backgroundColor: "#f9fafb",
  },
  commentInput: {
    flex: 1,
    color: "#000000",
    fontSize: 14,
    height: "100%",
  },
});

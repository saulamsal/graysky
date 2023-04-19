import { Image, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { type AppBskyFeedDefs, type AppBskyFeedPost } from "@atproto/api";
import { Heart, MessageSquare, Repeat, User } from "lucide-react-native";

import { useLike, useRepost } from "../lib/hooks";
import { cx } from "../lib/utils/cx";
import { timeSince } from "../lib/utils/time";
import { Embed, type PostEmbed } from "./embed";

interface Props {
  post: AppBskyFeedDefs.ThreadViewPost["post"];
  hasReply?: boolean;
}

export const Post = ({ post, hasReply }: Props) => {
  const { liked, likeCount, toggleLike } = useLike(post);
  const { reposted, repostCount, toggleRepost } = useRepost(post);

  const profileHref = `/profile/${post.author.handle}`;

  return (
    <View
      className={cx(
        "bg-white p-4 pb-5",
        !hasReply && "border-b border-b-neutral-200",
      )}
    >
      <Link href={profileHref} asChild>
        <TouchableOpacity className="flex-row">
          {post.author.avatar ? (
            <Image
              source={{ uri: post.author.avatar }}
              alt={post.author.handle}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <User size={32} color="#1C1C1E" />
            </View>
          )}
          <View className="ml-3 flex-1 justify-center">
            <View className="flex-row">
              <Text
                numberOfLines={1}
                className="max-w-[85%] text-base font-semibold"
              >
                {post.author.displayName}
              </Text>
              {/* get age of post - e.g. 5m */}
              <Text className="text-base text-neutral-500">
                {" "}
                · {timeSince(new Date(post.indexedAt))}
              </Text>
            </View>
            <Text className="text-base leading-5 text-neutral-500">
              @{post.author.handle}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      {/* text content */}
      <Text className="mt-3 text-lg leading-6">
        {(post.record as AppBskyFeedPost.Record).text}
      </Text>
      {/* embeds */}
      {post.embed && <Embed content={post.embed as PostEmbed} />}
      {/* actions */}
      <View className="mt-4 flex-row justify-between">
        <TouchableOpacity className="flex-row items-center gap-2">
          <MessageSquare size={16} color="#1C1C1E" />
          <Text>{post.replyCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={toggleRepost.isLoading}
          onPress={() => toggleRepost.mutate()}
          className="flex-row items-center gap-2"
        >
          <Repeat size={16} color={reposted ? "#2563eb" : "#1C1C1E"} />
          <Text
            style={{
              color: reposted ? "#2563eb" : "#1C1C1E",
            }}
          >
            {repostCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={toggleLike.isLoading}
          onPress={() => toggleLike.mutate()}
          className="flex-row items-center gap-2"
        >
          <Heart
            size={16}
            fill={liked ? "#dc2626" : "transparent"}
            color={liked ? "#dc2626" : "#1C1C1E"}
          />
          <Text
            style={{
              color: liked ? "#dc2626" : "#1C1C1E",
            }}
          >
            {likeCount}
          </Text>
        </TouchableOpacity>
        <View className="w-8" />
      </View>
    </View>
  );
};
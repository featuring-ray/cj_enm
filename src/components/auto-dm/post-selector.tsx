"use client";

import { useState } from "react";
import { RefreshCw, Image as ImageIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InstagramPost } from "@/types/auto-dm";
import postsData from "@/data/mock/instagram-posts.json";

interface PostSelectorProps {
  selectedPostId: string | null;
  currentAutomationId?: string;
  onSelect: (postId: string) => void;
  error?: string;
}

export function PostSelector({
  selectedPostId,
  currentAutomationId,
  onSelect,
  error,
}: PostSelectorProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = () => {
    setIsLoading(true);
    // 목 데이터 로드 시뮬레이션
    setTimeout(() => {
      setPosts(postsData as InstagramPost[]);
      setLastRefreshed(new Date().toLocaleString("ko-KR"));
      setIsLoading(false);
    }, 500);
  };

  const isPostUsed = (post: InstagramPost) =>
    post.usedInAutomationId !== null &&
    post.usedInAutomationId !== currentAutomationId;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadPosts}
          disabled={isLoading}
        >
          {posts.length === 0 ? (
            <>
              <ImageIcon className="w-4 h-4 mr-1.5" />
              게시물 불러오기
            </>
          ) : (
            <>
              <RefreshCw
                className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
              />
              업데이트
            </>
          )}
        </Button>
        {lastRefreshed && (
          <span className="text-xs text-muted-foreground">
            마지막 업데이트: {lastRefreshed}
          </span>
        )}
      </div>

      {posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {posts.map((post) => {
            const used = isPostUsed(post);
            const selected = selectedPostId === post.id;

            return (
              <Card
                key={post.id}
                className={`relative cursor-pointer transition-all ${
                  selected
                    ? "ring-2 ring-purple-500 shadow-md"
                    : used
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                }`}
                onClick={() => !used && onSelect(post.id)}
              >
                <CardContent className="p-2">
                  <div className="relative aspect-square rounded-md bg-gray-100 overflow-hidden mb-2">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    {used && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-xs text-center px-2">
                          <Lock className="w-4 h-4 mx-auto mb-1" />
                          다른 자동화에서
                          <br />
                          사용 중
                        </div>
                      </div>
                    )}
                    {selected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 mb-1">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>❤️ {post.likeCount.toLocaleString()}</span>
                    <span>💬 {post.commentCount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {posts.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">
          &quot;게시물 불러오기&quot; 버튼을 클릭하여 게시물을 가져오세요.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, MessageSquare, ThumbsUp, Reply, Trash2, Pin, Lock, Eye } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function DiscussionTopic() {
  const [, params] = useRoute("/forum/topic/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const topicId = params?.id ? parseInt(params.id) : 0;
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  
  const { data: topic, isLoading: topicLoading } = trpc.discussion.topicById.useQuery(
    { topicId },
    { enabled: topicId > 0 }
  );
  
  const { data: replies, refetch: refetchReplies } = trpc.discussion.replies.useQuery(
    { topicId },
    { enabled: topicId > 0 }
  );
  
  const { data: userLikes, refetch: refetchLikes } = trpc.discussion.userLikes.useQuery(
    { topicId },
    { enabled: !!user && topicId > 0 }
  );
  
  const createReplyMutation = trpc.discussion.createReply.useMutation({
    onSuccess: () => {
      toast.success("Reply posted!");
      setReplyContent("");
      setReplyingTo(null);
      refetchReplies();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post reply");
    },
  });
  
  const toggleLikeMutation = trpc.discussion.toggleLike.useMutation({
    onSuccess: () => {
      refetchLikes();
      refetchReplies();
    },
  });
  
  const updateTopicMutation = trpc.discussion.updateTopic.useMutation({
    onSuccess: () => {
      toast.success("Topic updated!");
      window.location.reload();
    },
  });
  
  const deleteTopicMutation = trpc.discussion.deleteTopic.useMutation({
    onSuccess: () => {
      toast.success("Topic deleted");
      setLocation("/forum");
    },
  });
  
  const deleteReplyMutation = trpc.discussion.deleteReply.useMutation({
    onSuccess: () => {
      toast.success("Reply deleted");
      refetchReplies();
    },
  });
  
  if (topicId === 0) {
    setLocation("/forum");
    return null;
  }
  
  if (topicLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading topic...</div>
        </div>
      </div>
    );
  }
  
  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-card/50 backdrop-blur border-white/10 max-w-md">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-semibold text-white mb-2">Topic Not Found</h3>
              <p className="text-white/60 mb-4">This discussion topic could not be found.</p>
              <Button onClick={() => setLocation("/forum")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const handlePostReply = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    
    createReplyMutation.mutate({
      topicId,
      parentReplyId: replyingTo || undefined,
      content: replyContent,
    });
  };
  
  const handleLike = (replyId?: number) => {
    toggleLikeMutation.mutate({
      topicId: replyId ? undefined : topicId,
      replyId,
    });
  };
  
  const isLiked = (replyId?: number) => {
    if (!userLikes) return false;
    return userLikes.some(like => 
      replyId ? like.replyId === replyId : like.topicId === topicId
    );
  };
  
  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      general: { bg: "bg-blue-500/20", text: "text-blue-400" },
      module_question: { bg: "bg-purple-500/20", text: "text-purple-400" },
      technical_support: { bg: "bg-red-500/20", text: "text-red-400" },
      success_story: { bg: "bg-green-500/20", text: "text-green-400" },
      best_practices: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    };
    
    const variant = variants[category] || variants.general;
    const label = category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0`}>
        {label}
      </Badge>
    );
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };
  
  const isInstructor = user?.role === "admin" || user?.role === "instructor";
  const isAuthor = user?.id === topic.authorId;
  
  // Build threaded reply structure
  const topLevelReplies = replies?.filter(r => !r.parentReplyId) || [];
  const getRepliesTo = (parentId: number) => replies?.filter(r => r.parentReplyId === parentId) || [];
  
  const ReplyCard = ({ reply, depth = 0 }: { reply: any; depth?: number }) => {
    const nestedReplies = getRepliesTo(reply.id);
    const maxDepth = 3;
    
    return (
      <div className={depth > 0 ? "ml-8 md:ml-12 mt-4" : ""}>
        <Card className="bg-card/30 backdrop-blur border-white/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-semibold">
                    {reply.author?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">{reply.author?.name || "Unknown"}</span>
                  {reply.author?.role === "admin" && (
                    <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">Instructor</Badge>
                  )}
                  <span className="text-white/50 text-sm">•</span>
                  <span className="text-white/50 text-sm">{formatTimeAgo(reply.createdAt)}</span>
                </div>
                
                <p className="text-white/80 whitespace-pre-wrap mb-3">{reply.content}</p>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(reply.id)}
                    disabled={!user || toggleLikeMutation.isPending}
                    className={`text-white/60 hover:text-white ${isLiked(reply.id) ? "text-purple-400" : ""}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {reply.likeCount || 0}
                  </Button>
                  
                  {user && depth < maxDepth && !topic.isLocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(reply.id);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  )}
                  
                  {(isInstructor || user?.id === reply.authorId) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this reply?")) {
                          deleteReplyMutation.mutate({ replyId: reply.id });
                        }
                      }}
                      className="text-red-400/60 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {nestedReplies.map(nestedReply => (
          <ReplyCard key={nestedReply.id} reply={nestedReply} depth={depth + 1} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/forum")}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
          
          {/* Topic */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 font-semibold text-lg">
                      {topic.author?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">{topic.author?.name || "Unknown"}</span>
                    {topic.author?.role === "admin" && (
                      <Badge className="bg-red-500/20 text-red-400 border-0">Instructor</Badge>
                    )}
                    <span className="text-white/50">•</span>
                    <span className="text-white/50">{formatTimeAgo(topic.createdAt)}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {topic.isPinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    {topic.isLocked && (
                      <Badge className="bg-red-500/20 text-red-400 border-0">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                    {getCategoryBadge(topic.category)}
                    {topic.moduleId && (
                      <Badge className="bg-indigo-500/20 text-indigo-400 border-0">
                        Module {topic.moduleId}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-white/50 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{topic.viewCount} views</span>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{topic.title}</h1>
                  <p className="text-white/80 whitespace-pre-wrap">{topic.content}</p>
                </div>
              </div>
              
              {/* Moderator Actions */}
              {isInstructor && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTopicMutation.mutate({ topicId, isPinned: !topic.isPinned })}
                    className="text-white/70"
                  >
                    <Pin className="w-4 h-4 mr-1" />
                    {topic.isPinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTopicMutation.mutate({ topicId, isLocked: !topic.isLocked })}
                    className="text-white/70"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    {topic.isLocked ? "Unlock" : "Lock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete this topic and all replies?")) {
                        deleteTopicMutation.mutate({ topicId });
                      }
                    }}
                    className="text-red-400/70 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Replies */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              {topic.replyCount} {topic.replyCount === 1 ? "Reply" : "Replies"}
            </h2>
            
            {topLevelReplies.map(reply => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
          
          {/* Reply Form */}
          {user && !topic.isLocked ? (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-6">
                {replyingTo && (
                  <div className="mb-4 flex items-center justify-between bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <span className="text-white/70">
                      Replying to {replies?.find(r => r.id === replyingTo)?.author?.name}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                  </div>
                )}
                
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="bg-background/50 border-white/10 text-white resize-none mb-4"
                />
                
                <div className="flex justify-end">
                  <Button
                    onClick={handlePostReply}
                    disabled={createReplyMutation.isPending || !replyContent.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : !user ? (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-6 text-center">
                <p className="text-white/60 mb-4">Please log in to reply to this topic</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <p className="text-white/60">This topic is locked. No new replies can be added.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

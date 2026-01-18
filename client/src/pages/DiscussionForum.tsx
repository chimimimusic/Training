import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Plus, Search, Eye, MessageCircle, Pin, Lock, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function DiscussionForum() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [moduleFilter, setModuleFilter] = useState<number | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: topics, isLoading, refetch } = trpc.discussion.topics.useQuery({
    category: categoryFilter,
    moduleId: moduleFilter,
    search: searchQuery || undefined,
  });
  
  const createTopicMutation = trpc.discussion.createTopic.useMutation({
    onSuccess: () => {
      toast.success("Topic created successfully!");
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create topic");
    },
  });
  
  const handleCreateTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTopicMutation.mutate({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as any,
      moduleId: formData.get("moduleId") ? parseInt(formData.get("moduleId") as string) : undefined,
    });
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Community Forum</h1>
              <p className="text-white/70">Connect, ask questions, and share experiences with fellow trainees</p>
            </div>
            
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Topic</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Start a discussion with the community
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateTopic} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        required
                        minLength={5}
                        maxLength={255}
                        className="bg-background/50 border-white/10 text-white"
                        placeholder="What's your topic about?"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select name="category" required defaultValue="general">
                        <SelectTrigger className="bg-background/50 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Discussion</SelectItem>
                          <SelectItem value="module_question">Module Question</SelectItem>
                          <SelectItem value="technical_support">Technical Support</SelectItem>
                          <SelectItem value="success_story">Success Story</SelectItem>
                          <SelectItem value="best_practices">Best Practices</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="moduleId" className="text-white">Related Module (Optional)</Label>
                      <Select name="moduleId">
                        <SelectTrigger className="bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select a module" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <SelectItem key={num} value={num.toString()}>Module {num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="content" className="text-white">Content</Label>
                      <Textarea
                        id="content"
                        name="content"
                        required
                        minLength={10}
                        rows={6}
                        className="bg-background/50 border-white/10 text-white resize-none"
                        placeholder="Describe your topic in detail..."
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTopicMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                        {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-white/10 text-white"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val === "all" ? undefined : val)}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General Discussion</SelectItem>
                    <SelectItem value="module_question">Module Questions</SelectItem>
                    <SelectItem value="technical_support">Technical Support</SelectItem>
                    <SelectItem value="success_story">Success Stories</SelectItem>
                    <SelectItem value="best_practices">Best Practices</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={moduleFilter?.toString()} onValueChange={(val) => setModuleFilter(val === "all" ? undefined : parseInt(val))}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-white">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>Module {num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Topics List */}
          {isLoading ? (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-8 text-center text-white/60">
                Loading topics...
              </CardContent>
            </Card>
          ) : topics && topics.length > 0 ? (
            <div className="space-y-3">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  className="bg-card/50 backdrop-blur border-white/10 hover:bg-card/70 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/forum/topic/${topic.id}`)}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Topic Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                      
                      {/* Topic Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          {topic.isPinned && <Pin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />}
                          {topic.isLocked && <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />}
                          <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                            {topic.title}
                          </h3>
                        </div>
                        
                        <p className="text-white/60 text-sm line-clamp-2 mb-3">
                          {topic.content}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                          {getCategoryBadge(topic.category)}
                          
                          {topic.moduleId && (
                            <Badge className="bg-indigo-500/20 text-indigo-400 border-0">
                              Module {topic.moduleId}
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{topic.viewCount}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{topic.replyCount}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-white/70">{topic.author?.name || "Unknown"}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(topic.lastActivityAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <h3 className="text-xl font-semibold text-white mb-2">No topics found</h3>
                <p className="text-white/60 mb-4">
                  {searchQuery || categoryFilter || moduleFilter
                    ? "Try adjusting your filters"
                    : "Be the first to start a discussion!"}
                </p>
                {user && !searchQuery && !categoryFilter && !moduleFilter && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Topic
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

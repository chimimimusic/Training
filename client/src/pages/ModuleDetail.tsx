import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle, FileText, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import Header from "@/components/Header";
// Multi-section module removed - all modules now use standard single-section UI

export default function ModuleDetail() {
  const [, params] = useRoute("/module/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const moduleId = params?.id ? parseInt(params.id) : 0;
  
  // Validate moduleId before making queries
  const { data: module } = trpc.modules.getById.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );
  // Sections query removed - all modules are now single-section
  const { data: progress } = trpc.modules.getProgress.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );
  const { data: assessmentQuestions } = trpc.assessments.getByModule.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );
  const { data: attemptHistory } = trpc.assessments.getAttemptHistory.useQuery(
    { moduleId },
    { enabled: moduleId > 0 && !!user }
  );
  const { data: videoProgressData } = trpc.modules.getVideoProgress.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );
  const saveVideoProgress = trpc.modules.saveVideoProgress.useMutation();
  
  const updateProgress = trpc.modules.updateProgress.useMutation();
  const submitAssessment = trpc.assessments.submit.useMutation();
  const logEngagement = trpc.engagement.log.useMutation();

  const [activeTab, setActiveTab] = useState("video");
  const [assessmentResponses, setAssessmentResponses] = useState<Record<number, string>>({});
  const [player, setPlayer] = useState<any>(null);
  const [videoStartTime, setVideoStartTime] = useState<number>(0);
  const playerRef = useState<any>(null);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  useEffect(() => {
    if (module) {
      updateProgress.mutate({
        moduleId,
        status: "in_progress",
      });
    }
  }, [moduleId]);

  // Initialize YouTube Player API
  useEffect(() => {
    if (!module || !window) return;
    
    // Only initialize player when Video tab is active
    if (activeTab !== 'video') return;

    // Reset player state when module changes
    setPlayer(null);

    const initializePlayer = () => {
      // Small delay to ensure DOM is ready and old player is cleaned up
      setTimeout(() => {
        const playerElement = document.getElementById(`youtube-player-${moduleId}`);
        if (!playerElement) {
          console.warn('Player element not found:', `youtube-player-${moduleId}`);
          return;
        }

        // Create new player
        const ytPlayer = new (window as any).YT.Player(`youtube-player-${moduleId}`, {
          videoId: module.youtubeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            start: videoProgressData?.lastPosition || 0,
          },
          events: {
            onReady: (event: any) => {
              setPlayer(event.target);
              // Resume from saved position
              if (videoProgressData?.lastPosition) {
                event.target.seekTo(videoProgressData.lastPosition, true);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                handleVideoPlay();
                setVideoStartTime(Date.now());
              }
            },
          },
        });
      }, 100);
    };

    // Check if YouTube API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      // API already loaded, initialize player directly
      initializePlayer();
    } else {
      // Load YouTube IFrame API if not already loaded
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      (window as any).onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          console.warn('Failed to destroy player in cleanup:', e);
        }
      }
    };
  }, [module?.youtubeVideoId, moduleId, activeTab]);

  // Auto-save video progress every 5 seconds
  useEffect(() => {
    if (!player || !module) return;

    const interval = setInterval(async () => {
      try {
        const currentTime = await player.getCurrentTime();
        const duration = await player.getDuration();
        const watchPercentage = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;
        const totalWatchTime = (videoProgressData?.totalWatchTimeSeconds || 0) + 5;

        saveVideoProgress.mutate({
          moduleId,
          lastPosition: Math.floor(currentTime),
          watchPercentage,
          totalWatchTimeSeconds: totalWatchTime,
        });

        // Auto-mark video as watched when 95% complete
        if (watchPercentage >= 95 && !progress?.videoWatched) {
          handleVideoComplete();
        }
      } catch (error) {
        console.error('Error saving video progress:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [player, moduleId, videoProgressData, progress]);

  // Handle invalid module ID
  if (moduleId === 0) {
    setLocation("/training");
    return null;
  }
  
  if (!module) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // All modules now use standard single-section UI

  const handleVideoPlay = () => {
    logEngagement.mutate({
      moduleId,
      eventType: "video_play",
    });
  };

  const handleVideoComplete = () => {
    updateProgress.mutate({
      moduleId,
      videoWatched: true,
      videoWatchPercentage: 100,
    });
    logEngagement.mutate({
      moduleId,
      eventType: "video_complete",
    });
    toast.success("Video completed!");
  };

  const handleTranscriptView = () => {
    if (!progress?.transcriptViewed) {
      updateProgress.mutate({
        moduleId,
        transcriptViewed: true,
      });
      logEngagement.mutate({
        moduleId,
        eventType: "transcript_view",
      });
    }
  };

  const handleAssessmentSubmit = () => {
    const responses = Object.entries(assessmentResponses).map(([assessmentId, answer]) => ({
      assessmentId: parseInt(assessmentId),
      selectedAnswer: answer,
    }));

    if (responses.length !== assessmentQuestions?.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const attemptNumber = (progress?.assessmentAttempts || 0) + 1;

    submitAssessment.mutate(
      {
        moduleId,
        attemptNumber,
        responses,
      },
      {
        onSuccess: (data) => {
          setAssessmentSubmitted(true);
          setAssessmentResult(data);
          
          if (data.passed) {
            toast.success(`Congratulations! You passed with ${data.score}/${data.totalPoints} points`);
          } else {
            toast.error(`You scored ${data.score}/${data.totalPoints}. You need 80% to pass. Please try again.`);
          }
        },
      }
    );
  };

  const handleRetakeAssessment = () => {
    setAssessmentResponses({});
    setAssessmentSubmitted(false);
    setAssessmentResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/training")} className="flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm text-primary font-semibold">Module {module.moduleNumber}</div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{module.title}</h1>
            <p className="text-sm sm:text-base text-white/60">{module.description}</p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {progress?.videoWatched && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Video Completed
            </div>
          )}
          {progress?.transcriptViewed && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Transcript Viewed
            </div>
          )}
          {progress?.assessmentCompleted && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Assessment Completed ({progress.assessmentScore} points)
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="video" className="text-xs sm:text-sm py-2 sm:py-3">
              <PlayCircle className="w-4 h-4 mr-2" />
              <span className="text-white">Video</span>
            </TabsTrigger>
            <TabsTrigger value="transcript" className="text-xs sm:text-sm py-2 sm:py-3">
              <FileText className="w-4 h-4 mr-2" />
              <span className="text-white">Transcript</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs sm:text-sm py-2 sm:py-3">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-white">Assessment</span>
            </TabsTrigger>
          </TabsList>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  <div id={`youtube-player-${moduleId}`} className="w-full h-full"></div>
                </div>
                <div className="p-6">
                  <Button onClick={handleVideoComplete} disabled={progress?.videoWatched}>
                    {progress?.videoWatched ? "Video Completed" : "Mark as Completed"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Video Transcript</CardTitle>
                <CardDescription>Read-only transcript for reference</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="no-select max-h-[400px] sm:max-h-[600px] overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-muted/20 rounded-lg"
                  onMouseEnter={handleTranscriptView}
                >
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {module.transcriptContent}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Transcripts are for reference only and cannot be downloaded or copied
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-4">
            {/* Assessment History Header */}
            {attemptHistory && attemptHistory.attempts > 0 && (
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Assessment Progress</h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <span className="text-xs text-muted-foreground">Previous Attempts:</span>
                          <span className="ml-2 font-semibold">{attemptHistory.attempts}</span>
                        </div>
                        {attemptHistory.highestScore !== null && (
                          <div>
                            <span className="text-xs text-muted-foreground">Best Score:</span>
                            <span className="ml-2 font-semibold text-green-600">
                              {attemptHistory.highestScore}
                            </span>
                          </div>
                        )}
                        {attemptHistory.lastAttemptAt && (
                          <div>
                            <span className="text-xs text-muted-foreground">Last Attempt:</span>
                            <span className="ml-2 font-semibold">
                              {new Date(attemptHistory.lastAttemptAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {progress?.assessmentCompleted && (
                      <div className="flex items-center gap-2 text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Passed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Module Assessment</CardTitle>
                <CardDescription>
                  {progress?.assessmentAttempts ? `Attempt ${progress.assessmentAttempts + 1}` : "First Attempt"} - You need 80% to pass
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!assessmentSubmitted ? (
                  <>
                    {assessmentQuestions?.map((question, index) => (
                      <div key={question.id} className="space-y-4 p-4 bg-muted/20 rounded-lg">
                        <div>
                          <span className="text-sm text-primary font-semibold">Question {index + 1}</span>
                          <p className="text-lg font-medium mt-2">{question.questionText}</p>
                          <span className="text-xs text-muted-foreground">({question.points} points)</span>
                        </div>

                        {question.questionType === "multiple_choice" ? (
                          <RadioGroup
                            value={assessmentResponses[question.id] || ""}
                            onValueChange={(value) =>
                              setAssessmentResponses({ ...assessmentResponses, [question.id]: value })
                            }
                          >
                            {question.options?.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.optionLetter} id={`q${question.id}-${option.optionLetter}`} />
                                <Label htmlFor={`q${question.id}-${option.optionLetter}`} className="cursor-pointer">
                                  {option.optionLetter}. {option.optionText}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <Textarea
                            placeholder="Type your answer here..."
                            value={assessmentResponses[question.id] || ""}
                            onChange={(e) =>
                              setAssessmentResponses({ ...assessmentResponses, [question.id]: e.target.value })
                            }
                            rows={4}
                          />
                        )}
                      </div>
                    ))}

                    {/* Current Attempt Info */}
                    {progress && progress.assessmentAttempts > 0 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Current Attempt</p>
                            <p className="text-xs text-muted-foreground">Attempt #{(progress.assessmentAttempts || 0) + 1}</p>
                          </div>
                          {progress.highestScore !== null && progress.highestScore !== undefined && (
                            <div className="text-right">
                              <p className="text-sm font-medium">Best Score</p>
                              <p className="text-lg font-bold text-green-600">{progress.highestScore}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAssessmentSubmit}
                      disabled={submitAssessment.isPending}
                      size="lg"
                      className="w-full"
                    >
                      {submitAssessment.isPending ? "Submitting..." : "Submit Assessment"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Results Header */}
                    <div className="text-center space-y-4 p-6 bg-muted/20 rounded-lg">
                      <div
                        className={`text-6xl ${assessmentResult?.passed ? "text-green-500" : "text-yellow-500"}`}
                      >
                        {assessmentResult?.passed ? "🎉" : "📚"}
                      </div>
                      <h3 className="text-2xl font-bold">
                        {assessmentResult?.passed ? "Congratulations!" : "Keep Learning"}
                      </h3>
                      <p className="text-lg">
                        You scored {assessmentResult?.score} out of {assessmentResult?.totalPoints} points
                        <span className="text-muted-foreground ml-2">
                          ({Math.round((assessmentResult?.score / assessmentResult?.totalPoints) * 100)}%)
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        {assessmentResult?.passed
                          ? "You have successfully completed this module!"
                          : "You need 80% to pass. Review the materials and try again."}
                      </p>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Review Your Answers</h4>
                      {assessmentResult?.detailedResults?.map((result: any, index: number) => (
                        <div
                          key={result.questionId}
                          className={`p-4 rounded-lg border-2 ${
                            result.isCorrect
                              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                              : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {result.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <span className="text-red-600 text-xl">✗</span>
                              )}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <span className="text-sm font-semibold text-primary">Question {index + 1}</span>
                                <p className="font-medium mt-1">{result.questionText}</p>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Your Answer: </span>
                                  <span className={result.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                                    {result.selectedAnswer}. {result.options?.find((opt: any) => opt.optionLetter === result.selectedAnswer)?.optionText}
                                  </span>
                                </div>

                                {!result.isCorrect && (
                                  <div>
                                    <span className="text-sm font-medium">Correct Answer: </span>
                                    <span className="text-green-700 dark:text-green-400">
                                      {result.correctAnswer}. {result.options?.find((opt: any) => opt.optionLetter === result.correctAnswer)?.optionText}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="text-sm text-muted-foreground">
                                Points: {result.pointsEarned} / {result.totalPoints}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Attempt Summary */}
                    {attemptHistory && attemptHistory.attempts > 0 && (
                      <div className="space-y-4 mt-6 pt-6 border-t">
                        <h4 className="text-lg font-semibold">Assessment Summary</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                            <p className="text-sm text-muted-foreground">Total Attempts</p>
                            <p className="text-2xl font-bold">{attemptHistory.attempts}</p>
                          </div>
                          {attemptHistory.highestScore !== null && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                              <p className="text-sm text-muted-foreground">Best Score</p>
                              <p className="text-2xl font-bold text-green-600">{attemptHistory.highestScore}</p>
                            </div>
                          )}
                          {attemptHistory.lastScore !== null && (
                            <div className="p-4 bg-muted/20 rounded-lg border">
                              <p className="text-sm text-muted-foreground">Last Score</p>
                              <p className="text-2xl font-bold">{attemptHistory.lastScore}</p>
                            </div>
                          )}
                        </div>
                        {attemptHistory.lastAttemptAt && (
                          <p className="text-sm text-muted-foreground text-center">
                            Last attempted: {new Date(attemptHistory.lastAttemptAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center pt-4">
                      {assessmentResult?.passed ? (
                        <Button onClick={() => setLocation("/training")} size="lg">
                          Back to Training
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => setActiveTab("video")}>
                            Review Video
                          </Button>
                          <Button onClick={handleRetakeAssessment}>Retake Assessment</Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

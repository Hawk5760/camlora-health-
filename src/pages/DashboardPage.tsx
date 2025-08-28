import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Heart, 
  BookOpen, 
  Wind, 
  TrendingUp,
  Calendar as CalendarIcon,
  Target,
  Volume2
} from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MoodEntry {
  mood: string;
  note: string;
  timestamp: Date;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface BreathingSession {
  id: string;
  type: string;
  duration: number;
  timestamp: Date;
}

interface SoundscapeSession {
  id: string;
  soundName: string;
  duration: number;
  timestamp: Date;
}

export const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [breathingSessions, setBreathingSessions] = useState<BreathingSession[]>([]);
  const [soundscapeSessions, setSoundscapeSessions] = useState<SoundscapeSession[]>([]);
  const [gardenStats, setGardenStats] = useState<any>({});
  const { t } = useTranslation();

  useEffect(() => {
    // Load data from localStorage
    const loadedMoods = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const loadedJournals = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const loadedSessions = JSON.parse(localStorage.getItem("breathingSessions") || "[]");
    const loadedSoundscapes = JSON.parse(localStorage.getItem("soundscapeSessions") || "[]");
    const loadedStats = JSON.parse(localStorage.getItem("gardenStats") || "{}");

    setMoodEntries(loadedMoods.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    })));
    
    setJournalEntries(loadedJournals.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    })));
    
    setBreathingSessions(loadedSessions.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    })));
    
    setSoundscapeSessions(loadedSoundscapes.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    })));
    
    setGardenStats(loadedStats);
  }, []);

  const getMoodColor = (mood: string) => {
    const colors = {
      amazing: "bg-yellow-500",
      good: "bg-green-500",
      okay: "bg-blue-500",
      sad: "bg-purple-500",
      anxious: "bg-pink-500"
    };
    return colors[mood as keyof typeof colors] || "bg-gray-500";
  };

  const getMoodTrend = () => {
    const recent = moodEntries.slice(-7);
    if (recent.length < 2) return "stable";
    
    const moodValues = {
      amazing: 5,
      good: 4,
      okay: 3,
      sad: 2,
      anxious: 1
    };
    
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return "improving";
    if (secondAvg < firstAvg - 0.5) return "declining";
    return "stable";
  };

  const getActivityDays = () => {
    const allDates = [
      ...moodEntries.map(e => e.timestamp),
      ...journalEntries.map(e => e.timestamp),
      ...breathingSessions.map(s => s.timestamp),
      ...soundscapeSessions.map(s => s.timestamp)
    ];
    
    const uniqueDates = [...new Set(allDates.map(date => date.toDateString()))];
    return uniqueDates.map(dateStr => new Date(dateStr));
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekMoods = moodEntries.filter(entry => entry.timestamp >= weekAgo);
    const thisWeekJournals = journalEntries.filter(entry => entry.timestamp >= weekAgo);
    const thisWeekSessions = breathingSessions.filter(session => session.timestamp >= weekAgo);
    const thisWeekSoundscapes = soundscapeSessions.filter(session => session.timestamp >= weekAgo);
    const thisWeekMinutes = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const thisWeekSoundMinutes = thisWeekSoundscapes.reduce((sum, session) => sum + session.duration, 0);
    
    return {
      moods: thisWeekMoods.length,
      journals: thisWeekJournals.length,
      sessions: thisWeekSessions.length,
      soundscapes: thisWeekSoundscapes.length,
      minutes: thisWeekMinutes,
      soundMinutes: thisWeekSoundMinutes
    };
  };

  const weeklyStats = getWeeklyStats();
  const moodTrend = getMoodTrend();
  const activityDays = getActivityDays();

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient-soul">
            {t('pages.dashboard.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('pages.dashboard.subtitle')}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h3 className="font-semibold">{t('pages.dashboard.moodEntries')}</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {gardenStats.moodEntries || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              {weeklyStats.moods} {t('pages.dashboard.thisWeek')}
            </p>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">{t('pages.dashboard.journalEntries')}</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {gardenStats.journalEntries || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              {weeklyStats.journals} {t('pages.dashboard.thisWeek')}
            </p>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">{t('pages.dashboard.mindfulMinutes')}</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {gardenStats.mindfulMinutes || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              {weeklyStats.minutes} {t('pages.dashboard.thisWeek')}
            </p>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Volume2 className="w-6 h-6 text-orange-500" />
              <h3 className="font-semibold">{t('pages.dashboard.soundscapeSessions')}</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {soundscapeSessions.length}
            </div>
            <p className="text-sm text-muted-foreground">
              {weeklyStats.soundscapes} {t('pages.dashboard.thisWeek')}
            </p>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold">{t('pages.dashboard.gardenLevel')}</h3>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {gardenStats.level || 1}
            </div>
            <p className="text-sm text-muted-foreground">
              {Math.floor((gardenStats.totalActions || 0) / 10)} {t('pages.dashboard.actionsCompleted')}
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
               {t('pages.dashboard.activityCalendar')}
              </h3>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
                modifiers={{
                  active: activityDays
                }}
                modifiersClassNames={{
                  active: "bg-primary text-primary-foreground"
                }}
              />
              
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
               <span>{t('pages.dashboard.daysWithActivity')}</span>
              </div>
            </Card>
          </div>

          {/* Insights & Trends */}
          <div className="space-y-6">
            {/* Mood Trend */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('pages.dashboard.moodTrend')}
              </h3>
              
              <div className="text-center">
                <div className={`text-3xl mb-2 ${
                  moodTrend === "improving" ? "text-green-500" : 
                  moodTrend === "declining" ? "text-red-500" : "text-blue-500"
                }`}>
                  {moodTrend === "improving" ? "📈" : 
                   moodTrend === "declining" ? "📉" : "📊"}
                </div>
                <Badge 
                  variant={moodTrend === "improving" ? "default" : "secondary"}
                  className="mb-2"
                >
                  {t(`pages.dashboard.${moodTrend}`)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t('pages.dashboard.basedOnRecent')}
                </p>
              </div>
            </Card>

            {/* Recent Moods */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <h3 className="text-lg font-semibold mb-4">{t('pages.dashboard.recentMoods')}</h3>
              
              <div className="space-y-3">
                {moodEntries.slice(-5).reverse().map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium capitalize">{entry.mood}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {moodEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('pages.dashboard.noMoodEntries')}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Detailed Analytics */}
        <Card className="p-6 mt-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('pages.dashboard.detailedAnalytics')}
          </h3>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('pages.dashboard.overview')}</TabsTrigger>
              <TabsTrigger value="moods">{t('pages.dashboard.moods')}</TabsTrigger>
              <TabsTrigger value="activities">{t('pages.dashboard.activities')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {Math.round(((gardenStats.totalActions || 0) / 100) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pages.dashboard.gardenGrowth')}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-2">
                    {activityDays.length}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pages.dashboard.activeDays')}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-2">
                    {Math.round((gardenStats.mindfulMinutes || 0) / 60 * 10) / 10}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pages.dashboard.hoursMeditated')}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="moods" className="mt-6">
              <div className="grid md:grid-cols-5 gap-4">
                {["amazing", "good", "okay", "sad", "anxious"].map(mood => {
                  const count = moodEntries.filter(entry => entry.mood === mood).length;
                  const percentage = moodEntries.length > 0 ? Math.round((count / moodEntries.length) * 100) : 0;
                  
                  return (
                    <div key={mood} className="text-center">
                      <div className={`w-16 h-16 rounded-full ${getMoodColor(mood)} mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                        {count}
                      </div>
                      <div className="text-sm font-medium capitalize">{mood}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <span>{t('pages.dashboard.totalMindfulActions')}</span>
                  <Badge variant="secondary">{gardenStats.totalActions || 0}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <span>{t('pages.dashboard.breathingSessions')}</span>
                  <Badge variant="secondary">{breathingSessions.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <span>{t('pages.dashboard.soundscapeSessions')}</span>
                  <Badge variant="secondary">{soundscapeSessions.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <span>{t('pages.dashboard.consecutiveDays')}</span>
                  <Badge variant="secondary">{activityDays.length >= 7 ? "7+" : activityDays.length}</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
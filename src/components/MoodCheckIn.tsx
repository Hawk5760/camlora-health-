import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

interface MoodEntry {
  mood: string;
  note: string;
  timestamp: Date;
}

export const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  const moods = [
    { id: "great", icon: Star, label: t('moodCheckIn.amazing'), color: "text-yellow-500" },
    { id: "good", icon: Smile, label: t('moodCheckIn.good'), color: "text-green-500" },
    { id: "okay", icon: Meh, label: t('moodCheckIn.okay'), color: "text-blue-500" },
    { id: "sad", icon: Frown, label: t('moodCheckIn.sad'), color: "text-purple-500" },
    { id: "anxious", icon: Heart, label: t('moodCheckIn.anxious'), color: "text-pink-500" },
  ];

  const handleMoodSubmit = () => {
    console.log("Mood submit clicked", { selectedMood, note });
    
    if (!selectedMood) {
      toast({
        title: t('moodCheckIn.pleaseSelectMood'),
        description: t('moodCheckIn.pleaseSelectMoodDesc'),
        variant: "destructive",
      });
      return;
    }

    const moodEntry: MoodEntry = {
      mood: selectedMood,
      note,
      timestamp: new Date(),
    };

    // Store mood entry (would integrate with backend/database)
    const existingEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    existingEntries.push(moodEntry);
    localStorage.setItem("moodEntries", JSON.stringify(existingEntries));

    toast({
      title: t('moodCheckIn.moodLogged'),
      description: t('moodCheckIn.moodLoggedDesc'),
    });

    // Reset form
    setSelectedMood("");
    setNote("");
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-foreground">
          {t('moodCheckIn.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('moodCheckIn.subtitle')}
        </p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center p-4 rounded-2xl transition-gentle hover:scale-105 ${
                selectedMood === mood.id
                  ? "bg-primary/20 shadow-glow"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${mood.color}`} />
              <span className="text-sm font-medium text-foreground">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Note Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          {t('moodCheckIn.whatsOnMind')}
        </label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('moodCheckIn.placeholder')}
          className="bg-background/50 border-border/50 focus:border-primary transition-gentle"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <Button 
        onClick={handleMoodSubmit}
        variant="soul" 
        size="lg" 
        className="w-full"
      >
        {t('moodCheckIn.logMood')}
      </Button>
    </Card>
  );
};
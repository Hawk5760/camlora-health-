import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { SoulGarden } from "@/components/SoulGarden";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { 
  Heart, 
  BookOpen, 
  Wind, 
  Music, 
  Leaf, 
  MessageCircle, 
  BarChart3, 
  Moon,
  Sparkles,
  ArrowRight,
  Shield,
  Lock
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Authentication CTA for non-authenticated users */}
      {!user && (
        <section className="py-16 px-6 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-primary/20 shadow-magical">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  {t('pages.index.securePrivate')}
                </h2>
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('pages.index.secureDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/auth">
                  <Button size="lg" className="gradient-forest hover:shadow-glow transition-gentle min-w-[200px]">
                    {t('common.startYourJourney')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {t('pages.index.securityFeatures')}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Features Overview */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {t('pages.index.nurtureInnerPeace')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pages.index.nurtureDescription')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Heart}
              title={t('features.emotionalCheckins')}
              description={t('features.emotionalCheckinsDesc')}
              gradient="gradient-soul"
            />
            <FeatureCard
              icon={BookOpen}
              title={t('features.guidedJournaling')}
              description={t('features.guidedJournalingDesc')}
              gradient="gradient-twilight"
            />
            <FeatureCard
              icon={Wind}
              title={t('features.mindfulnessBreathing')}
              description={t('features.mindfulnessBreathingDesc')}
              gradient="gradient-calm"
              href="/mindfulness"
            />
            <FeatureCard
              icon={Music}
              title={t('features.soothingSoundscapes')}
              description={t('features.soothingSoundscapesDesc')}
              gradient="gradient-forest"
              href="/sounds"
            />
            <FeatureCard
              icon={Leaf}
              title={t('features.soulGardenGrowth')}
              description={t('features.soulGardenGrowthDesc')}
              gradient="gradient-soul"
              href="/garden"
            />
            <FeatureCard
              icon={MessageCircle}
              title={t('features.aiReflectionBuddy')}
              description={t('features.aiReflectionBuddyDesc')}
              gradient="gradient-twilight"
              href="/chat"
            />
          </div>
        </div>
      </section>
      
      {/* Interactive Demo Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {t('pages.index.tryCalmoraToday')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('pages.index.tryDescription')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <MoodCheckIn />
            <SoulGarden />
          </div>
        </div>
      </section>
      
      {/* Coming Soon Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">{t('pages.index.moreFeaturesGrowing')}</h2>
          <p className="text-lg text-muted-foreground mb-12">
            {t('pages.index.moreFeaturesDescription')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card/50 rounded-2xl border border-border/30">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('features.advancedAnalytics')}</h3>
              <p className="text-sm text-muted-foreground">{t('features.advancedAnalyticsDesc')}</p>
            </div>
            <div className="p-6 bg-card/50 rounded-2xl border border-border/30">
              <Moon className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('features.sleepSanctuary')}</h3>
              <p className="text-sm text-muted-foreground">{t('features.sleepSanctuaryDesc')}</p>
            </div>
            <div className="p-6 bg-card/50 rounded-2xl border border-border/30">
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('features.dailyAffirmations')}</h3>
              <p className="text-sm text-muted-foreground">{t('features.dailyAffirmationsDesc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-gradient-soul">
              Calmora
            </span>
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">
            {t('pages.index.digitalSanctuary')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('pages.index.builtWithLove')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

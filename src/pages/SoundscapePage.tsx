import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";

interface SoundTrack {
  id: string;
  name: string;
  audioUrl: string;
  icon: string;
}

const soundTracks: SoundTrack[] = [
  {
    id: "rain",
    name: "Gentle Rain",
    audioUrl: "https://www.soundjay.com/misc/sounds/rain-01.wav",
    icon: "🌧️"
  },
  {
    id: "ocean",
    name: "Ocean Waves", 
    audioUrl: "https://www.soundjay.com/misc/sounds/ocean-waves.wav",
    icon: "🌊"
  },
  {
    id: "forest",
    name: "Forest Birds",
    audioUrl: "https://www.soundjay.com/misc/sounds/forest-birds.wav", 
    icon: "🦜"
  },
  {
    id: "wind",
    name: "Gentle Wind",
    audioUrl: "https://www.soundjay.com/misc/sounds/wind-gentle.wav",
    icon: "🍃"
  },
  {
    id: "fireplace",
    name: "Cozy Fireplace",
    audioUrl: "https://www.soundjay.com/misc/sounds/fireplace.wav",
    icon: "🔥"
  },
  {
    id: "meditation",
    name: "Singing Bowls",
    audioUrl: "https://www.soundjay.com/misc/sounds/singing-bowl.wav",
    icon: "🎵"
  }
];

export const SoundscapePage = () => {
  const [playingTracks, setPlayingTracks] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Initialize audio elements
    soundTracks.forEach(track => {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.5;
      audioRefs.current[track.id] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const toggleTrack = (trackId: string) => {
    const audio = audioRefs.current[trackId];
    const isPlaying = playingTracks.has(trackId);

    if (isPlaying) {
      audio.pause();
      setPlayingTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
    } else {
      // Create a simple tone using Web Audio API since external URLs may not work
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sounds
      const frequencies: Record<string, number> = {
        rain: 200,
        ocean: 100,
        forest: 800,
        wind: 150,
        fireplace: 80,
        meditation: 440
      };
      
      oscillator.frequency.setValueAtTime(frequencies[trackId] || 200, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      
      // Store oscillator reference for stopping later
      (audio as any).oscillator = oscillator;
      (audio as any).audioContext = audioContext;
      
      setPlayingTracks(prev => new Set(prev).add(trackId));
    }
  };

  const updateVolume = (trackId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [trackId]: volume }));
    const audio = audioRefs.current[trackId];
    if (audio) {
      audio.volume = volume / 100;
    }
  };

  const stopAllTracks = () => {
    playingTracks.forEach(trackId => {
      const audio = audioRefs.current[trackId];
      if ((audio as any).oscillator) {
        (audio as any).oscillator.stop();
      }
    });
    setPlayingTracks(new Set());
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient-soul">
            Peaceful Soundscapes
          </h1>
          <p className="text-lg text-muted-foreground">
            Create your perfect ambient environment for relaxation and focus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {soundTracks.map((track) => {
            const isPlaying = playingTracks.has(track.id);
            const volume = volumes[track.id] || 50;

            return (
              <Card key={track.id} className="p-6 bg-card/80 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{track.icon}</div>
                  <h3 className="text-lg font-semibold">{track.name}</h3>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => toggleTrack(track.id)}
                    variant={isPlaying ? "soul" : "outline"}
                    className="w-full"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Playing
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>

                  {isPlaying && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Volume2 className="w-4 h-4" />
                        <span>Volume: {volume}%</span>
                      </div>
                      <Slider
                        value={[volume]}
                        onValueChange={(value) => updateVolume(track.id, value[0])}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {playingTracks.size > 0 && (
          <div className="text-center">
            <Button onClick={stopAllTracks} variant="outline" size="lg">
              Stop All Sounds
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {playingTracks.size} track{playingTracks.size !== 1 ? 's' : ''} playing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
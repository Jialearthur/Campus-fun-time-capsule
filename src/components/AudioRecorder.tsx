import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Trash2, Pause, Volume2, VolumeX } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface AudioRecorderProps {
  audioUrl: string | null;
  onChange: (audioUrl: string | null) => void;
  isDark?: boolean;
}

export default function AudioRecorder({ audioUrl, onChange, isDark = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    audioRef.current.onloadedmetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTimer();
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  // 当音频URL变化时，重置状态
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      setCurrentTime(0);
      setDuration(0);
    }
  }, [audioUrl]);

  const [micError, setMicError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        onChange(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicError('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      stopTimer();
      setRecordingTime(0);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 60) {
          stopRecording();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const togglePlay = () => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    onChange(null);
  };

  const handleVolumeChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioUrl) {
    return (
      <div className={cn(
        "rounded-2xl p-4 border",
        isDark
          ? "bg-dark-bg-secondary border-dark-border-secondary"
          : "bg-[#f5f3f7] border-[#e0d6f0]"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] flex items-center justify-center text-[#5a4b7a] shadow-lg shadow-[#e8dff5]/50 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={cn(
                  "flex-1 h-2 rounded-full appearance-none cursor-pointer",
                  isDark ? "bg-dark-border-secondary" : "bg-[#e0d6f0]"
                )}
                style={{
                  background: `linear-gradient(to right, #c8b6e2 0%, #c8b6e2 ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#334155' : '#e0d6f0'} ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#334155' : '#e0d6f0'} 100%)`
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs font-medium",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>{formatTime(currentTime)}</span>
              <span className={cn(
                "text-xs font-medium",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-xs",
            isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
          )}>语音留言</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className={cn(
                "p-1 transition-colors",
                isDark
                  ? "text-dark-text-tertiary hover:text-dark-text-secondary"
                  : "text-[#8a7ab5] hover:text-[#5a4b7a]"
              )}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className={cn(
                "w-24 h-2 rounded-full appearance-none cursor-pointer",
                isDark ? "bg-dark-border-secondary" : "bg-[#e0d6f0]"
              )}
              style={{
                background: `linear-gradient(to right, #c8b6e2 0%, #c8b6e2 ${(isMuted ? 0 : volume) * 100}%, ${isDark ? '#334155' : '#e0d6f0'} ${(isMuted ? 0 : volume) * 100}%, ${isDark ? '#334155' : '#e0d6f0'} 100%)`
              }}
            />
            <button
              type="button"
              onClick={deleteAudio}
              className={cn(
                "p-2 transition-colors",
                isDark
                  ? "text-dark-text-tertiary hover:text-[#e57373]"
                  : "text-[#a093c2] hover:text-[#e57373]"
              )}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
          isRecording 
            ? "bg-[#e57373] shadow-[#fdecea] animate-pulse" 
            : "bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] shadow-[#e8dff5]/50 hover:scale-105 active:scale-95"
        )}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white fill-current" />
        ) : (
          <Mic className={cn(
            "w-8 h-8",
            isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
          )} />
        )}
      </button>

      {isRecording && (
        <div className="text-center">
          <p className="text-2xl font-bold text-[#e57373] font-mono">{formatTime(recordingTime)}</p>
          <p className={cn(
            "text-xs mt-1",
            isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
          )}>正在录音...</p>
        </div>
      )}

      {!isRecording && (
        <>
          {micError && (
            <p className="text-sm text-[#e57373] mb-2">{micError}</p>
          )}
          <p className={cn(
            "text-sm",
            isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
          )}>点击麦克风录制语音</p>
        </>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Trash2, Pause } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface AudioRecorderProps {
  audioUrl: string | null;
  onChange: (audioUrl: string | null) => void;
}

export default function AudioRecorder({ audioUrl, onChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTimer();
    };
  }, []);

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
      setRecordingTime(prev => prev + 1);
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
      audioRef.current.src = audioUrl;
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
    onChange(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioUrl) {
    return (
      <div className="flex items-center gap-3 bg-purple-50 rounded-2xl p-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-1/3 rounded-full" />
            </div>
            <span className="text-xs text-purple-600 font-medium">00:15</span>
          </div>
          <p className="text-xs text-purple-400">语音留言</p>
        </div>

        <button
          type="button"
          onClick={deleteAudio}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
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
            ? "bg-red-500 shadow-red-200 animate-pulse" 
            : "bg-gradient-to-br from-pink-400 to-purple-500 shadow-purple-200 hover:scale-105 active:scale-95"
        )}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white fill-current" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>

      {isRecording && (
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500 font-mono">{formatTime(recordingTime)}</p>
          <p className="text-xs text-gray-400 mt-1">正在录音...</p>
        </div>
      )}

      {!isRecording && (
        <>
          {micError && (
            <p className="text-sm text-red-500 mb-2">{micError}</p>
          )}
          <p className="text-sm text-gray-400">点击麦克风录制语音</p>
        </>
      )}
    </div>
  );
}

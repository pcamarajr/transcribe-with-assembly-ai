
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptionViewerProps {
  audioFile: File;
  onTranscriptionReady: (text: string) => void;
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ audioFile, onTranscriptionReady }) => {
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio URL from file
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    
    // Simulate transcription (in a real app, you would use a speech-to-text API)
    setIsTranscribing(true);
    
    setTimeout(() => {
      // This is a placeholder. In a real app, you'd use a proper API for transcription
      const simulatedTranscription = `Esta é uma transcrição simulada para o arquivo "${audioFile.name}". 
Em uma aplicação real, este texto seria o resultado de um serviço de reconhecimento de fala como 
o Google Speech-to-Text API, Microsoft Azure Speech Services, ou similar.

A transcrição incluiria todo o conteúdo de áudio convertido em texto, mantendo a pontuação 
e formatação adequadas para fácil leitura.`;
      
      setTranscription(simulatedTranscription);
      setIsTranscribing(false);
      onTranscriptionReady(simulatedTranscription);
    }, 2000);
    
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioFile, onTranscriptionReady]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTranscriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscription(e.target.value);
    onTranscriptionReady(e.target.value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transcrição</span>
          {audioUrl && (
            <div className="flex items-center space-x-2">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePlayPause}
              >
                {isPlaying ? 'Pausar' : 'Reproduzir'} áudio
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTranscribing ? (
          <div className="space-y-4 py-8 flex flex-col items-center justify-center">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="audio-wave w-1 h-8" 
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${10 + Math.random() * 20}px`
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Transcrevendo áudio...</p>
          </div>
        ) : (
          <div>
            <Textarea 
              className="min-h-[200px]" 
              value={transcription}
              onChange={handleTranscriptionChange}
              placeholder="A transcrição aparecerá aqui..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Você pode editar a transcrição se necessário
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionViewer;

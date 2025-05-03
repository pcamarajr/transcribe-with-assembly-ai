
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileAudio, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface AudioUploaderProps {
  onAudioUploaded: (file: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, envie apenas arquivos de áudio."
      });
      return;
    }

    setUploadedFile(file);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onAudioUploaded(file);
      }
    }, 100);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-all-ease ${
            isDragging ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="audio/*" 
            onChange={handleFileSelect}
          />
          
          {!uploadedFile ? (
            <div className="cursor-pointer">
              <FileAudio className="h-12 w-12 mx-auto text-brand-500 mb-4" />
              <p className="font-medium text-lg text-gray-700 mb-1">
                Arraste e solte um arquivo de áudio ou clique para escolher
              </p>
              <p className="text-gray-500 text-sm">
                Formatos suportados: MP3, WAV, M4A, etc.
              </p>
            </div>
          ) : (
            <div>
              <FileAudio className="h-8 w-8 mx-auto text-brand-500 mb-2" />
              <p className="font-medium text-gray-700 mb-2">
                {uploadedFile.name}
              </p>
              <div className="mx-auto max-w-md">
                <Progress value={uploadProgress} className="h-2" />
              </div>
              {uploadProgress < 100 && (
                <p className="text-sm text-gray-500 mt-2">Processando...</p>
              )}
              {uploadProgress === 100 && (
                <p className="text-sm text-green-600 mt-2">Arquivo pronto!</p>
              )}
            </div>
          )}
        </div>

        {!uploadedFile && (
          <Button 
            className="mt-4 w-full"
            onClick={triggerFileInput}
          >
            <Upload className="w-4 h-4 mr-2" /> Selecionar arquivo
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioUploader;

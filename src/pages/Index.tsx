
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioUploader from "@/components/AudioUploader";
import ApiKeyForm from "@/components/ApiKeyForm";
import FilesViewer from "@/components/FilesViewer";
import TranscriptsViewer from "@/components/TranscriptsViewer";
import { Button } from "@/components/ui/button";
import { FileAudio, FileText, List } from "lucide-react";
import { hasApiKey } from '@/services/assemblyAiService';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(hasApiKey());
  const [refreshFilesCounter, setRefreshFilesCounter] = useState<number>(0);
  const [refreshTranscriptsCounter, setRefreshTranscriptsCounter] = useState<number>(0);
  const [currentTranscriptId, setCurrentTranscriptId] = useState<string | undefined>();

  const handleApiKeySet = () => {
    setIsApiKeySet(true);
  };

  const handleAudioUploaded = (file: File, fileId: string) => {
    // When a file is uploaded, refresh the files list
    setRefreshFilesCounter(prev => prev + 1);
    setActiveTab('files');
  };

  const handleTranscriptionRequested = (transcriptId: string) => {
    // When a transcription is requested, refresh the transcripts list and set the current transcript
    setRefreshTranscriptsCounter(prev => prev + 1);
    setCurrentTranscriptId(transcriptId);
    setActiveTab('transcripts');
  };

  useEffect(() => {
    // Check if API key is set on component mount
    setIsApiKeySet(hasApiKey());
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileAudio className="h-6 w-6 text-brand-500 mr-2" />
            <h1 className="text-xl font-semibold">Audio Scribe</h1>
          </div>
          <div>
            <span className="text-sm text-gray-500">Transcrição simples com AssemblyAI</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Transcreva áudio facilmente
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Carregue seu arquivo de áudio e receba uma transcrição de alta qualidade usando AssemblyAI
          </p>

          {!isApiKeySet ? (
            <div className="mb-8">
              <ApiKeyForm onKeySet={handleApiKeySet} />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="upload" className="flex items-center">
                  <FileAudio className="w-4 h-4 mr-2" /> Upload
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center">
                  <List className="w-4 h-4 mr-2" /> Arquivos
                </TabsTrigger>
                <TabsTrigger value="transcripts" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Transcrições
                </TabsTrigger>
              </TabsList>

              <div className="relative rounded-lg border p-1">
                <div className="absolute top-0 left-0 w-full h-1">
                  <div 
                    className="h-1 bg-brand-500 transition-all duration-300" 
                    style={{ 
                      width: activeTab === 'upload' ? '33%' : activeTab === 'files' ? '66%' : '100%' 
                    }} 
                  />
                </div>
                
                <TabsContent value="upload" className="p-4 mt-4">
                  <AudioUploader onAudioUploaded={handleAudioUploaded} />
                </TabsContent>
                
                <TabsContent value="files" className="p-4 mt-4">
                  <FilesViewer 
                    onTranscriptionRequested={handleTranscriptionRequested}
                    refreshTrigger={refreshFilesCounter}
                  />
                </TabsContent>
                
                <TabsContent value="transcripts" className="p-4 mt-4">
                  <TranscriptsViewer 
                    refreshTrigger={refreshTranscriptsCounter}
                    currentTranscriptId={currentTranscriptId}
                  />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </main>

      <footer className="bg-gray-50 border-t py-6">
        <div className="container">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Audio Scribe • Transcrição de áudio com AssemblyAI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

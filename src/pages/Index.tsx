
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioUploader from "@/components/AudioUploader";
import TranscriptionViewer from "@/components/TranscriptionViewer";
import EmailSender from "@/components/EmailSender";
import { Button } from "@/components/ui/button";
import { FileAudio, FileText, Mail } from "lucide-react";

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upload');

  const handleAudioUploaded = (file: File) => {
    setAudioFile(file);
    setActiveTab('transcribe');
  };

  const handleTranscriptionReady = (text: string) => {
    setTranscription(text);
  };

  const moveToNextStep = () => {
    if (activeTab === 'transcribe') {
      setActiveTab('send');
    }
  };

  const moveToPreviousStep = () => {
    if (activeTab === 'send') {
      setActiveTab('transcribe');
    } else if (activeTab === 'transcribe') {
      setActiveTab('upload');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileAudio className="h-6 w-6 text-brand-500 mr-2" />
            <h1 className="text-xl font-semibold">Audio Scribe</h1>
          </div>
          <div>
            <span className="text-sm text-gray-500">Transcrição e envio simples</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Transcreva áudio e envie por e-mail
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Carregue seu arquivo de áudio, revise a transcrição e envie para qualquer pessoa
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="upload" className="flex items-center" disabled={activeTab === 'transcribe' || activeTab === 'send'}>
                <FileAudio className="w-4 h-4 mr-2" /> Upload
              </TabsTrigger>
              <TabsTrigger value="transcribe" className="flex items-center" disabled={!audioFile || activeTab === 'send'}>
                <FileText className="w-4 h-4 mr-2" /> Transcrição
              </TabsTrigger>
              <TabsTrigger value="send" className="flex items-center" disabled={!transcription}>
                <Mail className="w-4 h-4 mr-2" /> E-mail
              </TabsTrigger>
            </TabsList>

            <div className="relative rounded-lg border p-1">
              <div className="absolute top-0 left-0 w-full h-1">
                <div 
                  className="h-1 bg-brand-500 transition-all duration-300" 
                  style={{ 
                    width: activeTab === 'upload' ? '33%' : activeTab === 'transcribe' ? '66%' : '100%' 
                  }} 
                />
              </div>
              
              <TabsContent value="upload" className="p-4 mt-4">
                <AudioUploader onAudioUploaded={handleAudioUploaded} />
              </TabsContent>
              
              <TabsContent value="transcribe" className="p-4 mt-4">
                {audioFile && (
                  <>
                    <TranscriptionViewer 
                      audioFile={audioFile}
                      onTranscriptionReady={handleTranscriptionReady}
                    />
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={moveToPreviousStep}>
                        Voltar
                      </Button>
                      <Button onClick={moveToNextStep} disabled={!transcription}>
                        Continuar para E-mail
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="send" className="p-4 mt-4">
                {audioFile && (
                  <>
                    <EmailSender 
                      transcription={transcription}
                      audioFileName={audioFile.name}
                    />
                    <div className="flex justify-start mt-6">
                      <Button variant="outline" onClick={moveToPreviousStep}>
                        Voltar para Transcrição
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gray-50 border-t py-6">
        <div className="container">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Audio Scribe • Transcrição e envio de áudio simplificados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

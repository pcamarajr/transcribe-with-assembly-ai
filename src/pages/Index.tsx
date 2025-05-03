import ApiKeyForm from "@/components/ApiKeyForm";
import AudioUploader from "@/components/AudioUploader";
import TranscriptsViewer from "@/components/TranscriptsViewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasApiKey } from "@/services/assemblyAiService";
import { FileAudio, FileText, Github, Globe, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(hasApiKey());
  const [refreshTranscriptsCounter, setRefreshTranscriptsCounter] =
    useState<number>(0);
  const [currentTranscriptId, setCurrentTranscriptId] = useState<
    string | undefined
  >();
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState<boolean>(false);

  const handleApiKeySet = () => {
    setIsApiKeySet(true);
    setIsApiKeyDialogOpen(false);
  };

  const handleApiKeyRemoved = () => {
    setIsApiKeySet(false);
    setIsApiKeyDialogOpen(false);
  };

  const handleTranscriptionRequested = (transcriptId: string) => {
    // When a transcription is requested, refresh the transcripts list and set the current transcript
    setRefreshTranscriptsCounter((prev) => prev + 1);
    setCurrentTranscriptId(transcriptId);
    setActiveTab("transcripts");
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
          {isApiKeySet && (
            <Dialog
              open={isApiKeyDialogOpen}
              onOpenChange={setIsApiKeyDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Configurar API</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações da API</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <ApiKeyForm
                    onKeySet={handleApiKeySet}
                    onKeyRemoved={handleApiKeyRemoved}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <div>
            <span className="text-sm text-gray-500">
              Transcrição simples com AssemblyAI
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Transcreva áudio facilmente
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Carregue seu arquivo de áudio e receba uma transcrição de alta
            qualidade usando AssemblyAI
          </p>

          {!isApiKeySet ? (
            <div className="mb-8">
              <ApiKeyForm
                onKeySet={handleApiKeySet}
                onKeyRemoved={handleApiKeyRemoved}
              />
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="upload" className="flex items-center">
                  <FileAudio className="w-4 h-4 mr-2" /> Upload
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
                      width: activeTab === "upload" ? "50%" : "100%",
                    }}
                  />
                </div>

                <TabsContent value="upload" className="p-4 mt-4">
                  <AudioUploader
                    onTranscriptionRequested={handleTranscriptionRequested}
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
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Audio Scribe • Transcrição de áudio com AssemblyAI
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://pcamarajr.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-500 transition-colors flex items-center"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="text-sm">pcamarajr.dev</span>
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://github.com/pcamarajr/transcribe-with-assembly-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-500 transition-colors flex items-center"
              >
                <Github className="h-4 w-4 mr-1" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

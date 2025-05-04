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
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasApiKey } from "@/services/assemblyAiService";
import { FileAudio, FileText, Github, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
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
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <FileAudio className="h-6 w-6 text-brand-500 mr-2" />
              <h1 className="text-xl font-semibold">{t("appName")}</h1>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-sm text-gray-500">{t("appTagline")}</span>
            </div>

            <div className="flex items-center">
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
                      <span className="text-sm">
                        {t("header.configureApi")}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("apiKey.title")}</DialogTitle>
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
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            {t("main.title")}
          </h1>
          <p className="text-gray-500 text-center mb-8">{t("main.subtitle")}</p>

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
                  <FileAudio className="w-4 h-4 mr-2" /> {t("upload.tab")}
                </TabsTrigger>
                <TabsTrigger value="transcripts" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />{" "}
                  {t("transcriptions.tab")}
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

      <footer className="container bg-gray-50 border-t py-6">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-gray-500 text-sm">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center space-x-4">
            <a
              href={t("footer.developerSiteUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-500 transition-colors flex items-center"
            >
              <span className="text-sm">{t("footer.developerSite")}</span>
            </a>
            <span className="text-gray-300">•</span>
            <a
              href={t("footer.githubUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-500 transition-colors flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              <span className="text-sm">{t("footer.githubText")}</span>
            </a>
            <span className="text-gray-300">•</span>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

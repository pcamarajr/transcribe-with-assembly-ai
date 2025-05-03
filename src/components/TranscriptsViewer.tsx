import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranscriptions } from "@/hooks/useTranscriptions";
import { FileText, Loader, RefreshCw } from "lucide-react";
import React from "react";
import TranscriptDetail from "./transcripts/TranscriptDetail";
import TranscriptsList from "./transcripts/TranscriptsList";

interface TranscriptsViewerProps {
  refreshTrigger: number;
  currentTranscriptId?: string;
}

const TranscriptsViewer: React.FC<TranscriptsViewerProps> = ({
  refreshTrigger,
  currentTranscriptId,
}) => {
  const {
    transcripts,
    loading,
    selectedTranscript,
    transcriptText,
    transcriptStatus,
    loadingTranscript,
    fetchTranscripts,
    handleSelectTranscript,
    lastUpdated,
    isPolling,
  } = useTranscriptions(refreshTrigger, currentTranscriptId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Transcrições
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTranscripts}
            disabled={loading}
          >
            {loading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-xs">
          <div>
            {lastUpdated ? (
              <span>Última atualização: {lastUpdated}</span>
            ) : null}
          </div>
          {isPolling && (
            <div className="flex items-center text-amber-500">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Atualizando automaticamente...
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
            <p className="text-sm text-gray-500">Carregando transcrições...</p>
          </div>
        ) : transcripts.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm text-gray-500">
              Nenhuma transcrição encontrada.
            </p>
            <p className="text-xs text-gray-400">
              Solicite uma transcrição para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <TranscriptsList
                  transcripts={transcripts}
                  selectedTranscript={selectedTranscript}
                  onSelectTranscript={handleSelectTranscript}
                />
              </div>

              <div className="md:col-span-2">
                <TranscriptDetail
                  transcriptId={selectedTranscript}
                  transcriptStatus={transcriptStatus}
                  transcriptText={transcriptText}
                  loadingTranscript={loadingTranscript}
                  isPolling={isPolling}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptsViewer;

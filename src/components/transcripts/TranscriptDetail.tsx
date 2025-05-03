import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TranscriptStatus } from "@/hooks/useTranscriptions";
import { Check, Clock, Copy, FileText, Loader, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import TranscriptStatusBadge from "./TranscriptStatusBadge";

interface TranscriptDetailProps {
  transcriptId: string | null;
  transcriptStatus: TranscriptStatus | null;
  transcriptText: string | null;
  loadingTranscript: boolean;
  isPolling?: boolean;
}

const TranscriptDetail: React.FC<TranscriptDetailProps> = ({
  transcriptId,
  transcriptStatus,
  transcriptText,
  loadingTranscript,
  isPolling = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (transcriptText) {
      navigator.clipboard.writeText(transcriptText);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Transcrição copiada para a área de transferência.",
      });

      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusMessage = () => {
    switch (transcriptStatus) {
      case "queued":
        return "Sua transcrição está na fila e será processada em breve.";
      case "processing":
        return "Sua transcrição está sendo processada. Isso pode levar de alguns segundos a alguns minutos, dependendo do tamanho do arquivo.";
      case "completed":
        return "Transcrição concluída com sucesso!";
      case "error":
        return "Ocorreu um erro ao processar a transcrição.";
      default:
        return "Aguardando informações de status...";
    }
  };

  if (!transcriptId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center border rounded-md">
        <FileText className="h-8 w-8 text-gray-300 mb-4" />
        <p className="text-sm text-gray-500">
          Selecione uma transcrição para ver os detalhes.
        </p>
      </div>
    );
  }

  if (loadingTranscript) {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
        <p className="text-sm text-gray-500">Carregando transcrição...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-medium mr-2">
            Status: <TranscriptStatusBadge status={transcriptStatus || ""} />
          </p>
          {isPolling && (
            <span className="text-xs text-amber-500 flex items-center">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Atualizando...
            </span>
          )}
        </div>
        {transcriptStatus === "completed" && transcriptText && (
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        )}
      </div>

      {transcriptStatus === "processing" || transcriptStatus === "queued" ? (
        <div
          className={`p-6 flex flex-col items-center justify-center border rounded-md ${
            transcriptStatus === "processing"
              ? "border-amber-200 bg-amber-50"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          {transcriptStatus === "processing" ? (
            <Loader className="h-8 w-8 animate-spin text-amber-500 mb-4" />
          ) : (
            <Clock className="h-8 w-8 text-blue-500 mb-4" />
          )}

          <p className="text-sm font-medium mb-2">
            {transcriptStatus === "processing"
              ? "Processando transcrição..."
              : "Transcrição na fila..."}
          </p>

          <p className="text-xs text-gray-600 text-center mb-2">
            {getStatusMessage()}
          </p>

          {isPolling ? (
            <p className="text-xs text-amber-600 flex items-center">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Atualizando automaticamente a cada 5 segundos
            </p>
          ) : (
            <p className="text-xs text-gray-500">Aguardando atualização...</p>
          )}
        </div>
      ) : transcriptStatus === "completed" && transcriptText ? (
        <div className="space-y-2">
          <div className="p-2 bg-green-50 border border-green-200 rounded-md mb-2">
            <p className="text-xs text-green-700">{getStatusMessage()}</p>
          </div>
          <Textarea className="min-h-[300px]" value={transcriptText} readOnly />
        </div>
      ) : transcriptStatus === "error" ? (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md border-red-200 bg-red-50">
          <p className="text-red-500 font-medium mb-2">
            Ocorreu um erro ao processar a transcrição.
          </p>
          <p className="text-xs text-red-400 text-center">
            Isso pode ocorrer por vários motivos, como problemas com o arquivo
            de áudio ou limites de API. Tente fazer o upload novamente ou
            verifique se o arquivo de áudio é válido.
          </p>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md">
          <p className="text-gray-500">
            Nenhum texto de transcrição disponível.
          </p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDetail;

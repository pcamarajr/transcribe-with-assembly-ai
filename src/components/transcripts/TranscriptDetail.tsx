
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TranscriptStatusBadge from './TranscriptStatusBadge';

interface TranscriptDetailProps {
  transcriptId: string | null;
  transcriptStatus: string | null;
  transcriptText: string | null;
  loadingTranscript: boolean;
}

const TranscriptDetail: React.FC<TranscriptDetailProps> = ({
  transcriptId,
  transcriptStatus,
  transcriptText,
  loadingTranscript
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (transcriptText) {
      navigator.clipboard.writeText(transcriptText);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Transcrição copiada para a área de transferência."
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!transcriptId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center border rounded-md">
        <FileText className="h-8 w-8 text-gray-300 mb-4" />
        <p className="text-sm text-gray-500">Selecione uma transcrição para ver os detalhes.</p>
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
        <div>
          <p className="font-medium">Status: <TranscriptStatusBadge status={transcriptStatus || ''} /></p>
        </div>
        {transcriptStatus === 'completed' && transcriptText && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopyToClipboard}
          >
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
      
      {transcriptStatus === 'processing' || transcriptStatus === 'queued' ? (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md">
          <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
          <p className="text-sm">
            {transcriptStatus === 'processing' ? 'Processando transcrição...' : 'Transcrição na fila...'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Isso pode levar alguns segundos dependendo do tamanho do arquivo.
          </p>
        </div>
      ) : transcriptStatus === 'completed' && transcriptText ? (
        <Textarea 
          className="min-h-[300px]"
          value={transcriptText}
          readOnly
        />
      ) : transcriptStatus === 'error' ? (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md border-red-200 bg-red-50">
          <p className="text-red-500">Ocorreu um erro ao processar a transcrição.</p>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md">
          <p className="text-gray-500">Nenhum texto de transcrição disponível.</p>
        </div>
      )}
    </div>
  );
};

// Add missing FileText import
import { FileText } from "lucide-react";

export default TranscriptDetail;

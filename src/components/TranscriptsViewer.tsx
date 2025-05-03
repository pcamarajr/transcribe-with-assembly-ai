
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listTranscripts, getTranscription } from '@/services/assemblyAiService';
import { useToast } from "@/components/ui/use-toast";
import { FileText, Loader, Copy, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TranscriptsViewerProps {
  refreshTrigger: number;
  currentTranscriptId?: string;
}

const TranscriptsViewer: React.FC<TranscriptsViewerProps> = ({ refreshTrigger, currentTranscriptId }) => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [transcriptStatus, setTranscriptStatus] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTranscripts();
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentTranscriptId) {
      setSelectedTranscript(currentTranscriptId);
      fetchTranscriptDetails(currentTranscriptId);
    }
  }, [currentTranscriptId]);

  useEffect(() => {
    if (selectedTranscript && (transcriptStatus === 'processing' || transcriptStatus === 'queued')) {
      // Poll for transcript updates every 2 seconds if it's processing
      const interval = setInterval(() => {
        fetchTranscriptDetails(selectedTranscript);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [selectedTranscript, transcriptStatus]);

  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      const transcriptsData = await listTranscripts();
      setTranscripts(transcriptsData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar transcrições",
        description: "Não foi possível obter a lista de transcrições. Por favor, verifique sua chave API."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscriptDetails = async (transcriptId: string) => {
    try {
      setLoadingTranscript(true);
      const result = await getTranscription(transcriptId);
      setTranscriptStatus(result.status);
      setTranscriptText(result.text);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar transcrição",
        description: "Não foi possível obter os detalhes da transcrição."
      });
    } finally {
      setLoadingTranscript(false);
    }
  };

  const handleSelectTranscript = (transcriptId: string) => {
    setSelectedTranscript(transcriptId);
    setTranscriptText(null);
    setTranscriptStatus(null);
    fetchTranscriptDetails(transcriptId);
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-500">Concluído</span>;
      case 'processing':
        return <span className="text-amber-500">Processando</span>;
      case 'queued':
        return <span className="text-blue-500">Na fila</span>;
      case 'error':
        return <span className="text-red-500">Erro</span>;
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

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
            {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Atualizar
          </Button>
        </CardTitle>
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
            <p className="text-sm text-gray-500">Nenhuma transcrição encontrada.</p>
            <p className="text-xs text-gray-400">Solicite uma transcrição para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto border rounded-md p-2">
                {transcripts.map((transcript) => (
                  <div 
                    key={transcript.id}
                    className={`p-2 rounded-md cursor-pointer border ${
                      selectedTranscript === transcript.id ? 'bg-brand-50 border-brand-200' : ''
                    }`}
                    onClick={() => handleSelectTranscript(transcript.id)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate text-sm">
                        {transcript.audio_url.split('/').pop() || 'Transcrição'}
                      </p>
                      <div className="text-xs">
                        {getStatusLabel(transcript.status)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(transcript.created_at), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="md:col-span-2">
                {selectedTranscript ? (
                  loadingTranscript ? (
                    <div className="py-8 flex flex-col items-center justify-center">
                      <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
                      <p className="text-sm text-gray-500">Carregando transcrição...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Status: {getStatusLabel(transcriptStatus || '')}</p>
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
                  )
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center border rounded-md">
                    <FileText className="h-8 w-8 text-gray-300 mb-4" />
                    <p className="text-sm text-gray-500">Selecione uma transcrição para ver os detalhes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptsViewer;

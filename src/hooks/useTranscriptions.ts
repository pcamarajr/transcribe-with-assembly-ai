
import { useState, useEffect } from 'react';
import { listTranscripts, getTranscription } from '@/services/assemblyAiService';
import { useToast } from "@/hooks/use-toast";

export const useTranscriptions = (refreshTrigger: number, currentTranscriptId?: string) => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [transcriptStatus, setTranscriptStatus] = useState<string | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);
  const { toast } = useToast();

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

  return {
    transcripts,
    loading,
    selectedTranscript,
    transcriptText,
    transcriptStatus,
    loadingTranscript,
    fetchTranscripts,
    handleSelectTranscript
  };
};

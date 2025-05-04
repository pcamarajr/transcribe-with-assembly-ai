import { useToast } from "@/hooks/use-toast";
import {
  getTranscription,
  listTranscripts,
} from "@/services/assemblyAiService";
import { useCallback, useEffect, useState } from "react";

// Define the possible transcript statuses
export type TranscriptStatus =
  | "queued"
  | "processing"
  | "completed"
  | "error"
  | string;

// Interface for transcript data
export interface TranscriptData {
  id: string;
  status: TranscriptStatus;
  created: string | Date;
  completed?: string | Date;
  text?: string;
  audio_url: string;
  error?: string;
  resource_url?: string;
}

export const useTranscriptions = (
  refreshTrigger: number,
  currentTranscriptId?: string
) => {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(
    null
  );
  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [transcriptStatus, setTranscriptStatus] =
    useState<TranscriptStatus | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch all transcripts
  const fetchTranscripts = useCallback(async () => {
    try {
      setLoading(true);
      const transcriptsData = await listTranscripts();
      setTranscripts(transcriptsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching transcripts:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar transcrições",
        description:
          "Não foi possível obter a lista de transcrições. Por favor, verifique sua chave API.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch details for a specific transcript
  const fetchTranscriptDetails = useCallback(
    async (transcriptId: string) => {
      try {
        setLoadingTranscript(true);
        const result = await getTranscription(transcriptId);

        // Update the transcript status
        setTranscriptStatus(result.status);

        // Set the text if available
        if (result.text) {
          setTranscriptText(result.text);
        }

        // Update the timestamp
        setLastUpdated(new Date());

        // If transcript is completed or error, stop polling
        if (result.status === "completed" || result.status === "error") {
          setPollingEnabled(false);

          // Show a toast for completed transcripts
          if (result.status === "completed") {
            toast({
              title: "Transcrição concluída",
              description: "A transcrição do áudio foi concluída com sucesso.",
            });
          }

          // Show a toast for error status
          if (result.status === "error") {
            toast({
              variant: "destructive",
              title: "Erro na transcrição",
              description:
                "Ocorreu um erro ao processar a transcrição do áudio.",
            });
          }
        } else {
          // For queued or processing, ensure polling is enabled
          setPollingEnabled(true);
        }

        return result.status;
      } catch (error) {
        console.error("Error fetching transcript details:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar transcrição",
          description: "Não foi possível obter os detalhes da transcrição.",
        });
        setPollingEnabled(false);
        return "error";
      } finally {
        setLoadingTranscript(false);
      }
    },
    [toast]
  );

  // Handle selecting a transcript
  const handleSelectTranscript = useCallback(
    (transcriptId: string) => {
      // If already selected, do nothing
      if (selectedTranscript === transcriptId) return;

      setSelectedTranscript(transcriptId);
      setTranscriptText(null);
      setTranscriptStatus(null);
      setPollingEnabled(false); // Reset polling until we know the status

      // Fetch the transcript details
      fetchTranscriptDetails(transcriptId).then((status) => {
        // Start polling if needed (queued or processing)
        if (status === "queued" || status === "processing") {
          setPollingEnabled(true);
        }
      });
    },
    [selectedTranscript, fetchTranscriptDetails]
  );

  // Refresh transcript list when trigger changes
  useEffect(() => {
    fetchTranscripts();
  }, [refreshTrigger, fetchTranscripts]);

  // Handle new transcript ID (from upload)
  useEffect(() => {
    if (currentTranscriptId) {
      setSelectedTranscript(currentTranscriptId);
      setTranscriptText(null);
      setTranscriptStatus(null);
      setPollingEnabled(true); // Immediately start polling for new transcripts

      fetchTranscriptDetails(currentTranscriptId);
    }
  }, [currentTranscriptId, fetchTranscriptDetails]);

  // Set up polling for transcript status
  useEffect(() => {
    if (!selectedTranscript || !pollingEnabled) return;

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchTranscriptDetails(selectedTranscript);
    }, 5000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [selectedTranscript, pollingEnabled, fetchTranscriptDetails]);

  // Format the last updated time for display
  const formattedLastUpdate = lastUpdated
    ? lastUpdated.toLocaleTimeString()
    : null;

  return {
    transcripts,
    loading,
    selectedTranscript,
    transcriptText,
    transcriptStatus,
    loadingTranscript,
    fetchTranscripts,
    handleSelectTranscript,
    lastUpdated: formattedLastUpdate,
    isPolling: pollingEnabled,
  };
};

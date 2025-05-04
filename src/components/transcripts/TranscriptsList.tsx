import { TranscriptData } from "@/hooks/useTranscriptions";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import TranscriptStatusBadge from "./TranscriptStatusBadge";

interface TranscriptsListProps {
  transcripts: TranscriptData[];
  selectedTranscript: string | null;
  onSelectTranscript: (transcriptId: string) => void;
}

const TranscriptsList: React.FC<TranscriptsListProps> = ({
  transcripts,
  selectedTranscript,
  onSelectTranscript,
}) => {
  const { i18n } = useTranslation();

  // Select locale based on current language
  const locale = i18n.language === "pt" ? ptBR : enUS;

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto border rounded-md p-2">
      {transcripts.map((transcript) => {
        // Prevent error with invalid date by checking if created_at is valid
        const createdAt = new Date(transcript.created);
        const isValidDate = !isNaN(createdAt.getTime());

        console.log(transcript);

        return (
          <div
            key={transcript.id}
            className={`p-2 rounded-md cursor-pointer border ${
              selectedTranscript === transcript.id
                ? "bg-brand-50 border-brand-200"
                : ""
            }`}
            onClick={() => onSelectTranscript(transcript.id)}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium truncate text-sm">
                {transcript.audio_url.split("/").pop() || "Transcrição"}
              </p>
              <div className="text-xs">
                <TranscriptStatusBadge status={transcript.status} />
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(transcript.created, {
                      addSuffix: true,
                      locale,
                    })}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  {format(new Date(transcript.created), "PPPPpp", { locale })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      })}
    </div>
  );
};

export default TranscriptsList;

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TranscriptStatus } from "@/hooks/useTranscriptions";
import { Check, Clock, Copy, FileText, Loader, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (transcriptText) {
      navigator.clipboard.writeText(transcriptText);
      setCopied(true);
      toast({
        title: t("transcriptions.copied"),
        description: t("transcriptions.transcriptionCopied"),
      });

      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusMessage = () => {
    switch (transcriptStatus) {
      case "queued":
        return t("status.queuedDesc");
      case "processing":
        return t("status.processingDesc");
      case "completed":
        return t("status.completedDesc");
      case "error":
        return t("status.errorDesc");
      default:
        return t("status.waiting");
    }
  };

  if (!transcriptId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center border rounded-md">
        <FileText className="h-8 w-8 text-gray-300 mb-4" />
        <p className="text-sm text-gray-500">{t("transcriptions.select")}</p>
      </div>
    );
  }

  if (loadingTranscript) {
    return (
      <div className="py-8 flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
        <p className="text-sm text-gray-500">
          {t("transcriptions.loadingTranscript")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-medium mr-2">
            {t("transcriptions.status")}{" "}
            <TranscriptStatusBadge status={transcriptStatus || ""} />
          </p>
          {isPolling && (
            <span className="text-xs text-amber-500 flex items-center">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              {t("transcriptions.updating")}
            </span>
          )}
        </div>
        {transcriptStatus === "completed" && transcriptText && (
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {t("transcriptions.copied")}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {t("transcriptions.copy")}
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
              ? t("status.processing")
              : t("status.queued")}
          </p>

          <p className="text-xs text-gray-600 text-center mb-2">
            {getStatusMessage()}
          </p>

          {isPolling ? (
            <p className="text-xs text-amber-600 flex items-center">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              {t("status.updatingEvery5Seconds")}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              {t("status.waitingForUpdate")}
            </p>
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
            {t("status.errorDesc")}
          </p>
          <p className="text-xs text-red-400 text-center">
            {t("status.errorDetailedDesc")}
          </p>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center border rounded-md">
          <p className="text-gray-500">{t("transcriptions.none")}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDetail;

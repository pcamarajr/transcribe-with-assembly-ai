import React from "react";
import { useTranslation } from "react-i18next";

interface TranscriptStatusBadgeProps {
  status: string;
}

const TranscriptStatusBadge: React.FC<TranscriptStatusBadgeProps> = ({
  status,
}) => {
  const { t } = useTranslation();

  switch (status) {
    case "completed":
      return <span className="text-green-500">{t("status.completed")}</span>;
    case "processing":
      return <span className="text-amber-500">{t("status.processing")}</span>;
    case "queued":
      return <span className="text-blue-500">{t("status.queued")}</span>;
    case "error":
      return <span className="text-red-500">{t("status.error")}</span>;
    default:
      return <span className="text-gray-500">{status}</span>;
  }
};

export default TranscriptStatusBadge;

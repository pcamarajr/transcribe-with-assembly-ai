
import React from 'react';

interface TranscriptStatusBadgeProps {
  status: string;
}

const TranscriptStatusBadge: React.FC<TranscriptStatusBadgeProps> = ({ status }) => {
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

export default TranscriptStatusBadge;

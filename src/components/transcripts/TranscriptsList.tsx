
import React from 'react';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import TranscriptStatusBadge from './TranscriptStatusBadge';

interface TranscriptsListProps {
  transcripts: any[];
  selectedTranscript: string | null;
  onSelectTranscript: (transcriptId: string) => void;
}

const TranscriptsList: React.FC<TranscriptsListProps> = ({ 
  transcripts, 
  selectedTranscript, 
  onSelectTranscript 
}) => {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto border rounded-md p-2">
      {transcripts.map((transcript) => {
        // Prevent error with invalid date by checking if created_at is valid
        const createdAt = new Date(transcript.created_at);
        const isValidDate = !isNaN(createdAt.getTime());
        
        return (
          <div 
            key={transcript.id}
            className={`p-2 rounded-md cursor-pointer border ${
              selectedTranscript === transcript.id ? 'bg-brand-50 border-brand-200' : ''
            }`}
            onClick={() => onSelectTranscript(transcript.id)}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium truncate text-sm">
                {transcript.audio_url.split('/').pop() || 'Transcrição'}
              </p>
              <div className="text-xs">
                <TranscriptStatusBadge status={transcript.status} />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {isValidDate 
                ? formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })
                : 'Data desconhecida'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TranscriptsList;

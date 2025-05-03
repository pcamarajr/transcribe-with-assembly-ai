
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listFiles, requestTranscription } from '@/services/assemblyAiService';
import { useToast } from "@/components/ui/use-toast";
import { FileAudio, File, FileText, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FilesViewerProps {
  onTranscriptionRequested: (transcriptId: string) => void;
  refreshTrigger: number;
}

const FilesViewer: React.FC<FilesViewerProps> = ({ onTranscriptionRequested, refreshTrigger }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingFiles, setProcessingFiles] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await listFiles();
      setFiles(filesData);
    } catch (error) {
      console.error('Error listing files:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar arquivos",
        description: "Não foi possível obter a lista de arquivos. Por favor, verifique sua chave API."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTranscription = async (fileId: string) => {
    try {
      setProcessingFiles(prev => ({ ...prev, [fileId]: true }));
      const transcriptId = await requestTranscription(fileId);
      toast({
        title: "Sucesso",
        description: "Transcrição solicitada com sucesso!"
      });
      onTranscriptionRequested(transcriptId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível solicitar a transcrição. Por favor, tente novamente."
      });
    } finally {
      setProcessingFiles(prev => ({ ...prev, [fileId]: false }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileAudio className="w-5 h-5 mr-2" />
            Arquivos de Áudio
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchFiles}
            disabled={loading}
          >
            {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <File className="w-4 h-4 mr-2" />}
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-brand-500 mb-4" />
            <p className="text-sm text-gray-500">Carregando arquivos...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <FileAudio className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm text-gray-500">Nenhum arquivo encontrado.</p>
            <p className="text-xs text-gray-400">Faça o upload de um arquivo de áudio para começar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="p-3 border rounded-md flex items-center justify-between"
              >
                <div>
                  <p className="font-medium truncate" title={file.audio_url}>
                    {file.filename || file.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(file.created_at), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleRequestTranscription(file.audio_url)}
                  disabled={processingFiles[file.id]}
                >
                  {processingFiles[file.id] ? (
                    <>
                      <Loader className="w-3 h-3 mr-2 animate-spin" />
                      Processando
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3 mr-2" />
                      Transcrever
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesViewer;

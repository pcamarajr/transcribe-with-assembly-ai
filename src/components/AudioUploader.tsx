import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { uploadAndTranscribe } from "@/services/assemblyAiService";
import { Check, Clock, FileAudio, Loader, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TranscriptStatusBadge from "./transcripts/TranscriptStatusBadge";

interface AudioUploaderProps {
  onTranscriptionRequested: (transcriptId: string) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  onTranscriptionRequested,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    // Check if file is audio
    if (!file.type.startsWith("audio/")) {
      toast({
        variant: "destructive",
        title: t("apiKey.error"),
        description: "Por favor, envie apenas arquivos de áudio.",
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setCurrentStatus("uploading");

    try {
      // Start simulating upload progress for UI feedback
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress <= 90) {
          // Only go up to 90% during the actual upload
          setUploadProgress(progress);
        }
      }, 100);

      // Upload file to AssemblyAI
      setUploadProgress(50);
      clearInterval(progressInterval);

      // Show transcribing state
      setIsTranscribing(true);
      setCurrentStatus("requesting");

      // Upload and immediately request transcription
      const id = await uploadAndTranscribe(file);
      setTranscriptId(id);

      // Upload and transcription request complete
      setUploadProgress(100);
      setCurrentStatus("queued");

      toast({
        title: t("upload.transcriptionRequested"),
        description: t("upload.transcriptionRequestedDesc"),
      });

      // Switch to the transcriptions tab immediately
      onTranscriptionRequested(id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("apiKey.error"),
        description: t("apiKey.uploadError"),
      });
      setUploadedFile(null);
      setUploadProgress(0);
      setIsTranscribing(false);
      setCurrentStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (
      !isUploading &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploading && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const renderStatusIndicator = () => {
    switch (currentStatus) {
      case "uploading":
        return (
          <p className="text-sm text-blue-500 mt-2 flex items-center justify-center">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            {t("upload.uploading")} ({Math.round(uploadProgress)}%)...
          </p>
        );
      case "requesting":
        return (
          <p className="text-sm text-amber-500 mt-2 flex items-center justify-center">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            {t("upload.initiatingTranscription")}
          </p>
        );
      case "queued":
        return (
          <div className="mt-2">
            <p className="text-sm flex items-center justify-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>
                {t("transcriptions.status")}{" "}
                <TranscriptStatusBadge status="queued" />
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {t("upload.transcriptionQueued")}
            </p>
          </div>
        );
      case "processing":
        return (
          <div className="mt-2">
            <p className="text-sm flex items-center justify-center">
              <Loader className="h-4 w-4 mr-2 animate-spin text-amber-500" />
              <span>
                {t("transcriptions.status")}{" "}
                <TranscriptStatusBadge status="processing" />
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {t("upload.transcriptionProcessing")}
            </p>
          </div>
        );
      case "completed":
        return (
          <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
            <Check className="h-4 w-4 mr-2" />
            <span>
              {t("transcriptions.status")}{" "}
              <TranscriptStatusBadge status="completed" />
            </span>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-all-ease ${
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-gray-200 hover:border-brand-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isUploading ? undefined : triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {!uploadedFile ? (
            <div className="cursor-pointer">
              <FileAudio className="h-12 w-12 mx-auto text-brand-500 mb-4" />
              <p className="font-medium text-lg text-gray-700 mb-1">
                {t("upload.dragDrop")}
              </p>
              <p className="text-gray-500 text-sm">
                {t("upload.supportedFormats")}
              </p>
            </div>
          ) : (
            <div>
              <FileAudio className="h-8 w-8 mx-auto text-brand-500 mb-2" />
              <p className="font-medium text-gray-700 mb-2">
                {uploadedFile.name}
              </p>
              <div className="mx-auto max-w-md">
                <Progress value={uploadProgress} className="h-2" />
              </div>

              {renderStatusIndicator()}
            </div>
          )}
        </div>

        {!uploadedFile && !isUploading && (
          <Button className="mt-4 w-full" onClick={triggerFileInput}>
            <Upload className="w-4 h-4 mr-2" /> {t("upload.selectFile")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioUploader;

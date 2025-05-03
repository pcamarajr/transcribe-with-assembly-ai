
import { AssemblyAI, FileUploadData, TranscribeParams, SpeechModel } from "assemblyai";

// Function to get API key from local storage
export const getApiKey = (): string | null => {
  return localStorage.getItem('assemblyai_api_key');
};

// Function to set API key in local storage
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('assemblyai_api_key', apiKey);
};

// Function to check if API key exists
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

// Function to create AssemblyAI client
export const createClient = (): AssemblyAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  
  return new AssemblyAI({
    apiKey,
  });
};

// Function to upload audio file to AssemblyAI
export const uploadAudioFile = async (file: File): Promise<string> => {
  const client = createClient();
  if (!client) throw new Error('API key not set');

  try {
    // The upload method directly returns a string in v4 of the SDK
    const audioUrl = await client.files.upload(file);
    return audioUrl; // This is already the string we need
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to request transcription
export const requestTranscription = async (fileId: string, language: string = 'pt'): Promise<string> => {
  const client = createClient();
  if (!client) throw new Error('API key not set');

  try {
    const params: TranscribeParams = {
      audio: fileId,
      language_code: language,
    };
    
    const transcript = await client.transcripts.transcribe(params);
    return transcript.id;
  } catch (error) {
    console.error('Error requesting transcription:', error);
    throw error;
  }
};

// Function to get transcription status and text
export const getTranscription = async (transcriptId: string): Promise<{ status: string, text: string | null }> => {
  const client = createClient();
  if (!client) throw new Error('API key not set');

  try {
    const transcript = await client.transcripts.get(transcriptId);
    return {
      status: transcript.status,
      text: transcript.text,
    };
  } catch (error) {
    console.error('Error getting transcription:', error);
    throw error;
  }
};

// Function to list all uploaded files
export const listFiles = async (): Promise<any[]> => {
  const client = createClient();
  if (!client) throw new Error('API key not set');

  try {
    // Use the correct API to get files
    // According to AssemblyAI v4 API, we need to use a different approach
    // Using transcripts to get the uploaded files
    const transcripts = await client.transcripts.list({ limit: 100 });
    
    // Map the transcripts to get file information
    const files = transcripts.transcripts.map(transcript => ({
      id: transcript.id,
      filename: transcript.audio_url.split('/').pop() || transcript.id,
      audio_url: transcript.audio_url,
      created_at: transcript.created,
    }));
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Function to list all transcripts
export const listTranscripts = async (): Promise<any[]> => {
  const client = createClient();
  if (!client) throw new Error('API key not set');

  try {
    const transcripts = await client.transcripts.list({ limit: 100 });
    return transcripts.transcripts;
  } catch (error) {
    console.error('Error listing transcripts:', error);
    throw error;
  }
};

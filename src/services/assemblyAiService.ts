import { secureStorage } from "@/lib/secureStorage";
import { AssemblyAI, TranscribeParams } from "assemblyai";

// Function to get API key from secure storage
export const getApiKey = (): string | null => {
  return secureStorage.getItem();
};

// Function to set API key in secure storage
export const setApiKey = (apiKey: string): void => {
  secureStorage.setItem(apiKey);
};

// Function to remove API key
export const removeApiKey = (): void => {
  secureStorage.removeItem();
};

// Function to check if API key exists
export const hasApiKey = (): boolean => {
  return secureStorage.hasItem();
};

// Function to validate an API key by making a request to the transcripts list endpoint
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://api.assemblyai.com/v2/transcript?limit=1",
      {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (response.ok) {
      return true;
    }

    // If response is 401 (Unauthorized), the API key is invalid
    if (response.status === 401) {
      return false;
    }

    // For other errors, we'll assume the API key might be valid but there's another issue
    // Log the error for debugging
    console.error("Error validating API key:", await response.text());
    return false;
  } catch (error) {
    console.error("Network error validating API key:", error);
    return false;
  }
};

// Function to create AssemblyAI client
export const createClient = (): AssemblyAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  return new AssemblyAI({
    apiKey,
  });
};

// Function to upload audio file to AssemblyAI and immediately request transcription
export const uploadAndTranscribe = async (
  file: File,
  language: string = "pt"
): Promise<string> => {
  const client = createClient();
  if (!client) throw new Error("API key not set");

  try {
    // Upload the file
    const audioUrl = await client.files.upload(file);

    // Immediately request transcription
    const params: TranscribeParams = {
      audio: audioUrl,
      language_code: language,
    };

    const transcript = await client.transcripts.transcribe(params);
    return transcript.id;
  } catch (error) {
    console.error("Error uploading and transcribing file:", error);
    throw error;
  }
};

// Function to get transcription status and text
export const getTranscription = async (
  transcriptId: string
): Promise<{ status: string; text: string | null }> => {
  const client = createClient();
  if (!client) throw new Error("API key not set");

  try {
    const transcript = await client.transcripts.get(transcriptId);
    return {
      status: transcript.status,
      text: transcript.text,
    };
  } catch (error) {
    console.error("Error getting transcription:", error);
    throw error;
  }
};

// Function to list all transcripts without type specifics
export const listTranscripts = async () => {
  const client = createClient();
  if (!client) throw new Error("API key not set");

  try {
    const transcripts = await client.transcripts.list({ limit: 100 });
    return transcripts.transcripts;
  } catch (error) {
    console.error("Error listing transcripts:", error);
    throw error;
  }
};

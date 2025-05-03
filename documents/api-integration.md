# API Integration

Audio Scribe integrates with [AssemblyAI](https://www.assemblyai.com/) for audio transcription.

## API Key Management

- API key is stored in localStorage.
- All API requests require the key; user is prompted if missing.

## File Upload & Transcription

- Audio files are uploaded to AssemblyAI via their SDK.
- After upload, a transcription request is made immediately.
- The service returns a transcript ID for tracking.

## Fetching Transcripts

- The app fetches the list of transcripts and their statuses.
- Individual transcript details (status, text) are fetched and polled until complete.

## Service Abstraction

- All API logic is encapsulated in `src/services/assemblyAiService.ts`.
- Errors are caught and surfaced to the user via toast notifications.

See [Features](./features.md) for user-facing flows or [Extending the App](./extending.md) for how to add more integrations.

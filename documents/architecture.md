# Architecture

Audio Scribe is built with a modular, maintainable architecture:

## Frontend Stack

- **React** with **TypeScript** for UI and logic
- **Vite** for fast development and builds
- **Tailwind CSS** and **shadcn-ui** for styling

## Main Modules

- **API Service**: Handles all communication with AssemblyAI (see [API Integration](./api-integration.md))
- **Custom Hooks**: Encapsulate logic for fetching and managing transcriptions
- **Components**: Modular UI elements for upload, viewing, and managing transcripts (see [UI Components](./ui-components.md))

## Data Flow

1. User enters API key (stored in localStorage)
2. User uploads audio file
3. File is sent to AssemblyAI, transcription is requested
4. Transcripts are fetched and displayed, with polling for status updates

For more, see [API Integration](./api-integration.md) and [UI Components](./ui-components.md).

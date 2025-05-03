# UI Components

Audio Scribe uses a modular component architecture for maintainability and reusability.

## Key Components

- **AudioUploader**: Handles file selection, drag-and-drop, and upload progress.
- **TranscriptsViewer**: Displays the list of transcripts and manages selection.
- **TranscriptDetail**: Shows transcript status, text, and copy-to-clipboard.
- **ApiKeyForm**: Prompts for and stores the AssemblyAI API key.

## UI Libraries

- **shadcn-ui** and **Radix UI**: Provide accessible, customizable UI primitives (buttons, cards, tabs, etc.).
- **Lucide Icons**: Used for visual feedback and clarity.

## Modularity

- Components are designed for reuse and easy extension.
- Custom hooks encapsulate logic and state management.

See [Architecture](./architecture.md) for structure or [Extending the App](./extending.md) for customization tips.

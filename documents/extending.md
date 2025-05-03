# Extending the App

Audio Scribe is designed for easy extension and customization.

## Adding New Features

- Create new components in `src/components` and hooks in `src/hooks`.
- Use the existing modular structure for consistency.

## Integrating Other APIs

- Add new service files in `src/services`.
- Follow the pattern in `assemblyAiService.ts` for API abstraction and error handling.
- Update UI components to support new data sources as needed.

## Customizing the UI

- Leverage shadcn-ui and Tailwind CSS for styling.
- Add or modify components in `src/components/ui` for shared UI elements.

## Best Practices

- Keep logic in hooks and services, UI in components.
- Use TypeScript for type safety.
- Write clear, concise documentation for new features.

See [Architecture](./architecture.md) and [API Integration](./api-integration.md) for technical details.

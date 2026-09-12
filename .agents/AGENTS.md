# Finace.Client Project Context

This is the central knowledge base for the Finace.Client Angular application. AI agents should refer to this document to understand the project's architecture, tools, and design guidelines before making changes.

## 1. Technology Stack
- **Framework**: Angular 19
- **UI Library**: Angular Material
- **API Client Generation**: `ng-openapi-gen`

## 2. Project Structure & API Client
- **OpenAPI Specification**: The source of truth for the API is located at `src/swagger.json`.
- **Generated Client**: The API client is automatically generated into the `src/api/` directory.
  - To regenerate the client, run: `npm run generate-api`
  - Do not manually edit the files inside `src/api/`.
- **Importing API Code**: When importing models or services into components, always use the barrel index files:
  - Models: `import { ... } from '../api/models';`
  - Services: `import { ... } from '../api/services';`

## 3. Design Guidelines
- **Theme**: The application uses a strictly defined custom Angular Material theme.
- **Colors**: The global theme enforces a white background with black text (`#ffffff` background, `#000000` text). Avoid adding conflicting global styles.
- **Styling Preference**: Rely on Angular Material components and their built-in typography/theming wherever possible before writing custom CSS.

## 4. Git & Commit Guidelines
- Follow standard conventional commits.
- Ensure only necessary files are committed.
- Keep the VSCode specific files (`.vscode/`) ignored in source control.

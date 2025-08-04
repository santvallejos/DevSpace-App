1.Framework Versions and Dependencies
    Backend: .NET 9 (ASP.NET Core) with MongoDB.Driver for data access
    Frontend: React 18 + TypeScript, Vite build system
    Desktop Packaging: Electron 26
    UI Libraries: Tailwind CSS 4, Shadcn UI, Magic UI
    Utilities: Excalidraw for architecture diagrams (dev-only)

2.Project Architecture
    Monorepo Layout:
    Devspace/
    ├── API/          # .NET backend (Controllers, Data, Services)
    ├── client/       # React frontend (components, contexts, hooks, etc.)
    └── electron/     # Electron wrapper (main.js, package.json)

    Layered Design (API):
    Controllers
    Data (Models, Repositories)
    Infrastructure/DTOs
    Services (business logic)

3.Key Code Structure
    API Folder:
    Controllers/
    Data/Models/
    Data/Repositories/
    Infrastructure/Dto/
    Services/
    Program.cs, appsettings.json

    Client Folder:
    src/components/, contexts/, hooks/, layouts/, lib/, models/, pages/, services/, stores/
    App.tsx, main.tsx, layout.tsx
    .env, vite.config.ts, tsconfig.json

    Electron Folder:
    main.js (bootstraps API + client)
    package.json (Electron config)

4.Coding Guidelines & Conventions
TypeScript: strict mode enabled
    .NET: Follow C# 10 conventions, use nullable reference types
    Styling: Prefer Tailwind utility classes; encapsulate reusable UI in Shadcn components
    Commits: Conventional Commits specification

5.Environment & Configuration
    API: appsettings.json for connection strings, secrets via environment variables
    Client: .env for API endpoints, feature flags
    Electron: Build scripts located in electron/package.json

6.Build & Release Scripts
    Root package.json scripts:
    npm run build:api
    npm run build:client
    npm run package:electron

7.Helpful Links
    [Excalidraw Architecture Diagram](/client/public/Devspace - excalidraw.png)
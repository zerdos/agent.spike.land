# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript application for managing and controlling AI agents. It consists of:
- **Frontend**: React + Vite application with real-time WebSocket communication
- **Backend**: Express server with WebSocket support that manages agent sessions via Anthropic API

## Development Commands

### Frontend (React + Vite)
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run Vitest unit tests
npm run type-check   # TypeScript type checking
npm run lint         # ESLint
npm run e2e          # Run Cucumber BDD tests with Playwright
```

### Backend (Express + WebSocket Server)
```bash
cd server
npm run dev          # Start dev server with hot reload (port 3001)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production server
npm run test         # Run backend tests
```

### Running the Full Application
1. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`
2. Start backend: `cd server && npm run dev`
3. Start frontend: `npm run dev` (in root directory)

## Architecture

### WebSocket Communication Flow

The application uses a bidirectional WebSocket protocol between frontend and backend:

**Client → Server messages:**
- `create_session`: Initialize new agent session for a project
- `send_message`: Send user message to agent
- `get_sessions`: Retrieve all active sessions
- `delete_session`: Terminate agent session

**Server → Client messages:**
- `session_created`: Confirms session creation with session ID
- `message_chunk`: Streaming response chunks from Claude API
- `message_complete`: Signals end of agent response
- `error`: Error information
- `sessions_list`: List of active sessions

### Backend Structure (server/src/)

**AgentManager** (`AgentManager.ts`): Core agent session lifecycle manager
- Manages multiple concurrent agent sessions via Map
- Wraps Anthropic SDK for streaming Claude API calls
- Tracks session state (idle/busy/error) and activity timestamps
- Sessions are identified by unique IDs generated on creation

**WebSocketHandler** (`WebSocketHandler.ts`): WebSocket protocol implementation
- Maps WebSocket connections to agent sessions
- Routes client messages to appropriate AgentManager methods
- Streams Claude API responses back to clients in real-time
- Automatically cleans up sessions when clients disconnect

**Server Entry** (`index.ts`): Express + WebSocket server initialization
- Configures CORS for frontend origin
- Validates ANTHROPIC_API_KEY on startup
- Wires together AgentManager and WebSocketHandler

### Frontend Structure (src/)

**AgentService** (`services/AgentService.ts`): WebSocket client abstraction
- Establishes and maintains WebSocket connection to backend
- Implements automatic reconnection logic (max 5 attempts)
- Provides type-safe message sending/receiving API
- Event-based message handler registration system

**useAgent Hook** (`hooks/useAgent.ts`): React integration for agent communication
- Manages connection lifecycle and session state
- Accumulates streaming message chunks into complete messages
- Maintains conversation history with timestamps
- Handles loading states and error conditions

**Component Structure:**
- `Dashboard`: Main view showing projects and agent statistics
- `ProjectCard`: Displays individual project info and status
- `AgentStats`: Shows aggregate agent metrics
- `AgentConsole`: Interactive chat interface (newly added)

All components follow the pattern: `ComponentName.tsx` + `ComponentName.test.tsx` in the same directory.

### Type System

Shared types between frontend and backend are duplicated (not ideal but current state):
- `src/types/index.ts`: Frontend types (Project, Agent, DashboardStats)
- `server/src/*.ts`: Backend types defined inline (AgentSession, message types)
- `src/services/AgentService.ts` and `server/src/WebSocketHandler.ts`: WebSocket message protocol types

## Testing

### Unit Tests (Vitest)
- Uses jsdom environment for React component testing
- Setup file: `src/setupTests.ts` (configured in `vite.config.ts`)
- Run specific test: `npm test -- ComponentName.test.tsx`

### E2E Tests (Cucumber + Playwright)
- Feature files: `features/*.feature` (Gherkin syntax)
- Step definitions: `features/support/*.ts`
- Config: `cucumber.js` (uses ts-node for TypeScript support)
- Generates HTML report: `cucumber-report.html`

## Environment Variables

Required environment variables (see `.env.example`):
- `ANTHROPIC_API_KEY`: API key for Claude access (backend only)
- `PORT`: Backend server port (default: 3001)
- `FRONTEND_URL`: CORS allowed origin (default: http://localhost:5173)

The backend validates `ANTHROPIC_API_KEY` on startup and exits if missing.

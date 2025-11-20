# Agent Control Panel

A modern web application for controlling and monitoring AI agents powered by Claude. Built with React, TypeScript, and the Anthropic SDK.

## Features

- 🎯 **Dashboard**: View all your projects and agent statistics at a glance
- 🤖 **Real-time Agent Control**: Send messages to Claude agents and see responses stream in real-time
- 💬 **Interactive Console**: Chat-style interface for agent interaction
- 🔄 **WebSocket Communication**: Low-latency bidirectional communication
- 🧪 **Test-Driven Development**: Comprehensive test coverage with Vitest
- 🎨 **Premium Dark Theme**: Beautiful, modern UI with smooth animations

## Prerequisites

- Node.js 18+ 
- npm or yarn
- **Claude CLI** installed and authenticated (`npm install -g @anthropic-ai/claude-code`)

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd agent.spike.land
npm install
cd server && npm install && cd ..
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Authenticate Claude

Ensure you have authenticated the Claude CLI on your machine:

```bash
claude login
```

### 3. Run the Application

**Option A: Run both frontend and backend (recommended)**

From the root directory:
```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
npm run dev
```

**Option B: Use concurrently (WIP)**
```bash
npm run dev:all # Coming soon
```

### 4. Open the Application

Navigate to http://localhost:5173 in your browser.

## Usage

1. **View Dashboard**: See your projects and agent statistics
2. **Connect to Agent**: Click on any project card
3. **Chat with Agent**: Type messages in the console and get real-time responses
4. **Close Console**: Click the × button to return to the dashboard

## Project Structure

```
agent.spike.land/
├── src/                        # Frontend React application
│   ├── components/             # React components
│   │   ├── Dashboard/          # Main dashboard
│   │   ├── AgentConsole/       # Agent chat interface
│   │   ├── AgentStats/         # Statistics display
│   │   └── ProjectCard/        # Project information cards
│   ├── hooks/                  # Custom React hooks
│   │   └── useAgent.ts         # Agent connection management
│   ├── services/               # Frontend services
│   │   └── AgentService.ts     # WebSocket client
│   └── types/                  # TypeScript type definitions
│
├── server/                     # Backend Node.js application
│   └── src/
│       ├── index.ts            # Express server + WebSocket setup
│       ├── AgentManager.ts     # Claude SDK integration
│       └── WebSocketHandler.ts # WebSocket message handling
│
├── features/                   # E2E tests (Cucumber + Playwright)
└── .github/workflows/          # CI/CD pipelines
```

## Development

### Running Tests

```bash
# Frontend unit tests
npm test

# Frontend tests (watch mode)
npm test -- --watch

# E2E tests
npm run e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, WebSocket
- **AI**: Anthropic Claude SDK
- **Testing**: Vitest, React Testing Library, Playwright, Cucumber
- **CI/CD**: GitHub Actions

## Architecture

The application uses a client-server architecture:

1. **Frontend (React)**: 
   - Modern SPA with component-based architecture
   - WebSocket client for real-time communication
   - State management with React hooks

2. **Backend (Node.js)**:
   - Express server for HTTP endpoints
   - WebSocket server for real-time messaging
   - AgentManager wraps Anthropic SDK
   - Streaming responses from Claude

3. **Communication Flow**:
   ```
   Browser → WebSocket → Backend → Anthropic API
              ← Stream ←         ← Claude Response
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test updates
- `refactor:` Code refactoring

## License

Open Source - MIT License

## Roadmap

- [ ] User authentication
- [ ] Agent persistence across sessions
- [ ] Multi-agent conversations
- [ ] Agent tool permissions UI
- [ ] Project creation and management
- [ ] Real-time collaboration
- [ ] Agent performance metrics
- [ ] Export conversation history

## Support

For issues and questions, please open an issue on GitHub.

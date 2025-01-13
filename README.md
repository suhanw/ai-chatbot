# Project URL

https://www.suhanwijaya.com/ai-chatbot

# Local development

1. Create an OpenAI API key and assign it to the `OPENAI_API_KEY` environment variable.

2. Make sure you have Docker installed and running. Build and start Docker containers:

```
npm start
```

3. The service runs on `http://localhost:3000`.

4. Monitor logs:

```
docker compose logs -f
```

5. Tear down Docker containers:

```
npm stop
```

# Overview

## Functionality

### Core Features

- Real-time chat interface with AI responses
- User authentication (signup/login)
- Conversation history management
- Multi-session support
- Persistent storage of conversations

### AI Integration

The application uses OpenAI's GPT model for generating responses, with a abstract `GenAIClient` interface to allow for future integrations with other AI providers.

## Design and Usability

### User Interface

- Clean, modern Material-UI based design
- Intuitive chat interface with message history and input area
- Simple layout with collapsible sidebar to browse past chats

### UX Features

- Real-time message updates
- Auto-scroll to latest messages
- Loading states during AI responses
- Error handling with user-friendly messages
- Persistent login sessions

## Architecture

### Project Structure

- Modular architecture with clear separation of concerns
- Loosely coupled client, server, data, cache, and integration components
- TypeScript throughout for type safety and strong DevEx
- Docker compose to simplify local environment setup
- Consistent code style and formatting

### Three-Tier Architecture

#### Client (Frontend Layer)

- React with Material-UI components
- Redux for global state management
- Separate slices for data and UI states
- Optimistic chat updates for better UX

#### Server (Application Layer)

- Express.js server
- Plugin-based architecture for separation of concerns and future extensibility
- Secure session management
- RESTful API with auth and clear error responses

#### Data Layer

- MongoDB for user profile and conversation storage
- Redis for session management
- Repository design pattern to abstract data access logic from business logic

### Infrastructure

- Docker containerization for easy deployment and scaling
- Separate development and production configurations
- Server and Redis are deployed to Render managed services
- Client is deployed to Render static site which serves as CDN
- MongoDB database deployed to MongoDB Atlas serverless

## Security

### Session-based Authentication

- Secure password hashing in data store
- Redis for temporary session storage
- Secure cookie configuration

### Infrastructure Security

- Environment variable management (no secrets in the codebase)
- Sanitized database URIs to avoid exposing credentials in logs

## Scalability and Performance

### Current Optimizations

- Docker containerization for easy deployment and scaling
- Redis store to enable caching capabilities
- Webpack optimization for bundle size

### Scalability Considerations

- Loose coupling of data stores and application so each layer can be replaced easily or scaled independently
- Choice of MongoDB for horizontal scalability and flexible model to accommodate multi-modal conversations
- `render.yaml` configuration for scalable cloud deployment via Infrastructure-as-Code

## If I had more time, I would work on these:

### Features

- Polish the format of the AI responses
- Add file upload support to enable multi-modal conversations
- Add conversation export/sharing
- Integrate more AI providers (e.g., Google, Anthropic)

### Performance

- Unit, integration, and end-to-end testing
- Database optimizations in conversation updates
- Implement API rate limiting
- Add request caching
- Optimize client bundle sizes

### Security

- Implement API key rotation
- Require app users to provide their own API keys

### Monitoring

- Add more structure to logging and error handling/reporting
- Implement o11y tools (e.g., Datadog)
- Monitor compute/storage metrics, logs, and traces

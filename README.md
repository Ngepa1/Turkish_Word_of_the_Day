# Turkish Word of the Day

A web application that helps English speakers learn Turkish vocabulary one word at a time.

## Features

- **Word of the Day**: A new Turkish word is featured daily with its pronunciation, meaning, and example sentences.
- **Word History**: Browse through previously featured words.
- **Search Functionality**: Search for specific Turkish or English words.
- **Learning Resources**: Includes information about Turkish pronunciation, alphabet, and learning tips.

## Technology Stack

- **Frontend**: React with TanStack Query for data fetching
- **Styling**: Tailwind CSS with Shadcn UI components
- **Routing**: Wouter for lightweight client-side routing
- **Backend**: Express.js server with RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Basic user authentication (planned for future)

## Development Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Environment Variables

The application requires the following environment variables:

```
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

Additional PostgreSQL-related variables:
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/turkish-word-of-the-day.git
cd turkish-word-of-the-day
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application should now be running at `http://localhost:5000`.

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: UI components
  - `/src/pages`: Page components for different routes
  - `/src/lib`: Utility functions and types
- `/server`: Backend Express server
  - `routes.ts`: API endpoints
  - `storage.ts`: Data access layer
  - `db.ts`: Database connection
- `/shared`: Shared code between frontend and backend
  - `schema.ts`: Database schema definitions with Drizzle ORM

## Future Enhancements

- User accounts to track learning progress
- Spaced repetition for vocabulary learning
- Quizzes to test vocabulary retention
- Categories and difficulty levels for words
- Audio pronunciation for words

## License

MIT
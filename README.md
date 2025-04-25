# LeetCode API Server

A Node.js backend for LeetCode API integration, providing access to daily challenges, submitting solutions, and browsing problems.

## Features

- Fetch daily LeetCode challenges
- Get problem details by title slug
- Submit solutions to problems
- Run code against test cases
- Browse all LeetCode questions with filtering and pagination
- Check authentication status

## Tech Stack

- Node.js
- Express.js
- Axios for HTTP requests
- Winston for logging
- Joi for validation
- Morgan for HTTP request logging
- Helmet for security headers
- CORS for cross-origin resource sharing

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── static/             # Static files
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   HOST=0.0.0.0
   NODE_ENV=development
   LEETCODE_GRAPHQL=https://leetcode.com/graphql
   LEETCODE_BASE_URL=https://leetcode.com
   LEETCODE_CSRF_TOKEN=
   LEETCODE_COOKIE=
   LEETCODE_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36
   LEETCODE_ORIGIN=https://leetcode.com
   LEETCODE_REFERER=https://leetcode.com/problems/two-sum/
   LOG_LEVEL=info
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### LeetCode

- `GET /api/leetcode/daily` - Get daily LeetCode challenge

### Problems

- `GET /api/leetcode/problems/:titleSlug` - Get problem by title slug
- `POST /api/leetcode/problems/submit` - Submit solution for a problem
- `POST /api/leetcode/problems/submit-as-proxy` - Submit solution as proxy

### Submissions

- `POST /api/leetcode/run-code/:questionTitleSlug` - Run code for a problem
- `POST /api/leetcode/submit/:questionTitleSlug` - Submit code for a problem
- `GET /api/leetcode/submissions/:submissionId/check` - Check submission status
- `GET /api/leetcode/run-code/check/:interpretId` - Check run code result

### Questions

- `GET /api/leetcode/questions` - Get all LeetCode questions

### Authentication

- `GET /api/leetcode/auth-check` - Check LeetCode authentication status
- `GET /api/leetcode/fetch-cookies` - Fetch cookies from LeetCode

## License

MIT

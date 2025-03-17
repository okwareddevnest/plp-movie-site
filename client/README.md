# MovieHub Frontend

This is the frontend for the MovieHub application, a movie information site that pulls data from the IMDB API.

## Technologies Used

- React
- React Router
- Radix UI
- Tailwind CSS
- Axios
- React Query

## Features

- Responsive design that works on all device sizes
- User authentication (login/register)
- Movie search
- Movie details
- User profiles with favorites and watchlist
- Movie reviews

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page components
- `src/context` - React context for state management
- `src/hooks` - Custom React hooks
- `src/api` - API service functions
- `src/utils` - Utility functions

## Backend API

This frontend connects to a Node.js/Express backend API. Make sure the backend server is running on `http://localhost:5000`.

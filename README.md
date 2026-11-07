# Class Notes

A full-stack notes app built with React, Node.js, Express, and SQLite. Users can create, edit, delete, and view notes, and the notes stay saved after a refresh.



## Features

- Add notes with a title and content
- Edit and delete existing notes
- Notes are stored in a SQLite database, so they persist after a refresh
- Readable dates on each note
- Success and error messages, including a message when the server is not running
- Confirmation prompt before deleting
- Responsive pastel card layout

## Tech Stack

- **Front end:** React (built with Vite)
- **Back end:** Node.js and Express
- **Database:** SQLite (using better-sqlite3)

## How It Works

The React page sends requests to the Express server, and the server reads and writes the SQLite database. React never talks to the database directly.

## API Routes

| Method | Route | What it does |
|---|---|---|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Run It Locally

You need [Node.js](https://nodejs.org) installed.

1. Clone the repo and open the folder.

2. Start the server in one terminal:

```bash
cd server
npm install
node server.js
```

The server runs at `http://localhost:3000`, and a `notes.db` file is created the first time.

3. Start the React app in a second terminal:

```bash
cd client
npm install
npm run dev
```

4. Open the address shown in the terminal, usually `http://localhost:5173`.

## Notes

- Both the server and the React app need to be running at the same time.
- There are no user accounts, so everyone using the same server shares the same notes.

## What I Learned

- How a React front end, an Express API, and a SQLite database connect to each other
- Using `fetch()` with GET, POST, PUT, and DELETE requests
- Managing state and loading data with React hooks (`useState`, `useEffect`)
- Writing SQL queries with placeholders and validating input on the server
- Debugging syntax errors, scope problems, and server restarts

## Future Ideas

- Search and filter notes
- Organize notes by class
- User accounts

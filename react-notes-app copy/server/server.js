const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Database("notes.db");

db.prepare("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL)").run();

app.get("/", (request, response) => {
  response.send("Notes server is running.");
});

app.get("/api/notes", (request, response) => {
  const notes = db
    .prepare("SELECT * FROM notes ORDER BY id DESC")
    .all();
  response.json(notes);
});

app.post("/api/notes", (request, response) => {
  const { title, content } = request.body;

  if (!title || !content) {
    return response.status(400).json({
      error: "Title and content are required."
    });
  }

  const createdAt = new Date().toISOString();

  const result = db
    .prepare("INSERT INTO notes (title, content, created_at) VALUES (?, ?, ?)")
    .run(title, content, createdAt);

  const newNote = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(result.lastInsertRowid);

  response.status(201).json(newNote);
});

app.put("/api/notes/:id", (request, response) => {
  const { title, content } = request.body;

  if (!title || !content) {
    return response.status(400).json({
      error: "Title and content are required."
    });
  }

  const result = db
    .prepare("UPDATE notes SET title = ?, content = ? WHERE id = ?")
    .run(title, content, request.params.id);

  if (result.changes === 0) {
    return response.status(404).json({ error: "Note not found." });
  }

  const updatedNote = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(request.params.id);

  response.json(updatedNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const result = db
    .prepare("DELETE FROM notes WHERE id = ?")
    .run(request.params.id);

  if (result.changes === 0) {
    return response.status(404).json({ error: "Note not found." });
  }

  response.status(204).send();
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
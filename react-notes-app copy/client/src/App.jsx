import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/notes";

function formatDate(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  function showMessage(text, type) {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  async function loadNotes() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      showMessage("Could not reach the server. Is it running?", "error");
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        setEditingId(null);
        loadNotes();
        showMessage(isEditing ? "Note updated!" : "Note saved!", "success");
      } else {
        showMessage("Please fill in both fields.", "error");
      }
    } catch (error) {
      showMessage("Could not reach the server. Is it running?", "error");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this note? This can't be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (response.ok) {
        if (id === editingId) {
          cancelEditing();
        }
        loadNotes();
        showMessage("Note deleted.", "success");
      } else {
        showMessage("Could not delete that note.", "error");
      }
    } catch (error) {
      showMessage("Could not reach the server. Is it running?", "error");
    }
  }

  function startEditing(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <div className="app">
      <h1 className="app-title">Class Notes</h1>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form className="note-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note"
          rows="5"
          required
        />
        <div className="form-actions">
          {editingId !== null && (
            <button type="button" className="cancel-btn" onClick={cancelEditing}>
              Cancel
            </button>
          )}
          <button type="submit">
            {editingId !== null ? "Update Note" : "Save Note"}
          </button>
        </div>
      </form>

      <section className="notes-section">
        <h2>Saved Notes</h2>
        {notes.length === 0 ? (
          <p className="empty-message">No notes have been added yet.</p>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <article
                className={`note-card ${note.id === editingId ? "editing" : ""}`}
                key={note.id}
              >
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-footer">
                  <small>{formatDate(note.created_at)}</small>
                  <div className="note-actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => startEditing(note)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
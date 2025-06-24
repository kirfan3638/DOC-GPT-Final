const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const notesFile = path.join(__dirname, 'notes.json');

function loadNotes() {
  if (fs.existsSync(notesFile)) {
    return JSON.parse(fs.readFileSync(notesFile));
  }
  return [];
}

function saveNotes(notes) {
  fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

app.post('/notes', (req, res) => {
  const { note, timestamp } = req.body;
  if (!note || !timestamp) {
    return res.status(400).json({ error: 'Missing note or timestamp' });
  }
  const notes = loadNotes();
  notes.push({ note, timestamp, received: new Date().toISOString() });
  saveNotes(notes);
  res.json({ status: 'saved' });
});

app.get('/notes', (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

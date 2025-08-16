let notes = []
let editingNoteId = null

function loadNotes() {
  const savedNotes = localStorage.getItem('quickNotes')
  return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event) {
  event.preventDefault()

  const title = document.getElementById('noteTitle').value.trim()
  const content = document.getElementById('noteContent').value.trim()

  if (!title && !content) return alert("Please enter a title or content")

  const now = new Date()
  const timestamp = now.toLocaleString() // e.g., "8/15/2025, 10:30 AM"

  if (editingNoteId) {
    // Update existing note
    const noteIndex = notes.findIndex(note => note.id === editingNoteId)
    notes[noteIndex] = { ...notes[noteIndex], title, content, timestamp }
  } else {
    // Add new note
    notes.unshift({ id: generateId(), title, content, timestamp })
  }

  closeNoteDialog()
  saveNotes()
  renderNotes()
}

function generateId() {
  return Date.now().toString()
}

function saveNotes() {
  localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId) {
  if (!confirm("Are you sure you want to delete this note?")) return
  notes = notes.filter(note => note.id != noteId)
  saveNotes()
  renderNotes()
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer')
  const emptyState = document.getElementById('emptyState')
  const template = document.getElementById('noteTemplate')

  if (notes.length === 0) {
    emptyState.style.display = 'block'
    notesContainer.innerHTML = ''
    return
  } else {
    emptyState.style.display = 'none'
    notesContainer.innerHTML = ''
  }

  notes.forEach(note => {
    const noteClone = template.content.cloneNode(true)
    noteClone.querySelector('.note-title').textContent = note.title
    noteClone.querySelector('.note-content').textContent = note.content

    // Add timestamp element
    const timestampEl = document.createElement('div')
    timestampEl.className = 'note-timestamp'
    timestampEl.textContent = note.timestamp
    noteClone.querySelector('.note-content').after(timestampEl)

    // Edit button
    noteClone.querySelector('.edit-btn').addEventListener('click', () => openNoteDialog(note.id))

    // Delete button
    noteClone.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id))

    notesContainer.appendChild(noteClone)
  })
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById('noteDialog')
  const titleInput = document.getElementById('noteTitle')
  const contentInput = document.getElementById('noteContent')

  if (noteId) {
    const noteToEdit = notes.find(note => note.id === noteId)
    editingNoteId = noteId
    document.getElementById('dialogTitle').textContent = 'Edit Note'
    titleInput.value = noteToEdit.title
    contentInput.value = noteToEdit.content
  } else {
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Add New Note'
    titleInput.value = ''
    contentInput.value = ''
  }

  dialog.showModal()
  titleInput.focus()
}

function closeNoteDialog() {
  document.getElementById('noteDialog').close()
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

function applyStoredTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme')
    document.getElementById('themeToggleBtn').textContent = '☀️'
  }
}

document.addEventListener('DOMContentLoaded', function() {
  applyStoredTheme()
  notes = loadNotes()
  renderNotes()

  document.getElementById('noteForm').addEventListener('submit', saveNote)
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)
  
  // Open note dialog when Add Notes button is clicked
  document.querySelector('.add-note-btn').addEventListener('click', () => openNoteDialog())

  // Close dialog if clicked outside
  document.getElementById('noteDialog').addEventListener('click', function(event) {
    if (event.target === this) closeNoteDialog()
  })
})

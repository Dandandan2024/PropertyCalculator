// Demo version - Works without Supabase setup
// Use this file to test the app locally before setting up Supabase

// Global variables
let currentUser = { id: 'demo-user' };
let notes = [];
let editingNoteId = null;

// DOM elements
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNote');
const clearNoteBtn = document.getElementById('clearNote');
const searchInput = document.getElementById('searchNotes');
const notesList = document.getElementById('notesList');
const loadingIndicator = document.getElementById('loadingIndicator');
const noNotesMessage = document.getElementById('noNotesMessage');
const noteModal = document.getElementById('noteModal');
const editNoteTitle = document.getElementById('editNoteTitle');
const editNoteContent = document.getElementById('editNoteContent');
const updateNoteBtn = document.getElementById('updateNote');
const deleteNoteBtn = document.getElementById('deleteNote');
const closeModalBtn = document.getElementById('closeModal');
const cancelEditBtn = document.getElementById('cancelEdit');

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
saveNoteBtn.addEventListener('click', saveNote);
clearNoteBtn.addEventListener('click', clearNoteForm);
searchInput.addEventListener('input', debounce(handleSearch, 300));
closeModalBtn.addEventListener('click', closeModal);
cancelEditBtn.addEventListener('click', closeModal);
updateNoteBtn.addEventListener('click', updateNote);
deleteNoteBtn.addEventListener('click', deleteNote);

// Initialize the application
async function initializeApp() {
    try {
        // Load demo notes from localStorage
        await loadNotes();
        showToast('Demo mode: Notes are stored locally in your browser', 'info');
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error initializing app.', 'error');
    }
}

// Load notes from localStorage
async function loadNotes() {
    try {
        showLoading(true);
        
        // Load from localStorage for demo
        const storedNotes = localStorage.getItem('demo-notes');
        notes = storedNotes ? JSON.parse(storedNotes) : [];
        
        // Add some demo notes if none exist
        if (notes.length === 0) {
            notes = [
                {
                    id: 'demo-1',
                    title: 'Welcome to Your Notebook!',
                    content: 'This is a demo note. You can edit, delete, and create new notes. All data is stored locally in your browser for this demo.',
                    user_id: currentUser.id,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'demo-2',
                    title: 'Getting Started',
                    content: 'To use this app with real cloud storage:\n1. Set up a Supabase account\n2. Update config.js with your credentials\n3. Replace script-demo.js with script.js\n4. Deploy your app!',
                    user_id: currentUser.id,
                    created_at: new Date(Date.now() - 3600000).toISOString()
                }
            ];
            saveNotesToStorage();
        }
        
        renderNotes();
        showLoading(false);
        
        if (notes.length === 0) {
            showNoNotesMessage(true);
        } else {
            showNoNotesMessage(false);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Error loading notes. Please try again.', 'error');
        showLoading(false);
    }
}

// Save notes to localStorage
function saveNotesToStorage() {
    localStorage.setItem('demo-notes', JSON.stringify(notes));
}

// Save a new note
async function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title || !content) {
        showToast('Please enter both title and content.', 'error');
        return;
    }
    
    try {
        saveNoteBtn.disabled = true;
        saveNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        // Create new note
        const newNote = {
            id: 'note-' + Date.now(),
            title,
            content,
            user_id: currentUser.id,
            created_at: new Date().toISOString()
        };
        
        // Add to local array
        notes.unshift(newNote);
        saveNotesToStorage();
        renderNotes();
        
        // Clear form
        clearNoteForm();
        
        showToast('Note saved successfully!', 'success');
        showNoNotesMessage(false);
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Error saving note. Please try again.', 'error');
    } finally {
        saveNoteBtn.disabled = false;
        saveNoteBtn.innerHTML = '<i class="fas fa-save"></i> Save Note';
    }
}

// Update an existing note
async function updateNote() {
    const title = editNoteTitle.value.trim();
    const content = editNoteContent.value.trim();
    
    if (!title || !content) {
        showToast('Please enter both title and content.', 'error');
        return;
    }
    
    try {
        updateNoteBtn.disabled = true;
        updateNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        
        // Update local note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = title;
            notes[noteIndex].content = content;
            notes[noteIndex].updated_at = new Date().toISOString();
            saveNotesToStorage();
        }
        
        renderNotes();
        closeModal();
        showToast('Note updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating note:', error);
        showToast('Error updating note. Please try again.', 'error');
    } finally {
        updateNoteBtn.disabled = false;
        updateNoteBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    }
}

// Delete a note
async function deleteNote() {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }
    
    try {
        deleteNoteBtn.disabled = true;
        deleteNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        
        // Remove note from local array
        notes = notes.filter(note => note.id !== editingNoteId);
        saveNotesToStorage();
        renderNotes();
        
        closeModal();
        showToast('Note deleted successfully!', 'success');
        
        if (notes.length === 0) {
            showNoNotesMessage(true);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Error deleting note. Please try again.', 'error');
    } finally {
        deleteNoteBtn.disabled = false;
        deleteNoteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    }
}

// Render notes in the UI
function renderNotes() {
    if (notes.length === 0) {
        notesList.innerHTML = '';
        return;
    }
    
    notesList.innerHTML = notes.map(note => `
        <div class="note-card" onclick="openEditModal('${note.id}')">
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-meta">
                <span>${formatDate(note.created_at)}</span>
                <div class="note-actions-menu">
                    <button class="action-btn" onclick="event.stopPropagation(); openEditModal('${note.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); deleteNoteById('${note.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open edit modal
function openEditModal(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    editingNoteId = noteId;
    editNoteTitle.value = note.title;
    editNoteContent.value = note.content;
    
    noteModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    noteModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    editingNoteId = null;
    editNoteTitle.value = '';
    editNoteContent.value = '';
}

// Delete note by ID (for direct deletion from card)
async function deleteNoteById(noteId) {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Remove note from local array
        notes = notes.filter(note => note.id !== noteId);
        saveNotesToStorage();
        renderNotes();
        
        showToast('Note deleted successfully!', 'success');
        
        if (notes.length === 0) {
            showNoNotesMessage(true);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Error deleting note. Please try again.', 'error');
    }
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderNotes();
        return;
    }
    
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredNotes(filteredNotes);
}

// Render filtered notes
function renderFilteredNotes(filteredNotes) {
    if (filteredNotes.length === 0) {
        notesList.innerHTML = `
            <div class="no-notes">
                <i class="fas fa-search"></i>
                <p>No notes found matching "${escapeHtml(searchInput.value)}"</p>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = filteredNotes.map(note => `
        <div class="note-card" onclick="openEditModal('${note.id}')">
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-meta">
                <span>${formatDate(note.created_at)}</span>
                <div class="note-actions-menu">
                    <button class="action-btn" onclick="event.stopPropagation(); openEditModal('${note.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); deleteNoteById('${note.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Clear note form
function clearNoteForm() {
    noteTitleInput.value = '';
    noteContentInput.value = '';
    noteTitleInput.focus();
}

// Show/hide loading indicator
function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
        notesList.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        notesList.classList.remove('hidden');
    }
}

// Show/hide no notes message
function showNoNotesMessage(show) {
    if (show) {
        noNotesMessage.classList.remove('hidden');
        notesList.classList.add('hidden');
    } else {
        noNotesMessage.classList.add('hidden');
        notesList.classList.remove('hidden');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    // Show the toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
        }
        return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Close modal when clicking outside
noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !noteModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Make functions globally available for onclick handlers
window.openEditModal = openEditModal;
window.deleteNoteById = deleteNoteById;
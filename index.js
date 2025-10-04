// Register Service Worker
if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.register("/sw.js").then(function (reg) {
        console.log("Service worker has been registered for scope: " + reg.scope);
    });
}

// DOM Elements
const body = document.getElementById("body");
const textarea = document.getElementById("notes");
const menu = document.getElementById("menu");
const menuIcon = document.getElementById("menu-icon");
const tabList = document.getElementById("tab-list");
const newNoteBtn = document.getElementById("new-note-btn");
const themeSelect = document.getElementById("theme-select");
const fontSizeSelect = document.getElementById("font-size-select");
const fontStyleSelect = document.getElementById("font-style-select");

// App State
let notes = [];
let activeNoteId = null;
let menuRotated = false;

// --- INITIALIZATION ---
function initializeApp() {
    loadNotes();
    loadSettings();
    renderUI();
    addEventListeners();
};

function loadNotes() {
    const savedNotes = localStorage.getItem("notes");
    notes = savedNotes ? JSON.parse(savedNotes) : [];
    
    // If no notes exist, create a default one
    if (notes.length === 0) {
        const newNote = createNoteObject("Untitled Note");
        notes.push(newNote);
        activeNoteId = newNote.id;
        saveState();
    } else {
        const savedActiveId = localStorage.getItem("activeNoteId");
        // Check if the saved active ID is valid
        activeNoteId = notes.some(note => note.id == savedActiveId) ? savedActiveId : notes[0].id;
    }
}

function loadSettings() {
    const theme = localStorage.getItem("theme") || "light";
    const fontSize = localStorage.getItem("font-size") || "large";
    const fontFamily = localStorage.getItem("font-family") || "system-ui";

    themeSelect.value = theme;
    document.documentElement.style.setProperty('--font-size', fontSize);
    fontSizeSelect.value = fontSize;
    document.documentElement.style.setProperty('--font-family', fontFamily);
    fontStyleSelect.value = fontFamily;

    // Apply theme without triggering the change function
    body.className = `body-${theme}`;
}

// --- UI RENDERING ---
function renderUI() {
    renderTabs();
    renderActiveNote();
}

function renderTabs() {
    tabList.innerHTML = ""; // Clear existing tabs
    notes.forEach(note => {
        const tab = document.createElement("li");
        tab.dataset.id = note.id;
        tab.textContent = note.title;
        tab.className = note.id == activeNoteId ? "active" : "";

        const closeBtn = document.createElement("span");
        closeBtn.textContent = "×";
        closeBtn.className = "close-tab-btn";
        closeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent tab selection when clicking close
            deleteNote(note.id);
        };
        
        tab.appendChild(closeBtn);
        tabList.appendChild(tab);
    });
}

function renderActiveNote() {
    const activeNote = notes.find(note => note.id == activeNoteId);
    if (activeNote) {
        textarea.value = activeNote.content;
    } else {
        textarea.value = ""; // Clear textarea if no active note
    }
}

// --- EVENT LISTENERS ---
function addEventListeners() {
    newNoteBtn.addEventListener("click", addNewNote);
    textarea.addEventListener("keyup", updateNoteContent);
    tabList.addEventListener("click", handleTabClick);
    tabList.addEventListener("dblclick", handleTabDoubleClick);
}

// --- ACTIONS ---
function addNewNote() {
    const newNote = createNoteObject(`Untitled Note ${notes.length + 1}`);
    notes.push(newNote);
    activeNoteId = newNote.id;
    saveAndRender();
    textarea.focus();
}

function deleteNote(idToDelete) {
    // Prevent deleting the last note
    if (notes.length <= 1) {
        alert("You cannot delete the last note.");
        return;
    }

    if (confirm("Are you sure you want to delete this note?")) {
        notes = notes.filter(note => note.id != idToDelete);
        // If the deleted note was the active one, switch to the first available note
        if (activeNoteId == idToDelete) {
            activeNoteId = notes[0].id;
        }
        saveAndRender();
    }
}

function updateNoteContent() {
    const activeNote = notes.find(note => note.id == activeNoteId);
    if (activeNote) {
        activeNote.content = textarea.value;
        saveState(); // Only save, no need to re-render the entire UI
    }
}

function handleTabClick(e) {
    if (e.target.tagName === 'LI') {
        const newActiveId = e.target.dataset.id;
        if (newActiveId !== activeNoteId) {
            activeNoteId = newActiveId;
            saveAndRender();
        }
    }
}

function handleTabDoubleClick(e) {
     if (e.target.tagName === 'LI') {
        const noteId = e.target.dataset.id;
        const note = notes.find(n => n.id == noteId);
        if (note) {
            const newTitle = prompt("Enter a new name for the note:", note.title);
            if (newTitle && newTitle.trim() !== "") {
                note.title = newTitle.trim();
                saveAndRender();
            }
        }
    }
}

// --- SETTINGS & MENU ---
function toggleMenu() {
    menuRotated = !menuRotated;
    menuIcon.style.animationName = menuRotated ? "rotate-open" : "rotate-close";
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function themeChange() {
    const theme = themeSelect.value;
    body.className = `body-${theme}`;
    localStorage.setItem("theme", theme);
}

function fontSizeChange() {
    const size = fontSizeSelect.value;
    document.documentElement.style.setProperty('--font-size', size);
    localStorage.setItem("font-size", size);
}

function fontFamilyChange() {
    const family = fontStyleSelect.value;
    document.documentElement.style.setProperty('--font-family', family);
    localStorage.setItem("font-family", family);
}

// --- HELPERS & STATE MANAGEMENT ---
function createNoteObject(title) {
    return {
        id: Date.now().toString(),
        title: title,
        content: ""
    };
}

function saveState() {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("activeNoteId", activeNoteId);
}

function saveAndRender() {
    saveState();
    renderUI();
}

initializeApp();
const STORAGE_KEY = "task-tracker-v1";
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const list = document.querySelector("#task-list");
const count = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const formMessage = document.querySelector("#form-message");
const storageMessage = document.querySelector("#storage-message");

let tasks = [];
let storageReady = true;

function showStorageError(message) {
  storageMessage.textContent = message;
  storageMessage.classList.add("error");
}

// Validate saved data before using it. Never replace unreadable data silently.
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(task =>
      task !== null && typeof task === "object" &&
      typeof task.id === "string" && task.id.length > 0 &&
      typeof task.title === "string" && task.title.trim().length > 0 &&
      typeof task.completed === "boolean"
    ) || new Set(parsed.map(task => task.id)).size !== parsed.length) {
      throw new Error("Invalid saved tasks");
    }
    tasks = parsed;
  } catch {
    storageReady = false;
    showStorageError("Could not load saved tasks. Changes are disabled to protect stored data. Check browser storage settings or use another browser.");
  }
}

// Save first. If storage fails, keep the previously displayed task list.
function saveTasks(nextTasks) {
  if (!storageReady) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    tasks = nextTasks;
    storageMessage.textContent = "Saved in this browser. Clearing browser data removes saved tasks.";
    storageMessage.classList.remove("error");
    renderTasks();
    return true;
  } catch {
    showStorageError("Could not save this change. Your task list has not changed. Check browser storage settings and try again.");
    return false;
  }
}

function renderTasks() {
  list.replaceChildren();
  for (const task of tasks) {
    const row = document.createElement("li");
    row.className = task.completed ? "task completed" : "task";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      const saved = saveTasks(tasks.map(item =>
        item.id === task.id ? { ...item, completed: checkbox.checked } : item
      ));
      if (!saved) checkbox.checked = task.completed;
      else list.children[tasks.findIndex(item => item.id === task.id)].querySelector("input").focus();
    });

    const title = document.createElement("span");
    title.textContent = task.title;
    label.append(checkbox, title);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.title}`);
    deleteButton.addEventListener("click", () => {
      const index = tasks.findIndex(item => item.id === task.id);
      if (saveTasks(tasks.filter(item => item.id !== task.id))) {
        const nextRow = list.children[Math.min(index, tasks.length - 1)];
        if (nextRow) nextRow.querySelector("button").focus();
        else titleInput.focus();
      }
    });

    row.append(label, deleteButton);
    list.append(row);
  }
  emptyMessage.hidden = tasks.length > 0;
  count.textContent = `${tasks.filter(task => task.completed).length} of ${tasks.length} completed`;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    formMessage.textContent = "Enter a task title first.";
    formMessage.classList.add("error");
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return;
  }
  const task = { id: crypto.randomUUID(), title, completed: false };
  if (saveTasks([...tasks, task])) {
    titleInput.value = "";
    titleInput.removeAttribute("aria-invalid");
    formMessage.classList.remove("error");
    formMessage.textContent = "Task added.";
    titleInput.focus();
  }
});

loadTasks();
renderTasks();
if (!storageReady) {
  titleInput.disabled = true;
  form.querySelector("button").disabled = true;
  emptyMessage.textContent = "Saved tasks could not be loaded.";
}

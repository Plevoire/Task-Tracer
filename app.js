const STORAGE_KEY = "task-tracker-v1";
const DEFAULT_CATEGORIES = ["Uncategorized", "School", "Home", "Personal"];
const PRIORITIES = ["Low", "Normal", "High"];
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const categoryInput = document.querySelector("#task-category");
const priorityInput = document.querySelector("#task-priority");
const dueDateInput = document.querySelector("#task-due-date");
const statusFilter = document.querySelector("#status-filter");
const categoryFilter = document.querySelector("#category-filter");
const list = document.querySelector("#task-list");
const count = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const formMessage = document.querySelector("#form-message");
const storageMessage = document.querySelector("#storage-message");
const viewMessage = document.querySelector("#view-message");
const categoryForm = document.querySelector("#category-form");
const categoryName = document.querySelector("#category-name");
const categoryMessage = document.querySelector("#category-message");

let tasks = [];
let categories = [...DEFAULT_CATEGORIES];
let storageReady = true;
let editingId = null;

function fillPriorities(select) {
  for (const priority of PRIORITIES) {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    select.append(option);
  }
  select.value = "Normal";
}

// Check date-only strings without UTC conversion or automatic date rollover.
function validDueDate(value) {
  if (value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

function localToday() {
  const date = new Date();
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function validateTaskForm(title, category, priority, dueDate, feedback) {
  for (const field of [title, category, priority, dueDate]) field.removeAttribute("aria-invalid");
  let field;
  let message;
  if (!title.value.trim()) {
    field = title;
    message = "Enter a task title first.";
  } else if (!categories.includes(category.value)) {
    field = category;
    message = "Choose a valid category.";
  } else if (!PRIORITIES.includes(priority.value)) {
    field = priority;
    message = "Choose a valid priority.";
  } else if (!validDueDate(dueDate.value) || !dueDate.validity.valid) {
    field = dueDate;
    message = "Choose a valid due date or leave it blank.";
  }
  if (!field) return true;
  feedback.textContent = message;
  feedback.classList.add("error");
  field.setAttribute("aria-invalid", "true");
  field.focus();
  return false;
}

function fillCategories(select, includeAll = false) {
  const previous = select.value;
  select.replaceChildren();
  if (includeAll) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "All categories";
    select.append(option);
  }
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.append(option);
  }
  select.value = categories.includes(previous) ? previous : includeAll ? "" : "Uncategorized";
}

function showStorageError(message) {
  storageMessage.textContent = message;
  storageMessage.classList.add("error");
}

// Missing legacy categories get a default in memory. Loading never writes.
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return;
    const parsed = JSON.parse(saved);
    const legacy = Array.isArray(parsed);
    if (!legacy && (parsed === null || typeof parsed !== "object" || parsed.version !== 1)) {
      throw new Error("Unsupported saved format");
    }
    const loadedCategories = legacy ? [...DEFAULT_CATEGORIES] : parsed.categories;
    const loadedTasks = legacy ? parsed : parsed.tasks;
    if (!Array.isArray(loadedCategories) || !loadedCategories.every(name =>
      typeof name === "string" && name.length > 0 && name === name.trim()
    ) || !loadedCategories.includes("Uncategorized") ||
      new Set(loadedCategories.map(name => name.toLowerCase())).size !== loadedCategories.length) {
      throw new Error("Invalid saved categories");
    }
    if (!Array.isArray(loadedTasks) || !loadedTasks.every(task =>
      task !== null && typeof task === "object" &&
      typeof task.id === "string" && task.id.length > 0 &&
      typeof task.title === "string" && task.title.trim().length > 0 &&
      typeof task.completed === "boolean" &&
      ((legacy && task.category === undefined) || loadedCategories.includes(task.category)) &&
      (task.priority === undefined || PRIORITIES.includes(task.priority)) &&
      (task.dueDate === undefined || validDueDate(task.dueDate))
    ) || new Set(loadedTasks.map(task => task.id)).size !== loadedTasks.length) {
      throw new Error("Invalid saved tasks");
    }
    tasks = loadedTasks.map(task => ({
      ...task, category: task.category ?? "Uncategorized",
      priority: task.priority ?? "Normal", dueDate: task.dueDate ?? ""
    }));
    categories = loadedCategories;
  } catch {
    storageReady = false;
    showStorageError("Could not load saved tasks. Changes are disabled to protect stored data. Check browser storage settings or use another browser.");
  }
}

// One storage write saves the full task list and category list together.
function saveData(nextTasks, nextCategories = categories) {
  if (!storageReady) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: nextTasks, categories: nextCategories }));
  } catch {
    showStorageError("Could not save this change. Your saved tasks and categories have not changed. Check browser storage settings and try again.");
    return false;
  }
  tasks = nextTasks;
  categories = nextCategories;
  fillCategories(categoryInput);
  fillCategories(categoryFilter, true);
  storageMessage.textContent = "Saved in this browser. Clearing browser data removes saved tasks.";
  storageMessage.classList.remove("error");
  renderTasks();
  return true;
}

function visibleTasks() {
  return tasks.filter(task =>
    (statusFilter.value === "all" || task.completed === (statusFilter.value === "completed")) &&
    (categoryFilter.value === "" || task.category === categoryFilter.value)
  );
}

// Find the same task by ID, or a neighbor when that task leaves the view.
function restoreFocus(taskId, selector, previousIndex) {
  const rows = Array.from(list.children);
  const sameRow = rows.find(row => row.dataset.taskId === taskId);
  const targetRow = sameRow || rows[Math.min(previousIndex, rows.length - 1)];
  if (targetRow) targetRow.querySelector(selector).focus();
  else titleInput.focus();
}

function createEditor(task, index) {
  const editor = document.createElement("form");
  editor.className = "task-editor";
  editor.noValidate = true;
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Edit task title";
  const input = document.createElement("input");
  input.type = "text";
  input.id = `edit-title-${task.id}`;
  input.value = task.title;
  titleLabel.htmlFor = input.id;
  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Edit category";
  const category = document.createElement("select");
  category.id = `edit-category-${task.id}`;
  categoryLabel.htmlFor = category.id;
  fillCategories(category);
  category.value = task.category;
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Edit priority";
  const priority = document.createElement("select");
  priority.className = "edit-priority";
  priority.id = `edit-priority-${task.id}`;
  priorityLabel.htmlFor = priority.id;
  fillPriorities(priority);
  priority.value = task.priority;
  const dueLabel = document.createElement("label");
  dueLabel.textContent = "Edit due date, optional";
  const dueDate = document.createElement("input");
  dueDate.type = "date";
  dueDate.className = "edit-due-date";
  dueDate.id = `edit-due-${task.id}`;
  dueDate.min = "0001-01-01";
  dueDate.max = "9999-12-31";
  dueDate.value = task.dueDate;
  dueLabel.htmlFor = dueDate.id;
  const feedback = document.createElement("p");
  feedback.id = `edit-message-${task.id}`;
  feedback.className = "message";
  feedback.setAttribute("role", "status");
  feedback.textContent = "Save or cancel this edit to use other controls.";
  input.setAttribute("aria-describedby", feedback.id);
  category.setAttribute("aria-describedby", feedback.id);
  priority.setAttribute("aria-describedby", feedback.id);
  dueDate.setAttribute("aria-describedby", feedback.id);
  const actions = document.createElement("div");
  actions.className = "task-actions";
  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "cancel-button";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", () => {
    editingId = null;
    renderTasks();
    restoreFocus(task.id, ".edit-button", index);
    formMessage.textContent = "Edit cancelled. No changes saved.";
  });
  editor.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateTaskForm(input, category, priority, dueDate, feedback)) return;
    const title = input.value.trim();
    editingId = null;
    if (saveData(tasks.map(item => item.id === task.id ? {
      ...item, title, category: category.value, priority: priority.value, dueDate: dueDate.value
    } : item))) {
      restoreFocus(task.id, ".edit-button", index);
      formMessage.textContent = "Task updated.";
    } else {
      editingId = task.id;
      feedback.textContent = "Could not save. Your draft is still here. Retry Save or Cancel.";
      feedback.classList.add("error");
      input.focus();
    }
  });
  actions.append(save, cancel);
  editor.append(titleLabel, input, categoryLabel, category, priorityLabel, priority, dueLabel, dueDate, feedback, actions);
  return editor;
}

function renderTasks() {
  list.replaceChildren();
  const visible = visibleTasks();
  const today = localToday();
  visible.forEach((task, index) => {
    const row = document.createElement("li");
    row.dataset.taskId = task.id;
    row.className = task.completed ? "task completed" : "task";
    if (editingId === task.id) {
      row.append(createEditor(task, index));
    } else {
      const details = document.createElement("div");
      details.className = "task-details";
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.disabled = editingId !== null;
      checkbox.addEventListener("change", () => {
        if (!saveData(tasks.map(item => item.id === task.id ? { ...item, completed: checkbox.checked } : item))) {
          checkbox.checked = task.completed;
        } else restoreFocus(task.id, "input", index);
      });
      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;
      const category = document.createElement("span");
      category.className = "task-category";
      category.textContent = task.category;
      const priority = document.createElement("span");
      priority.className = "task-priority";
      priority.textContent = `Priority: ${task.priority}`;
      const dueDate = document.createElement("span");
      const overdue = !task.completed && task.dueDate !== "" && task.dueDate < today;
      dueDate.className = overdue ? "task-due-date overdue" : "task-due-date";
      dueDate.textContent = task.dueDate ? `${overdue ? "Overdue" : "Due"}: ${task.dueDate}` : "No due date";
      label.append(checkbox, title);
      details.append(label, category, priority, dueDate);
      const actions = document.createElement("div");
      actions.className = "task-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "edit-button";
      edit.textContent = "Edit";
      edit.disabled = editingId !== null;
      edit.setAttribute("aria-label", `Edit task: ${task.title}`);
      edit.addEventListener("click", () => {
        editingId = task.id;
        renderTasks();
        restoreFocus(task.id, "input", index);
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-button";
      remove.textContent = "Delete";
      remove.disabled = editingId !== null;
      remove.setAttribute("aria-label", `Delete task: ${task.title}`);
      remove.addEventListener("click", () => {
        if (saveData(tasks.filter(item => item.id !== task.id))) {
          restoreFocus(task.id, ".delete-button", index);
          formMessage.textContent = "Task deleted.";
        }
      });
      actions.append(edit, remove);
      row.append(details, actions);
    }
    list.append(row);
  });
  emptyMessage.hidden = visible.length > 0;
  emptyMessage.textContent = !storageReady ? "Saved tasks could not be loaded." : tasks.length === 0
    ? "No tasks yet. Add a sample task to get started." : "No matching tasks. Try another filter.";
  count.textContent = `${tasks.filter(task => task.completed).length} of ${tasks.length} completed`;
  viewMessage.textContent = `${visible.length} of ${tasks.length} tasks shown.`;
  const paused = editingId !== null || !storageReady;
  titleInput.disabled = paused;
  categoryInput.disabled = paused;
  priorityInput.disabled = paused;
  dueDateInput.disabled = paused;
  form.querySelector("button").disabled = paused;
  statusFilter.disabled = paused;
  categoryFilter.disabled = paused;
  categoryName.disabled = paused;
  categoryForm.querySelector("button").disabled = paused;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (editingId !== null || !storageReady) return;
  if (!validateTaskForm(titleInput, categoryInput, priorityInput, dueDateInput, formMessage)) return;
  const task = {
    id: crypto.randomUUID(), title: titleInput.value.trim(), completed: false,
    category: categoryInput.value, priority: priorityInput.value, dueDate: dueDateInput.value
  };
  if (saveData([...tasks, task])) {
    titleInput.value = "";
    dueDateInput.value = "";
    titleInput.removeAttribute("aria-invalid");
    formMessage.classList.remove("error");
    formMessage.textContent = "Task added. If it is hidden, change your filters to see it.";
    titleInput.focus();
  }
});

categoryForm.addEventListener("submit", event => {
  event.preventDefault();
  if (editingId !== null || !storageReady) return;
  const name = categoryName.value.trim();
  const duplicate = categories.some(category => category.toLowerCase() === name.toLowerCase());
  if (!name || duplicate) {
    categoryMessage.textContent = !name ? "Enter a category name first." : "That category already exists. Choose another name.";
    categoryMessage.classList.add("error");
    categoryName.setAttribute("aria-invalid", "true");
    categoryName.focus();
    return;
  }
  if (saveData(tasks, [...categories, name])) {
    categoryInput.value = name;
    categoryName.value = "";
    categoryName.removeAttribute("aria-invalid");
    categoryMessage.classList.remove("error");
    categoryMessage.textContent = `Category "${name}" added and selected for new tasks.`;
  } else {
    categoryMessage.classList.add("error");
    categoryMessage.textContent = "Could not save category. Your name is still here; try again.";
  }
  categoryName.focus();
});

for (const filter of [statusFilter, categoryFilter]) {
  filter.addEventListener("change", renderTasks);
}
loadData();
fillCategories(categoryInput);
fillCategories(categoryFilter, true);
fillPriorities(priorityInput);
categoryInput.value = "Uncategorized";
statusFilter.value = "all";
categoryFilter.value = "";
renderTasks();

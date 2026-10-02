// Uses Node's built-in test runner. This simulates DOM/storage, not a browser.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { randomUUID } = require("node:crypto");
const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const key = "task-tracker-v1";

class Element {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.dataset = {};
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name)
    };
    this.value = "";
    this.textContent = "";
    this.checked = false;
    this.disabled = false;
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { Element.active = this; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  dispatch(name) { this.listeners[name]({ preventDefault() {} }); }
  querySelector(tag) {
    for (const child of this.children) {
      if (tag.startsWith(".") ? (child.className || "").split(" ").includes(tag.slice(1)) : child.tag === tag) return child;
      const found = child.querySelector(tag);
      if (found) return found;
    }
    return null;
  }
}

function storage(initial = {}) {
  return {
    data: new Map(Object.entries(initial)),
    failRead: false,
    failWrite: false,
    getItem(name) {
      if (this.failRead) throw new Error("Read denied");
      return this.data.has(name) ? this.data.get(name) : null;
    },
    setItem(name, value) {
      if (this.failWrite) throw new Error("Quota exceeded");
      this.data.set(name, value);
    }
  };
}

function openApp(saved = storage()) {
  const elements = {};
  for (const [id, tag] of Object.entries({
    "task-form": "form", "task-title": "input", "task-list": "ul",
    "task-count": "p", "empty-message": "p", "form-message": "p", "storage-message": "p",
    "task-category": "select", "status-filter": "select", "category-filter": "select", "view-message": "p"
  })) elements[id] = new Element(tag);
  elements["task-form"].append(new Element("button"));
  vm.runInNewContext(source, {
    document: {
      querySelector: selector => elements[selector.slice(1)],
      createElement: tag => new Element(tag)
    },
    localStorage: saved,
    crypto: { randomUUID }
  });
  return {
    elements, saved,
    rows: () => elements["task-list"].children,
    focused: () => Element.active,
    add(title, category = "Uncategorized") {
      elements["task-title"].value = title;
      elements["task-category"].value = category;
      elements["task-form"].dispatch("submit");
    },
    toggle(index, completed) {
      const checkbox = elements["task-list"].children[index].querySelector("input");
      checkbox.checked = completed;
      checkbox.dispatch("change");
    },
    delete(index) {
      elements["task-list"].children[index].querySelector(".delete-button").dispatch("click");
    },
    filter(status, category = "all") {
      elements["status-filter"].value = status;
      elements["category-filter"].value = category;
      elements["status-filter"].dispatch("change");
    },
    edit(index) {
      elements["task-list"].children[index].querySelector(".edit-button").dispatch("click");
      return elements["task-list"].children[index].querySelector("form");
    },
    readSaved: () => JSON.parse(saved.getItem(key))
  };
}

test("add trims title; blank titles rejected; task text is literal", () => {
  const app = openApp();
  app.add("   ");
  assert.equal(app.rows().length, 0);
  assert.match(app.elements["form-message"].textContent, /Enter a task title/);
  app.add("  Read chapter 1  ");
  assert.equal(app.rows().length, 1);
  assert.equal(app.elements["task-title"].value, "");
  assert.equal(app.readSaved()[0].title, "Read chapter 1");
  assert.equal(app.readSaved()[0].completed, false);
  app.add('<img src=x onerror="alert(1)">');
  const title = app.rows()[1].querySelector("span");
  assert.equal(title.textContent, '<img src=x onerror="alert(1)">');
  assert.equal(title.children.length, 0);
});

test("complete/incomplete state and saved mutations survive a new app load", () => {
  const app = openApp();
  app.add("Read chapter 1");
  app.add("Practice JavaScript");
  app.toggle(0, true);
  assert.equal(app.rows()[0].className, "task completed");
  assert.equal(app.elements["task-count"].textContent, "1 of 2 completed");
  const reopened = openApp(app.saved);
  assert.equal(reopened.rows().length, 2);
  assert.equal(reopened.rows()[0].querySelector("input").checked, true);
  reopened.toggle(0, false);
  assert.equal(reopened.readSaved()[0].completed, false);
  assert.equal(reopened.rows()[0].className, "task");
  reopened.delete(1);
  assert.equal(openApp(app.saved).rows().length, 1);
});

test("duplicate titles delete independently; empty list persists; unrelated key preserved", () => {
  const saved = storage({ "another-app": "preserve me" });
  const app = openApp(saved);
  app.add("Sample task");
  app.add("Sample task");
  const secondId = app.readSaved()[1].id;
  assert.notEqual(app.readSaved()[0].id, secondId);
  app.delete(0);
  assert.equal(app.readSaved()[0].id, secondId);
  app.delete(0);
  assert.deepEqual(app.readSaved(), []);
  assert.equal(app.elements["empty-message"].hidden, false);
  assert.equal(openApp(saved).rows().length, 0);
  assert.equal(saved.getItem("another-app"), "preserve me");
});

test("failed saves leave visible and stored state unchanged; retry succeeds", () => {
  const app = openApp();
  app.add("Sample task");
  const before = app.saved.getItem(key);
  app.saved.failWrite = true;
  app.toggle(0, true);
  assert.equal(app.rows()[0].querySelector("input").checked, false);
  app.delete(0);
  app.add("Unsaved task");
  assert.equal(app.rows().length, 1);
  assert.equal(app.saved.getItem(key), before);
  assert.match(app.elements["storage-message"].textContent, /Could not save/);
  assert.equal(app.elements["task-title"].value, "Unsaved task");
  app.saved.failWrite = false;
  app.add("Saved task");
  assert.equal(app.rows().length, 2);
});

test("malformed or invalid saved data is preserved and mutations disabled", () => {
  for (const raw of ["broken JSON", "null", "{}", '[{"id":"x","title":"","completed":false}]',
    '[{"id":"x","title":"A","completed":false},{"id":"x","title":"B","completed":true}]']) {
    const saved = storage({ [key]: raw });
    const app = openApp(saved);
    assert.equal(app.elements["task-title"].disabled, true);
    assert.equal(app.elements["task-form"].querySelector("button").disabled, true);
    assert.match(app.elements["storage-message"].textContent, /Could not load/);
    assert.equal(saved.getItem(key), raw);
  }
});

test("blocked storage reads show a load error", () => {
  const saved = storage();
  saved.failRead = true;
  const app = openApp(saved);
  assert.equal(app.elements["task-title"].disabled, true);
  assert.match(app.elements["storage-message"].textContent, /Could not load/);
});

test("legacy category default is in memory only until a successful save", () => {
  const original = JSON.stringify([{ id: "legacy", title: "Old task", completed: true }]);
  const saved = storage({ [key]: original });
  const app = openApp(saved);
  assert.equal(app.rows()[0].querySelector(".task-category").textContent, "Uncategorized");
  assert.equal(saved.getItem(key), original);
  app.add("New task", "School");
  assert.equal(app.readSaved()[0].id, "legacy");
  assert.equal(app.readSaved()[0].title, "Old task");
  assert.equal(app.readSaved()[0].completed, true);
  assert.equal(app.readSaved()[0].category, "Uncategorized");
  assert.equal(openApp(saved).rows()[1].querySelector(".task-category").textContent, "School");
});

test("editing saves only selected task, preserves ID/completion, and survives reload", () => {
  const app = openApp();
  app.add("Same title", "School");
  app.add("Same title", "Home");
  app.toggle(1, true);
  const before = app.readSaved();
  const editor = app.edit(1);
  assert.equal(app.focused(), editor.querySelector("input"));
  assert.equal(app.elements["status-filter"].disabled, true);
  assert.equal(app.rows()[0].querySelector(".delete-button").disabled, true);
  editor.querySelector("input").value = "  Updated sample  ";
  editor.querySelector("select").value = "Personal";
  editor.dispatch("submit");
  const after = app.readSaved();
  assert.deepEqual(after[0], before[0]);
  assert.equal(after[1].id, before[1].id);
  assert.equal(after[1].completed, true);
  assert.equal(after[1].title, "Updated sample");
  assert.equal(after[1].category, "Personal");
  assert.equal(app.focused(), app.rows()[1].querySelector(".edit-button"));
  assert.equal(app.elements["status-filter"].disabled, false);
  assert.equal(openApp(app.saved).readSaved()[1].title, "Updated sample");
});

test("blank/invalid edits reject; Cancel discards draft without storage mutation", () => {
  const app = openApp();
  app.add("Original", "School");
  const before = app.saved.getItem(key);
  const editor = app.edit(0);
  editor.querySelector("input").value = "  ";
  editor.dispatch("submit");
  assert.match(editor.querySelector("p").textContent, /Enter a task title/);
  assert.equal(app.saved.getItem(key), before);
  editor.querySelector("input").value = "Draft";
  editor.querySelector("select").value = "Unknown";
  editor.dispatch("submit");
  assert.match(editor.querySelector("p").textContent, /valid category/);
  editor.querySelector(".cancel-button").dispatch("click");
  assert.equal(app.saved.getItem(key), before);
  assert.equal(app.rows()[0].querySelector("span").textContent, "Original");
  assert.equal(app.focused(), app.rows()[0].querySelector(".edit-button"));
});

test("failed edit save keeps draft, paused controls, and original saved data; retry succeeds", () => {
  const app = openApp();
  app.add("Original", "School");
  const before = app.saved.getItem(key);
  const editor = app.edit(0);
  editor.querySelector("input").value = "Draft";
  editor.querySelector("select").value = "Home";
  app.saved.failWrite = true;
  editor.dispatch("submit");
  assert.equal(app.saved.getItem(key), before);
  assert.equal(app.rows()[0].querySelector("form"), editor);
  assert.equal(editor.querySelector("input").value, "Draft");
  assert.match(editor.querySelector("p").textContent, /draft is still here/);
  assert.equal(app.elements["task-title"].disabled, true);
  app.saved.failWrite = false;
  editor.dispatch("submit");
  assert.equal(app.readSaved()[0].title, "Draft");
  assert.equal(app.readSaved()[0].category, "Home");
  assert.equal(app.elements["task-title"].disabled, false);
});

test("combined filters are a temporary view and never overwrite hidden tasks", () => {
  const app = openApp();
  app.add("Study", "School");
  app.add("Chores", "Home");
  app.add("Homework", "School");
  app.toggle(2, true);
  const before = app.saved.getItem(key);
  app.filter("completed", "School");
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0].querySelector("span").textContent, "Homework");
  assert.equal(app.elements["task-count"].textContent, "1 of 3 completed");
  assert.equal(app.elements["view-message"].textContent, "1 of 3 tasks shown.");
  assert.equal(app.saved.getItem(key), before);
  app.delete(0);
  assert.equal(app.readSaved().length, 2);
  assert.deepEqual(app.readSaved().map(task => task.title), ["Study", "Chores"]);
  assert.match(app.elements["empty-message"].textContent, /No matching tasks/);
  const reopened = openApp(app.saved);
  assert.equal(reopened.rows().length, 2);
  assert.equal(reopened.elements["status-filter"].value, "all");
  assert.equal(reopened.elements["category-filter"].value, "all");
});

test("completion in filtered view focuses by ID or neighbor, including empty result", () => {
  const app = openApp();
  app.add("Hidden", "Home");
  app.add("Visible A", "School");
  app.add("Visible B", "School");
  app.filter("all", "School");
  app.toggle(1, true);
  assert.equal(app.focused(), app.rows()[1].querySelector("input"));
  assert.equal(app.readSaved()[2].completed, true);
  app.filter("incomplete", "School");
  app.toggle(0, true);
  assert.equal(app.rows().length, 0);
  assert.equal(app.focused(), app.elements["task-title"]);
  app.filter("completed", "School");
  app.toggle(0, false);
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0].querySelector("span").textContent, "Visible B");
  assert.equal(app.focused(), app.rows()[0].querySelector("input"));
});

test("category edit and deletion leaving a filter restore predictable focus", () => {
  const app = openApp();
  app.add("Hidden", "Home");
  app.add("Visible A", "School");
  app.add("Visible B", "School");
  app.filter("all", "School");
  const editor = app.edit(0);
  editor.querySelector("select").value = "Home";
  editor.dispatch("submit");
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0].querySelector("span").textContent, "Visible B");
  assert.equal(app.focused(), app.rows()[0].querySelector(".edit-button"));
  app.delete(0);
  assert.equal(app.focused(), app.elements["task-title"]);
  assert.equal(app.readSaved().length, 2);
});

test("invalid stored categories preserve data; add rejects invalid category", () => {
  for (const category of [null, "Unknown", 3]) {
    const original = JSON.stringify([{ id: "x", title: "Sample", completed: false, category }]);
    const app = openApp(storage({ [key]: original }));
    assert.equal(app.elements["task-title"].disabled, true);
    assert.equal(app.saved.getItem(key), original);
  }
  const app = openApp();
  app.add("Sample", "Unknown");
  assert.equal(app.rows().length, 0);
  assert.match(app.elements["form-message"].textContent, /valid category/);
});

test("every status/category combination returns the expected subset without writing", () => {
  const app = openApp();
  const categories = ["Uncategorized", "School", "Home", "Personal"];
  for (const category of categories) {
    app.add(`${category} pending`, category);
    app.add(`${category} done`, category);
    app.toggle(app.rows().length - 1, true);
  }
  const before = app.saved.getItem(key);
  for (const status of ["all", "incomplete", "completed"]) {
    for (const category of ["all", ...categories]) {
      app.filter(status, category);
      const expected = app.readSaved().filter(task =>
        (status === "all" || task.completed === (status === "completed")) &&
        (category === "all" || task.category === category)
      );
      assert.deepEqual(app.rows().map(row => row.dataset.taskId), expected.map(task => task.id));
      assert.equal(app.saved.getItem(key), before);
    }
  }
});

test("failed filtered completion/deletion preserve hidden data and visible checkbox", () => {
  const app = openApp();
  app.add("Hidden", "Home");
  app.add("Visible", "School");
  app.filter("incomplete", "School");
  const before = app.saved.getItem(key);
  app.saved.failWrite = true;
  app.toggle(0, true);
  app.delete(0);
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0].querySelector("input").checked, false);
  assert.equal(app.saved.getItem(key), before);
});

test("adding under a filter persists the full list even when new task is hidden", () => {
  const app = openApp();
  app.add("Existing", "School");
  app.filter("all", "School");
  app.add("Hidden new sample", "Home");
  assert.equal(app.rows().length, 1);
  assert.equal(app.readSaved().length, 2);
  assert.equal(app.elements["view-message"].textContent, "1 of 2 tasks shown.");
  assert.equal(openApp(app.saved).rows().length, 2);
});

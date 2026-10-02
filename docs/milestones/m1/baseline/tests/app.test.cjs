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
  focus() { this.focused = true; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  dispatch(name) { this.listeners[name]({ preventDefault() {} }); }
  querySelector(tag) {
    for (const child of this.children) {
      if (child.tag === tag) return child;
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
    "task-count": "p", "empty-message": "p", "form-message": "p", "storage-message": "p"
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
    add(title) {
      elements["task-title"].value = title;
      elements["task-form"].dispatch("submit");
    },
    toggle(index, completed) {
      const checkbox = elements["task-list"].children[index].querySelector("input");
      checkbox.checked = completed;
      checkbox.dispatch("change");
    },
    delete(index) {
      elements["task-list"].children[index].querySelector("button").dispatch("click");
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

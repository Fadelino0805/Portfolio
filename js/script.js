/* ===== Mobile navigation ===== */
const menuBtn = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
menuBtn.addEventListener("click", function () {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

/* ===== Dynamic greeting (home page) ===== */
const greeting = document.getElementById("greeting");
if (greeting) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  greeting.textContent = part + "! Welcome to my portfolio";
}

/* ===== Academic Planner ===== */
const taskForm = document.getElementById("task-form");
if (taskForm) {
  const input = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const list = document.getElementById("task-list");
  const errorBox = document.getElementById("task-error");
  const countBox = document.getElementById("task-count");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

  function render() {
    list.innerHTML = "";
    tasks.forEach(function (task) {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = task.done;
      check.setAttribute("aria-label", "Mark complete");
      check.addEventListener("change", function () { toggleTask(task.id); });

      const text = document.createElement("span");
      text.className = "task-text";
      const title = document.createElement("strong");
      title.textContent = task.text;
      text.appendChild(title);
      if (task.date) {
        const due = document.createElement("small");
        due.textContent = "Due: " + task.date;
        text.appendChild(due);
      }

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "Delete";
      del.addEventListener("click", function () { deleteTask(task.id); });

      li.append(check, text, del);
      list.appendChild(li);
    });
    const remaining = tasks.filter(function (t) { return !t.done; }).length;
    countBox.textContent = tasks.length
      ? remaining + " of " + tasks.length + " tasks remaining"
      : "No tasks yet. Add your first one above!";
  }

  function addTask(text, date) {
    tasks.push({ id: Date.now(), text: text, date: date, done: false });
    save(); render();
  }
  function toggleTask(id) {
    tasks = tasks.map(function (t) { return t.id === id ? { ...t, done: !t.done } : t; });
    save(); render();
  }
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save(); render();
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) { errorBox.textContent = "Please enter a task."; return; }
    errorBox.textContent = "";
    addTask(value, dateInput.value);
    taskForm.reset();
    input.focus();
  });
  render();
}

/* ===== Contact form validation ===== */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const fields = ["name", "email", "phone", "message"];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const digitsOnly = /^\d+$/;

  function setError(id, msg) {
    document.getElementById(id + "-error").textContent = msg;
    document.getElementById(id).classList.toggle("invalid", msg !== "");
  }

  function validate() {
    let valid = true;
    fields.forEach(function (id) {
      const value = document.getElementById(id).value.trim();
      let msg = "";
      if (value === "") msg = "This field cannot be empty.";
      else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email address.";
      else if (id === "phone" && !digitsOnly.test(value)) msg = "Phone number must contain digits only.";
      setError(id, msg);
      if (msg) valid = false;
    });
    return valid;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const success = document.getElementById("form-success");
    if (validate()) {
      success.textContent = "Thank you! Your message has been sent successfully.";
      contactForm.reset();
    } else {
      success.textContent = "";
    }
  });
  fields.forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { setError(id, ""); });
  });
}

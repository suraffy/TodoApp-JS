const showCompleted = document.querySelector('#show-completed');
const newTask = document.querySelector('#new-task');
const newTaskCont = document.querySelector('.new-task-cont');
const taskCont = document.querySelector('.task-container');

class Task {
  constructor(taskId, title, note = '') {
    this.taskId = taskId;
    this.title = title;
    this.note = note;
    this.priority = 'none';
    this.completed = false;
  }
}

class TaskStorage {
  static getTasks() {
    return localStorage.getItem('tasks')
      ? JSON.parse(localStorage.getItem('tasks'))
      : [];
  }

  static storeTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static taskTitle(taskId, title) {
    const tasks = this.getTasks();
    tasks.find((el) => {
      if (el.taskId === +taskId) el.title = title;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static addNote(taskId, note) {
    const tasks = this.getTasks();
    tasks.find((el) => {
      if (el.taskId === +taskId) el.note = note;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static addPriority(taskId, priority) {
    const tasks = this.getTasks();
    tasks.find((el) => {
      if (el.taskId === +taskId) el.priority = priority;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static taskCompleted(taskId, taskCompleted) {
    const tasks = this.getTasks();
    tasks.find((el) => {
      if (el.taskId === +taskId) el.completed = taskCompleted;
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static removeTask(taskId) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((el) => el.taskId === +taskId);
    tasks.splice(taskIndex, 1);

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

class TaskUI {
  static displayTasks() {
    const tasks = TaskStorage.getTasks();
    tasks.forEach((task) => TaskUI.addTaskToList(task));
  }

  static addTaskToList(task) {
    let checked = '';
    let lineThrough = '';
    let displayTask = '';
    let taskCompleted = '';
    if (task.completed === true || task.completed === 'true') {
      checked = 'checked';
      lineThrough = 'text-decoration: 2px line-through';
      taskCompleted = 'task-completed';
      displayTask = 'none';
    }

    let borderColor = 'transparent';
    if (task.priority === 'high') {
      borderColor = 'var(--red)';
    } else if (task.priority === 'medium') {
      borderColor = 'var(--orange)';
    } else if (task.priority === 'low') {
      borderColor = 'var(--green)';
    }

    newTaskCont.insertAdjacentHTML(
      'afterend',
      `<div class="active-task-cont row ${taskCompleted}" style="border-color: ${borderColor}; display: ${displayTask}" data-task-id="${
        task.taskId
      }" data-task-priority="${task.priority}" data-task-completed="${
        task.completed
      }">
              <div class="active-task-overview row">
                <input type="checkbox" id="task-completed" ${checked} />
                <input type="text" name="" id="task-title" class="task-title" style="${lineThrough}" value="${
        task.title
      }">
                <span class="remove-task">Remove</span>
                <img src="caret-down.svg" class="caret-down" alt="caret-down" />
              </div>
  
              <div class="task-details row">
                <div class="task-note-cont">
                  <h4>Notes</h4>
                  <textarea name="" id="task-notes" class="task-notes" maxlength="512">${
                    task.note
                  }</textarea>
                </div>
  
                <div class="priority-cont row">
                  <h4>Priority</h4>
                  <div class="priorities">
                    <span class="priority priority-high" style=${
                      task.priority === 'high' ? 'opacity:1' : ''
                    } >High</span>
                    <span class="priority priority-medium" style=${
                      task.priority === 'medium' ? 'opacity:1' : ''
                    } >Medium</span>
                    <span class="priority priority-low" style=${
                      task.priority === 'low' ? 'opacity:1' : ''
                    } >Low</span>
                    <span class="priority priority-none" style=${
                      task.priority === 'none' ? 'opacity:1' : ''
                    } >None</span>
                  </div>
                </div>
              </div>
  
            </div>
    `
    );
  }

  static clearFields() {
    newTask.value = '';
  }

  static addPriority(targetEl) {
    const task =
      targetEl.parentElement.parentElement.parentElement.parentElement;

    const prs = targetEl.parentElement.children;
    for (let pr of prs) {
      if (pr === targetEl) {
        pr.style.opacity = '1';
        continue;
      }
      pr.style.opacity = '0.6';
    }

    if (targetEl.classList.contains('priority-high')) {
      task.style.borderColor = 'var(--red)';
      task.setAttribute('data-task-priority', 'high');
    } else if (targetEl.classList.contains('priority-medium')) {
      task.style.borderColor = 'var(--orange)';
      task.setAttribute('data-task-priority', 'medium');
    } else if (targetEl.classList.contains('priority-low')) {
      task.style.borderColor = 'var(--green)';
      task.setAttribute('data-task-priority', 'low');
    } else if (targetEl.classList.contains('priority-none')) {
      task.style.borderColor = 'transparent';
      task.setAttribute('data-task-priority', 'none');
    }
  }

  static showCompletedTasks() {
    const compTasks = document.querySelectorAll('.task-completed');
    if (showCompleted.checked) {
      for (let task of compTasks) task.style.display = 'block';
    } else {
      for (let task of compTasks) task.style.display = 'none';
    }
  }
}

// Add stored lists
document.addEventListener('DOMContentLoaded', TaskUI.displayTasks);

// Show completed
showCompleted.addEventListener('change', (e) => TaskUI.showCompletedTasks());

// New task
newTask.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const taskId = new Date().getTime();
  const title = newTask.value;
  const task = new Task(taskId, title);

  TaskStorage.storeTask(task);
  TaskUI.addTaskToList(task);
  TaskUI.clearFields();
});

// Show task details
taskCont.addEventListener('click', (e) => {
  if (e.target.classList.contains('caret-down')) {
    e.target.parentElement.nextElementSibling.classList.toggle(
      'show-task-details'
    );
  } else if (e.target.classList.contains('active-task-overview')) {
    e.target.nextElementSibling.classList.toggle('show-task-details');
  }
});

// Remove task
taskCont.addEventListener('click', (e) => {
  if (!e.target.classList.contains('remove-task')) return;
  const task = e.target.parentElement.parentElement;
  task.remove();

  TaskStorage.removeTask(task.dataset.taskId);
});

// Task title
taskCont.addEventListener('keyup', (e) => {
  if (!e.target.classList.contains('task-title')) return;

  const taskId = e.target.parentElement.parentElement.dataset.taskId;
  TaskStorage.taskTitle(taskId, e.target.value);
});

// Task notes
taskCont.addEventListener('keyup', (e) => {
  if (!e.target.classList.contains('task-notes')) return;
  e.target.textContent = e.target.value;
  const taskId =
    e.target.parentElement.parentElement.parentElement.dataset.taskId;

  TaskStorage.addNote(taskId, e.target.value);
});

// Priority
taskCont.addEventListener('click', (e) => {
  if (!e.target.classList.contains('priority')) return;

  const task = e.target.parentElement.parentElement.parentElement.parentElement;

  TaskStorage.addPriority(
    task.dataset.taskId,
    e.target.textContent.toLowerCase()
  );
  TaskUI.addPriority(e.target);
});

// task completed
taskCont.addEventListener('change', (e) => {
  if (e.target.id !== 'task-completed') return;

  const task = e.target.parentElement.parentElement;
  const taskTitle = e.target.nextElementSibling;

  if (e.target.checked) {
    task.setAttribute('data-task-completed', true);
    task.classList.add('task-completed');
    task.lastElementChild.classList.remove('show-task-details');
    taskTitle.style.textDecoration = '2px line-through';
    if (!showCompleted.checked) task.style.display = 'none';
  } else {
    task.setAttribute('data-task-completed', false);
    task.classList.remove('task-completed');
    taskTitle.style.textDecoration = 'none';
  }

  TaskStorage.taskCompleted(task.dataset.taskId, task.dataset.taskCompleted);
});

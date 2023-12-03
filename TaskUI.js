const date = document.querySelector('.date');
const showCompleted = document.querySelector('#show-completed');
const newTask = document.querySelector('#new-task');
const newTaskCont = document.querySelector('.new-task-cont');

import { TaskStorage } from './TaskStorage.js';

export class TaskUI {
  static displayDate() {
    const now = new Date();

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = now.getMonth();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let format = 'AM';

    if (hour >= 12) {
      hour = hour - 12;
      format = 'PM';
    }
    if (hour === 0) hour = 12;

    if (hour.toString().length === 1) hour = `0${hour}`;
    if (minute.toString().length === 1) minute = `0${minute}`;

    const dateString = `${
      months[month]
    } ${now.getDate()}&nbsp;&nbsp; ${hour} : ${minute} ${format}`;
    date.innerHTML = dateString;
  }

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
                <input type="text" name=""  class="task-title" style="${lineThrough}" value="${
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

  static showTaskDetails(targetEl) {
    if (targetEl.classList.contains('caret-down')) {
      targetEl.parentElement.nextElementSibling.classList.toggle(
        'show-task-details'
      );
    } else if (targetEl.classList.contains('active-task-overview')) {
      targetEl.nextElementSibling.classList.toggle('show-task-details');
    }
  }

  static taskCompleted(targetEl) {
    const task = targetEl.parentElement.parentElement;
    const taskTitle = targetEl.nextElementSibling;

    if (targetEl.checked) {
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
  }
}

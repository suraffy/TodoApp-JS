import { Task } from './Task.js';
import { TaskStorage } from './TaskStorage.js';
import { TaskUI } from './TaskUI.js';

const showCompleted = document.querySelector('#show-completed');
const newTask = document.querySelector('#new-task');
const taskCont = document.querySelector('.task-container');

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
taskCont.addEventListener('click', (e) => TaskUI.showTaskDetails(e.target));

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
  TaskStorage.taskCompleted(task.dataset.taskId, e.target.checked);
  TaskUI.taskCompleted(e.target);
});

// Display date
TaskUI.displayDate();
let minute = new Date().getMinutes();
setInterval(() => {
  let minuteNow = new Date().getMinutes();
  if (minute !== minuteNow) {
    TaskUI.displayDate();
    minute = minuteNow;
  }
}, 1000);

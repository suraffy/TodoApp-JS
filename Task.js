export class Task {
  constructor(taskId, title, note = '') {
    this.taskId = taskId;
    this.title = title;
    this.note = note;
    this.priority = 'none';
    this.completed = false;
  }
}

export class TaskStorage {
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

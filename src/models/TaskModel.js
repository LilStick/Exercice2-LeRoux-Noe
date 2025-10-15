const Task = require('./Task');

class TaskModel {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  getAll() {
    return this.tasks;
  }

  add(title) {
    const task = new Task(this.nextId++, title);
    this.tasks.push(task);
    return task;
  }

  remove(id) {
    const index = this.tasks.findIndex(task => task.id === parseInt(id));
    if (index !== -1) {
      return this.tasks.splice(index, 1)[0];
    }
    return null;
  }
}

module.exports = new TaskModel();

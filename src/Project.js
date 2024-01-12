export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(taskTitle) {
        this.tasks.forEach((task) => {
            if (task.title === taskTitle) {
                return this.tasks.splice(this.tasks.indexOf(task.title) - 1, 1);
            }
        });
    }
}
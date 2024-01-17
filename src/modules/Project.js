export default class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    deleteTask(taskTitle) {
        this.tasks.forEach((task) => {
            if (task.title === taskTitle) {
                return this.tasks.splice(this.tasks.findIndex((task) => task.title === taskTitle), 1);
            }
        });
    }
}
import { format, formatDistanceToNow } from "date-fns";

export default class Task {
    constructor(title, description, priority, dueDate, isDone = false) {
        this.title = title;
        this.description = description;
        this._priority = priority;
        this._dueDate = dueDate;
        this._timeLeft = formatDistanceToNow(dueDate);
        this._formattedDueDate = format(this.dueDate, 'dd.MM.yyyy HH:mm');
        this.isDone = isDone;
    }
    
    get priority() {
        return this._priority;
    }

    get dueDate() {
        return this._dueDate;
    }

    get timeLeft() {
        return this._timeLeft;
    }

    get formattedDueDate() {
        return this._formattedDueDate;
    }

    set priority(priority) {
        const priorities = ['high', 'medium', 'low'];
        if (priorities.includes(priority)) {
            this._priority = priority;
        } else {
            console.error('Uncaught Error: No valid priority');
        }
    }

    set dueDate(date) {
        if (date instanceof Date) {
            this._dueDate = date;
            this._timeLeft = formatDistanceToNow(date);
            this._formattedDueDate = format(this.dueDate, 'dd.MM.yyyy HH:mm');
        } else {
            console.error('Uncaught Error: No valid Date object');
        }
    }

    set timeLeft(value) {
        console.error('Uncaught Error: Can\'t change value of timeLeft');
    }

    set formattedDueDate(value) {
        console.error('Uncaught Error: Can\'t change value of timeLeft');
    }
}
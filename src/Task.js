import { formatDistanceToNow } from "date-fns";

export default class Task {
    constructor(title, description, priority, dueDate) {
        this.title = title;
        this.description = description;
        this._priority = priority;
        this._dueDate = dueDate;
        this._timeLeft = formatDistanceToNow(dueDate);
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

    set priority(priority) {
        const priorities = ['high', 'medium', 'low'];
        if (priorities.includes(priority)) {
            this._priority = priority;
        } else {
            throw 'Error: No valid priority';
        }
    }

    set dueDate(date) {
        if (date instanceof Date) {
            this._dueDate = date;
            this._timeLeft = formatDistanceToNow(date);
        } else {
            throw 'Error: No valid Date object';
        }
    }

    set timeLeft(value) {
        throw 'Error: Can\'t change value of timeLeft';
    }
}
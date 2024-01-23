import Task from "./Task";
import ProjectManager from "./ProjectManager";
import Project from "./Project";
import { format, isPast } from 'date-fns';
import LocalStorage from "./LocalStorage";

export default class Display {
    static renderPageLayout() {
        const nav = document.createElement('nav');
        const main = document.createElement('main');

        document.body.appendChild(nav);
        document.body.appendChild(main);
    }

    static renderProjects(projects) {
        if (document.querySelector('.projects')) {
            const ul = document.querySelector('.projects');
            ul.remove();
        }
    
        const nav = document.querySelector('nav');
        const ul = document.createElement('ul');
    
        ul.classList.toggle('projects');
    
        projects.forEach((project) => {
            const li = document.createElement('li');
            const projectTitle = document.createElement('p');
            const closeIcon = document.createElement('i');
    
            projectTitle.textContent = project.title;
            closeIcon.textContent = '\u{00D7}';
    
            projectTitle.classList.toggle('project-title');
            closeIcon.classList.toggle('close-icon');
    
            li.addEventListener('click', () => {
                this.renderProject(project);
                ProjectManager.currentProject = project;
            });
    
            li.addEventListener('dblclick', () => {
                this.renderProjectModal('rename', project);
            });
    
            closeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.renderDeleteModal('project', project);
            });

            li.appendChild(projectTitle);
            li.appendChild(closeIcon);
            ul.appendChild(li);
        });
    
        const li = document.createElement('li');
        const newProjectParagraph = document.createElement('p');
        newProjectParagraph.textContent = '+';
    
        li.addEventListener('click', () => {
            this.renderProjectModal('new', undefined);
        }); 
    
        li.appendChild(newProjectParagraph);
        ul.appendChild(li);
        nav.appendChild(ul);
    }

    static renderProject(project) {
        if (document.querySelector('.project')) {
            const ul = document.querySelector('.project');
            ul.remove();
        }
    
        const main = document.querySelector('main');
        const ul = document.createElement('ul');
    
        ul.classList.toggle('project');
    
        project.tasks.forEach((task) => {
            const li = document.createElement('li');
            const arrowIcon = document.createElement('i');
            const taskTitle = document.createElement('h4');
            const priority = document.createElement('i');
            const timeLeft = document.createElement('p');
            const checkbox = document.createElement('i');
    
            arrowIcon.textContent = '\u{25BE}';
            taskTitle.textContent = task.title;
            timeLeft.textContent = task.timeLeft;
    
            li.classList.toggle('task');
            arrowIcon.classList.toggle('arrow-icon');
            taskTitle.classList.toggle('task-title');
            priority.classList.toggle('priority');
            priority.classList.toggle(`priority-${task.priority}`);
            timeLeft.classList.toggle('time-left');
            checkbox.classList.toggle('checkbox');

            if (task.isDone) {
                taskTitle.classList.toggle('done');
                timeLeft.classList.toggle('done');
                checkbox.classList.toggle('checked');
            }

            li.addEventListener('click', () => {
                const taskTitleToClass = task.title.toLowerCase().split(' ').join('-');
                const detailsDiv = document.querySelector(`.${taskTitleToClass}`);
                
                arrowIcon.classList.toggle('arrow-rotated');

                if (detailsDiv) {
                    detailsDiv.remove();
                    return;
                }

                const div = document.createElement('div');

                div.classList.toggle('collapsible-content');
                div.classList.toggle(taskTitleToClass);
                
                const collapsibleTitle = document.createElement('h4');
                const collapsibleDescription = document.createElement('p');
                const collapsiblePriorityTitle = document.createElement('h4');
                const collapsiblePriority = document.createElement('i');
                const collapsibleDueDateTitle = document.createElement('h4');
                const collapsibleDueDate = document.createElement('p');
                const collapsibleTimeLeftTitle = document.createElement('h4');
                const collapsibleTimeLeft = document.createElement('p');
                const collapsibleEditButton = document.createElement('button');
                const collapsibleDeleteButton = document.createElement('button');

                collapsibleTitle.textContent = task.title;
                collapsibleDescription.textContent = task.description;
                collapsiblePriorityTitle.textContent = 'Priority';
                collapsiblePriority.textContent = task.priority;
                collapsibleDueDateTitle.textContent = 'Due by';
                collapsibleDueDate.textContent = task.formattedDueDate;
                collapsibleTimeLeftTitle.textContent = 'Time left';
                collapsibleTimeLeft.textContent = task.timeLeft;
                collapsibleEditButton.textContent = 'Edit';
                collapsibleDeleteButton.textContent = 'Delete';

                collapsibleEditButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.renderTaskModal('edit', task);
                });

                collapsibleDeleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.renderDeleteModal('task', task);
                });

                div.appendChild(collapsibleTitle);
                div.appendChild(collapsibleDescription);
                div.appendChild(collapsiblePriorityTitle);
                div.appendChild(collapsiblePriority);
                div.appendChild(collapsibleDueDateTitle);
                div.appendChild(collapsibleDueDate);
                div.appendChild(collapsibleTimeLeftTitle);
                div.appendChild(collapsibleTimeLeft);
                div.appendChild(collapsibleEditButton);
                div.appendChild(collapsibleDeleteButton);
                
                li.appendChild(div);
            });

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                taskTitle.classList.toggle('done');
                timeLeft.classList.toggle('done');
                checkbox.classList.toggle('checked');

                if (!task.isDone) {
                    task.isDone = true;

                    const dialog = document.createElement('dialog');
                    const dialogTitle = document.createElement('h4');
                    const dialogKeepBtn = document.createElement('button');
                    const dialogDeleteBtn = document.createElement('button');
            
                    dialogTitle.textContent = `Nice! Do you want to keep ${task.title} or delete it?`;
                    dialogKeepBtn.textContent = 'Keep';
                    dialogDeleteBtn.textContent = 'Delete';
            
                    dialog.appendChild(dialogTitle);
                    dialog.appendChild(dialogKeepBtn);
                    dialog.appendChild(dialogDeleteBtn);
    
                    dialogKeepBtn.addEventListener('click', () => {
                        dialog.close();
                        dialog.remove();

                        ProjectManager.saveProjects();
                    });
    
                    dialogDeleteBtn.addEventListener('click', () => {
                        ProjectManager.currentProject.deleteTask(task.title);
                        Display.renderProject(ProjectManager.currentProject);
                        dialog.close();
                        dialog.remove();

                        ProjectManager.saveProjects();
                    });

                    main.appendChild(dialog);
                    dialog.showModal();

                    return;
                }

                task.isDone = false;

                ProjectManager.saveProjects();
            });

            li.appendChild(arrowIcon);
            li.appendChild(taskTitle);
            li.appendChild(priority);
            li.appendChild(timeLeft);
            li.appendChild(checkbox);
            
            ul.appendChild(li);
        });

        const li = document.createElement('li');
        const newTaskParagraph = document.createElement('p');
    
        newTaskParagraph.textContent = '+ New';
        li.classList.toggle('add-project');
    
        li.addEventListener('click', () => {
            this.renderTaskModal('new', undefined);
        });
    
        li.appendChild(newTaskParagraph);
        ul.appendChild(li);
    
        main.appendChild(ul);
    }

    static renderProjectModal(type, project) {
        const main = document.querySelector('main');
        const nav = document.querySelector('nav');

        const dialog = document.createElement('dialog');

        const dialogHeaderDiv = document.createElement('div');

        const modalTitle = document.createElement('h3');
        const closeIcon = document.createElement('i');   

        const titleInput = document.createElement('input');
        const confirmButton = document.createElement('button');

        if (type === 'new') {
            modalTitle.textContent = 'Add new Project';

            confirmButton.addEventListener('click', () => {
                ProjectManager.addProject(new Project(titleInput.value));
                ProjectManager.currentProject = ProjectManager.projects[ProjectManager.projects.length - 1];
                Display.renderProjects(ProjectManager.projects);
                Display.renderProject(ProjectManager.currentProject);
                dialog.close();
                dialog.remove();
            });
        } else if (type === 'rename') {
            modalTitle.textContent = 'Rename Project';

            confirmButton.addEventListener('click', () => {
                project.title = titleInput.value;
                Display.renderProjects(ProjectManager.projects);
                dialog.close();
                dialog.remove();

                ProjectManager.saveProjects();
            });
        }

        closeIcon.textContent = '\u{00D7}';
        confirmButton.textContent = 'Confirm';

        dialog.addEventListener('close', () => {
            nav.style.filter = '';
            main.style.filter = '';
        });

        dialogHeaderDiv.appendChild(modalTitle);
        dialogHeaderDiv.appendChild(closeIcon);

        dialog.appendChild(dialogHeaderDiv);
        dialog.appendChild(titleInput);
        dialog.appendChild(confirmButton);

        closeIcon.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });

        nav.style.filter = 'blur(5px)';
        main.style.filter = 'blur(5px)';

        main.appendChild(dialog);
        dialog.showModal();
    }

    static renderTaskModal(type, task) {
        const main = document.querySelector('main');
        const nav = document.querySelector('nav');
    
        const dialog = document.createElement('dialog');

        const dialogHeaderDiv = document.createElement('div');
        
        const modalTitle = document.createElement('h3');
        const closeIcon = document.createElement('i');        

        const modalForm = document.createElement('form');
        
        const titleLabel = document.createElement('label');
        const titleInput = document.createElement('input');
    
        const descriptionLabel = document.createElement('label');
        const descriptionInput = document.createElement('textarea');
    
        const priorityLabel = document.createElement('label');
        const priorityInput = document.createElement('select');
        const priorityHigh = document.createElement('option');
        const priorityMedium = document.createElement('option');
        const priorityLow = document.createElement('option');
    
        const dateLabel = document.createElement('label');
        const dateInput = document.createElement('input');
    
        const confirmButton = document.createElement('button');
    
        closeIcon.textContent = '\u{00D7}';
    
        titleLabel.textContent = 'Title';
        descriptionLabel.textContent = 'Description';
        priorityLabel.textContent = 'Priority';
        priorityHigh.textContent = 'High';
        priorityMedium.textContent = 'Medium';
        priorityLow.textContent = 'Low';
        dateLabel.textContent = 'Due by';
    
        confirmButton.textContent = 'Confirm';
    
        titleInput.id = 'newTaskTitle';
        descriptionInput.id = 'newTaskDescription';
        priorityInput.id = 'newTaskPriority';
        dateInput.id = 'newTaskDate';
    
        titleLabel.for = 'newTaskTitle';
        descriptionLabel.for = 'newTaskDescription';
        priorityLabel.for = 'newTaskPriority';
        dateLabel.for = 'newTaskDate';
    
        priorityHigh.value = 'high';
        priorityMedium.value = 'medium';
        priorityLow.value = 'low';
    
        dateInput.type = 'datetime-local'
        dateInput.min = new Date().toJSON().toString().substring(0, 16);

        priorityInput.appendChild(priorityHigh);
        priorityInput.appendChild(priorityMedium);
        priorityInput.appendChild(priorityLow);
    
        modalForm.appendChild(titleLabel);
        modalForm.appendChild(titleInput);
        modalForm.appendChild(descriptionLabel);
        modalForm.appendChild(descriptionInput);
        modalForm.appendChild(priorityLabel);
        modalForm.appendChild(priorityInput);
        modalForm.appendChild(dateLabel);
        modalForm.appendChild(dateInput);
    
        dialogHeaderDiv.appendChild(modalTitle);
        dialogHeaderDiv.appendChild(closeIcon);
    
        dialog.appendChild(dialogHeaderDiv);
        dialog.appendChild(modalForm);
        dialog.appendChild(confirmButton);
          
        main.appendChild(dialog);

        if (type === 'new') {
            modalTitle.textContent = 'Add new Task';

            dialog.classList.toggle('dialog-new-task');

            dateInput.value = new Date().toJSON().toString().substring(0, 16);
            
            confirmButton.addEventListener('click', (e) => {
                if (!isPast(dateInput.value) && dateInput.value) {
                    const newTask = new Task(titleInput.value, descriptionInput.value, priorityInput.value, dateInput.value);
                    ProjectManager.currentProject.addTask(newTask);
                    Display.renderProject(ProjectManager.currentProject);
                    dialog.close();
                    dialog.remove();
                }
            });     
        } else if (type === 'edit') {
            const selectedPriority = document.querySelector(`option[value="${task.priority}"]`);
            
            modalTitle.textContent = 'Edit Task';

            titleInput.value = task.title;
            descriptionInput.textContent = task.description;
            selectedPriority.setAttribute('selected', 'selected');
            dateInput.value = `${format(task.dueDate, 'yyyy-MM-dd')}T${format(task.dueDate, 'HH:mm')}`;         

            confirmButton.addEventListener('click', (e) => {
                if (!isPast(dateInput.value) && dateInput.value) {
                    task.title = titleInput.value;
                    task.description = descriptionInput.value;
                    task.priority = priorityInput.value;
                    task.dueDate = new Date(dateInput.value);
            
                    Display.renderProject(ProjectManager.currentProject);
                    dialog.close();
                    dialog.remove();

                    ProjectManager.saveProjects();
                }
            });   
        }
        
        closeIcon.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });

        dialog.addEventListener('close', () => {
            nav.style.filter = '';
            main.style.filter = '';
        });

        nav.style.filter = 'blur(5px)';
        main.style.filter = 'blur(5px)';

        dialog.showModal();
    }

    static renderDeleteModal(type, element) {
        const main = document.querySelector('main');

        const dialog = document.createElement('dialog');
        const dialogTitle = document.createElement('h4');
        const dialogConfirmBtn = document.createElement('button');
        const dialogCancelBtn = document.createElement('button');

        dialogTitle.textContent = `Delete ${element.title}?`;
        dialogConfirmBtn.textContent = 'Confirm';
        dialogCancelBtn.textContent = 'Cancel';

        dialog.appendChild(dialogTitle);
        dialog.appendChild(dialogConfirmBtn);
        dialog.appendChild(dialogCancelBtn);

        main.appendChild(dialog);
        dialog.showModal();

        if (type === 'task') {
            dialogConfirmBtn.addEventListener('click', () => {
                ProjectManager.currentProject.deleteTask(element.title);
                Display.renderProject(ProjectManager.currentProject);
                dialog.close();
                dialog.remove();
            });
        } else if (type === 'project') {
            dialogConfirmBtn.addEventListener('click', () => {
                ProjectManager.deleteProject(element.title);
                ProjectManager.currentProject = ProjectManager.projects[0];
                Display.renderProjects(ProjectManager.projects);
                Display.renderProject(ProjectManager.currentProject);
                dialog.close();
                dialog.remove();
            });
        }

        dialogCancelBtn.addEventListener('click', () => {
            dialog.close();
            dialog.remove();
        });
    }
}
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
    
            projectTitle.addEventListener('click', () => {
                this.renderProject(project);
                ProjectManager.currentProject = project;
            });
    
            li.appendChild(projectTitle);
            li.appendChild(closeIcon);
            ul.appendChild(li);
        });
    
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = '+';
    
        p.addEventListener('click', () => {
            console.log(ProjectManager.projects);
            const test = new Project('test');
            ProjectManager.addProject(test);
            Display.renderProjects(ProjectManager.projects);
        }); 
    
        li.appendChild(p);
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
            const taskTitle = document.createElement('p');
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
    
        li.addEventListener('click', this.renderNewTaskModal);
    
        li.appendChild(newTaskParagraph);
        ul.appendChild(li);
    
        main.appendChild(ul);
    }
}
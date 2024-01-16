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
}
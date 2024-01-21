import Project from "./Project";
import Task from "./Task";
import LocalStorage from "./LocalStorage";

export default class ProjectManager {

    static currentProject;
    static projects = [];

    static addProject(project) {
        this.projects.push(project);   
        this.saveProjects();
    }

    static deleteProject(projectTitle) {
        this.projects.forEach((project) => {
            if (project.title === projectTitle) {
                return this.projects.splice(this.projects.findIndex((project) => project.title === projectTitle), 1);
            }
        });
        this.saveProjects();
    }

    static saveProjects() {
        LocalStorage.clear();
        LocalStorage.setItem('projects', JSON.stringify(ProjectManager.projects));
    }

    static loadProjects() {
        this.projects = [];
        Object.assign(this.projects, JSON.parse(LocalStorage.getItem('projects')));
        LocalStorage.clear();
    
        const projectCount = this.projects.length; 
        let tempProject;
    
        for (let i = projectCount - 1; i >= 0; i--) {
            tempProject = Object.assign(new Project(), ProjectManager.projects[i])
            ProjectManager.projects.splice(i, 1);
            this.addProject(tempProject);
        }
        
        ProjectManager.projects.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
          
            return 0;
        });
    
        ProjectManager.projects.forEach((project) => {
            const taskCount = project.tasks.length;
    
            let tempTask
    
            for (let i = taskCount - 1; i >= 0; i--) {
                tempTask = new Task(project.tasks[i].title, project.tasks[i].description, project.tasks[i]._priority, project.tasks[i]._dueDate);
                project.tasks.splice(i, 1);
                project.addTask(tempTask);
            }
    
            project.tasks.sort((a, b) => {
                const titleA = a.title.toUpperCase();
                const titleB = b.title.toUpperCase();
                if (titleA < titleB) {
                  return -1;
                }
                if (titleA > titleB) {
                  return 1;
                }
              
                return 0;
            });
        });
    }

}
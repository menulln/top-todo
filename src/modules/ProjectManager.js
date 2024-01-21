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
}
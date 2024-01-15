export default class ProjectManager {

    static currentProject;
    static projects = [];

    static addProject(project) {
        this.projects.push(project);
    }

    static deleteProject(projectTitle) {
        this.projects.forEach((project) => {
            if (project.title === projectTitle) {
                return this.projects.splice(this.projects.indexOf(project.title) - 1, 1);
            }
        });
    }
}
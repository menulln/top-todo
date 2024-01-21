import Display from './modules/Display';
import ProjectManager from './modules/ProjectManager';
import './css/main.css';

Display.renderPageLayout();
ProjectManager.loadProjects();
ProjectManager.currentProject = ProjectManager.projects[0];
Display.renderProjects(ProjectManager.projects);
Display.renderProject(ProjectManager.currentProject);
import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { createProjectDto, updateProjectDto } from "../schemas/project.schema";

//lsit all projects for a tenant - tenantId is always from JWT
async function listProjects(tenantId:string){
    const projects =  await prisma.project.findMany({where: {tenantId}})
    return projects
}

//get a single project - returns null if it belongs to a different tenant
//NOTE: returns 404 not(403) intentionally, dont reveal the resource exists
async function getProject(id:string, tenantId:string){
    const project = await prisma.project.findFirst({where: {id,tenantId}})
    return project;
}

//create project
async function createProject(data: Prisma.ProjectCreateManyInput) {
    const project = await prisma.project.create({data})
    return project
}

//update project
async function updateProject(id:string,tenantId:string,data: Prisma.ProjectUpdateInput){
    const project = await prisma.project.update({where:{id,tenantId},data})
    return project;
}

//delete project
async function deleteProject(id:string, tenantId:string){
    const result =  await prisma.project.delete({where:{id, tenantId}})
    return result;
}

export const projectRepo = {
    listProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
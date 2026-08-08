import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByWorkspace(workspaceId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndWorkspace(id: string, workspaceId: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        template: true,
        revisions: {
          include: {
            attachments: true,
            author: {
              select: { id: true, email: true, fullName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found in workspace`);
    }
    return project;
  }
}

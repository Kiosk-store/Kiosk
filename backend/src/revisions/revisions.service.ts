import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Revision } from '@prisma/client';

@Injectable()
export class RevisionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string, workspaceId: string): Promise<Revision[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found in workspace`);
    }

    return this.prisma.revision.findMany({
      where: { projectId },
      include: {
        attachments: true,
        author: {
          select: { id: true, email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Asset } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByWorkspace(workspaceId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription, Invoice } from '@prisma/client';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(workspaceId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({
      where: { workspaceId },
    });
  }

  async getInvoices(workspaceId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

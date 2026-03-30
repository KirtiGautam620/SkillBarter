import { PrismaClient } from '@prisma/client';

class PrismaService {
  public client: PrismaClient;

  private static instance: PrismaService;

  private constructor() {
    this.client = new PrismaClient();
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }
}

export default PrismaService;


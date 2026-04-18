import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserEntity } from '@entities/UserEntity';
import { IUserRepo } from '@repositories/interfaces/IUserRepo';
import { TimeCreditService } from './TimeCreditService';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  private userRepo: IUserRepo;
  private creditService: TimeCreditService;

  constructor(userRepo: IUserRepo, creditService: TimeCreditService) {
    this.userRepo = userRepo;
    this.creditService = creditService;
  }

  async register(name: string, email: string, password: string): Promise<{ user: UserEntity; token: string }> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id = crypto.randomUUID();
    const user = new UserEntity(id, name, email, hashedPassword);
    const createdUser = await this.userRepo.create(user);
    
    // Create default time credit account
    await this.creditService.getAccount(createdUser.id);

    const token = jwt.sign({ id: createdUser.id }, JWT_SECRET, { expiresIn: '24h' });
    return { user: createdUser, token };
  }

  async login(email: string, password: string): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return { user, token };
  }
}

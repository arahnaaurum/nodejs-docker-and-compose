import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface ValidatedRequest extends Request {
  user: Omit<User, 'password'>;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
  };
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers['x-admin-key'];
    const expected = process.env.ADMIN_API_KEY;
    if (!expected || key !== expected) {
      throw new UnauthorizedException('Invalid or missing admin key');
    }
    return true;
  }
}

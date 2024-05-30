import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async use(req: IncomingMessage, _: any, next: () => void) {
    const token = req.headers['authorization']?.slice(7);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const isValidToken = await this.dataSource.getRepository('auths').exists({
      where: { accessToken: token },
    });
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}

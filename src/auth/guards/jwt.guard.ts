import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}

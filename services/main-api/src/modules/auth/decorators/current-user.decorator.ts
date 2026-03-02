import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Exported as a class so it can be used as both a type and a value
// (avoids TS1272 isolatedModules + emitDecoratorMetadata issue)
export class CurrentUserData {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);

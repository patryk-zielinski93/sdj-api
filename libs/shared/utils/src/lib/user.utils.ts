import { User } from '@sdj/shared/domain';

export class UserUtils {
  static getUserName(user: User): string {
    return user.displayName || user.name || user.realName;
  }
}

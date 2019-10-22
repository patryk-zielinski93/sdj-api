import { User } from '@sdj/shared/common';

export class UserUtils {
  static getUserName(user: User): string {
    return user.displayName || user.name || user.realName;
  }
}

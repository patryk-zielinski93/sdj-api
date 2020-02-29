import { User } from '@sdj/backend/radio/core/domain';

export abstract class UserDomainRepository {
  abstract async findOneOrFail(userId: string): Promise<User>;

  abstract async findOne(id: string): Promise<User | undefined>;

  abstract async save(user: User): Promise<User>;
}

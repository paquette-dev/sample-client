import { RawUser, User } from '../models/user.model';
import { UserStatus, UserStatusLabels } from './constants';

export const toUser = (raw: RawUser): User => {
  return {
    id: raw.user_id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email,
    username: raw.user_name,
    department: raw.department,
    status: UserStatusLabels[raw.user_status as keyof typeof UserStatusLabels],
  };
};

export const toRawUser = (user: User): RawUser => {
  return {
    user_id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    user_name: user.username,
    department: user.department,
    user_status: UserStatus[user.status as keyof typeof UserStatus],
  };
};

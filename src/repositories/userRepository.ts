import { getState } from '../lib/store';
import { User } from '../types';

export const userRepository = {
  getAll(): User[] {
    return getState().users;
  },

  create(user: User): User {
    getState().users.push(user);
    return user;
  },
};

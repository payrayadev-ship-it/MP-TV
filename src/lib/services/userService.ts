import { getState } from '../store';
import { User } from '../../types';

export const userService = {
  getAll() {
    return getState().users;
  },

  create(data: Partial<User>) {
    const store = getState();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name || 'User Baru MPTV',
      email: data.email || `user${Date.now()}@majalengkapost.tv`,
      role: data.role || 'Operator',
      active: true,
      lastActive: 'Baru saja',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    store.users.push(newUser);
    return newUser;
  },
};

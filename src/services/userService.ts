import { userRepository } from '../repositories/userRepository';
import { User } from '../types';

export const userService = {
  getAll(): User[] {
    return userRepository.getAll();
  },

  create(data: Partial<User>): User {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name || 'User Baru MPTV',
      email: data.email || `user${Date.now()}@majalengkapost.tv`,
      role: data.role || 'Operator',
      active: true,
      lastActive: 'Baru saja',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    return userRepository.create(newUser);
  },
};

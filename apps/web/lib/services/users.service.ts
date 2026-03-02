import { api } from '../api/api';
import { API_ENDPOINTS } from '../config/api';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatar?: string;
}

export const usersService = {
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return api.put(API_ENDPOINTS.USERS.BY_ID(userId), dto);
  },
};

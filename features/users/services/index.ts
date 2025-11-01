import { apiClient } from '@/shared/services';
import type { 
  User, 
  UsersResponse, 
  CreateUserData, 
  UpdateUserData,
  GetUsersParams 
} from '@/features/users/types';

class UsersService {
  private readonly baseUrl = '/users';

  async getUsers(params: GetUsersParams): Promise<UsersResponse> {
    const response = await apiClient.get(this.baseUrl, { params });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getUserPermissions(id: string): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/permissions`);
    return response.data;
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    const response = await apiClient.post(`${this.baseUrl}/${userId}/roles`, { roleId });
    return response.data;
  }
}

export const usersService = new UsersService();
export default usersService;
// User Management API Client
import { api } from '../api';
import type {
  User,
  Role,
  CreateUserData,
  UpdateUserData,
  AssignRoleData,
  UserResponse,
  UsersListResponse,
  RolesListResponse,
} from '../types/user';

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Users API
export const usersApi = {
  // Get all users
  async getUsers(): Promise<UsersListResponse> {
    try {
      const response = await api.get<User[]>('/users', {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data || [],
        message: response.message || 'Users retrieved successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get single user
  async getUser(id: string): Promise<UserResponse> {
    try {
      const response = await api.get<User>(`/users/${id}`, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'User retrieved successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      const response = await api.post<User>('/users', userData, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'User created successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<UserResponse> {
    try {
      const response = await api.put<User>(`/users/${id}`, userData, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'User updated successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<UserResponse> {
    try {
      const response = await api.delete<User>(`/users/${id}`, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'User deleted successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Assign role to user
  async assignRole(userId: string, roleData: AssignRoleData): Promise<UserResponse> {
    try {
      const response = await api.post<User>(`/users/${userId}/roles`, roleData, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'Role assigned successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  },

  // Remove role from user
  async removeRole(userId: string, roleId: string): Promise<UserResponse> {
    try {
      const response = await api.delete<User>(`/users/${userId}/roles/${roleId}`, {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data!,
        message: response.message || 'Role removed successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error removing role:', error);
      throw error;
    }
  },
};

// Roles API
export const rolesApi = {
  // Get all roles
  async getRoles(): Promise<RolesListResponse> {
    try {
      const response = await api.get<Role[]>('/roles', {
        headers: getAuthHeaders(),
      });
      
      return {
        status: 'success',
        data: response.data || [],
        message: response.message || 'Roles retrieved successfully',
        code: response.status,
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
};

// Export default
export default {
  users: usersApi,
  roles: rolesApi,
};
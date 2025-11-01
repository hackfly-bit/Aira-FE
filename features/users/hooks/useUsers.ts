import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/features/users/services';
import type { UseUsersOptions } from '@/features/users/types';

export default function useUsers(options: UseUsersOptions = {}) {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    role = '',
    enabled = true 
  } = options;

  return useQuery({
    queryKey: ['users', { page, limit, search, role }],
    queryFn: () => usersService.getUsers({ page, limit, search, role }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export type { UseUsersOptions };
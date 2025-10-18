import {
  CreatePermissionDTO,
  PermissionResponse,
  UpdatePermissionDTO,
} from './types/permissions';

import { httpClient } from './utils/httpClient';

export class PermissionService {
  static async getPermission(id: string): Promise<PermissionResponse> {
    const { data } = await httpClient.get(`/permissions/${id}`);
    return data;
  }

  static async getAllPermissions(): Promise<PermissionResponse[]> {
    const { data } = await httpClient.get('/permissions');
    return data;
  }

  static async createPermission(
    createData: CreatePermissionDTO
  ): Promise<PermissionResponse> {
    const { data } = await httpClient.post('/permissions', createData);
    return data;
  }

  static async updatePermission({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdatePermissionDTO;
  }): Promise<PermissionResponse> {
    const { data } = await httpClient.put(`/permissions/${id}`, updateData);
    return data;
  }

  static async deletePermission(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/permissions/${id}`);
    return data;
  }
}

import { CreateRoleDTO, RoleResponse, UpdateRoleDTO } from './types/roles';
import { httpClient } from './utils/httpClient';

export class RoleService {
  static async getRole(id: string): Promise<RoleResponse> {
    const { data } = await httpClient.get(`/roles/${id}`);
    return data;
  }

  static async getAllRoles(): Promise<RoleResponse[]> {
    const { data } = await httpClient.get('/roles');
    return data;
  }

  static async createRole(createData: CreateRoleDTO): Promise<RoleResponse> {
    const { data } = await httpClient.post('/roles', createData);
    return data;
  }

  static async updateRole({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateRoleDTO;
  }): Promise<RoleResponse> {
    const { data } = await httpClient.put(`/roles/${id}`, updateData);
    return data;
  }

  static async deleteRole(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/roles/${id}`);
    return data;
  }
}

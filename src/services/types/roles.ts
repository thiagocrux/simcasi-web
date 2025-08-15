import { CommonProperties } from './common';

export interface Role {
  name: string;
  permissions?: string[];
}

export interface CreateRoleDTO extends Role {}
export interface UpdateRoleDTO extends Partial<Role> {}
export interface RoleResponse extends Role, CommonProperties {}

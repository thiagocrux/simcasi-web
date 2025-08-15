import { CommonProperties } from './common';

export interface Permission {
  code: string;
}

export interface CreatePermissionDTO extends Permission {}
export interface UpdatePermissionDTO extends Partial<Permission> {}
export interface PermissionResponse extends Permission, CommonProperties {}

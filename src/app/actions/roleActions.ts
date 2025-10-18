'use server';

import { RoleService } from '@/services/RoleService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  CreateRoleDTO,
  RoleResponse,
  UpdateRoleDTO,
} from '@/services/types/roles';

export async function getAllRolesAction() {
  const response = await withAuthentication(RoleService.getAllRoles);

  return {
    success: true,
    data: response as RoleResponse[],
  };
}

export async function getRoleAction(id: string) {
  const response = await withAuthentication(() => RoleService.getRole(id));

  return {
    success: true,
    data: response as RoleResponse,
  };
}

export async function createRoleAction(data: CreateRoleDTO) {
  const response = await withAuthentication(() => RoleService.createRole(data));

  return {
    success: true,
    data: response as RoleResponse,
  };
}

export async function updateRoleAction(id: string, data: UpdateRoleDTO) {
  const response = await withAuthentication(() =>
    RoleService.updateRole({ id, updateData: data })
  );

  return {
    success: true,
    data: response as RoleResponse,
  };
}

export async function deleteRoleAction(id: string) {
  await withAuthentication(() => RoleService.deleteRole(id));

  return {
    success: true,
  };
}

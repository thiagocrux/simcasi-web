'use server';

import { AccountService } from '@/services/AccountService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  AccountResponse,
  CreateAccountDTO,
  UpdateAccountDTO,
} from '@/services/types/accounts';

export async function getAllAccountsAction() {
  const response = await withAuthentication(AccountService.getAllAccounts);

  return {
    success: true,
    data: response as AccountResponse[],
  };
}

export async function getAccountAction(id: string) {
  const response = await withAuthentication(() =>
    AccountService.getAccount(id)
  );

  return {
    success: true,
    data: response as AccountResponse,
  };
}

export async function createAccountAction(data: CreateAccountDTO) {
  const response = await withAuthentication(() =>
    AccountService.createAccount(data)
  );

  return {
    success: true,
    data: response as AccountResponse,
  };
}

export async function updateAccountAction(id: string, data: UpdateAccountDTO) {
  const response = await withAuthentication(() =>
    AccountService.updateAccount({ id, updateData: data })
  );

  return {
    success: true,
    data: response as AccountResponse,
  };
}

export async function deleteAccountAction(id: string) {
  await withAuthentication(() => AccountService.deleteAccount(id));

  return {
    success: true,
  };
}

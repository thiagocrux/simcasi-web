import {
  AccountResponse,
  CreateAccountDTO,
  UpdateAccountDTO,
} from './types/accounts';

import { httpClient } from './utils/httpClient';

export class AccountService {
  static async getAccount(id: string): Promise<AccountResponse> {
    const { data } = await httpClient.get(`/accounts/${id}`);
    return data;
  }

  static async getAllAccounts(): Promise<AccountResponse[]> {
    const { data } = await httpClient.get('/accounts');
    return data;
  }

  static async createAccount(
    createData: CreateAccountDTO
  ): Promise<AccountResponse> {
    const { data } = await httpClient.post('/accounts', createData);
    return data;
  }

  static async updateAccount({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateAccountDTO;
  }): Promise<AccountResponse> {
    const { data } = await httpClient.put(`/accounts/${id}`, updateData);
    return data;
  }

  static async deleteAccount(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/accounts/${id}`);
    return data;
  }
}

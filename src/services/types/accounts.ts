import { CommonProperties } from './common';

export interface Account {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateAccountDTO extends Account {}
export interface UpdateAccountDTO extends Partial<Account> {}
export interface AccountResponse extends Account, CommonProperties {}

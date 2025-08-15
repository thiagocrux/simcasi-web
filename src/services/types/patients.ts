import { CommonProperties } from './common';

export interface Patient {
  susCardNumber: string;
  name: string;
  cpf: string;
  socialName: string | null;
  birthDate: string;
  race: string;
  sex: string;
  gender: string;
  sexuality: string;
  nationality: string;
  schooling: string;
  phone: string | null;
  email: string | null;
  motherName: string;
  fatherName: string | null;
  isDeceased: boolean;
  monitoringType: string;
  zipCode: string | null;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  houseNumber: number;
  complement: string | null;
}

export interface CreatePatientDTO extends Patient {}
export interface UpdatePatientDTO extends Partial<Patient> {}
export interface PatientResponse extends Patient, CommonProperties {}

import {
  CreatePatientDTO,
  PatientResponse,
  UpdatePatientDTO,
} from './types/patients';

import { httpClient } from './utils/httpClient';

export class PatientService {
  static async getPatient(id: string): Promise<PatientResponse> {
    const { data } = await httpClient.post(`/patients/${id}`);
    return data;
  }

  static async getAllPatients(): Promise<PatientResponse[]> {
    const { data } = await httpClient.post('/patients');
    return data;
  }

  static async createPatient(
    createData: CreatePatientDTO
  ): Promise<PatientResponse> {
    const { data } = await httpClient.post('/patients', createData);
    return data;
  }

  static async updatePatient({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdatePatientDTO;
  }): Promise<PatientResponse> {
    const { data } = await httpClient.post(`/patients/${id}`, updateData);
    return data;
  }

  static async deletePatient(id: string): Promise<void> {
    const { data } = await httpClient.post(`/patients/${id}`);
    return data;
  }
}

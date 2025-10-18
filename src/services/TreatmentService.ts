import {
  CreateTreatmentDTO,
  TreatmentResponse,
  UpdateTreatmentDTO,
} from './types/treatments';

import { httpClient } from './utils/httpClient';

export class TreatmentService {
  static async getTreatment(id: string): Promise<TreatmentResponse> {
    const { data } = await httpClient.get(`/treatments/${id}`);
    return data;
  }

  static async getAllTreatments(): Promise<TreatmentResponse[]> {
    const { data } = await httpClient.get('/treatments');
    return data;
  }

  static async getAllTreatmentsByPatient(
    patientId: string
  ): Promise<TreatmentResponse[]> {
    const { data } = await httpClient.get(`/treatments/patient/${patientId}`);
    return data;
  }

  static async createTreatment(
    createData: CreateTreatmentDTO
  ): Promise<TreatmentResponse> {
    const { data } = await httpClient.post('/treatments', createData);
    return data;
  }

  static async updateTreatment({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateTreatmentDTO;
  }): Promise<TreatmentResponse> {
    const { data } = await httpClient.put(`/treatments/${id}`, updateData);
    return data;
  }

  static async deleteTreatment(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/treatments/${id}`);
    return data;
  }
}

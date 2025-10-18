import {
  CreateObservationDTO,
  ObservationResponse,
  UpdateObservationDTO,
} from './types/observations';

import { httpClient } from './utils/httpClient';

export class ObservationService {
  static async getObservation(id: string): Promise<ObservationResponse> {
    const { data } = await httpClient.get(`/observations/${id}`);
    return data;
  }

  static async getAllObservations(): Promise<ObservationResponse[]> {
    const { data } = await httpClient.get('/observations');
    return data;
  }

  static async getAllObservationsByPatient(
    patientId: string
  ): Promise<ObservationResponse[]> {
    const { data } = await httpClient.get(`/observations/patient/${patientId}`);

    return data;
  }

  static async createObservation(
    createData: CreateObservationDTO
  ): Promise<ObservationResponse> {
    const { data } = await httpClient.post('/observations', createData);
    return data;
  }

  static async updateObservation({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateObservationDTO;
  }): Promise<ObservationResponse> {
    const { data } = await httpClient.put(`/observations/${id}`, updateData);
    return data;
  }

  static async deleteObservation(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/observations/${id}`);
    return data;
  }
}

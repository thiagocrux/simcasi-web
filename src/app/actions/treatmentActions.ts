'use server';

import { TreatmentService } from '@/services/TreatmentService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  CreateTreatmentDTO,
  TreatmentResponse,
  UpdateTreatmentDTO,
} from '@/services/types/treatments';

export async function getAllTreatmentsAction() {
  const response = await withAuthentication(TreatmentService.getAllTreatments);

  return {
    success: true,
    data: response as TreatmentResponse[],
  };
}

export async function getAllTreatmentsByPatientAction(patientId: string) {
  const response = await withAuthentication(() =>
    TreatmentService.getAllTreatmentsByPatient(patientId)
  );

  return {
    success: true,
    data: response as TreatmentResponse[],
  };
}

export async function getTreatmentAction(id: string) {
  const response = await withAuthentication(() =>
    TreatmentService.getTreatment(id)
  );

  return {
    success: true,
    data: response as TreatmentResponse,
  };
}

export async function createTreatmentAction(data: CreateTreatmentDTO) {
  const response = await withAuthentication(() =>
    TreatmentService.createTreatment(data)
  );

  return {
    success: true,
    data: response as TreatmentResponse,
  };
}

export async function updateTreatmentAction(
  id: string,
  data: UpdateTreatmentDTO
) {
  const response = await withAuthentication(() =>
    TreatmentService.updateTreatment({ id, updateData: data })
  );

  return {
    success: true,
    data: response as TreatmentResponse,
  };
}

export async function deleteTreatmentAction(id: string) {
  await withAuthentication(() => TreatmentService.deleteTreatment(id));

  return {
    success: true,
  };
}

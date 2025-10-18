'use server';

import { ObservationService } from '@/services/ObservationService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  CreateObservationDTO,
  ObservationResponse,
  UpdateObservationDTO,
} from '@/services/types/observations';

export async function getAllObservationsAction() {
  const response = await withAuthentication(
    ObservationService.getAllObservations
  );

  return {
    success: true,
    data: response as ObservationResponse[],
  };
}

export async function getAllObservationsByPatientAction(patientId: string) {
  const response = await withAuthentication(() =>
    ObservationService.getAllObservationsByPatient(patientId)
  );

  return {
    success: true,
    data: response as ObservationResponse[],
  };
}

export async function getObservationAction(id: string) {
  const response = await withAuthentication(() =>
    ObservationService.getObservation(id)
  );

  return {
    success: true,
    data: response as ObservationResponse,
  };
}

export async function createObservationAction(data: CreateObservationDTO) {
  const response = await withAuthentication(() =>
    ObservationService.createObservation(data)
  );

  return {
    success: true,
    data: response as ObservationResponse,
  };
}

export async function updateObservationAction(
  id: string,
  data: UpdateObservationDTO
) {
  const response = await withAuthentication(() =>
    ObservationService.updateObservation({ id, updateData: data })
  );

  return {
    success: true,
    data: response as ObservationResponse,
  };
}

export async function deleteObservationAction(id: string) {
  await withAuthentication(() => ObservationService.deleteObservation(id));

  return {
    success: true,
  };
}

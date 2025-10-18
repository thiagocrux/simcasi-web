'use server';

import { PatientService } from '@/services/PatientService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import { ExamService } from '@/services/ExamService';
import { NotificationService } from '@/services/NotificationService';
import { ObservationService } from '@/services/ObservationService';
import { TreatmentService } from '@/services/TreatmentService';
import {
  CreatePatientDTO,
  PatientResponse,
  UpdatePatientDTO,
} from '@/services/types/patients';

export async function getAllPatientsAction() {
  const response = await withAuthentication(PatientService.getAllPatients);

  return {
    success: true,
    data: response as PatientResponse[],
  };
}

export async function getPatientAction(id: string) {
  const response = await withAuthentication(() =>
    PatientService.getPatient(id)
  );

  return {
    success: true,
    data: response as PatientResponse,
  };
}

export async function createPatientAction(data: CreatePatientDTO) {
  const response = await withAuthentication(() =>
    PatientService.createPatient(data)
  );

  return {
    success: true,
    data: response as PatientResponse,
  };
}

export async function updatePatientAction(id: string, data: UpdatePatientDTO) {
  const response = await withAuthentication(() =>
    PatientService.updatePatient({ id, updateData: data })
  );

  return {
    success: true,
    data: response as PatientResponse,
  };
}

export async function deletePatientAction(id: string) {
  await withAuthentication(() => PatientService.deletePatient(id));

  return {
    success: true,
  };
}

export async function getPatientWithRelatedDataAction(id: string) {
  const [
    patient,
    patientExams,
    patientNotifications,
    patientObservations,
    patientTreatments,
  ] = await withAuthentication(() =>
    Promise.all([
      PatientService.getPatient(id),
      ExamService.getAllExamsByPatient(id),
      NotificationService.getAllNotificationsByPatient(id),
      ObservationService.getAllObservationsByPatient(id),
      TreatmentService.getAllTreatmentsByPatient(id),
    ])
  );

  return {
    success: true,
    data: {
      patient,
      patientExams,
      patientNotifications,
      patientObservations,
      patientTreatments,
    },
  };
}

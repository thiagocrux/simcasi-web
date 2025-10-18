'use server';

import { ExamService } from '@/services/ExamService';
import { withAuthentication } from '@/services/utils/withAuthentication';

import {
  CreateExamDTO,
  ExamResponse,
  UpdateExamDTO,
} from '@/services/types/exams';

export async function getAllExamsAction() {
  const response = await withAuthentication(ExamService.getAllExams);

  return {
    success: true,
    data: response as ExamResponse[],
  };
}

export async function getAllExamsByPatientAction(patientId: string) {
  const response = await withAuthentication(() =>
    ExamService.getAllExamsByPatient(patientId)
  );

  return {
    success: true,
    data: response as ExamResponse[],
  };
}

export async function getExamAction(id: string) {
  const response = await withAuthentication(() => ExamService.getExam(id));

  return {
    success: true,
    data: response as ExamResponse,
  };
}

export async function createExamAction(data: CreateExamDTO) {
  const response = await withAuthentication(() => ExamService.createExam(data));

  return {
    success: true,
    data: response as ExamResponse,
  };
}

export async function updateExamAction(id: string, data: UpdateExamDTO) {
  const response = await withAuthentication(() =>
    ExamService.updateExam({ id, updateData: data })
  );

  return {
    success: true,
    data: response as ExamResponse,
  };
}

export async function deleteExamAction(id: string) {
  await withAuthentication(() => ExamService.deleteExam(id));

  return {
    success: true,
  };
}

import { CreateExamDTO, ExamResponse, UpdateExamDTO } from './types/exams';
import { httpClient } from './utils/httpClient';

export class ExamService {
  static async getExam(id: string): Promise<ExamResponse> {
    const { data } = await httpClient.get(`/exams/${id}`);
    return data;
  }

  static async getAllExams(): Promise<ExamResponse[]> {
    const { data } = await httpClient.get('/exams');
    return data;
  }

  static async getAllExamsByPatient(
    patientId: string
  ): Promise<ExamResponse[]> {
    const { data } = await httpClient.get(`/exams/patient/${patientId}`);
    return data;
  }

  static async createExam(createData: CreateExamDTO): Promise<ExamResponse> {
    const { data } = await httpClient.post('/exams', createData);
    return data;
  }

  static async updateExam({
    id,
    updateData,
  }: {
    id: string;
    updateData: UpdateExamDTO;
  }): Promise<ExamResponse> {
    const { data } = await httpClient.put(`/exams/${id}`, updateData);
    return data;
  }

  static async deleteExam(id: string): Promise<void> {
    const { data } = await httpClient.delete(`/exams/${id}`);
    return data;
  }
}

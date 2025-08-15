import { CommonProperties } from './common';

export interface Treatment {
  medication: string;
  healthCenter: string;
  startDate: string;
  dosage: string;
  observations: string | null;
  partnerInformation: string | null;
  patient: string;
}

export interface CreateTreatmentDTO extends Treatment {}
export interface UpdateTreatmentDTO extends Partial<Treatment> {}
export interface TreatmentResponse extends Treatment, CommonProperties {}

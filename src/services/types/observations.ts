import { CommonProperties } from './common';

export interface Observation {
  observations: string | null;
  partnerBeingTreated: boolean;
  patient: string;
}

export interface CreateObservationDTO extends Observation {}
export interface UpdateObservationDTO extends Partial<Observation> {}
export interface ObservationResponse extends Observation, CommonProperties {}

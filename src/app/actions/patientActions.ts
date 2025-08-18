'use server';

import { PatientService } from '@/services/PatientService';
import { withAuthentication } from '@/services/utils/withAuthentication';

export async function GetAllPatientsAction() {
  const response = await withAuthentication(PatientService.getAllPatients);
  return response;
}

// export async function GetAllPatientsAction() {
//   try {
//     const response = await PatientService.getAllPatients();
//     return response;
//   } catch (error: any) {
//     return {
//       success: false,
//       ...error.response?.data?.error,
//     };
//   }
// }

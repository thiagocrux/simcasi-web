'use client';

import { GetAllPatientsAction } from '@/app/actions/patientActions';
import Button from '@/components/atoms/Button';
import { PatientResponse } from '@/services/types/patients';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);

  useEffect(() => {
    async function xablas() {
      const response = await GetAllPatientsAction();
      setPatients(response);
    }

    xablas();
  }, []);

  async function getPatients() {
    const response = await GetAllPatientsAction();
    setPatients(response);
  }

  return (
    <div>
      <p>Dashboard page</p>
      <div>
        <Button onClick={getPatients}>Get patients</Button>

        <div>
          {patients?.map((patient) => (
            <p key={patient?._id}>{patient?.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

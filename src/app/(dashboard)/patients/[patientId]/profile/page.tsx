'use client';

import { getPatientWithRelatedDataAction } from '@/app/actions/patientActions';
import Button from '@/components/atoms/Button';
import ExamList from '@/components/molecules/ExamList';
import NotificationList from '@/components/molecules/NotificationList';
import ObservationList from '@/components/molecules/ObservationList';
import PatientDetails from '@/components/molecules/PatientDetails';
import TreatmentList from '@/components/molecules/TreatmentList';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type TabOptions = 'exams' | 'notifications' | 'observations' | 'treatments';

export default function PatientProfile() {
  const { patientId } = useParams();

  const { data: patientResponse, isSuccess } = useQuery({
    queryKey: ['patients', patientId],
    queryFn: () => getPatientWithRelatedDataAction(patientId as string),
  });

  const DEFAULT_TAB: TabOptions = 'exams';
  const [currentTab, setCurrentTab] = useState<TabOptions>(DEFAULT_TAB);

  const buttons = [
    {
      label: 'Exames',
      id: 'show-patient-exams-button',
      action: () => setCurrentTab('exams'),
    },
    {
      label: 'Notificações',
      id: 'show-patient-notifications-button',
      action: () => setCurrentTab('notifications'),
    },
    {
      label: 'Observações',
      id: 'show-patient-observations-button',
      action: () => setCurrentTab('observations'),
    },
    {
      label: 'Tratamentos',
      id: 'show-patient-treatments-button',
      action: () => setCurrentTab('treatments'),
    },
  ];

  return (
    patientResponse &&
    isSuccess && (
      <div className="flex flex-col gap-y-8">
        <div>
          <h1 className="mb-4 text-2xl">Perfil do paciente</h1>
          <PatientDetails data={patientResponse.data?.patient} />
        </div>

        <div>
          <h1 className="mb-4 text-2xl">
            Informações médicas relacionadas ao paciente
          </h1>
          <div className="mb-4 flex gap-x-2">
            {buttons.map((button, index) => (
              <Button id={button.id} key={index} onClick={button.action}>
                {button.label}
              </Button>
            ))}
          </div>

          {currentTab === 'exams' ? (
            <ExamList data={patientResponse.data?.patientExams} />
          ) : null}

          {currentTab === 'notifications' ? (
            <NotificationList
              data={patientResponse.data?.patientNotifications}
            />
          ) : null}

          {currentTab === 'observations' ? (
            <ObservationList data={patientResponse.data?.patientObservations} />
          ) : null}

          {currentTab === 'treatments' ? (
            <TreatmentList data={patientResponse.data?.patientTreatments} />
          ) : null}
        </div>
      </div>
    )
  );
}

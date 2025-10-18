'use client';

import { PatientResponse } from '@/services/types/patients';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  deleteAccountAction,
  getAllAccountsAction,
} from '@/app/actions/accountActions';
import {
  deletePatientAction,
  getAllPatientsAction,
} from '@/app/actions/patientActions';
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup';
import {
  ClipboardPlus,
  Eye,
  FlaskConical,
  Hospital,
  IdCard,
  Syringe,
  UserRoundPlus,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: getAllPatientsResponse } = useQuery({
    queryKey: ['patients'],
    queryFn: getAllPatientsAction,
  });

  const deletePatientMutation = useMutation({
    mutationFn: deletePatientAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  const handlePatientDeletion = (patientId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deletePatientMutation.mutate(patientId);
    }
  };

  const { data: getAllAccountsResponse } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccountsAction,
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const handleAccountDeletion = (patientId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deletePatientMutation.mutate(patientId);
    }
  };

  return (
    <div className="mx-auto w-200">
      <p>Dashboard page</p>
      <div>
        {getAllPatientsResponse ? (
          <div className="mt-8 mb-12 flex flex-col gap-y-2">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">Lista de pacientes</p>
              <button
                id="patients-form-redirect-button"
                onClick={() => router.push('/patients/new')}
                className="border-border hover:bg-surface flex cursor-pointer items-center gap-x-2 rounded-md border-1 px-2 py-1"
              >
                <UserRoundPlus size={20} />
                <span className="font-medium">Cadastrar paciente</span>
              </button>
            </div>

            {getAllPatientsResponse.data.map((patient: PatientResponse) => (
              <div
                key={patient?._id}
                className="border-border flex flex-col rounded-md border-1 px-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-x-4 text-sm">
                    <p className="font-medium">{patient?.name}</p>
                    <div className="flex items-center gap-x-2">
                      <IdCard size={16} className="text-gray-400" />
                      <span>{patient?.cpf}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Hospital size={16} className="text-gray-400" />
                      <span>{patient?.susCardNumber}</span>
                    </div>
                  </div>
                  <ActionButtonGroup
                    redirect={{
                      action: () =>
                        router.push(`/patients/${patient?._id}/profile`),
                    }}
                    edit={{
                      action: () => router.push(`/patients/${patient?._id}`),
                    }}
                    remove={{
                      action: () => handlePatientDeletion(patient?._id),
                      isDisabled: deletePatientMutation.isPending,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-x-2">
                  <button
                    className="border-border hover:bg-surface flex flex-1 cursor-pointer justify-center gap-x-2 rounded-md border-1 p-2 text-sm font-medium"
                    onClick={() =>
                      router.push(`/patients/${patient?._id}/exams/new`)
                    }
                  >
                    <FlaskConical size={18} />
                    <span>Cadastrar exame</span>
                  </button>
                  <button
                    className="border-border hover:bg-surface flex cursor-pointer justify-center gap-x-2 rounded-md border-1 p-2 text-sm font-medium"
                    onClick={() =>
                      router.push(`/patients/${patient?._id}/notifications/new`)
                    }
                  >
                    <ClipboardPlus size={18} />
                    <span>Cadastrar notificação</span>
                  </button>
                  <button
                    className="border-border hover:bg-surface flex cursor-pointer justify-center gap-x-2 rounded-md border-1 p-2 text-sm font-medium"
                    onClick={() =>
                      router.push(`/patients/${patient?._id}/observations/new`)
                    }
                  >
                    <Eye size={18} />
                    <span>Cadastrar observação</span>
                  </button>
                  <button
                    className="border-border hover:bg-surface flex cursor-pointer justify-center gap-x-2 rounded-md border-1 p-2 text-sm font-medium"
                    onClick={() =>
                      router.push(`/patients/${patient?._id}/treatments/new`)
                    }
                  >
                    <Syringe size={18} />
                    <span>Cadastrar tratamento</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // TODO: Implement a better loader.
          <p>Loading patients...</p>
        )}
      </div>

      {getAllAccountsResponse ? (
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Lista de usuários</p>
            <button
              id="patients-form-redirect-button"
              onClick={() => router.push('/accounts/new')}
              className="border-border hover:bg-surface flex cursor-pointer items-center gap-x-2 rounded-md border-1 px-2 py-1"
            >
              <UserRoundPlus size={20} />
              <span className="font-medium">Cadastrar usuários</span>
            </button>
          </div>
          <div className="flex flex-col gap-y-2">
            {getAllAccountsResponse.data.map((account) => (
              <div
                key={account?._id}
                className="border-border flex flex-col rounded-md border-1 px-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-x-4 text-sm">
                    <p className="font-medium">{account?.name}</p>
                    <div className="flex items-center gap-x-2">
                      <IdCard size={16} className="text-gray-400" />
                      <span>{account?.email}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Hospital size={16} className="text-gray-400" />
                      <span>{account?.role}</span>
                    </div>
                  </div>
                  <ActionButtonGroup
                    redirect={{
                      action: () =>
                        router.push(`/accounts/${account?._id}/profile`),
                    }}
                    edit={{
                      action: () => router.push(`/accounts/${account?._id}`),
                    }}
                    remove={{
                      action: () => handleAccountDeletion(account?._id),
                      isDisabled: deleteAccountMutation.isPending,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading accounts...</p>
      )}
    </div>
  );
}

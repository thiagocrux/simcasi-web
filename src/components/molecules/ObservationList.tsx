import { deleteObservationAction } from '@/app/actions/observationActions';
import { ObservationResponse } from '@/services/types/observations';
import { displayValue } from '@/utils/displayValue';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DetailsCard from '../atoms/DetailsCard';
import DetailsCardField from '../atoms/DetailsCardField';
import ActionButtonGroup from './ActionButtonGroup';

interface ObservationListProps {
  data: ObservationResponse[];
  showRelatedPatient?: boolean;
  isSimplified?: boolean;
}

export default function ObservationList({
  data,
  showRelatedPatient = false,
}: ObservationListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteObservationMutation = useMutation({
    mutationFn: deleteObservationAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['observations'] });
    },
  });

  const handleObservationDeletion = (patientId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deleteObservationMutation.mutate(patientId);
    }
  };

  if (!data) {
    return null;
  }

  return data.length ? (
    <div className="flex flex-col gap-y-2">
      {data.map((observation, index) => (
        <DetailsCard key={observation._id ?? index}>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Hash size={18} />
              &nbsp;{observation?._id}
            </span>
            <ActionButtonGroup
              edit={{
                action: () =>
                  router.push(
                    `/patients/${observation?.patient}/observations/${observation?._id}`
                  ),
              }}
              remove={{
                action: () => () => handleObservationDeletion(observation?._id),
                isDisabled: deleteObservationMutation.isPending,
              }}
            />
          </div>

          <DetailsCardField
            label="Observações"
            value={displayValue(observation?.observations)}
          />
          <DetailsCardField
            label="O parceiro está sendo tratado?"
            value={observation?.partnerBeingTreated}
            isBordered={showRelatedPatient}
          />

          {showRelatedPatient ? (
            <DetailsCardField
              label="Identificador do paciente"
              value={observation?.patient}
              isBordered={false}
            />
          ) : null}
        </DetailsCard>
      ))}
    </div>
  ) : (
    <p>Nenhuma observação foi cadastrada para este paciente.</p>
  );
}

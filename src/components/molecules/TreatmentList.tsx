import { deleteTreatmentAction } from '@/app/actions/treatmentActions';
import { TreatmentResponse } from '@/services/types/treatments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DetailsCard from '../atoms/DetailsCard';
import DetailsCardField from '../atoms/DetailsCardField';
import ActionButtonGroup from './ActionButtonGroup';

interface TreatmentListProps {
  data: TreatmentResponse[];
  showRelatedPatient?: boolean;
  isSimplified?: boolean;
}

export default function TreatmentList({
  data,
  showRelatedPatient = false,
}: TreatmentListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteTreatmentMutation = useMutation({
    mutationFn: deleteTreatmentAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
  });

  const handleTreatmentDeletion = (patientId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deleteTreatmentMutation.mutate(patientId);
    }
  };

  if (!data) {
    return null;
  }

  return data.length ? (
    <div className="flex flex-col gap-y-2">
      {data.map((treatment, index) => (
        <DetailsCard key={treatment._id ?? index}>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Hash size={18} />
              &nbsp;{treatment?._id}
            </span>
            <ActionButtonGroup
              edit={{
                action: () =>
                  router.push(
                    `/patients/${treatment?.patient}/treatments/${treatment?._id}`
                  ),
              }}
              remove={{
                action: () => () => handleTreatmentDeletion(treatment?._id),
                isDisabled: deleteTreatmentMutation.isPending,
              }}
            />
          </div>

          <DetailsCardField label="Medicação" value={treatment?.medication} />
          <DetailsCardField
            label="Unidade de saúde"
            value={treatment?.healthCenter}
          />
          <DetailsCardField
            label="Data de início"
            value={treatment?.startDate}
          />
          <DetailsCardField label="Dosagem" value={treatment?.dosage} />
          <DetailsCardField
            label="Observações"
            value={treatment?.observations}
          />
          <DetailsCardField
            label="Informações do(a) parceiro(a)"
            value={treatment?.partnerInformation}
            isBordered={showRelatedPatient}
          />

          {showRelatedPatient ? (
            <DetailsCardField
              label="Identificador do paciente"
              value={treatment?.patient}
              isBordered={false}
            />
          ) : null}
        </DetailsCard>
      ))}
    </div>
  ) : (
    <p>Nenhum tratamento foi cadastrado para este paciente.</p>
  );
}

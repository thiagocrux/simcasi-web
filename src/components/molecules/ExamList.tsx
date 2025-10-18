import { deleteExamAction } from '@/app/actions/examActions';
import { ExamResponse } from '@/services/types/exams';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DetailsCard from '../atoms/DetailsCard';
import DetailsCardField from '../atoms/DetailsCardField';
import ActionButtonGroup from './ActionButtonGroup';

interface ExamListProps {
  data: ExamResponse[];
  showRelatedPatient?: boolean;
  isSimplified?: boolean;
}

export default function ExamList({
  data,
  showRelatedPatient = false,
}: ExamListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteExamMutation = useMutation({
    mutationFn: deleteExamAction,
    onSuccess: () => {
      // Invalidate and refetch patients list after successful deletion
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });

  const handleExamDeletion = (patientId: string) => {
    // TODO: Improve this
    if (confirm('Are you sure you want to delete this patient?')) {
      deleteExamMutation.mutate(patientId);
    }
  };

  if (!data) {
    return null;
  }

  return data.length ? (
    <div className="flex flex-col gap-y-4">
      {data.map((exam, index) => (
        <DetailsCard key={exam._id ?? index}>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Hash size={18} />
              &nbsp;{exam?._id}
            </span>
            <ActionButtonGroup
              edit={{
                action: () =>
                  router.push(`/patients/${exam?.patient}/exams/${exam?._id}`),
              }}
              remove={{
                action: () => () => handleExamDeletion(exam?._id),
                isDisabled: deleteExamMutation.isPending,
              }}
            />
          </div>

          <DetailsCardField
            label="Tipo de teste treponêmico"
            value={exam?.treponemalTestType}
          />
          <DetailsCardField
            label="Resultado do teste treponêmico"
            value={exam?.treponemalTestResult}
          />
          <DetailsCardField
            label="Data do teste treponêmico"
            value={exam?.treponemalTestDate}
          />
          <DetailsCardField
            label="Local do teste treponêmico"
            value={exam?.treponemalTestLocation}
          />
          <DetailsCardField
            label="Teste não treponêmico (VDRL)"
            value={exam?.nontreponemalVdrlTest}
          />
          <DetailsCardField
            label="Titulação do teste não treponêmico"
            value={exam?.nontreponemalTestTitration}
          />
          <DetailsCardField
            label="Data do teste não treponêmico"
            value={exam?.nontreponemalTestDate}
          />
          <DetailsCardField
            label="Outro teste não treponêmico"
            value={exam?.otherNontreponemalTest}
          />
          <DetailsCardField
            label="Data do outro teste não treponêmico"
            value={exam?.otherNontreponemalTestDate}
          />
          <DetailsCardField
            label="Observações de referência"
            value={exam?.referenceObservations}
            isBordered={showRelatedPatient}
          />

          {showRelatedPatient ? (
            <DetailsCardField
              label="Identificador do paciente"
              value={exam?.patient}
              isBordered={false}
            />
          ) : null}
        </DetailsCard>
      ))}
    </div>
  ) : (
    <p>Nenhum tratamento cadastrado para este paciente.</p>
  );
}

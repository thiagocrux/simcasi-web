'use client';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Datepicker from '@/components/atoms/Datepicker';
import Input from '@/components/atoms/Input';
import Modal from '@/components/atoms/Modal';
import TextArea from '@/components/atoms/TextArea';
import { formatSafeBirthDate } from '@/utils/date';
import { formatToDateString } from '@/utils/formatToDateString';
import { getRequiredMessage } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import {
  CreateTreatmentDTO,
  UpdateTreatmentDTO,
} from '@/services/types/treatments';

import {
  createTreatmentAction,
  getTreatmentAction,
  updateTreatmentAction,
} from '@/app/actions/treatmentActions';

export default function TreatmentForm() {
  const router = useRouter();
  const { patientId, treatmentId } = useParams();
  const isUpdatingTreatment = !!treatmentId && treatmentId !== 'new';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    medication: z.string().min(1, getRequiredMessage('Medicação')),
    healthCenter: z
      .string()
      .min(1, getRequiredMessage('Unidade Básica de Saúde')),
    startDate: z.string().min(1, getRequiredMessage('Data de início')),
    dosage: z.string().min(1, getRequiredMessage('Dosagem')),
    observations: z.string().nullable().optional(),
    partnerInformation: z.string().nullable().optional(),
  });

  type Inputs = z.infer<typeof schema>;

  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
    trigger,
  } = methods;

  // FIXME: Delete after testing
  const watchedValues = watch();

  const { data: getTreatmentResponse, isSuccess } = useQuery({
    queryKey: ['treatments', treatmentId],
    queryFn: () => getTreatmentAction(treatmentId as string),
    enabled: isUpdatingTreatment,
  });

  useEffect(() => {
    if (getTreatmentResponse && isSuccess) {
      console.log(getTreatmentResponse);
    }
  }, [getTreatmentResponse, isSuccess]);

  const createTreatmentMutation = useMutation({
    mutationFn: (data: CreateTreatmentDTO) => createTreatmentAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updateTreatmentMutation = useMutation({
    mutationFn: (data: UpdateTreatmentDTO) =>
      updateTreatmentAction(treatmentId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    if (isSuccess && getTreatmentResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getTreatmentResponse.data)
            .filter(([key]) => !['startDate'].includes(key)) // Exclude birthDate from the spread
            .map(([key, value]) => [key, value === null ? undefined : value])
        ),
        startDate: formatSafeBirthDate(getTreatmentResponse.data.startDate),
      };

      reset(formData);

      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [isSuccess, getTreatmentResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreateTreatmentDTO = {
      ...data,
      startDate: formatToDateString(data.startDate),
      observations: data.observations ?? null,
      partnerInformation: data.observations ?? null,
      patient: patientId as string,
    };

    if (isUpdatingTreatment) {
      updateTreatmentMutation.mutate(parsedData);
    } else {
      createTreatmentMutation.mutate(parsedData);
    }
  }

  const isSubmitButtonDisabled = !isValid;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        hideCloseButton
        closeModal={() => setIsModalOpen(false)}
        customClasses="w-140 flex flex-col gap-y-4"
      >
        {/* TODO: Adjust modal content */}
        <div className="flex items-center justify-center gap-x-2">
          <CircleCheck size={20} className="text-success" />
          <p className="font-medium">{`O tratamento foi ${isUpdatingTreatment ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingTreatment && (
            <Button
              id="create-new-patient-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outro tratamento</span>
              <UserRoundPlus size={16} />
            </Button>
          )}
          <Button
            id="dashboard-redirect-button"
            onClick={() => router.push('/dashboard')}
            customClasses="flex justify-center items-center gap-x-2"
          >
            <span>Ir para a dashboard</span>
            <ChartPie size={16} />
          </Button>
        </div>
      </Modal>

      <div className="flex flex-1 flex-col items-center justify-center pb-8">
        <h1 className="mb-8 text-2xl">{`${isUpdatingTreatment ? 'Atualização' : 'Cadastro'} de tratamento`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <Input
              name="medication"
              label="Medicação"
              placeholder="Medicação"
              errorMessage={errors.medication?.message}
              control={control}
            />
            <Input
              name="healthCenter"
              label="Unidade Básica de Saúde"
              placeholder="Unidade Básica de Saúde"
              errorMessage={errors.healthCenter?.message}
              control={control}
            />
            <Datepicker
              name="startDate"
              label="Data de início"
              errorMessage={errors.startDate?.message}
              control={control}
            />
            <Input
              name="dosage"
              label="Dosagem"
              placeholder="Dosagem"
              errorMessage={errors.dosage?.message}
              control={control}
            />
            <TextArea
              name="observations"
              label="Observações"
              placeholder="Observações"
              errorMessage={errors.observations?.message}
              control={control}
            />
            <TextArea
              name="partnerInformation"
              label="Informação do parceiro"
              placeholder="Informação do parceiro"
              errorMessage={errors.partnerInformation?.message}
              control={control}
            />
            <Button
              id="create-treatment-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingTreatment ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}

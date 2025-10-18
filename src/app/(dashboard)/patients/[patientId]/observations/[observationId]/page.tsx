'use client';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Modal from '@/components/atoms/Modal';
import TextArea from '@/components/atoms/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import {
  CreateObservationDTO,
  UpdateObservationDTO,
} from '@/services/types/observations';

import {
  createObservationAction,
  getObservationAction,
  updateObservationAction,
} from '@/app/actions/observationActions';

export default function ObservationForm() {
  const router = useRouter();
  const { patientId, observationId } = useParams();
  const isUpdatingObservation = !!observationId && observationId !== 'new';
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    observations: z.string().nullable().optional(),
    partnerBeingTreated: z.boolean(),
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

  const { data: getObservationResponse, isSuccess } = useQuery({
    queryKey: ['observations', observationId],
    queryFn: () => getObservationAction(observationId as string),
    enabled: isUpdatingObservation,
  });

  const createObservationMutation = useMutation({
    mutationFn: (data: CreateObservationDTO) => createObservationAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updateObservationMutation = useMutation({
    mutationFn: (data: UpdateObservationDTO) =>
      updateObservationAction(observationId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    if (isSuccess && getObservationResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getObservationResponse.data).map(([key, value]) => [
            key,
            value === null ? undefined : value,
          ])
        ),
      };

      reset(formData);

      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [isSuccess, getObservationResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreateObservationDTO = {
      ...data,
      observations: data.observations ?? null,
      patient: patientId as string,
    };

    if (isUpdatingObservation) {
      updateObservationMutation.mutate(parsedData);
    } else {
      createObservationMutation.mutate(parsedData);
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
          <p className="font-medium">{`O tratamento foi ${isUpdatingObservation ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingObservation && (
            <Button
              id="create-new-patient-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outra observação</span>
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
        <h1 className="mb-8 text-2xl">{`${isUpdatingObservation ? 'Atualização' : 'Cadastro'} de observação`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <TextArea
              name="observations"
              label="Observações"
              placeholder="Observações"
              errorMessage={errors.observations?.message}
              control={control}
            />
            <Checkbox
              name="partnerBeingTreated"
              label="Parceiro sendo tratado?"
              errorMessage={errors.partnerBeingTreated?.message}
              control={control}
            />
            <Button
              id="create-patient-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingObservation ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}

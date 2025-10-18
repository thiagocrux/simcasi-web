'use client';

import FormValuesDebugger from '@/components/atoms/_FormValuesDebugger';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Modal from '@/components/atoms/Modal';
import TextArea from '@/components/atoms/TextArea';
import { getRequiredMessage } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChartPie, CircleCheck, UserRoundPlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from '@/services/types/notifications';

import {
  createNotificationAction,
  getNotificationAction,
  updateNotificationAction,
} from '@/app/actions/notificationActions';

export default function NotificationForm() {
  const router = useRouter();
  const { notificationId, patientId } = useParams();
  const isUpdatingNotification = !!notificationId && notificationId !== 'new';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const schema = z.object({
    sinan: z.string().min(1, getRequiredMessage('SINAN')),
    observations: z.string().nullable().optional(),
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

  const { data: getNotificationResponse, isSuccess } = useQuery({
    queryKey: ['notifications', notificationId],
    queryFn: () => getNotificationAction(notificationId as string),
    enabled: isUpdatingNotification,
  });

  const createNotificationMutation = useMutation({
    mutationFn: (data: CreateNotificationDTO) => createNotificationAction(data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: (data: UpdateNotificationDTO) =>
      updateNotificationAction(patientId as string, data),
    onSuccess: () => {
      handleRequestSuccess();
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  useEffect(() => {
    if (isSuccess && getNotificationResponse) {
      const formData = {
        ...Object.fromEntries(
          Object.entries(getNotificationResponse.data).map(([key, value]) => [
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
  }, [isSuccess, getNotificationResponse, reset, trigger]);

  function handleRequestSuccess() {
    setIsModalOpen(true);
    reset();
  }

  async function onSubmit(data: Inputs) {
    const parsedData: CreateNotificationDTO = {
      ...data,
      observations: data.observations ?? null,
      patient: patientId as string,
    };

    if (isUpdatingNotification) {
      updateNotificationMutation.mutate(parsedData);
    } else {
      createNotificationMutation.mutate(parsedData);
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
          <p className="font-medium">{`O notificação foi ${isUpdatingNotification ? 'atualizado' : 'cadastrado'} com sucesso!`}</p>
        </div>
        <div className="flex gap-x-2">
          {!isUpdatingNotification && (
            <Button
              id="create-new-notification-button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              customClasses="flex justify-center items-center gap-x-2"
            >
              <span>Cadastrar outro notificação</span>
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
        <h1 className="mb-8 text-2xl">{`${isUpdatingNotification ? 'Atualização' : 'Cadastro'} de notificação`}</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-[400px] flex-col gap-y-4"
          >
            <Input
              name="sinan"
              label="SINAN"
              placeholder="SINAN"
              errorMessage={errors.sinan?.message}
              control={control}
            />
            <TextArea
              name="observations"
              label="Observações"
              placeholder="Observações"
              errorMessage={errors.observations?.message}
              control={control}
            />
            <Button
              id="create-notification-button"
              type="submit"
              isDisabled={isSubmitButtonDisabled}
            >
              {isUpdatingNotification ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>

        <FormValuesDebugger watchedValues={watchedValues} />
      </div>
    </>
  );
}
